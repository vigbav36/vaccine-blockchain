'use strict';

const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('./CAUtil.js');
const { buildWallet, buildCCPOrg } = require('./AppUtil.js');
const channelName = 'mychannel';
const chaincodeName = 'ledger';

const FabricCAServices = require('fabric-ca-client');
const session = require('express-session');

function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}

async function getGateway() {
	console.log('\n--> Building local wallet system and registering admin and sample user');
  
	const ccpOrg = buildCCPOrg(process.env.URL_ORG, process.env.CONFIG_FILE_ORG);
	const caOrgClient = buildCAClient(FabricCAServices, ccpOrg, process.env.CA_ORG);
	const walletPathOrg = path.join(__dirname, process.env.WALLET_DIR);
	const walletOrg = await buildWallet(Wallets, walletPathOrg);
	await enrollAdmin(caOrgClient, walletOrg, process.env.MSP_ORG);
  
	try {
		const gatewayOrg = new Gateway();
		await gatewayOrg.connect(ccpOrg,
			{ wallet: walletOrg, identity:'admin', discovery: { enabled: true, asLocalhost: true } });
  
		console.log(gatewayOrg + " Made gateway");
		return gatewayOrg;
  
	} catch (error) {
		console.error(`Error in connecting to gateway: ${error}`);
		process.exit(1);
	}
  }

async function getGatewayAsUser(user_id) {
	console.log('\n--> Getting user gateway');
  
	const ccpOrg = buildCCPOrg(process.env.URL_ORG, process.env.CONFIG_FILE_ORG);
	const caOrgClient = buildCAClient(FabricCAServices, ccpOrg, process.env.CA_ORG);
	const walletPathOrg = path.join(__dirname, process.env.WALLET_DIR);
	const walletOrg = await buildWallet(Wallets, walletPathOrg);
	//await enrollAdmin(caOrgClient, walletOrg, process.env.MSP_ORG);
  
	try {
		const gatewayOrg = new Gateway();
		await gatewayOrg.connect(ccpOrg,
			{ wallet: walletOrg, identity:user_id, discovery: { enabled: true, asLocalhost: true } });
		
		return gatewayOrg;
  
	} catch (error) {
		console.error(`Error in connecting to gateway: ${error}`);
		process.exit(1);
	}
}

async function registerUser(user_id) {
	try {
		console.log('\n--> Registering user '+ user_id);
		const ccpOrg = buildCCPOrg(process.env.URL_ORG, process.env.CONFIG_FILE_ORG);
		const caOrgClient = buildCAClient(FabricCAServices, ccpOrg, process.env.CA_ORG);
		const walletPathOrg = path.join(__dirname, process.env.WALLET_DIR);
		const walletOrg = await buildWallet(Wallets, walletPathOrg);
		await enrollAdmin(caOrgClient, walletOrg, process.env.MSP_ORG);
		await registerAndEnrollUser(caOrgClient, walletOrg,  process.env.MSP_ORG , user_id, process.env.ORG_DEPARTMENT);
		console.log('\n--> Registered User successfully -  '+ user_id);

	} catch (error) {
		console.error(`Error in connecting to gateway: ${error}`);
		process.exit(1);
	}
}

async function connectToNetworkAsAdmin(){
	try {
		const gateway = await getGateway();
		const network = await gateway.getNetwork(channelName);
		return network;
	}
	catch(error){
		console.log(error);
	}
}


async function connectToNetworkAsUser(user_id){
	try {
		const gateway = await getGatewayAsUser(user_id);
		const network = await gateway.getNetwork(channelName);
		return network;
	}
	catch(error){
		console.log(error);
	}
}


exports.getVaccineHistory = async (vaccine_id) => {
	console.log("getting history")
	const network = await connectToNetworkAsAdmin();
	const contract = network.getContract(chaincodeName);
	// result = await contract.evaluateTransaction('QueryAssetsByBrand', 'medico');
	const resultBuffer  = await contract.evaluateTransaction('GetAssetHistory', vaccine_id);

	const resultString = resultBuffer.toString('utf8');

	const resultJSON = JSON.parse(resultString);
	return resultJSON
}
exports.getAllVaccines = async () => {
	console.log("getting history")
	const network = await connectToNetworkAsAdmin();
	const contract = network.getContract(chaincodeName);
	const resultBuffer  = await contract.evaluateTransaction('QueryAllVaccines');
	const resultString = resultBuffer.toString('utf8');
	const resultJSON = JSON.parse(resultString);
	return resultJSON
}

exports.getAllVaccinesContainer = async (container_id) => {
	console.log("getting history")
	const network = await connectToNetworkAsAdmin();
	const contract = network.getContract(chaincodeName);
	const resultBuffer  = await contract.evaluateTransaction('QueryAllVaccinesContainer', container_id);
	const resultString = resultBuffer.toString('utf8');
	const resultJSON = JSON.parse(resultString);
	return resultJSON
}


exports.getVaccinesByBrand =  async (brand) =>{
	const network = await connectToNetworkAsAdmin();
	const contract = network.getContract(chaincodeName);
	const resultBuffer = await contract.evaluateTransaction('QueryAssetsByBrand', brand);
	const resultString = resultBuffer.toString('utf8');
	const resultJSON = JSON.parse(resultString);
	return resultJSON
}

exports.registerViolation = async (vaccine_id, violation) => {
	const network = await connectToNetworkAsAdmin();
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
  

  exports.registerViolations = async (vaccine_id, violations, result) => {
	var resultt = [];
	for (let i = 0; i < violations.length; i++) {
	  console.log(result);
	  const violation = violations[i];
	  console.log("TESTTTT" + parseInt(result['threshold']['temperature']) +" "+parseInt(violation['value']))
	  if(violation["parameter"] == "temperature" && parseInt(result['threshold']['temperature']) < parseInt(violation['value'])){
		
		resultt.push(await exports.registerViolation(vaccine_id, violation)); // Fix the function name here
	  }
	  else if(violation["parameter"] != "temperature")	
		resultt.push(await exports.registerViolation(vaccine_id, violation));
	}
	return resultt;
  };

exports.addVaccine = async (vaccine, user) => {
	const network = await connectToNetworkAsUser(user);
	const contract = network.getContract(chaincodeName);
	return await contract.submitTransaction('CreateAsset', vaccine.vaccineId, vaccine.containerId, JSON.stringify(vaccine.threshold), vaccine.brand);
	
};

exports.getVaccine = async (vaccine_id) => {
	const network = await connectToNetworkAsAdmin();
	const contract = network.getContract(chaincodeName);

	const resultBuffer = await contract.evaluateTransaction('ReadAsset', vaccine_id);

	const resultString = resultBuffer.toString('utf8');
	const resultJSON = JSON.parse(resultString);
	return resultJSON;
}


exports.registerUser = async(user_id) =>{
	await registerUser(user_id);
}

exports.transferOwner = async(vaccine_id, user_id) =>{
	const network = await connectToNetworkAsUser(user_id);
	const contract = network.getContract(chaincodeName);
	await contract.submitTransaction('TransferOwner', vaccine_id);
}

exports.requestTransfer = async(vaccine_id, user_id) =>{
	const network = await connectToNetworkAsUser(user_id);
	const contract = network.getContract(chaincodeName);
	await contract.submitTransaction('TransferOwnerRequest', vaccine_id);
}