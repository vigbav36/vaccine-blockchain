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
