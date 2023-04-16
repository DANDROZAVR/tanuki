import { Database } from 'sqlite3';
import fs from 'fs';
import {type} from "os";
import {isNumberObject, isStringObject} from "util/types";

const db = new Database('temp.db');
// Read and execute the SQL query in ./sql/articles.sql

export function createDB(): void {
    db.exec(fs.readFileSync('src/sql/create.sql').toString());
}

export function insertScriptByName(title: string, source: string, userName: string, path: string) : Promise<boolean> {
    return new Promise((resolve, reject) => {
        getUserID(userName)
            .then(async userID => resolve(await insertScriptByID(title, source, userID, path)))
            .catch(error => reject(error))
    })
}

export function insertScriptByID(title: string, source: string, userID: number, path?: string): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
        const insert = db.prepare("INSERT INTO scripts (title, source, user, path) VALUES (?, ?, ?, ?)")
        try {
            insert.run([title, source, userID, path], (error) => {
                console.log("error: " + error)
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

export function insertUser(name: string): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
        const insert = db.prepare("INSERT INTO users (name) VALUES (?)");
        try {
            insert.run([name], (error) => {
                console.log("error: " + error)
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

export function insertIntoSchedule(scriptID: number, options: JSON): Promise<boolean> {
    return new Promise((resolve, reject) => {
        const insert = db.prepare(
            "INSERT INTO schedule (scriptID, options) VALUES (?, ?)"
        );
        try {
            insert.run([scriptID, JSON.stringify(options)], (error) => {
                if (error == null) {
                    resolve(true);
                } else {
                    reject(error);
                }
            });
        } catch (err) {
            console.error("Error inserting into schedule:", err);
            return false;
        }
    });
}

export function insertIntoCalendar(scheduleID: number, datetime: Date): Promise<boolean> {
    return new Promise((resolve, reject) => {
        const insert = db.prepare(
            "INSERT INTO calendar (id, datetime) VALUES (?, ?)"
        );
        try {
            insert.run([scheduleID, datetime.toString()], (error) => {
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


export function getScriptByName(title: string, userName: string): Promise<JSON> {
    return new Promise((resolve, reject) => {
        getUserID(userName)
            .then(async userID => resolve(await getScriptByUserID(title, userID)))
            .catch(error => reject(error))
    })
}


export function getScriptByUserID(title: string, user: number): Promise<JSON> {
    return new Promise((resolve, reject) => {
        const select = db.prepare(
            "SELECT * FROM scripts WHERE scripts.title = ? AND scripts.user = ?"
        );
        select.get([title, user], (err, row) => {
            if (err) {
                reject(err);
            } else {
                // @ts-ignore
                resolve(row.source);
            }
        });
    });
}

export function getScriptByID(scriptID: number): Promise<JSON> {
    return new Promise((resolve, reject) => {
        const select = db.prepare(
            "SELECT * FROM scripts WHERE scripts.id = ?"
        );
        select.get([scriptID], (err, row) => {
            if (err)
                reject(err); else
            if (row === undefined)
                reject(`There's no scrpt with id ${scriptID}`); else
                { // @ts-ignore
                    resolve(row.source);
                }
        });
    });
}

export function getUserID(name: string) : Promise<number> {
    return new Promise((resolve, reject) => {
        const selectId = db.prepare("SELECT ID FROM users WHERE users.name == ?")
        selectId.get([name], (err, row) => {
            if (err)
                reject(err); else
            if (row === undefined)
                reject(`There's no users with the name ${name}`); else {
                // @ts-ignore
                resolve(row.id);
            }
        })
    })
}

export function getScheduleByScriptID(scriptID: number): Promise<any[]> {
    return new Promise((resolve, reject) => {
        const select = db.prepare(
            "SELECT * FROM schedule WHERE schedule.scriptID = ?"
        );
        select.all([scriptID], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

export function getScheduleByID(scriptID: number): Promise<any> {
    return new Promise((resolve, reject) => {
        const select = db.prepare(
            "SELECT * FROM schedule WHERE schedule.id = ?"
        );
        select.get([scriptID], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

export function getFirstFromCalendar(): Promise<any> {
    return new Promise((resolve, reject) => {
        const select = db.prepare(
            "SELECT * FROM calendar ORDER BY datetime ASC LIMIT 1"
        );
        select.get((err, row) => {
            if (err)
                reject(err); else
            if (row === undefined)
                reject("There's no scripts are in calendar"); else
                resolve(row);
        });
    });
}

export function removeFromCalendar(eventID: number) {
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

