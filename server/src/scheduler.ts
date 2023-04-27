import {getFirstFromCalendar, getScheduleByID, getScriptByID, removeFromCalendar} from "./sql/database";
import {runWorker} from "./workersManager";
import {addToCalendar} from "./parser";

export const configureSchedule = () => {
    return setInterval(async () => {
        let processed = true
        while (processed) {
            processed = await (getFirstFromCalendar()
                    .then(async event => {
                        if (event.datetime.getTime() <= Date.now()) {
                            console.log(`Processing scheduled scripts "${event.id}". Date: ` + event.datetime)
                            const schedule = await getScheduleByID(event.scheduleID)
                            const options = schedule.options
                            const script = await getScriptByID(schedule.scriptID)
                            await removeFromCalendar(event.id)
                            const feedback = await runWorker({
                                workerData: {
                                    script: script,
                                    lastRunFeedback: options.lastRunFeedback,
                                    scriptOptions: options.scriptOptions
                                }
                            })
                            options['lastRunFeedback'] = feedback
                            await addToCalendar(script, options, false, event.scheduleID)
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
}