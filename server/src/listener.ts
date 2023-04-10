import http = require('http');
import {createDB, insertScript, insertUser} from "./database";
import {Worker} from 'node:worker_threads'

createDB();
//insertUser("admin");

const workerPath = './build/worker.js'

const PORT = 3001;
// TODO: change http to https?
/**
 * Every/each(choose correct later) http request should have:
 *  a) type
 *      1) addScript
 *      2) execScript
 *      3) TODO
 *  b) TODO
 *
 * Every/... addScript request should have:
 *  a) title (unique for that user)
 *  b) source
 *  c) a user it belongs to (TODO: change later to idk some private id)
 *
 * Every/... execScript should have:
 *  a) title
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
            const bodyJSON = JSON.parse(body)
            if (bodyJSON.type == 'addScript') {

            } else if (bodyJSON.type == 'execScript') {
                const jsonWorkerPath = JSON.stringify({path: '../../scripts/helloworld2.js'})
                const worker = new Worker(workerPath, {workerData: jsonWorkerPath})
                enableLogs(worker)
                addWorkerToObserveList(worker)
                console.log(jsonWorkerPath)
                res.end('GET READY BABY');
            }
        });
    } else {
        res.end();
    }
});

const addWorkerToObserveList = (worker:Worker) => {
    // TODO: add it. then check if it completes okay. if not - somehow do something (f.e relaunch, if relaunching is enabled in options)
}

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const enableLogs = (worker: Worker) => {
    worker.on('message', (result) => {
        console.log('msg' + result);
    });
    worker.on('error', (error) => {
        console.error(`Worker error: ${error}`);
        // Start a new task once the worker is no longer busy
    });
    worker.on('exit', (code) => {
        if (code !== 0) {
            console.error(`Worker stopped with exit code ${code}`);
            // Start a new task once the worker is no longer busy
        } else {
            console.error('worker stoped normally')
        }
    });
}

const sleep = async (time:number) => {
    await new Promise<void>((resolve) => {
        setTimeout(() => {
            resolve()
        }, time)
    })
}
