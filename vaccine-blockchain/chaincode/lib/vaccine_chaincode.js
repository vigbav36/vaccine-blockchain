'use strict';

const {Contract} = require('fabric-contract-api');

class Chaincode extends Contract{


	async getOrganizationFromId(ctx){
		try{
			const name = ctx.clientIdentity.getID()
			const parts = name.split('/');
			let orgName;
			for (const part of parts) {
				if (part.startsWith('OU=')) {
					orgName = part.split('=')[1];
					break;
				}
			}
			return orgName; 
		}
		catch(error){
			return "error"
		}
	}

	async check(ctx){
		return ctx.clientIdentity.getID();
	}

	async verifyClientOrgMatchesPeerOrg(ctx) {
        const clientMSPID = ctx.clientIdentity.getMSPID();
        const peerMSPID = ctx.stub.getMspID();
        if (clientMSPID !== peerMSPID) {
            return false
        }
        return true;
    }

	async TransferOwner(ctx, vaccineId){
		let assetAsBytes = await ctx.stub.getState(vaccineId);
		if (!assetAsBytes || !assetAsBytes.toString()) {
			throw new Error(`Asset ${vaccineId} does not exist`);
		}
		let vaccine = {};
		vaccine = JSON.parse(assetAsBytes.toString());

		const name = ctx.clientIdentity.getID()
		const parts = name.split('/');
		let orgName;

		for (const part of parts) {
			if (part.startsWith('OU=')) {
				orgName = part.split('=')[1];
				break;
			}
		}

		//Current owner must be the one initiating the requests
		if(orgName != vaccine['owner'])
			throw new Error(`error: submitting client (${orgName}) identity does not own asset. Owner is ${vaccine['owner']}. Vaccine object is ${vaccine}`);
		
		const clientMSPID = ctx.clientIdentity.getMSPID();
        const peerMSPID = ctx.stub.getMspID();
     
		vaccine['owner'] = vaccine['requesting_owner'];
		vaccine['requesting_owner'] = "";
		vaccine['transactionType'] = "TRANSFER_APPROVED"

		await ctx.stub.putState(vaccineId, Buffer.from(JSON.stringify(vaccine)));
	}

	async TransferOwnerRequest(ctx, vaccineId){
		let assetAsBytes = await ctx.stub.getState(vaccineId);
		if (!assetAsBytes || !assetAsBytes.toString()) {
			throw new Error(`Asset ${vaccineId} does not exist`);
		}
		let vaccine = {};
		vaccine = JSON.parse(assetAsBytes.toString());

		const name = ctx.clientIdentity.getID()
		const parts = name.split('/');
		let orgName;

		for (const part of parts) {
			if (part.startsWith('OU=')) {
				orgName = part.split('=')[1];
				break;
			}
		}
		
		if(!this.verifyClientOrgMatchesPeerOrg(ctx))
			throw new Error(`Error: Unauthorized transfer request`);
		
		vaccine['requesting_owner'] = orgName;
		vaccine['transactionType'] = "TRANSFER_REQUESTED"

		await ctx.stub.putState(vaccineId, Buffer.from(JSON.stringify(vaccine)));
	}

    async CreateAsset(ctx, vaccineId, containerId, threshold, brand) {
        const exists = await this.AssetExists(ctx, vaccineId);
        if (exists) {
            throw new Error(`The asset ${vaccineId} already exists`);
        }

		
		const name = ctx.clientIdentity.getID()
		const parts = name.split('/');
		let orgName;
		for (const part of parts) {
			if (part.startsWith('OU=')) {
				orgName = part.split('=')[1];
				break;
			}
		}
 

		const ownerId =  orgName

        let asset = {
            docType: 'vaccine',
            vaccineId: vaccineId,
            containerId:containerId,
			threshold: JSON.parse(threshold),
			brand: brand,
			owner: orgName,
			requesting_owner: "",
			transactionType : 'CREATION'
        };

        // === Save asset to state ===
        await ctx.stub.putState(vaccineId, Buffer.from(JSON.stringify(asset)));
        let indexName = 'brand~name';
        let colorNameIndexKey = await ctx.stub.createCompositeKey(indexName, [asset.brand, asset.vaccineId]);

        //  Save index entry to state. Only the key name is needed, no need to store a duplicate copy of the marble.
        //  Note - passing a 'nil' value will effectively delete the key from state, therefore we pass null character as value
        await ctx.stub.putState(colorNameIndexKey, Buffer.from('\u0000'));
    }

    async ReadAsset(ctx, id) {
		const assetJSON = await ctx.stub.getState(id); // get the asset from chaincode state
		if (!assetJSON || assetJSON.length === 0) {
			throw new Error(`Asset ${id} does not exist`);
		}
		return assetJSON.toString();
	}

    async GetAssetHistory(ctx, vaccineId) {

		let resultsIterator = await ctx.stub.getHistoryForKey(vaccineId);
		let results = await this._GetAllResults(resultsIterator, true);

		return JSON.stringify(results);
	}

