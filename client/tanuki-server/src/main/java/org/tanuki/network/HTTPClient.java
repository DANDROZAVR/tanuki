package org.tanuki.network;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URL;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class HTTPClient {
    public static void request(String address, String text) {
        /*try {
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("http://" + address + ":3001"))
                    .POST(HttpRequest.BodyPublishers.ofString(text))
                    .build();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            System.out.println("Server responded with code: " + response.statusCode());
        } catch (Exception e) {
            e.printStackTrace();
        }*/
        HttpURLConnection connection = null;
        try {
            URL url = new URL("http://" + address + ":3001");
            connection = (HttpURLConnection) url.openConnection();
            connection.setDoOutput(true);
            connection.setRequestMethod("POST");
            connection.setRequestProperty("Content-length", Integer.toString(text.length()));
            connection.setRequestProperty("Content-type", "text/plain");

            OutputStream outputStream = connection.getOutputStream();
            outputStream.write(text.getBytes(), 0, text.length());
            outputStream.close();

            int response = connection.getResponseCode();
            System.out.println("Server responded with code: " + response);

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (connection != null) {
                connection.disconnect();
            }
        }
    }
}
