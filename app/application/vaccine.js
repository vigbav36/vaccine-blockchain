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

async function connectToNetwork(){
	try {
		const ccp = buildCCPOrg1();

		const wallet = await buildWallet(Wallets, walletPath);

		const gateway = new Gateway();

		try {

			await gateway.connect(ccp, {
				wallet,
				identity: userId,
				discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
			});

			const network = await gateway.getNetwork(channelName);

			return network;
		}
		catch(error){
			console.log(error);
		}
	}
	catch(error){
		console.log(error);
	}
}


exports.getVaccineHistory = async (vaccine_id) => {
	console.log("getting history")
	const network = await connectToNetwork();
	const contract = network.getContract(chaincodeName);

	const resultBuffer  = await contract.evaluateTransaction('GetAssetHistory', vaccine_id);

	const resultString = resultBuffer.toString('utf8');

	const resultJSON = JSON.parse(resultString);
	return resultJSON
}


exports.getVaccinesByBrand =  async (brand) =>{
	const network = await connectToNetwork();
	const contract = network.getContract(chaincodeName);
	const resultBuffer = await contract.evaluateTransaction('QueryAssetsByBrand', brand);
	const resultString = resultBuffer.toString('utf8');
	const resultJSON = JSON.parse(resultString);
	return resultJSON
}

exports.registerViolation = async (vaccine_id, violation) => {
	const network = await connectToNetwork();
	const contract = network.getContract(chaincodeName);
  
	const resultBuffer = await contract.submitTransaction('RegisterViolation', vaccine_id, violation.parameter, violation.value);
	const resultString = resultBuffer.toString('utf8');
	const resultJSON = JSON.parse(resultString);
	return resultJSON;
  };
  
  exports.registerViolations = async (vaccine_id, violations) => {
	var result = [];
	for (let i = 0; i < violations.length; i++) {
	  const violation = violations[i];
	  result.push(await exports.registerViolation(vaccine_id, violation)); // Fix the function name here
	}
	return result;
  };
  

  exports.registerViolations = async (vaccine_id, violations) => {
	var result = [];
	for (let i = 0; i < violations.length; i++) {
	  const violation = violations[i];
	  result.push(await exports.registerViolation(vaccine_id, violation)); // Fix the function name here
	}
	return result;
  };

exports.addVaccine = async (vaccine) => {
	const network = await connectToNetwork();
	const contract = network.getContract(chaincodeName);
	console.log(vaccine.threshold)
	return await contract.submitTransaction('CreateAsset', vaccine.vaccineId, vaccine.containerId, JSON.stringify(vaccine.threshold), JSON.stringify(vaccine.readings), vaccine.brand, vaccine.owner);
	
};

exports.getVaccine = async (vaccine_id) => {
	const network = await connectToNetwork();
	const contract = network.getContract(chaincodeName);

	const resultBuffer = await contract.evaluateTransaction('ReadAsset', vaccine_id);

	const resultString = resultBuffer.toString('utf8');
	const resultJSON = JSON.parse(resultString);
	return resultJSON;
}