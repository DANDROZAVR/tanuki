import http = require('http');
import {createDB} from "./sql/database";
import {parseExecute, parseInsert, parseSchedule} from "./parser";

createDB();
const PORT = 3001;
// TODO: change http to https?
/**
 * Every (choose correct later) http request should have:
 *  a) type
 *      1) insertScript
 *      2) execScript
 *      3) scheduleScript
 *      4) TODO
 *  b) TODO
 *
 * Every insertScript request should have:
 *  a) user
 *  b) title (unique for that user)
 *  c) source
 *
 *
 * Every execScript should have:
 *  a) user
 *  b) title
 *
 *
 * Every scheduleScript should have:
 *  a) user
 *  b) title
 *  c) scheduleOptions (json that explains how the script should be scheduled)
 *
 *  ScheduleOptions:
 *      a) "tag" among { once, times, every }
 *          1) for {times} '"times": number' member should be filled. For now, times <= 9 to
 *          2) for {every} '"every": string' should be filled with {hour, day, week, month}. It means, that script could be executed in that time period
 *          3) for {once}, one could paste exact time of scripts' execution, f.e. '"once": date
 *      TODO:b) "interval"
 *          1) '"min": number' min number of seconds before two consequences execution (and before the first one)
 *          2) '"max": number' max --..--
 *
 *
 */
const server = http.createServer((req, res) => {
    if (req.method === 'POST') {
        console.log("GOT REQUEST")
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end',    () => {
            console.log(body)
            let bodyJSON
            try {
                bodyJSON = JSON.parse(body)
                if (bodyJSON.type == 'insertScript') {
                    parseInsert(bodyJSON)
                        .then(result => res.end(result ? "inserted" : "error"))
                } else if (bodyJSON.type == 'execScript') {
                    parseExecute(bodyJSON)
                        .then(result => res.end(result ? "running" : "error"))
                } else if (bodyJSON.type == 'scheduleScript') {
                    parseSchedule(bodyJSON)
                        .then(result => res.end(result ? `scheduled on ${result}` : "error"))
                }
            } catch (err) {
                console.error(err)
            }
        });
    } else {
        res.end();
    }
})

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
