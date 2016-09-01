'use strict'

const request = require('request');
const queryString = require('query-string');

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET

var exchangeAuthCodeForToken = function(code) {
  return new Promise(function(resolve, reject) {
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
        var respVals = queryString.parse(body);

        if (respVals.error) {
          reject(respVals.error);
        } else {
          resolve(respVals.access_token);
        }
      } else if (error) {
        reject(error);
      }
    });
  });
};

var buildConnectURL = function() {
  return "https://github.com/login/oauth/authorize?client_id=" + GITHUB_CLIENT_ID + "&allow_signup=true";
};

var lookupGithubUserID = function(auth_token) {
  return new Promise(function(resolve, reject) {
    request.get({
      url: 'https://api.github.com/user',
      headers: {
        'User-Agent': 'ocean-guest-experience',
        'Authorization': 'token ' + auth_token,
      },
    }, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        // Parse ID from response
        var respVals = JSON.parse(body);

        if (respVals.id) {
          resolve(respVals.id);
        } else {
          reject(respVals);
        }
      } else if (error) {
        reject(error);
      } else {
        reject("Unexpected status code: "+response.statusCode);
      }
    });
  });
};

module.exports = {
  exchangeAuthCodeForToken: exchangeAuthCodeForToken,
  buildConnectURL: buildConnectURL,
  lookupGithubUserID: lookupGithubUserID,
};
