import {insertScriptByName, getScriptByName, insertIntoSchedule, insertIntoCalendar} from "./sql/database";
import {saveJSToPath} from "./helpers/scriptsDymSaving";
import {createWorker} from "./workersManager";
import {Script} from "./sql/database";

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

class DataError extends Error{}

const checkContainsTags = (bodyJson: any, tags: string[]) : boolean => {
    for (const word of tags)
        if (!(word in bodyJson))
            return false
    return true
}

export const parseInsert = async (bodyJson: any) : Promise<void> => {
    if (!checkContainsTags(bodyJson, ['user', 'title', 'source']))
        throw new DataError('not a valid insert request')
    const title = bodyJson.title
    const user = bodyJson.user
    const path = 'scripts/' + user + '/' + title + '.js'
    const source = bodyJson.source
    await insertScriptByName(title, source, user, path)
        .then(_ => saveJSToPath(path, source))
        .catch(error =>{
            if(error.errno == 19){
                throw new DataError("Sript with that name already exist")
            }else{
                throw error
            }
        })
}

export const parseExecute = async (bodyJson: any) : Promise<void> => {  // todo: change void later to some callback results
    if (!checkContainsTags(bodyJson, ['user', 'title']))
        throw new DataError('not a valid execute request')
    const script : any = (await getScriptByName(bodyJson.title, bodyJson.user))
    if(script === undefined){
        throw new DataError("Script with that name does not exist")
    }
    createWorker({workerData: script})
}

export const parseSchedule = async (bodyJson: any) : Promise<Date|null> => {
    if (!checkContainsTags(bodyJson, ['user', 'title', 'scheduleOptions']))
        throw new DataError('not a valid schedule request')
    const options = bodyJson.scheduleOptions
    if (!checkContainsTags(options, ['tag']))
        throw new DataError('not a valid schedule request')
    const script : Script = await getScriptByName(bodyJson.title, bodyJson.user)
    return addToCalendar(script, options)
}

export const addToCalendar = async (script: any, options: any, firstTime: boolean = true) : Promise<Date | null> => {
    const tag = options.tag
    if (!(tag == 'once' || tag == 'every' || tag == 'times'))
        return null;
    let date : Date
    if (tag == 'once') {
        if (!firstTime)
            return null;
        if (!checkContainsTags(options, ['once']))
            return null; // todo: temp, not required later
        date = options.once
        if (!(await insertIntoSchedule(script.id, options))) {
            return null;
        }
    } else
    if (tag == 'every') {
        return null;
    } else
    if (tag == 'times') {
        return null;
    } else return null;
    await insertIntoCalendar(script.id, date)
    console.log(`script added: ${script.title} ${date}`)
    return new Date(date)
}

