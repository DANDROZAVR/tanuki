import {
    getFirstFromCalendar,
    getScheduleByID,
    getScriptByUserID,
    getScriptByName,
    getScriptByID,
    removeFromCalendar
} from "./sql/database";
import {createWorker} from "./workersManager";
import {addToCalendar} from "./parser";

export const dumpyConstant = 'yup'

setInterval(async () => {
    console.log('running scheduler')
    while (true) {
        getFirstFromCalendar()
            .then(async event => {
                if (Date.parse(event.datetime) <= Date.now()) {
                    const schedule = await getScheduleByID(event.id)
                    const options = schedule.options
                    const script = await getScriptByID(schedule.scriptID)
                    createWorker({workerData: script})
                    await removeFromCalendar(event.id)
                    const wasAdded = await addToCalendar(script, options, false)
                    console.log(wasAdded)
                }
            })
            .catch(_ => _)
    }
}, 1000)