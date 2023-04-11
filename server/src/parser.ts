// can't understand truly what is it for. for dealing with already founded scripts? or for founding on-request in the main thread and giving it to a worker? Or should it completely parse http requests?
import {Worker} from "node:worker_threads";
import {insertScript, loadScript} from "./database";
import * as timers from "timers";

const workerPath = './build/worker.js'

const parseInsert = async (bodyJson: any) : Promise<boolean> => {
    if (!('user' in bodyJson) || !('tittle' in bodyJson))
        return false;
    const tittle = bodyJson.tittle
    const user = bodyJson.user
    const path = user + tittle
    const source = bodyJson.source
    const options = ('options' in bodyJson ? bodyJson.options : {})
    return insertScript(tittle, source, user, path, options)

}

const parseExecute = async (bodyJson: any) : Promise<boolean> => {  // todo: change void later to some callback results
    if (!('user' in bodyJson) || !('tittle' in bodyJson))
        return false;
    const pathToScript = await loadScript(bodyJson.user, bodyJson.tittle)
    const jsonWorkerPath = JSON.stringify({path: '../../scripts/' + pathToScript})
    const worker = new Worker(workerPath, {workerData: jsonWorkerPath})
    enableLogs(worker)
    addWorkerToObserveList(worker)
    console.log(jsonWorkerPath)
    return true;
}

const addWorkerToObserveList = (worker:Worker) => {
    // TODO: add it. then check if it completes okay. if not - somehow do something (f.e relaunch, if relaunching is enabled in options)
}
const enableLogs = (worker: Worker) => {
    worker.on('message', (result) => {
        console.log('msg' + result);
    });
    worker.on('error', (error) => {
        console.error(`Worker error: ${error}`);
        // Start a new task once the worker is no longer busy
    });
    worker.on('exit', (code) => {
        if (code !== 0) {
            console.error(`Worker stopped with exit code ${code}`);
            // Start a new task once the worker is no longer busy
        } else {
            console.error('worker stoped normally')
        }
    });
}

export{parseExecute, parseInsert}