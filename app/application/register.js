'use strict';

const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('./CAUtil.js');
const { buildCCPOrg1, buildWallet } = require('./AppUtil.js');

const channelName = 'mychannel';
const chaincodeName = 'ledger';
const mspOrg1 = 'Org1MSP';

const walletPath = path.join(__dirname, 'wallet');
const userId = 'appUser';

function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}

async function main() {
	let skipInit = false;
	if (process.argv.length > 2) {
		if (process.argv[2] === 'skipInit') {
			skipInit = true;
		}
	}

	try {
		// build an in memory object with the network configuration (also known as a connection profile)
		const ccp = buildCCPOrg1();

		// build an instance of the fabric ca services client based on
		// the information in the network configuration
		//const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');

		// setup the wallet to hold the credentials of the application user
		const wallet = await buildWallet(Wallets, walletPath);

		// in a real application this would be done on an administrative flow, and only once
		//await enrollAdmin(caClient, wallet, mspOrg1);

		// in a real application this would be done only when a new user was required to be added
		// and would be part of an administrative flow
		//await registerAndEnrollUser(caClient, wallet, mspOrg1, userId, 'org1.department1');

		// Create a new gateway instance for interacting with the fabric network.
		// In a real application this would be done as the backend server session is setup for
		// a user that has been verified.
		const gateway = new Gateway();

		try {
			// setup the gateway instance
			// The user will now be able to create connections to the fabric network and be able to
			// submit transactions and query. All transactions submitted by this gateway will be
			// signed by this user using the credentials stored in the wallet.
			await gateway.connect(ccp, {
				wallet,
				identity: userId,
				discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
			});

			// Build a network instance based on the channel where the smart contract is deployed
			const network = await gateway.getNetwork(channelName);

			// Get the contract from the network.
			const contract = network.getContract(chaincodeName);

			// Initialize a set of asset data on the channel using the chaincode 'InitLedger' function.
			// This type of transaction would only be run once by an application the first time it was started after it
			// deployed the first time. Any updates to the chaincode deployed later would likely not need to run
			// an "init" type function.
			if (!skipInit) {
				try {
					console.log('\n--> Submit Transaction: InitLedger, function creates the initial set of assets on the ledger');
					await contract.submitTransaction('InitLedger');
					console.log('*** Result: committed');
				} catch (initError) {
					// this is error is OK if we are rerunning this app without restarting
					console.log(`******** initLedger failed :: ${initError}`);
				}
			} else {
				console.log('*** not executing "InitLedger');
			}

			let result;

			// Let's try a query operation (function).
			// This will be sent to just one peer and the results will be shown.
			console.log('\n--> Evaluate Transaction: Read vaccine1 details');
			let vaccine1 = await contract.evaluateTransaction('ReadAsset', 'vaccine1');
			console.log(`*** Result: ${prettyJSONString(vaccine1.toString())}`);


            console.log('\n--> Evaluate Transaction: Query for vaccines from pfizer');
			result = await contract.evaluateTransaction('QueryAssetsByBrand', 'pfizer');
			console.log(`*** Result: ${prettyJSONString(result.toString())}`);


            console.log('\n--> Evaluate Transaction: Query for vaccines from medico');
			result = await contract.evaluateTransaction('QueryAssetsByBrand', 'medico');
			console.log(`*** Result: ${prettyJSONString(result.toString())}`);
            
				
            console.log('\n--> Submit Transaction: Temperature violation for vaccine1');
			result = await contract.submitTransaction('RegisterViolation', 'vaccine1','temperature',"28.2");
			console.log(`*** Result: ${prettyJSONString(result.toString())}`);


            console.log('\n--> Evaluate Transaction: Read vaccine1 details');
			result = await contract.evaluateTransaction('ReadAsset', 'vaccine1');
			console.log(`*** Result: ${prettyJSONString(result.toString())}`);

			
            console.log('\n--> Get asset history');
			result = await contract.evaluateTransaction('GetAssetHistory', 'vaccine1');
			console.log(`*** Result: ${prettyJSONString(result.toString())}`);
			
		} finally {
			// Disconnect from the gateway when the application is closing
			// This will close all connections to the network
			gateway.disconnect();
		}
	} catch (error) {
		console.error(`******** FAILED to run the application: ${error}`);
		process.exit(1);
	}

	console.log('*** application ending');

}


main();