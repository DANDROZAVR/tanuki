import {loadJSFromPath} from "./helpers/scriptsDymLoading";

const { isMainThread, workerData, parentPort } = require('node:worker_threads');

const waitForConfirmationFromMainThread = async () => {
    let messagePromise = new Promise(resolve => {
        parentPort?.on("message", (message: any) => {
            if (message == 'ok')
                resolve(undefined)
            return;
        })
    });
    await messagePromise
    parentPort?.close()
}

const asyncMainFunction = async () => {
    const pathToJS = workerData.script.path
    const module = loadJSFromPath('../../' + pathToJS)
    let response = await module.start(workerData.lastRunFeedback, workerData.scriptOptions)
    if (response === undefined)
        response = {}
    console.log(response)
    //const response = {}
    // @ts-ignore
    response['type'] = 'feedbackWorker'
    parentPort?.postMessage(response)
    waitForConfirmationFromMainThread()
}

if (isMainThread) {
    console.log("You are not allowed to enter here. Get out!")
} else {
    asyncMainFunction()
}
