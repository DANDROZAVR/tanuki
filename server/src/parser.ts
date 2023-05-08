import {
    insertScriptByName,
    getScriptByName,
    insertIntoSchedule,
    insertIntoCalendar,
    updateScheduleOptionsByID, getScheduleByID
} from "./sql/database";
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

const MAX_TIMES_EXECUTION = 1000

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
    const path = 'scripts/' + user + '/' + title + '.tnk';
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

export const parseExecute = async (bodyJson: any) : Promise<void> => {
    if (!checkContainsTags(bodyJson, ['user', 'title']))
        throw new DataError('not a valid execute request')
    const script : any = (await getScriptByName(bodyJson.title, bodyJson.user))
    if(script === undefined){
        throw new DataError("Script with that name does not exist")
    }
    createWorker({
        workerData: {
            script: script,
            scriptOptions: bodyJson.scriptOptions
        }
    })
}

export const parseLoad = async (bodyJson: any) : Promise<Script> => {
    if (!checkContainsTags(bodyJson, ['user', 'title']))
        throw new DataError('not a valid load request')
    const script : Script = (await getScriptByName(bodyJson.title, bodyJson.user))
    if(script === undefined){
        throw new DataError("Script with that name does not exist")
    }
    return script;
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

export const addToCalendar = async (script: any, options: any, firstTime: boolean = true, scheduleID: number = -1) : Promise<Date | null> => {
    const tag = options.tag
    if (!(tag == 'once' || tag == 'every' || tag == 'times'))
        return null;
    let date : Date
    if (tag == 'once') {
        if (!firstTime)
            return null;
        if (!checkContainsTags(options, ['once'])) return null; // TODO: can we find for a pathes? like once.smth.smth
        const onceOptions = options.once
        if (!checkContainsTags(onceOptions, ['date'])) return null;
        date = onceOptions.date
    } else
    if (tag == 'every') {
        return null;
    } else
    if (tag == 'times') {
        if (!checkContainsTags(options, ['times'])) return null;
        const timesOptions = options.times
        if (!checkContainsTags(timesOptions, ['timesExecution', 'minWaitMinute', 'maxWaitMinute']) || timesOptions.timesExecution <= 0 || timesOptions.timesExecution > MAX_TIMES_EXECUTION) return null;
        const minutesToWait = getRandomNumber(timesOptions.minWaitMinute, timesOptions.maxWaitMinute)
        date = new Date(Date.now() + minutesToWait * 60 * 1000)
        timesOptions.timesExecution -= 1
    } else return null;
    if (firstTime) {
        const id = await insertIntoSchedule(script.id, options);
        const schedule = await getScheduleByID(id)
        scheduleID = id
    } else {
        await updateScheduleOptionsByID(scheduleID, options)
    }
    await insertIntoCalendar(scheduleID, date)
    console.log(`script added: ${script.title} ${date}`)
    return new Date(date)
}

function getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}