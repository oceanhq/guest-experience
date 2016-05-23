var express = require('express');
var Streams = require('../lib/streams.js');
var router = express.Router();

router.post('/create-stream', function(req, res, next) {
  if(!req.is('application/json')) {
    res.status(400).send({ status: 'fail', error: 'Request must be JSON'});
    return;
  }

  if(req.body.name === undefined) {
    res.status(400).send({ status: 'fail', error: 'No name'});
    return;
  }

  Streams.CreateStream(req.body.name)
  .then(function(stream) {
    res.send({result: "ok"});
  });
});

module.exports = router;