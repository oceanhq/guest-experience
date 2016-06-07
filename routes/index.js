'use strict'

var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {

  res.render('index', {});
});

router.get('/get-started', function(req, res) {

  res.render('get-started', {});
});

module.exports = router;
