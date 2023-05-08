import {loadJSFromPath} from "./helpers/scriptsDymLoading";
import { exec } from "child_process";

const { isMainThread, workerData, parentPort } = require('node:worker_threads');
const compilerPath = "compile.exe" // so far only Windows version (put this in container maybe someday?)

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

const compileScript = async (pathToScript: string, outputPath: string) => {
    console.log("Compiling " + pathToScript);
    await new Promise((resolve, reject) => {
        exec(compilerPath + " < " + pathToScript + " > " + outputPath, (err) => {
            if(err) reject(err);
            else    resolve(undefined);
        });
    });
}

const asyncMainFunction = async () => {
    const pathToScript = workerData.script.path;
    const pathToJS = pathToScript.slice(0, -4) + '-compiled.js';
    await compileScript(pathToScript, pathToJS);
    const module = loadJSFromPath('../../' + pathToJS)
    let response = await module.start(workerData.lastRunFeedback, workerData.scriptOptions);
    if (response === undefined)
        response = {};
    // console.log(response);
    //const response = {}
    // @ts-ignore
    response['type'] = 'feedbackWorker';
    parentPort?.postMessage(response);
    waitForConfirmationFromMainThread();
};

if (isMainThread) {
    console.log("You are not allowed to enter here. Get out!")
} else {
    asyncMainFunction()
}
