'use strict'

const request = require('request');
const queryString = require('query-string');

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET

function exchangeAuthCodeForToken(code, successCallback, errorCallback) {
  // Exchange our code for auth token.
  request.post({
    url: 'https://github.com/login/oauth/access_token',
    form: {
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code: code,
    }
  }, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      // Parse code from response
      console.log("GH Response body:", JSON.stringify(body));
      var respVals = queryString.parse(body);

      if (successCallback) {
        successCallback(respVals.access_token);
      }
    } else if (error) {
      if (errorCallback) {
        errorCallback(error);
      }
    }
  });
}

function buildConnectURL() {
  return "https://github.com/login/oauth/authorize?client_id=" + GITHUB_CLIENT_ID + "&allow_signup=true";
}

module.exports = {
  exchangeAuthCodeForToken: exchangeAuthCodeForToken,
  buildConnectURL: buildConnectURL,
};
