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

Go to test-network directory 

  ```bash
  cd test-network
  ```

Run bash file run.sh

  ```bash
  ./run.sh
  ```

The above file should have ended with the message 

 ```text
 Query chaincode definition successful on peer0.org2 on channel 'mychannel'
 Chaincode initialization is not required
 ```

## Running app

Go to vaccine-blockchain/application from test-network

  ```bash
  cd ../vaccine-blockchain/application
  ```

Delete the wallet directory if present 

```bash
rm -r wallet
```

Run the vaccine.js file
 ```bash
  node vaccine.js
  ```


Note - If access denied error pops up, make sure you have deleted the wallet directory and re run vaccine.js
