'use strict';

exports.__esModule = true;

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

exports.default = mutation;

var _formatRequestErrors = require('../formatRequestErrors');

var _formatRequestErrors2 = _interopRequireDefault(_formatRequestErrors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function mutation(relayRequest, fetchWithMiddleware) {
  var req = {
    relayReqId: Date.now(),
    relayReqObj: relayRequest,
    relayReqType: 'mutation'
  };

  if (_hasFiles(relayRequest)) {
    (0, _assign2.default)(req, _mutationWithFiles(relayRequest));
  } else {
    (0, _assign2.default)(req, _mutation(relayRequest));
  }

  return fetchWithMiddleware(req).then(function (payload) {
    if (payload.hasOwnProperty('errors')) {
      var error = new Error('Server request for mutation `' + relayRequest.getDebugName() + '` ' + 'failed for the following reasons:\n\n' + (0, _formatRequestErrors2.default)(relayRequest, payload.errors));
      error.source = payload;
      relayRequest.reject(error);
    } else {
      relayRequest.resolve({ response: payload.data });
    }
  }).catch(function (error) {
    return relayRequest.reject(error);
  });
} /* eslint-disable no-param-reassign, no-use-before-define, prefer-template */

function _hasFiles(relayRequest) {
  return !!(relayRequest.getFiles && relayRequest.getFiles());
}

function _mutationWithFiles(relayRequest) {
  var req = {
    method: 'POST'
  };

  if (_hasFiles(relayRequest)) {
    var files = relayRequest.getFiles();

    if (!global.FormData) {
      throw new Error('Uploading files without `FormData` not supported.');
    }
    var formData = new FormData();
    formData.append('query', relayRequest.getQueryString());
    formData.append('variables', (0, _stringify2.default)(relayRequest.getVariables()));
    for (var filename in files) {
      if (files.hasOwnProperty(filename)) {
        formData.append(filename, files[filename]);
      }
    }
    req.body = formData;
  }

  return req;
}

function _mutation(relayRequest) {
  var req = {
    method: 'POST',
    headers: {
      Accept: '*/*',
      'Content-Type': 'application/json'
    }
  };

  req.body = (0, _stringify2.default)({
    query: relayRequest.getQueryString(),
    variables: relayRequest.getVariables()
  });

  return req;
}
module.exports = exports['default'];