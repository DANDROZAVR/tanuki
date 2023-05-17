import {
    getScriptByName,
    getUserByName,
    insertIntoCalendar,
    insertIntoSchedule,
    insertScriptByName,
    insertUser,
    Script,
    updateScheduleOptionsByID
} from "./sql/database";
import {saveJSToPath} from "./helpers/scriptsDymSaving";
import {createWorker} from "./workersManager";
import * as crypto from "crypto"

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
    const path = 'scripts/' + user + '/' + title + (bodyJson.pureJsCode ? '.js' : '.tnk');
    const source = bodyJson.source
    await insertScriptByName(title, source, user, path, bodyJson.pureJsCode ?? false)
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

export const parseSchedule = async (bodyJson: any) : Promise<Date> => {
    if (!checkContainsTags(bodyJson, ['user', 'title', 'scheduleOptions']))
        throw new DataError('not a valid schedule request')
    const options = bodyJson.scheduleOptions
    if (!checkContainsTags(options, ['tag']))
        throw new DataError('not a valid schedule request')
    const script : Script = await getScriptByName(bodyJson.title, bodyJson.user)
    return addToCalendar(script, options)

}

export const addToCalendar = async (script: any, options: any, firstTime: boolean = true, scheduleID: number = -1) : Promise<Date> => {
    const tag = options.tag
    if (!(tag == 'once' || tag == 'every' || tag == 'times'))
        throw new DataError('not a valid schedule request')
    let date : Date
    if (tag == 'once') {
        if (!firstTime)
            throw new DataError('not a valid schedule request')
        if (!checkContainsTags(options, ['once'])) throw new DataError('not a valid schedule request') // TODO: can we find for a pathes? like once.smth.smth
        const onceOptions = options.once
        if (!checkContainsTags(onceOptions, ['date'])) throw new DataError('not a valid schedule request')
        date = onceOptions.date
    } else
    if (tag == 'every') {
        throw new DataError('not a valid schedule request')
    } else
    if (tag == 'times') {
        if (!checkContainsTags(options, ['times'])) throw new DataError('not a valid schedule request')
        const timesOptions = options.times
        if (!checkContainsTags(timesOptions, ['timesExecution', 'minWaitMinute', 'maxWaitMinute']) || timesOptions.timesExecution <= 0 || timesOptions.timesExecution > MAX_TIMES_EXECUTION) throw new DataError('not a valid schedule request')
        const minutesToWait = getRandomNumber(timesOptions.minWaitMinute, timesOptions.maxWaitMinute)
        date = new Date(Date.now() + minutesToWait * 60 * 1000)
        timesOptions.timesExecution -= 1
    } else throw new DataError('not a valid schedule request')
    if (firstTime) {
        scheduleID = await insertIntoSchedule(script.id, options)
    } else {
        await updateScheduleOptionsByID(scheduleID, options)
    }
    await insertIntoCalendar(scheduleID, date)
    console.log(`script added: ${script.title} ${date}`)
    return new Date(date)
}

export const parseCreateUser = async (bodyJson: any) : Promise<void> => {
    if (!checkContainsTags(bodyJson, ['username', 'password']))
        throw new DataError('not a valid create user request')
    const username = bodyJson.username
    const password = bodyJson.password
    await createUser(username, password)
}

function getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export const createUser = async(username:string, password:string) : Promise<void> => {
    return await new Promise((resolve) => {
        const salt = crypto.randomBytes(32)
        let hash:Buffer
        crypto.pbkdf2(password, salt, 1024, 64, 'sha256', async (err, derivedKey) => {
            if (err) throw new DataError('error encrypting users password');
            else {
                hash = derivedKey;
                await insertUser(username, salt.toString('hex'), hash.toString('hex')).catch(error => {
                    if (error.errno == 19) {
                        throw new DataError("User with that name already exist")
                    } else {
                        throw error
                    }
                })
                resolve()
            }
        });
    })
}

// @ts-ignore
export const authenticateUser = async(username:string, password:string) : Promise<boolean> => {
    let hash:Buffer;
    let user = await getUserByName(username)
    const salt:Buffer = Buffer.from(user.salt, "hex")
    return await new Promise((resolve) => {
        crypto.pbkdf2(password, salt, 1024, 64, 'sha256', (err, derivedKey) => {
            if (err) throw new DataError('error encrypting users password');
            else {
                hash = derivedKey;
                console.log(hash.toString("hex"))
                console.log(user.hash)
                resolve(hash.toString("hex") == user.hash)
            }
        });
    })
}