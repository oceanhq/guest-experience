'use strict'

require('dotenv').config();

var express = require('express');
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

  github.exchangeAuthCodeForToken(ghCode, function(token) {
    // Store auth token in client's secure cookies.
    res.cookie("githubToken", token, { httpOnly: true });

    res.redirect(302, '/get-started?step=2');
  }, function(error) {
    console.log("ERROR!", error)
  });
});

module.exports = router;
