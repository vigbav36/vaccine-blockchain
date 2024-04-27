# Software Requirements

- **Docker**: Docker is a platform for developing, shipping, and running applications using containerization.
- **Ubuntu or WSL (Windows Subsystem for Linux)**: Ubuntu is a popular Linux distribution, while WSL allows running Linux distributions on Windows seamlessly.
- **Node.js**: Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine, commonly used for building server-side applications.
- **Postman**: Postman is a collaboration platform for API development, allowing users to design, mock, test, and monitor APIs.

# Hardware Requirements

- **ESP32 controller**: ESP32 is a series of low-cost, low-power system-on-chip microcontrollers with integrated Wi-Fi and dual-mode Bluetooth.
- **DHT sensor**: The DHT series of sensors are used for measuring temperature and humidity.
- **GY30 light sensor**: GY30 is a light intensity sensor module that measures the intensity of light.
- **Breadboard**: A breadboard is a solderless device for temporary circuit prototyping.
- **Wires**: Wires are used for connecting components on the breadboard and to the ESP32 controller.
- **A box**: A box that acts like a vaccine container


# Vaccine Blockchain

Implementation of a blockchain network for vaccine supply chain and a node application that is connected to this network

## Clone the repository:

  ```bash
  git clone https://github.com/vigbav36/vaccine-blockchain.git
  cd vaccine-blockchain
  ```

## Install hyperledger docker necessities
  ```bash
  ./install-fabric.sh docker binary
  ```
## Setting Up Network and deploying chain code

### Go to test-network directory 

  ```bash
  cd test-network
  ```

### Run bash file run.sh

  ```bash
  ./run.sh
  ```

### The above file should have ended with the message 

 ```text
 Query chaincode definition successful on peer0.org2 on channel 'mychannel'
 Chaincode initialization is not required
 ```

## Running the express.js application

### Go to app from test-network

  ```bash
  cd ../app
  ```

### Delete the wallet directories if present 

```bash
rm -r wallet1
rm -r wallet2
```
### Install necessary packages

  ```bash
  npm install
  ```

### Start the server
 ```bash
  DEBUG=express:* node app.js
 ```


Note - If access denied error pops up, make sure you have deleted the wallet directory and re run vaccine.js
