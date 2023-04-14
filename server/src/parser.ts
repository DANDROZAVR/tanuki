import {insertScriptByName, getScriptByName, insertIntoSchedule, insertIntoCalendar} from "./sql/database";
import {saveJSToPath} from "./helpers/scriptsDymSaving";
import {createWorker} from "./workersManager";

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

const checkContainsTags = (bodyJson: any, tags: string[]) : boolean => {
    for (const word of tags)
        if (!(word in bodyJson))
            return false
    return true
}

const parseInsert = async (bodyJson: any) : Promise<boolean> => {
    if (!checkContainsTags(bodyJson, ['user', 'title', 'source']))
        return false;
    const title = bodyJson.title
    const user = bodyJson.user
    const path = 'scripts/' + user + title + '.js'
    const source = bodyJson.source
    return insertScriptByName(title, source, user, path)
        .then(_ => saveJSToPath(path, source))
}

const parseExecute = async (bodyJson: any) : Promise<boolean> => {  // todo: change void later to some callback results
    if (!checkContainsTags(bodyJson, ['user', 'title']))
        return false
    const script : any = (await getScriptByName(bodyJson.title, bodyJson.user))
    createWorker({workerData: script})
    return true
}

const parseSchedule = async (bodyJson: any) : Promise<Date | null> => {
    if (!checkContainsTags(bodyJson, ['user', 'title', 'scheduleOptions']))
        return null
    const options = bodyJson.scheduleOptions
    if (!checkContainsTags(options, ['tag']))
        return null
    const tag = options.tag
    if (!(tag == 'once' || tag == 'every' || tag == 'times'))
        return null;
    let date
    if (tag == 'once') {
        if (!checkContainsTags(options, ['once']))
            return null; // todo: not required later
        date = options.once
        const script : any = await getScriptByName(bodyJson.title, bodyJson.user)
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
    const script : any = (await getScriptByName(bodyJson.title, bodyJson.user))
    await insertIntoCalendar(script.id, date)
    console.log(`script ${script.title} ${date}`)
    return new Date(date)
}

export{parseExecute, parseInsert, parseSchedule}