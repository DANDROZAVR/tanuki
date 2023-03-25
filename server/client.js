const fs = require('fs');
const http = require('http');

const PORT = 3001;
const file_path = '/home/dandr/Documents/log';

const fileStream = fs.createReadStream(file_path);
const request = http.request({
    method: 'POST',
    hostname: 'localhost',
    port: PORT,
    headers: {
        'Content-Type': 'text/plain',
        'Content-Length': fs.statSync(file_path).size
    }
}, response => {
    response.on('data', data => {
        console.log(data.toString());
    });
});

fileStream.pipe(request);

/*

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

public class FileUploadClient {

    public static void main(String[] args) throws IOException {
        String serverUrl = "http://localhost:3001/upload"; // change this to the URL of your server
        String filePath = "path/to/file"; // change this to the path of the file you want to upload

        File file = new File(filePath);
        String fileName = file.getName();

        URL url = new URL(serverUrl);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setDoOutput(true);
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/octet-stream");
        conn.setRequestProperty("Content-Disposition", "attachment; filename=\"" + fileName + "\"");

        OutputStream outputStream = conn.getOutputStream();
        FileInputStream fileInputStream = new FileInputStream(file);
        byte[] buffer = new byte[4096];
        int bytesRead = -1;
        while ((bytesRead = fileInputStream.read(buffer)) != -1) {
            outputStream.write(buffer, 0, bytesRead);
        }

        outputStream.flush();
        fileInputStream.close();

        int responseCode = conn.getResponseCode();
        System.out.println("Server response code: " + responseCode);
        conn.disconnect();
    }
}
 */