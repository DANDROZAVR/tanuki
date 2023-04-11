import { Database } from 'sqlite3';
import fs from 'fs';

const db = new Database('temp.db');
// Read and execute the SQL query in ./sql/articles.sql

function createDB(): void {
    db.exec(fs.readFileSync('src/sql/create.sql').toString());
}

function insertScript(title: string, source: string, user: number, path?: string, options?: object): Promise<boolean> {
    return new Promise((resolve, reject) => {
        const insert = db.prepare("INSERT OR REPLACE INTO scripts (title, source, user, path, options) VALUES (?, ?, ?, ?, ?)")
        try {
            //title, source, user, path, JSON.stringify(options)
            insert.run([], (error) => {
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

function insertUser(name:string): boolean {
    const insert = db.prepare("INSERT OR REPLACE INTO users (name) VALUES (?)");
    try {
        insert.run([name]);
        console.log("User inserted successfully");
        return true;
    } catch (err) {
        console.error("Error inserting user:", err);
        return false;
    }
}

function loadScript(title: string, user: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const select = db.prepare(
            "SELECT source FROM scripts WHERE scripts.title = ? AND scripts.user = ?"
        );
        select.all([title, user], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                if (rows.length > 0) {
                    resolve(rows[0].source);
                } else {
                    resolve("");
                }
            }
        });
    });
}

export { insertScript, insertUser, createDB, loadScript };
