import {getFirstFromCalendar} from "./sql/database";
import {createWorker} from "./workersManager";

setInterval(async () => {
    while (true) {
        const event = await getFirstFromCalendar()
        if (Date.parse(event.datetime) <= Date.now()) {
            //const scripts = await get
            //createWorker({workerData: })
        }
    }
}, 1000)