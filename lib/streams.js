'use strict'
var request = require('request');

var STREAMS_PROTOCOL = process.env.SVC_STREAMS_PROTOCOL || 'https';
var STREAMS_HOSTNAME = process.env.SVC_STREAMS_HOSTNAME || 'localhost';
var STREAMS_PORT = process.env.SVC_STREAMS_PORT || '443';

var STREAMS_URL = STREAMS_PROTOCOL+'://'+STREAMS_HOSTNAME+':'+STREAMS_PORT;

var listStreams = function() {
  return new Promise(function(resolve, reject) {
    request.get(STREAMS_URL+'/streams', function(error, response, body) {
      if(!error && response.statusCode == 200) {
        var data = JSON.parse(body);
        resolve(data.streams);
      } else {
        reject(error);
      }
    });
  });
};

var createStream = function(name) {
  return new Promise(function(resolve, reject) {
    var opts = {
      method: 'POST',
      body: {name: name},
      json: true,
      url: STREAMS_URL+'/streams'
    };
    request.post(opts, function(error, response, body) {
      console.log('Got a response....')
      if(!error && response.statusCode == 201) {
        resolve(body);
      } else {
        reject(error);
      }
    });
  })
};

module.exports = {
  ListStreams: listStreams,
  CreateStream: createStream,
}
