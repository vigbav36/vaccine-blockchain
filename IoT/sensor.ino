#include <Wire.h>
#include <BH1750.h>
#include <DHT.h>
#include <WiFi.h>
#include <HTTPClient.h>

#define DHTPIN 4       // Digital pin connected to the DHT sensor
#define DHTTYPE DHT11  // DHT 22 (AM2302), AM2321
DHT dht(DHTPIN, DHTTYPE);

BH1750 lightSensor;

const char *ssid = "oplus_co_apjois";  // Your WiFi SSID
const char *password = "btac4949";     // Your WiFi password

const char *serverUrl = "https://szn8dg2qly88.share.zrok.io/vaccine/violations";  // Your server URL to post the data

void setup() {
  Serial.begin(115200);
  Wire.begin();

  dht.begin();          // Initialize DHT sensor
  lightSensor.begin();  // Initialize BH1750 sensor

  connectToWiFi();
}

void loop() {
  // Read and post DHT sensor data
  uint16_t temperature = readTemperature();
  uint16_t   humidity = readHumidity();

  // Read and post BH1750 sensor data
  uint16_t lightLevel = readLight();

Serial.print("Light value: ");
Serial.print(lightLevel);
Serial.println();

Serial.print("Humidity: ");
Serial.print(humidity);
Serial.println("%");

Serial.print("Temperature: ");
Serial.print(temperature);
Serial.println("C");
  // Post sensor data to server
  if(lightLevel > 4)
    postLightViolation(lightLevel);
  postTempViolation(temperature, humidity);

  delay(7000);  // Delay between posts
}

float readTemperature() {
  return dht.readTemperature();
}

float readHumidity() {
  return dht.readHumidity();
}

uint16_t readLight() {
  return lightSensor.readLightLevel();
}

void connectToWiFi() {
  Serial.println("Connecting to WiFi...");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting...");
  }
  Serial.println("Connected to WiFi");
  Serial.print(WiFi.localIP());
}
void postTempViolation(uint16_t temperature,uint16_t  humidity){
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;

    // Your server URL to post the data
    http.begin(serverUrl);

    // Set content type to JSON
    http.addHeader("Content-Type", "application/json");
    http.addHeader("Origin", "default");
    http.addHeader("ngrok-skip-browser-warning", "69420");

    // Create JSON payload
    String jsonData = "{\"container_id\":\"container1\",\"violations\":[{\"parameter\":\"temperature\",\"value\":\"" + String(temperature) + "\"}]}";


    // Send HTTP POST request
    int httpResponseCode = http.POST(jsonData);


    if (httpResponseCode > 0) {
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
    } else {
      Serial.print("Error code: ");
      Serial.println(httpResponseCode);
    }

    // Free resources
    http.end();
  } else {
    Serial.println("Error: WiFi not connected");
  }
}
void postLightViolation(uint16_t lightLevel) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;

    // Your server URL to post the data
    http.begin(serverUrl);

    // Set content type to JSON
    http.addHeader("Content-Type", "application/json");
    http.addHeader("Origin", "default");
    http.addHeader("ngrok-skip-browser-warning", "69420");

    // Create JSON payload
    String jsonData = "{\"container_id\":\"container1\",\"violations\":[{\"parameter\":\"opening\",\"value\":\"opening\"}]}";


    // Send HTTP POST request
    int httpResponseCode = http.POST(jsonData);


    if (httpResponseCode > 0) {
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
      String payload = http.getString();
      Serial.print('\n' + payload);
    } else {
      Serial.print("Error code: ");
      Serial.println(httpResponseCode);
    }

    // Free resources
    http.end();
  } else {
    Serial.println("Error: WiFi not connected");
  }
}