    async _GetAllResults(iterator, isHistory) {
		let allResults = [];
		let res = await iterator.next();
		while (!res.done) {
			if (res.value && res.value.value.toString()) {
				let jsonRes = {};
				console.log(res.value.value.toString('utf8'));
				if (isHistory && isHistory === true) {
					jsonRes.TxId = res.value.txId;
					jsonRes.Timestamp = res.value.timestamp;
					try {
						jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));
					} catch (err) {
						console.log(err);
						jsonRes.Value = res.value.value.toString('utf8');
					}
				} else {
					jsonRes.Key = res.value.key;
					try {
						jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
					} catch (err) {
						console.log(err);
						jsonRes.Record = res.value.value.toString('utf8');
					}
				}
				allResults.push(jsonRes);
			}
			res = await iterator.next();
		}
		iterator.close();
		return allResults;
	}

    async AssetExists(ctx, vaccineId) {
		// ==== Check if asset already exists ====
		let assetState = await ctx.stub.getState(vaccineId);
		return assetState && assetState.length > 0;
	}

    async GetQueryResultForQueryString(ctx, queryString) {

		let resultsIterator = await ctx.stub.getQueryResult(queryString);
		let results = await this._GetAllResults(resultsIterator, false);

		return JSON.stringify(results);
	}

    async QueryAllVaccines(ctx) {
		let queryString = {};
		queryString.selector = {};
		queryString.selector.docType = 'vaccine';
		return await this.GetQueryResultForQueryString(ctx, JSON.stringify(queryString)); //shim.success(queryResults);
	}

	async QueryAllVaccinesByOrg(ctx) {
		let queryString = {};
		queryString.selector = {};
		queryString.selector.docType = 'vaccine';


		const name = ctx.clientIdentity.getID()
		const parts = name.split('/');
		let orgName;
		for (const part of parts) {
			if (part.startsWith('OU=')) {
				orgName = part.split('=')[1];
				break;
			}
		}
 

		const ownerId =  orgName

		queryString.selector.vaccine.owner = ownerId;

		return await this.GetQueryResultForQueryString(ctx, JSON.stringify(queryString)); //shim.success(queryResults);
	}

	async QueryAllVaccinesContainer(ctx, id) {
		let queryString = {};
		queryString.selector = {};
		queryString.selector.docType = 'vaccine';
		queryString.selector.containerId = id;
		return await this.GetQueryResultForQueryString(ctx, JSON.stringify(queryString)); //shim.success(queryResults);
	}

    async UpdateAssetParameter(ctx, vaccineId, parameterName, parameterValue) {
        // Check if the asset exists
        let assetAsBytes = await ctx.stub.getState(vaccineId);
		if (!assetAsBytes || !assetAsBytes.toString()) {
			throw new Error(`Asset ${vaccineId} does not exist`);
		}
		let assetToTransfer = {};
		try {
			assetToTransfer = JSON.parse(assetAsBytes.toString()); 
		} catch (err) {
			let jsonResp = {};
			jsonResp.error = 'Failed to decode JSON of: ' + vaccineId;
			throw new Error(jsonResp);
		}
        assetToTransfer[parameterName] = parameterValue;        
		await ctx.stub.putState(vaccineId, Buffer.from(JSON.stringify(assetToTransfer)));
        return assetToTransfer;
    }

	async RegisterViolation(ctx, vaccineId, parameterName, parameterValue) {
        // Check if the asset exists
        let assetAsBytes = await ctx.stub.getState(vaccineId);
		if (!assetAsBytes || !assetAsBytes.toString()) {
			throw new Error(`Asset ${vaccineId} does not exist`);
		}
		let assetToTransfer = {};
		try {
			assetToTransfer = JSON.parse(assetAsBytes.toString()); 
		} catch (err) {
			let jsonResp = {};
			jsonResp.error = 'Failed to decode JSON of: ' + vaccineId;
			throw new Error(jsonResp);
		}
		if(parameterName == "opening"){
			assetToTransfer['transactionType'] = "VIOLATION_OPENING"  
		}
		else{
			assetToTransfer['transactionType'] = "VIOLATION_TEMPERATURE"  
		}      
		await ctx.stub.putState(vaccineId, Buffer.from(JSON.stringify(assetToTransfer)));
        return assetToTransfer;
    }
    
    async UpdateAsset(ctx, vaccine) {
        const exists = await this.AssetExists(ctx, vaccine.vaccineId);
        if (!exists) {
            throw new Error(`The asset ${vaccine.vaccineId} does not exist`);
        }
        return ctx.stub.putState(vaccine.vaccineId, Buffer.from(JSON.stringify(vaccine)));
    }



    async InitLedger(ctx) {
		const assets = [
			{
				vaccineId: 'vaccine1',
				containerId:'1',
				threshold:{
					temperature:"23.2",
					humidity:"10.2"
				},
				readings:{
					temperature:"23.2",
					humidity:"10.2"
				},
				brand: "pfizer",
				owner: 'manufacturer',
				requesting_owner : '',
				transactionType : 'CREATION'
			},
			{
				vaccineId: 'vaccine2',
				containerId:'1',
				threshold:{
					temperature:"23.2",
					humidity:"10.2"
				},
				readings:{
					temperature:"23.2",
					humidity:"10.2"
				},
				brand: "pfizer",
				owner: 'manufacturer',
				requesting_owner : '',
				transactionType : 'CREATION'
			},	
			{
				vaccineId: 'vaccine3',
				containerId:'1',
				threshold:{
					temperature:"23.2",
					humidity:"10.2"
				},
				readings:{
					temperature:"23.2",
					humidity:"10.2"
				},
				brand: "medico",
				owner: 'manufacturer',
				requesting_owner : '',
				transactionType : 'CREATION'
			},	
			{
				vaccineId: 'vaccine4',
				containerId:'1',
				threshold:{
					temperature:"23.2",
					humidity:"10.2"
				},
				readings:{
					temperature:"23.2",
					humidity:"10.2"
				},
				brand: "medico",
				owner: 'manufacturer',
				requesting_owner : '',
				transactionType : 'CREATION'
			},		
		];

		for (const asset of assets) {
			await this.CreateAsset(
				ctx,
				asset.vaccineId,
				asset.containerId,
				JSON.stringify(asset.threshold),
				asset.brand,
				asset.owner
			);
		}
	}
}

module.exports = Chaincode;