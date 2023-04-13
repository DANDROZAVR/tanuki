import { Database } from 'sqlite3';
import fs from 'fs';
import {type} from "os";
import {isNumberObject, isStringObject} from "util/types";

const db = new Database('temp.db');
// Read and execute the SQL query in ./sql/articles.sql

function createDB(): void {
    db.exec(fs.readFileSync('src/sql/create.sql').toString());
}

function insertScriptByName(title: string, source: string, userName: string, path?: string, options?: object) : Promise<boolean> {
    return new Promise((resolve, reject) => {
        getUserID(userName)
            .then(async userID => resolve(await insertScriptByID(title, source, userID, path, options)))
            .catch(error => reject(error))
    })
}

function insertScriptByID(title: string, source: string, userID: number, path?: string, options?: object): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
        const insert = db.prepare("INSERT OR REPLACE INTO scripts (title, source, user, path, options) VALUES (?, ?, ?, ?, ?)")
        try {
            insert.run([title, source, userID, path, JSON.stringify(options)], (error) => {
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

function insertUser(name: string): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
        const insert = db.prepare("INSERT OR REPLACE INTO users (name) VALUES (?)");
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

function insertIntoSchedule(scriptID: number, options: JSON): Promise<boolean> {
    return new Promise((resolve, reject) => {
        const insert = db.prepare(
            "INSERT OR REPLACE INTO schedule (scriptID, options) VALUES (?, ?)"
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

function insertIntoCalendar(scheduleID: number, datetime: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        const insert = db.prepare(
            "INSERT OR REPLACE INTO calendar (id, datetime) VALUES (?, ?)"
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


function loadScriptByName(title: string, userName: string): Promise<JSON> {
    return new Promise((resolve, reject) => {
        getUserID(userName)
            .then(async userID => resolve(await loadScriptByID(title, userID)))
            .catch(error => reject(error))
    })
}


function loadScriptByID(title: string, user: number): Promise<JSON> {
    return new Promise((resolve, reject) => {
        const select = db.prepare(
            "SELECT * FROM scripts WHERE scripts.title = ? AND scripts.user = ?"
        );
        select.get([title, user], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}

function getUserID(name: string) : Promise<number> {
    return new Promise((resolve, reject) => {
        const selectId = db.prepare("SELECT ID FROM users WHERE users.name == ?")
        selectId.all([name], (error, result) => {
            console.log("error: " + error)
            if (error == null && result.length == 1)
                resolve(result[0].id); else
            if (result.length != 1)
                reject("Didn't get any ids: " + result); else
                reject(error)
        })
    })
}

function getSchedule(scriptID: number): Promise<any[]> {
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

function getFirstFromCalendar(): Promise<any> {
    return new Promise((resolve, reject) => {
        const select = db.prepare(
            "SELECT * FROM calendar ORDER BY datetime ASC LIMIT 1"
        );
        select.get((err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}


export { insertScriptByID, insertScriptByName, insertUser, createDB, loadScriptByName, loadScriptByID };
