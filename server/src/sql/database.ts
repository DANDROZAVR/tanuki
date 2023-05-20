import { Database } from 'sqlite3';
import fs from 'fs';
export interface User {
    id: number;
    name: string;
    salt: string;
    hash: string;
}

export interface Script {
    id: number;
    title: string;
    source: string;
    path: string | null;
    pureJScode: boolean;
    user: User['id'];
}

interface Schedule {
    id: number;
    options: ScheduleOptions,
    scriptID: Script['id'],
}


enum ScheduleTag {
    once,
    every,
    times
}
interface ScheduleOptions {
    tag: ScheduleTag,
    once: OnceOptions | undefined,
    times: NotOnceOptions | undefined,
    lastRunFeedback: any,
    scriptOptions: any,
}

interface OnceOptions {
    date: Date,
}

interface NotOnceOptions {
    timesExecution: number,
    minWaitMinute: number,
    maxWaitMinute: number
}

interface Calendar {
    id: number,
    scheduleID: Schedule['id'];
    datetime: Date;
}


const db = new Database('temp2.db');

export function createDB(): void {
    db.exec(fs.readFileSync('src/sql/create.sql').toString());
}

export function insertScriptByName(title: string, source: string, userName: string, path: string, pureJSCode: boolean) : Promise<boolean> {
    return new Promise((resolve, reject) => {
        getUserByName(userName)
            .then(async user => resolve(await insertScriptByID(title, "", source, user.id, path, pureJSCode)))
            .catch(error => reject(error))
    })
}

export function insertScriptByID(title: string, description: string, source: string, userID: number, path: string, pureJSCode: boolean): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
        const insert = db.prepare("INSERT INTO scripts (title, description, source, user, path, pureJsCode) VALUES (?, ?, ?, ?, ?, ?)")
        try {
            insert.run([title, description, source, userID, path, pureJSCode], (error) => {
                if (error == null)
                    resolve(true); else
                    reject(error)
            }); // TODO: change to serialization if multithreadining is enabled
        } catch (err) {
            // TODO: make research. probably exceptions there don't work
            console.error("Error inserting script:", err);
            return false;
        }
    })
}

export function insertUser(name: string, salt:string, hash:string): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
        const insert = db.prepare("INSERT INTO users (name, salt, hash) VALUES (?, ?, ?)");
        try {
            insert.run([name, salt, hash], (error) => {
                if (error == null)
                    resolve(true); else
                    reject(error)
            });
        } catch (err) {
            console.error("Error inserting user:", err);
            return false;
        }
    })
}

// TODO: probably all function shoule look like this (serialization)
export const insertIntoSchedule = async(scriptID: number, options: any): Promise<number> => {
    return new Promise((resolve, reject) => {
            const insert = db.prepare(
                "INSERT INTO schedule (scriptID, options) VALUES (?, ?)"
            );
            try {
                insert.run([scriptID, JSON.stringify(options)], async function (error) {
                    if (error == null) {
                        const id = this.lastID;
                        if (error == null) {
                            resolve(id);
                        } else {
                            reject(error);
                        }
                    } else {
                        reject(error);
                    }
                });
            } catch (err) {
                console.error("Error inserting into schedule:", err);
                reject(err);
            }
        //});
    });
}


export function insertIntoCalendar(scheduleID: number, datetime: Date): Promise<boolean> {
    return new Promise((resolve, reject) => {
        const insert = db.prepare(
            "INSERT INTO calendar (scheduleID, datetime) VALUES (?, ?)"
        );
        try {
            insert.run([scheduleID, datetime], (error) => {
                if (error == null) {
                    resolve(true);
                } else {
                    reject(error);
                }
            });
        } catch (err) {
            console.error("Error inserting into calendar:", err);
            return false;
        }
    });
}

export function updateScheduleOptionsByID(scheduleID: number, options: any): Promise<boolean> {
    return new Promise((resolve, reject) => {
        const update = db.prepare(
            "UPDATE schedule SET options = ? WHERE id = ?"
        )
        try {
            update.run([JSON.stringify(options), scheduleID], (error) => {
                if (error == null) {
                    resolve(true)
                } else {
                    reject(error)
                }
            })
        } catch (err) {
            console.error("Error in update schedule")
            return false
        }
    })
}

export function getScriptByName(title: string, userName: string): Promise<Script> {
    return new Promise((resolve, reject) => {
        getUserByName(userName)
            .then(async user => resolve(await getScriptByUserID(title, user.id)))
            .catch(error => reject(error))
    })
}


export function getScriptByUserID(title: string, user: number): Promise<Script> {
    return new Promise((resolve, reject) => {
        const select = db.prepare(
            "SELECT * FROM scripts WHERE scripts.title = ? AND scripts.user = ?"
        );
        select.get([title, user], (err, row) => {
            if (err) {
                reject(err);
            } else {
                // @ts-ignore
                resolve(row as Script);
            }
        });
    });
}

export function getScriptByID(scriptID: number): Promise<Script> {
    return new Promise((resolve, reject) => {
        const select = db.prepare(
            "SELECT * FROM scripts WHERE scripts.id = ?"
        );
        select.get([scriptID], (err, row) => {
            if (err)
                reject(err); else
            if (row === undefined)
                reject(`There's no script with id ${scriptID}`); else
                { // @ts-ignore
                    resolve(row);
                }
        });
    });
}

export function getUserByName(name: string) : Promise<User> {
    return new Promise((resolve, reject) => {
        const selectId = db.prepare("SELECT * FROM users WHERE users.name == ?")
        selectId.get([name], (err, row) => {
            if (err)
                reject(err); else
            if (row === undefined)
                reject(`There are no users with the name ${name}`); else {
                // @ts-ignore
                resolve(row);
            }
        })
    })
}

export function getScheduleByScriptIDAndOptions(scriptID: number, options: any): Promise<Schedule> {
    return new Promise((resolve, reject) => {
        const select = db.prepare(
            "SELECT * FROM schedule WHERE schedule.scriptID = ? AND schedule.options = ?"
        );
        select.get([scriptID, JSON.stringify(options)], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row as Schedule)
            }
        });
    });
}

export function getScheduleByID(scriptID: number): Promise<Schedule> {
    return new Promise((resolve, reject) => {
        const select = db.prepare(
            "SELECT * FROM schedule WHERE schedule.id = ?"
        );
        select.get([scriptID], (err, row) => {
            if (err) {
                reject(err);
            } else {
                const schedule : Schedule = row as Schedule
                // @ts-ignore
                schedule.options = JSON.parse(row.options)
                resolve(row as Schedule);
            }
        });
    });
}

export function getFirstFromCalendar(): Promise<Calendar> {
    return new Promise((resolve, reject) => {
        const select = db.prepare(
            "SELECT * FROM calendar ORDER BY datetime LIMIT 1"
        );
        select.get((err, row) => {
            if (err)
                reject(err); else
            if (row === undefined)
                reject("There's no scripts are in calendar");
            else {
                const calendar: Calendar = row as Calendar
                calendar.datetime = new Date(calendar.datetime)
                resolve(calendar);
            }
        });
    });
}

export function removeFromCalendar(eventID: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
        const select = db.prepare(
            "DELETE FROM calendar WHERE id = ?"
        );
        select.run([eventID], (err) => {
            if (err == null) {
                resolve(true);
            } else {
                reject(err);
            }
        })
    });
}

