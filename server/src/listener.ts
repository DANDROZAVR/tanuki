import http = require('http');
import {createDB, insertScript, insertUser} from "./database";
import puppeteer from "puppeteer";
import {loadJSFromPath} from "./helpers/scriptsDymLoading";
import {Worker} from 'node:worker_threads'

createDB();
//insertUser("admin");

const workerPath = './build/worker.js'

const PORT = 3001;
const server = http.createServer((req, res) => {
    if (req.method === 'POST') {
        console.log("GOT REQUEST")
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end',    () => {
            console.log(body)
            const jsonWorkerPath = JSON.stringify({path: '../../scripts/helloworld2.js'})
            const worker = new Worker(workerPath, {workerData: jsonWorkerPath})
            enableLogs(worker)
            console.log(jsonWorkerPath)
            res.end('GET READY BABY');
        });
    } else {
        res.end();
    }
});

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
