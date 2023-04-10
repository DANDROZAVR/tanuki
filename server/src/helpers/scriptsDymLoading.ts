import path from 'path'
const clearModule = require('clear-module');

export const loadJSFromPath = (path: string) : any => {
    clearModule(path)
    module = require(path)
    return module
}
