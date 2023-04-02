import { Database } from 'sqlite3';
import fs from 'fs';

const db = new Database('temp.db');
// Read and execute the SQL query in ./sql/articles.sql

function create() {
    db.exec(fs.readFileSync('../src/sql/create.sql').toString());
}

create();

function insertScript(title:string, script:string, user:number){
    const insert = db.prepare("INSERT OR REPLACE INTO scripts (title, script, user) VALUES (?, ?, ?)");
    insert.run([title, script, user]);
}

function insertUser(name:string){
    const insert = db.prepare("INSERT OR REPLACE INTO users (name) VALUES (?)");
    insert.run([name]);
}

function loadScript(title:string, user:string): string{
    let result;
    const select = db.prepare("select script from scripts join users where scripts.title=? and users.name=?;");
    select.get(
        [title, user],
        (_, res) => {result = res;} //????
    );
    console.log(result);
    return "";
}

console.log(loadScript("manual", "admin"));

export {insertScript, insertUser}

