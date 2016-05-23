var express = require('express');
var Streams = require('../lib/streams.js');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  pStreams = Streams.ListStreams();
  pStreams.then(function(streams) {
    res.render('index', { title: 'Ocean', streams: streams });
  })
  .catch(function(errorRes) {
    error = errorRes.error;
    res.render('error', {message: error.message, error: JSON.stringify(error.service.error)});
  });

});

module.exports = router;
