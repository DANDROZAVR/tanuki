// can't understand truly what is it for. for dealing with already founded scripts? or for founding on-request in the main thread and giving it to a worker? Or should it completely parse http requests?
import {Worker} from "node:worker_threads";
import {insertScriptByName, loadScriptByName} from "./database";
import {saveJSToPath} from "./helpers/scriptsDymSaving";

const workerPath = './build/worker.js'

/**
 *
 * @param bodyJson
 * Example:
 *  {
 *      user: "admin",
 *      title: "title",
 *      source: "source",
 *  }
 */

const parseInsert = async (bodyJson: any) : Promise<boolean> => {
    if (!('user' in bodyJson) || !('title' in bodyJson) || !('source' in bodyJson))
        return false;
    const title = bodyJson.title
    const user = bodyJson.user
    const path = 'scripts/' + user + title + '.js'
    const source = bodyJson.source
    const options = ('options' in bodyJson ? bodyJson.options : {})
    return insertScriptByName(title, source, user, path, options)
        .then(_ => saveJSToPath(path, source))

}

const parseExecute = async (bodyJson: any) : Promise<boolean> => {  // todo: change void later to some callback results
    if (!('user' in bodyJson) || !('title' in bodyJson))
        return false;
    const script : any = (await loadScriptByName(bodyJson.title, bodyJson.user))
    const pathToScript = script.path
    const jsonWorkerPath = JSON.stringify({path: '../../' + pathToScript})
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