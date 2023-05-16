import http = require('http');
import {createDB} from "./sql/database";
import {parseExecute, parseInsert, parseSchedule, parseLoad, parseCreateUser} from "./parser";
import {configureSchedule} from "./scheduler";

createDB();
const PORT = 3001;
// TODO: change http to https?
/**
 * Every (choose correct later) http request should have:
 *  a) type
 *      1) insertScript
 *      2) execScript
 *      3) scheduleScript
 *      4) loadScript
 *      5) createUser
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
 * Every createUser should have
 *  a) username
 *  b) password
 *
 *
 */


const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
    console.log("GOT REQUEST")
    if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end',    () => {
            console.log(body)
            let bodyJSON  = JSON.parse(body)
            try {
                let response =''
                if (bodyJSON.type == 'insertScript') {
                    parseInsert(bodyJSON)
                        .then(_ => {
                            response = JSON.stringify({
                                status:'ok',
                                message: `Saved script ${bodyJSON.title}`
                            })
                        }).catch((error: any) => {
                        response = JSON.stringify({
                            status:'error',
                            message:error.message
                        })
                    }).then( _=> {
                        res.end(response)
                    })
                } else if (bodyJSON.type == 'execScript') {
                    parseExecute(bodyJSON)
                        .then(_ => {
                            response = JSON.stringify({
                                status:'ok',
                                message: `Running script ${bodyJSON.title}`
                            })
                        }).catch((error: any) => {
                        response = JSON.stringify({
                            status:'error',
                            message:error.message
                        })
                    }).then( _=> {
                        res.end(response)
                    })
                } else if (bodyJSON.type == 'scheduleScript') {
                    parseSchedule(bodyJSON)
                        .then(result => {
                                response = JSON.stringify({
                                    status:'ok',
                                    message: `Scheduled on ${result}`
                                })
                        }).catch((error: any) => {
                        response = JSON.stringify({
                            status:'error',
                            message:error.message
                        })
                    }).then( _=> {
                        res.end(response)
                    })
                } else if (bodyJSON.type == 'loadScript') {
                    parseLoad(bodyJSON)
                        .then((script: any) => {
                            response = JSON.stringify({
                                status:'ok',
                                message: `Loaded script ${script.title} succesfully`,
                                source: script.source
                            })
                        }).catch((error: any) => {
                        response = JSON.stringify({
                            status:'error',
                            message:error.message
                        })
                    }).then((_: any)=> {
                        res.end(response)
                    })
                } else if (bodyJSON.type == 'createUser') {
                    parseCreateUser(bodyJSON)
                        .then(_ => {
                            response = JSON.stringify({
                                status:'ok',
                                message: `Created new user ${bodyJSON.username} succesfully`,
                            })
                        }).catch((error: any) => {
                        response = JSON.stringify({
                            status:'error',
                            message:error.message
                        })
                    }).then((_: any)=> {
                        res.end(response)
                    })
                }
            } catch (err) {
                console.error(err)
            }
        });
    } else {
        res.end();
    }
})

configureSchedule()

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
