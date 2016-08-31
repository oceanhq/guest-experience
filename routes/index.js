'use strict'

require('dotenv').config();

var githubClientID = process.env.GITHUB_CLIENT_ID
var githubClientSecret = process.env.GITHUB_CLIENT_SECRET

const queryString = require('query-string');
var express = require('express');
var request = require('request');

var router = express.Router();

router.get('/', function(req, res) {

  res.render('index', {});
});

router.get('/get-started', function(req, res) {
  var step = 1;

  if (req.query.step) {
    step = req.query.step;
  }

  res.render('get-started', { step: step, githubClientID: githubClientID });
});

router.get('/callback', function(req, res) {
  var ghCode = req.query.code;

  // TODO: Exchange our code for auth token.
  request.post({
    url: 'https://github.com/login/oauth/access_token',
    form: {
      client_id: githubClientID,
      client_secret: githubClientSecret,
      code: ghCode,
    }
  }, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      // Parse code from response
      console.log("GH Response body:", JSON.stringify(body));
      var respVals = queryString.parse(body);
      var token = respVals.access_token;

      // Store auth token in client's secure cookies.
      res.cookie("githubToken", token);

      res.redirect(302, '/get-started?step=2');
    } else if (error) {
      console.log("ERROR!", error)
    }
  });
});

module.exports = router;
