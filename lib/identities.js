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
      if (err) {
        reject(err);
      } else {
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
    var newId = UUID.v4();

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

    // Lookup identity in dynamo DB
    return lookupIdentity(key).then(function(id) {
      if (id) {
        resolve(id);
      } else {
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
