import _Object$assign from 'babel-runtime/core-js/object/assign';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
/* eslint-disable no-param-reassign */

import { isFunction } from '../utils';

export default function urlMiddleware() {
  var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var urlOrThunk = opts.url || '/graphql';
  var batchUrlOrThunk = opts.batchUrl || '/graphql/batch';
  var fetchOpts = opts.opts;

  return function (next) {
    return function (req) {
      if (fetchOpts) {
        var headers = fetchOpts.headers;

        var otherOpts = _objectWithoutProperties(fetchOpts, ['headers']);

        _Object$assign(req, otherOpts);
        if (headers) {
          _Object$assign(req.headers, headers);
        }
      }

      var url = void 0;
      if (req.relayReqType === 'batch-query') {
        url = batchUrlOrThunk;
      } else {
        url = urlOrThunk;
      }

      req.url = isFunction(url) ? url(req) : url;

      return next(req);
    };
  };
}