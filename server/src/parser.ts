import {insertScriptByName, loadScriptByName} from "./database";
import {saveJSToPath} from "./helpers/scriptsDymSaving";
import {createWorker} from "./workersManager";

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
    createWorker(workerPath, {workerData: script})
    return true;
}


export{parseExecute, parseInsert}