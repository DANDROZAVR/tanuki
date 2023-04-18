import {
    getFirstFromCalendar,
    getScheduleByID,
    getScriptByID,
    removeFromCalendar
} from "./sql/database";
import {createWorker} from "./workersManager";
import {addToCalendar} from "./parser";

export const dumpyConstant = 'yup'

setInterval(async () => {
    let processed = true
    while (processed) {
        processed = await (getFirstFromCalendar()
            .then(async event => {
                console.log(new Date() + ' ' + event.datetime)
                if (event.datetime.getTime() <= Date.now()) {
                    console.log('Processing scheduled scripts. Date: ' + event.datetime)
                    const schedule = await getScheduleByID(event.id)
                    const options = schedule.options
                    const script = await getScriptByID(schedule.scriptID)
                    createWorker({workerData: script})
                    await removeFromCalendar(event.id)
                    await addToCalendar(script, options, false)
                    return true
                } else {
                    return false
                }
            })
            .catch(_ => {
                return false
            })
        )
    }
}, 1000)