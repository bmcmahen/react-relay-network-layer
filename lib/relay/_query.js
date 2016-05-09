'use strict';

exports.__esModule = true;

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

exports.queryPre = queryPre;
exports.queryPost = queryPost;

var _formatRequestErrors = require('../formatRequestErrors');

var _formatRequestErrors2 = _interopRequireDefault(_formatRequestErrors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function queryPre(relayRequest) {
  var req = {
    relayReqId: relayRequest.getID(),
    relayReqObj: relayRequest,
    relayReqType: 'query',
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
} /* eslint-disable no-param-reassign, prefer-template */

function queryPost(relayRequest, fetchPromise) {
  return fetchPromise.then(function (payload) {
    if (payload.hasOwnProperty('errors')) {
      var error = new Error('Server request for query `' + relayRequest.getDebugName() + '` ' + 'failed for the following reasons:\n\n' + (0, _formatRequestErrors2.default)(relayRequest, payload.errors));
      error.source = payload;
      relayRequest.reject(error);
    } else if (!payload.hasOwnProperty('data')) {
      relayRequest.reject(new Error('Server response was missing for query `' + relayRequest.getDebugName() + '`.'));
    } else {
      relayRequest.resolve({ response: payload.data });
    }
  }).catch(function (error) {
    return relayRequest.reject(error);
  });
}