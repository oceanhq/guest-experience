'use strict'

var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {

  res.render('index', {});
});

router.get('/get-started', function(req, res) {
  var step = 1;

  if (req.query.step) {
    step = req.query.step;
  }

  res.render('get-started', { step: step });
});

module.exports = router;
