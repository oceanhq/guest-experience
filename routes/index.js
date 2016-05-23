'use strict'

var express = require('express');
var Streams = require('../lib/streams.js');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('DEBUG: Received \'/\'');
  console.log('DEBUG: Fetching list of streams.');
  var pStreams = Streams.ListStreams();
  pStreams.then(function(streams) {
    console.log('DEBUG: Successful response.');
    res.render('index', { title: 'Ocean', streams: streams });
    console.log('DEBUG: Done rendering index.')
  })
  .catch(function(errorRes) {
    console.log('WARN: Error response. '+JSON.stringify(errorRes));
    error = errorRes.error;
    res.render('error', {message: error.message, error: JSON.stringify(error.service.error)});
    console.log('DEBUG: Done rendering error.');
  });

});

module.exports = router;
