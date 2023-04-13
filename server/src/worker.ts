import {loadJSFromPath} from "./helpers/scriptsDymLoading";

const { isMainThread, workerData } = require('node:worker_threads');

if (isMainThread) {
    console.log("You are not allowed to enter here. Get out!")
} else {
    console.log('entering worker')
    const pathToJS = workerData.path
    const module = loadJSFromPath('../../' + pathToJS)
    module.start()
}