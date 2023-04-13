import {Worker} from "node:worker_threads";
import {WorkerOptions} from "worker_threads";
import * as worker_threads from "worker_threads";

const maxErrorsRetrying = 3
let workersInWork : [Worker, any, number][] = []
setInterval(() => {
    for (let i = workersInWork.length - 1; i >= 0; --i) {
        let toBeRemoved = false
        const workerOptions = workersInWork[i][1]
        const exitCode = workersInWork[i][2]
        if (workersInWork[i][2] == 1) {
            // naturally finished
            console.log('normally finished task "' + workerOptions.title + '"')
            toBeRemoved = true
        } else
        if (workersInWork[i][2] > 1) {
            // finished with an error. was runned x - 1 time (initially 2 means an error)
            if (exitCode <= maxErrorsRetrying) {
                console.log('retrying task "' + workerOptions.title + '"')
                createWorker(workerOptions.path, workerOptions.workerData, -exitCode)
            }
            toBeRemoved = true
        } else {
            // 0 --- normally executing
        }
        if (toBeRemoved) {
            workersInWork.splice(i, 1);
        }
    }
}, 1000)
// TODO: make interfaces for each call in database like WorkerOptions
const createWorker = (path: string, workerOptions: any, exitCode: number = 0) : Worker => {
    console.log(path)
    const worker = new Worker(path, workerOptions)
    enableLogs(worker)
    workerOptions['path'] = path
    workersInWork.push([worker, workerOptions, exitCode])
    console.log('added task "' + workerOptions.title + '"')
    return worker
}

const findWorker = (worker: Worker) : number => {
    for (let i = 0; i < workersInWork.length; ++i)
        if (workersInWork[i][0] === worker)
            return i
    console.error("Worker wasn't found in the list. Something bad have happened")
    return -1;
}

const enableLogs = (worker: Worker) => {
    worker.on('message', (result) => {
        console.log('msg' + result);
    });
    worker.on('error', (error) => {
        console.error(`Worker error: ${error}`);
        // Start a new task once the worker is no longer busy
    });
    worker.on('exit', (code) => {
        const index = findWorker(worker)
        if (index !== -1) {
            // TODO: do this callback is executing in the main thread? there won't be any problems with?
            console.log(`found myself at ${index} with ${-workersInWork[index][2]} tries`)
            if (code !== 0) {
                console.error(`Worker stopped with exit code ${code}`);
                if (!workersInWork[index][2])
                    workersInWork[index][2] = -1;
            } else {
                console.log('worker stopped normally')
            }
            workersInWork[index][2] = -workersInWork[index][2] + 1
        }
    });
}

export {createWorker}