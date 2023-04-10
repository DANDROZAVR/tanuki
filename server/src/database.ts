import { Database } from 'sqlite3';
import fs from 'fs';

const db = new Database('temp.db');
// Read and execute the SQL query in ./sql/articles.sql

function createDB(): void {
    db.exec(fs.readFileSync('src/sql/create.sql').toString());
}

function insertScript(title: string, script: string, user: number, path?: string, options?: object): boolean {
    const insert = db.prepare("INSERT OR REPLACE INTO scripts (id, title, source, user, path, options) VALUES (?, ?, ?, ?, ?)")
    try {
        insert.run([title, script, user, path, JSON.stringify(options)]);
        console.log("Script inserted successfully");
        return true;
    } catch (err) {
        console.error("Error inserting script:", err);
        return false;
    }
}

function insertUser(name:string): boolean {
    const insert = db.prepare("INSERT OR REPLACE INTO users (id) VALUES (?)");
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
            "SELECT script FROM scripts JOIN users ON scripts.user = users.id WHERE scripts.title = ? AND users.name = ?"
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
