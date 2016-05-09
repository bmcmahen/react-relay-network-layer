'use strict';

exports.__esModule = true;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.default = queries;

var _query = require('./_query');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function queries(relayRequestList, fetchWithMiddleware) {
  return _promise2.default.all(relayRequestList.map(function (relayRequest) {
    var req = (0, _query.queryPre)(relayRequest);
    var fetchPromise = fetchWithMiddleware(req);
    return (0, _query.queryPost)(relayRequest, fetchPromise);
  }));
}
module.exports = exports['default'];