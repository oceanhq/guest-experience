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

  github.exchangeAuthCodeForToken(ghCode)
    .then(function(token){
      return github.lookupGithubUserID(token)
    }, logError)
    .then(function(ghID) {
      return identities.exchangeThirdPartyIdentity(identities.THIRD_PARTIES.GITHUB, ghID);
    })
    .then(function(oceanID) {
      res.cookie("OceanID", oceanID, { httpOnly: true });
    })
    .then(function() {
      res.redirect(302, '/get-started?step=2');
    });
});

function logError(error) {
  console.log("ERROR!", error);
}

module.exports = router;
