'use strict'

const github = require('./github.js');
const AWS = require('aws-sdk');
var UUID = require('node-uuid');

const DYNAMO_REGION = 'us-west-2';
// const ACCOUNTS_TABLE = 'ocean-accounts';
const IDENTITIES_TABLE = 'ocean-identities';

var dynamoDB = new AWS.DynamoDB({ apiVersion: '2016-08-31', region: DYNAMO_REGION });

const THIRD_PARTIES = {
  GITHUB: 'github',
};

var lookupIdentity = function(key) {
  return new Promise(function(resolve, reject) {
    var params = {
      Key: {
        identityKey: {
          S: key,
        },
      },
      TableName: IDENTITIES_TABLE,
      AttributesToGet: [
        'accountId',
      ]
    };

    dynamoDB.getItem(params, function(err, data) {
      console.log("identities.js:", "getItem responded:", data, err);
      if (err) {
        reject(err);
      } else {
        console.log("Received ID Item from DynamoDB:", data);

        if (data.Item) {
          var id = data.Item.accountId.S;
          resolve(id);
        } else {
          resolve(null);
        }
      }
    });
  });
};

var createIdentity = function(key) {
  return new Promise(function(resolve, reject) {
    console.log("identities.js:", "Creating new identity for key:", key);
    var newId = UUID.v4();
    console.log("identities.js:", "Generated new Ocean ID:");

    var params = {
      Item: {
        identityKey: {
          S: key,
        },
        accountId: {
          S: newId,
        }
      },
      TableName: IDENTITIES_TABLE,
    };

    dynamoDB.putItem(params, function(err, data) {
      console.log("identities.js:", "putItem responded:", data);
      if (err) {
        reject(err);
      } else {
        resolve(newId);
      }
    });
  });
};

var exchangeThirdPartyIdentity = function(thirdParty, thirdPartyID) {
  return new Promise(function(resolve, reject) {
    var key = thirdParty+'_'+thirdPartyID;
    console.log("identities.js:", "Exchanging key:", key);

    // Lookup identity in dynamo DB
    return lookupIdentity(key).then(function(id) {
      if (id) {
        console.log("identities.js:", "Found ID:", id);
        resolve(id);
      } else {
        console.log("identities.js:", "No ID found. Creating.");
        // Create identity in dynamo DB iff it doesn't exist
        return createIdentity(key).then(resolve, reject);
      }
    }, reject);
  });
};

module.exports = {
  THIRD_PARTIES: THIRD_PARTIES,
  exchangeThirdPartyIdentity: exchangeThirdPartyIdentity,
};
