import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
/* eslint-disable arrow-body-style, no-unused-vars */

import queries from './relay/queries';
import queriesBatch from './relay/queriesBatch';
import mutation from './relay/mutation';
import fetchWrapper from './fetchWrapper';

var RelayNetworkLayer = function RelayNetworkLayer(middlewares, options) {
  var _this = this;

  _classCallCheck(this, RelayNetworkLayer);

  this.supports = function () {
    // Does not support the only defined option, "defer".
    return false;
  };

  this.sendQueries = function (requests) {
    if (requests.length > 1 && !_this._isBatchQueriesDisabled()) {
      return queriesBatch(requests, _this._fetchWithMiddleware);
    }

    return queries(requests, _this._fetchWithMiddleware);
  };

  this.sendMutation = function (request) {
    return mutation(request, _this._fetchWithMiddleware);
  };

  this._fetchWithMiddleware = function (req) {
    return fetchWrapper(req, _this._middlewares);
  };

  this._isBatchQueriesDisabled = function () {
    return _this._options && _this._options.disableBatchQuery;
  };

  this._options = options;
  this._middlewares = Array.isArray(middlewares) ? middlewares : [middlewares];
};

export default RelayNetworkLayer;