'use strict'

var request = require('request');

var STREAMS_PROTOCOL = process.env.SVC_STREAMS_PROTOCOL || 'https';
var STREAMS_HOSTNAME = process.env.SVC_STREAMS_HOSTNAME || 'localhost';
var STREAMS_PORT = process.env.SVC_STREAMS_PORT || '443';

var STREAMS_URL = STREAMS_PROTOCOL+'://'+STREAMS_HOSTNAME+':'+STREAMS_PORT;

function formatStreamServiceErrorObj(error, response) {
  var res = {
    error: {
      message: "Stream service responded with an error.",
      service: {
        statusCode: 0,
        error: error || response.body.error
      }
    }
  };
  if (response) {
    res.error.service.statusCode = response.statusCode;
  }

  return res;
}

var listStreams = function() {
  console.log('DEBUG: Called Streams.listStreams.');
  return new Promise(function(resolve, reject) {
    var opts = {
      method: 'GET',
      json: true,
      url: STREAMS_URL+'/streams'
    };
    request(opts, function(error, response, body) {
      console.log('DEBUG: Received response. '+JSON.stringify(response));
      if(!error && response.statusCode == 200) {
        resolve(body.streams);
      } else {
        reject(formatStreamServiceErrorObj(error, response));
      }
    });
  });
};

var createStream = function(name) {
  console.log('DEBUG: Called Streams.createStream.');
  return new Promise(function(resolve, reject) {
    var opts = {
      method: 'POST',
      body: {name: name},
      json: true,
      url: STREAMS_URL+'/streams'
    };
    request(opts, function(error, response, body) {
      console.log('DEBUG: Received response. '+JSON.stringify(response));
      if(!error && response.statusCode == 201) {
        resolve(body);
      } else {
        reject(formatStreamServiceErrorObj(error, response));
      }
    });
  })
};

var readStream = function(streamId) {
  console.log('DEBUG: Called Streams.readStream.');
  return new Promise(function(resolve, reject) {
    console.log('DEBUG: Sending request to /streams/'+streamId+'.');
    var opts = {
      method: 'GET',
      json: true,
      url: STREAMS_URL+'/streams/'+streamId
    };
    request(opts, function(error, response, body) {
      console.log('DEBUG: Recieved response: '+JSON.stringify(response));
      if(!error && response.statusCode == 200) {
        console.log('DEBUG: Returning stream. '+JSON.stringify(body));
        resolve(body);
      } else {
        console.log('WARN: Error response: '+JSON.stringify(error));
        reject(formatStreamServiceErrorObj(error, response));
      }
    });
  });
}

module.exports = {
  ListStreams: listStreams,
  CreateStream: createStream,
  ReadStream: readStream,
}
