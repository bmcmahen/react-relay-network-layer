'use strict';

exports.__esModule = true;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _queries = require('./relay/queries');

var _queries2 = _interopRequireDefault(_queries);

var _queriesBatch = require('./relay/queriesBatch');

var _queriesBatch2 = _interopRequireDefault(_queriesBatch);

var _mutation = require('./relay/mutation');

var _mutation2 = _interopRequireDefault(_mutation);

var _fetchWrapper = require('./fetchWrapper');

var _fetchWrapper2 = _interopRequireDefault(_fetchWrapper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable arrow-body-style, no-unused-vars */

var RelayNetworkLayer = function RelayNetworkLayer(middlewares, options) {
  var _this = this;

  (0, _classCallCheck3.default)(this, RelayNetworkLayer);

  this.supports = function () {
    // Does not support the only defined option, "defer".
    return false;
  };

  this.sendQueries = function (requests) {
    if (requests.length > 1 && !_this._isBatchQueriesDisabled()) {
      return (0, _queriesBatch2.default)(requests, _this._fetchWithMiddleware);
    }

    return (0, _queries2.default)(requests, _this._fetchWithMiddleware);
  };

  this.sendMutation = function (request) {
    return (0, _mutation2.default)(request, _this._fetchWithMiddleware);
  };

  this._fetchWithMiddleware = function (req) {
    return (0, _fetchWrapper2.default)(req, _this._middlewares);
  };

  this._isBatchQueriesDisabled = function () {
    return _this._options && _this._options.disableBatchQuery;
  };

  this._options = options;
  this._middlewares = Array.isArray(middlewares) ? middlewares : [middlewares];
};

exports.default = RelayNetworkLayer;
module.exports = exports['default'];