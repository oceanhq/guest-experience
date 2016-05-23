'use strict'

var express = require('express');
var Streams = require('../lib/streams.js');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  console.log('DEBUG: Received \'/\'');
  console.log('DEBUG: Fetching list of streams.');
  var pStreams = Streams.ListStreams();
  pStreams.then(function(streams) {
    console.log('DEBUG: Successful response. '+JSON.stringify(streams));
    res.render('index', { title: 'Ocean', streams: streams });
    console.log('DEBUG: Done rendering index.')
  })
  .catch(function(errorRes) {
    console.log('WARN: Error response. '+JSON.stringify(errorRes));
    var error = errorRes.error;
    res.render('error', {message: error.message, error: JSON.stringify(error.service.error)});
    console.log('DEBUG: Done rendering error.');
  });
});

router.get('/streams/:streamId', function(req, res) {
  // Lookup stream
  Streams.ReadStream(req.params.streamId).then(function(stream) {
    console.log('DEBUG: /streams/:streamId Found stream.');

    res.render('stream', { stream: stream });
  })
  .catch(function(errRes) {
    console.log('WARN: Error response. '+JSON.stringify(errRes));
    var error = errRes.error;
    res.render('error', {message: error.message, error: error.service.error});
    console.log('DEBUG: Done rendering error.');
  });
});

module.exports = router;
