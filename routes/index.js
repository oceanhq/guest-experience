'use strict'

require('dotenv').config();

var express = require('express');
const identities = require('../lib/identities.js');
const github = require('../lib/github.js');

var router = express.Router();

router.get('/', function(req, res) {
  res.render('index', {});
});

router.get('/get-started', function(req, res) {
  var step = 1;

  if (req.query.step) {
    step = req.query.step;
  }

  res.render('get-started', { step: step, githubConnectURL: github.buildConnectURL() });
});

router.get('/callback', function(req, res) {
  var ghCode = req.query.code;
  console.log("Received callback with code:", ghCode);

  github.exchangeAuthCodeForToken(ghCode)
    .then(function(token){
      console.log("Exchanged code for token:", token);
      return github.lookupGithubUserID(token)
    }, logError)
    .then(function(ghID) {
      console.log("Looked up github ID:", ghID);
      return identities.exchangeThirdPartyIdentity(identities.THIRD_PARTIES.GITHUB, ghID);
    })
    .then(function(oceanID) {
      console.log("Exchanged github ID for ocean ID:", oceanID);
      res.cookie("OceanID", oceanID, { httpOnly: true });
    })
    .then(function() {
      console.log("Redirecting");
      res.redirect(302, '/get-started?step=2');
    });
});

function logError(error) {
  console.log("ERROR!", error);
}

module.exports = router;
