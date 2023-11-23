import {
    cellDataType,
    cellType,
    columnSettingsType,
    inputCellType,
    nodeType,
    textNodeType
} from "./types"

/**
 * Check is item is object
 */
export const isObject = (val: (string | number | boolean | object | null | undefined )) => Object.prototype.toString.call(val) === "[object Object]"

/**
 * Check for valid JSON string
 */
export const isJson = (str: string) => {
    let t = !1
    try {
        t = JSON.parse(str)
    } catch (e) {
        return !1
    }
    return !(null === t || (!Array.isArray(t) && !isObject(t))) && t
}

/**
 * Create DOM element node
 */
export const createElement = (nodeName: string, attrs?: { [key: string]: string}) => {
    const dom = document.createElement(nodeName)
    if (attrs && "object" == typeof attrs) {
        for (const attr in attrs) {
            if ("html" === attr) {
                dom.innerHTML = attrs[attr]
            } else {
                dom.setAttribute(attr, attrs[attr])
            }
        }
    }
    return dom
}

export const objToText = (obj: nodeType) => {
    if (["#text", "#comment"].includes(obj.nodeName)) {
        return (obj as textNodeType).data
    }
    if (obj.childNodes) {
        return obj.childNodes.map((childNode: nodeType) => objToText(childNode)).join("")
    }
    return ""
}

export const cellToText = (obj: inputCellType | cellDataType | null | undefined): string => {
    if (obj === null || obj === undefined) {
        return ""
    } else if (obj.hasOwnProperty("text") || obj.hasOwnProperty("data")) {
        const cell = obj as cellType
        return cell.text ?? cellToText(cell.data)
    } else if (obj.hasOwnProperty("nodeName")) {
        return objToText(obj as nodeType)
    }
    return String(obj)
}


export const escapeText = function(text: string) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
}


export const visibleToColumnIndex = function(visibleIndex: number, columns: columnSettingsType[]) {
    let counter = 0
    let columnIndex = 0
    while (counter < (visibleIndex+1)) {
        const columnSettings = columns[columnIndex]
        if (!columnSettings.hidden) {
            counter += 1
        }
        columnIndex += 1
    }
    return columnIndex-1
}

export const columnToVisibleIndex = function(columnIndex: number, columns: columnSettingsType[]) {
    let visibleIndex = columnIndex
    let counter = 0
    while (counter < columnIndex) {
        const columnSettings = columns[counter]
        if (columnSettings.hidden) {
            visibleIndex -= 1
        }
        counter++
    }
    return visibleIndex
}

/**
 * Converts a [NamedNodeMap](https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap) into a normal object.
 *
 * @param map The `NamedNodeMap` to convert
 */
export const namedNodeMapToObject = function(map: NamedNodeMap) {
    const obj = {}
    if (map) {
        for (const attr of map) {
            obj[attr.name] = attr.value
        }
    }
    return obj
}
