./network.sh down
./network.sh up createChannel -ca -s couchdb
./network.sh deployCC -ccn ledger -ccp ../vaccine-blockchain/chaincode/ -ccl javascript