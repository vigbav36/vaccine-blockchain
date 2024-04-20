'use strict';

const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('./CAUtil.js');
const { buildCCPOrg1, buildWallet, buildCCPOrg2, buildCCPOrg } = require('./AppUtil.js');

const channelName = 'mychannel';
const chaincodeName = 'ledger';


const mspOrg1 = 'Org1MSP';
const mspOrg2 = 'Org2MSP';
const Org1UserId = 'appUser1';
const Org2UserId = 'appUser2';

function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}

async function initContractFromOrg1Identity() {
    console.log('\n--> Fabric client user & Gateway init: Using Org1 identity to Org1 Peer');
    // build an in memory object with the network configuration (also known as a connection profile)
    const ccpOrg1 = buildCCPOrg1();

    // build an instance of the fabric ca services client based on
    // the information in the network configuration
    const caOrg1Client = buildCAClient(FabricCAServices, ccpOrg1, 'ca.org1.example.com');

    // setup the wallet to cache the credentials of the application user, on the app server locally
    const walletPathOrg1 = path.join(__dirname, 'wallet/org1');
    const walletOrg1 = await buildWallet(Wallets, walletPathOrg1);

    // in a real application this would be done on an administrative flow, and only once
    // stores admin identity in local wallet, if needed
    await enrollAdmin(caOrg1Client, walletOrg1, mspOrg1);
    // register & enroll application user with CA, which is used as client identify to make chaincode calls
    // and stores app user identity in local wallet
    // In a real application this would be done only when a new user was required to be added
    // and would be part of an administrative flow
    await registerAndEnrollUser(caOrg1Client, walletOrg1, mspOrg1, Org1UserId, 'org1.department1');

    try {
        // Create a new gateway for connecting to Org's peer node.
        const gatewayOrg1 = new Gateway();
        // Connect using Discovery enabled
        await gatewayOrg1.connect(ccpOrg1,
            { wallet: walletOrg1, identity: Org1UserId, discovery: { enabled: true, asLocalhost: true } });

        return gatewayOrg1;
    } catch (error) {
        console.error(`Error in connecting to gateway: ${error}`);
        process.exit(1);
    }
}

async function initContractFromOrgIdentity() {
    console.log('\n--> Fabric client user & Gateway init: Using Org1 identity to Org1 Peer');

	const ccpOrg2 = buildCCPOrg('org2.example.com', 'connection-org2.json');

    const caOrg2Client = buildCAClient(FabricCAServices, ccpOrg2, 'ca.org2.example.com');

    const walletPathOrg2 = path.join(__dirname, 'wallet/org2');
    const walletOrg2 = await buildWallet(Wallets, walletPathOrg2);

    //await enrollAdmin(caOrg2Client, walletOrg2, mspOrg2);
    

    //await registerAndEnrollUser(caOrg2Client, walletOrg2, mspOrg2, Org2UserId, 'org2.department1');

    try {
        
        const gatewayOrg2 = new Gateway();
        
        await gatewayOrg2.connect(ccpOrg2,
            { wallet: walletOrg2, identity: Org2UserId, discovery: { enabled: true, asLocalhost: true } });

        return gatewayOrg2;
    } catch (error) {
        console.error(`Error in connecting to gateway: ${error}`);
        process.exit(1);
    }
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
		// const ccp = buildCCPOrg1();
		// const ccp2 =  buildCCPOrg2();
		// // build an instance of the fabric ca services client based on
		// // the information in the network configuration
		// const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');
		
		// const caClient2 = buildCAClient(FabricCAServices, ccp2, 'ca.org2.example.com');

		// // setup the wallet to hold the credentials of the application user
		// const wallet = await buildWallet(Wallets, walletPath);

		// // in a real application this would be done on an administrative flow, and only once
		// await enrollAdmin(caClient, wallet, mspOrg1);
		
		// //await enrollAdmin(caClient2, wallet, mspOrg1);

		// // in a real application this would be done only when a new user was required to be added
		// // and would be part of an administrative flow
		// await registerAndEnrollUser(caClient, wallet, mspOrg1, userId, 'org1.department1');
		// await registerAndEnrollUser(caClient2, wallet, mspOrg2, userId2, 'org2.department1');

		// Create a new gateway instance for interacting with the fabric network.
		// In a real application this would be done as the backend server session is setup for
		// a user that has been verified.
		// const gateway = new Gateway();
		// const gateway2 = new Gateway();

		try {
			// setup the gateway instance
			// The user will now be able to create connections to the fabric network and be able to
			// submit transactions and query. All transactions submitted by this gateway will be
			// signed by this user using the credentials stored in the wallet.
			// await gateway.connect(ccp, {
			// 	wallet,
			// 	identity: userId,
			// 	discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
			// });


			// await gateway2.connect(ccp, {
			// 	wallet,
			// 	identity: userId2,
			// 	discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
			// });




			const gatewayOrg5 = await initContractFromOrgIdentity();
        	const networkOrg1 = await gatewayOrg5.getNetwork(channelName);
        	const contract = networkOrg1.getContract(chaincodeName);

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

			console.log('\n--> Change owner');
			console.log(await contract.submitTransaction('TransferOwner', 'vaccine1', 'new_owner2'));
			console.log("Owner changed");


			console.log('\n--> Evaluate Transaction: Read vaccine1 details');
			result = await contract.evaluateTransaction('ReadAsset', 'vaccine1');
			console.log(`*** Result: ${prettyJSONString(result.toString())}`);


			console.log('\n--> Get asset history');
			result = await contract.evaluateTransaction('GetAssetHistory', 'vaccine1');
			console.log(`*** Result: ${prettyJSONString(result.toString())}`);

			
		} finally {
			// Disconnect from the gateway when the application is closing
			// This will close all connections to the network
			//gatewayOrg5.disconnect();
		}
	} catch (error) {
		console.error(`******** FAILED to run the application: ${error}`);
		process.exit(1);
	}

	console.log('*** application ending');

}


main();