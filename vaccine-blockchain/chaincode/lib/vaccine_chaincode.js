'use strict';

const {Contract} = require('fabric-contract-api');

class Chaincode extends Contract{
    async CreateAsset(ctx, vaccineId, containerId, threshold, readings, brand, owner) {
        const exists = await this.AssetExists(ctx, vaccineId);
        if (exists) {
            throw new Error(`The asset ${vaccineId} already exists`);
        }

        // ==== Create asset object and marshal to JSON ====
        let asset = {
            docType: 'vaccine',
            vaccineId: vaccineId,
            containerId:containerId,
			threshold:threshold,
			readings:readings,
			brand: brand,
			owner: owner,
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

    async QueryAssetsByBrand(ctx, brand) {
		let queryString = {};
		queryString.selector = {};
		queryString.selector.docType = 'vaccine';
		queryString.selector.brand = brand;
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
        assetToTransfer['readings'][parameterName] = parameterValue;
		assetToTransfer['transactionType'] = "VIOLATION_TEMPERATURE"        
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
				transactionType : 'CREATION'
			},		
		];

		for (const asset of assets) {
			await this.CreateAsset(
				ctx,
				asset.vaccineId,
				asset.containerId,
				asset.threshold,
				asset.readings,
				asset.brand,
				asset.owner
			);
		}
	}
}

module.exports = Chaincode;