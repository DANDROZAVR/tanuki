import http = require('http');

const PORT = 3001;

const server = http.createServer((req, res) => {
    if (req.method === 'POST') {
        console.log("GOT REQUEST")
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end',    () => {
            console.log(`Received file: ${body}`);
            res.end('GET READY BABY');
        });
    } else {
        res.end();
    }
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});