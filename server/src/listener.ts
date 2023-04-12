import http = require('http');
import {createDB} from "./database";
import {parseExecute, parseInsert} from "./parser";

createDB();
const PORT = 3001;
// TODO: change http to https?
/**
 * Every/each(choose correct later) http request should have:
 *  a) type
 *      1) insertScript
 *      2) execScript
 *      3) TODO
 *  b) TODO
 *
 * Every/... insertScript request should have:
 *  a) user
 *  b) title (unique for that user)
 *  c) source
 *
 *
 * Every/... execScript should have:
 *  a) user
 *  b) title
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
            if (bodyJSON.type == 'insertScript') {
                parseInsert(bodyJSON)
                    .then(result => res.end(result ? "running" : "error"))
            } else if (bodyJSON.type == 'execScript') {
                parseExecute(bodyJSON)
                    .then(result => res.end(result ? "running" : "error"))
            }
        });
    } else {
        res.end();
    }
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
