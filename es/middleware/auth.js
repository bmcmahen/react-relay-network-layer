import _Promise from 'babel-runtime/core-js/promise';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
/* eslint-disable no-param-reassign, arrow-body-style */

import { isFunction } from '../utils';

var WrongTokenError = function (_Error) {
  _inherits(WrongTokenError, _Error);

  function WrongTokenError(msg) {
    var res = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, WrongTokenError);

    var _this = _possibleConstructorReturn(this, _Error.call(this, msg));

    _this.res = res;
    _this.name = 'WrongTokenError';
    return _this;
  }

  return WrongTokenError;
}(Error);

export default function authMiddleware() {
  var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var tokenOrThunk = opts.token;
  var tokenRefreshPromise = opts.tokenRefreshPromise;
  var _opts$prefix = opts.prefix;
  var prefix = _opts$prefix === undefined ? 'Bearer ' : _opts$prefix;


  return function (next) {
    return function (req) {
      return new _Promise(function (resolve, reject) {
        var token = isFunction(tokenOrThunk) ? tokenOrThunk(req) : tokenOrThunk;
        if (!token && tokenRefreshPromise) {
          reject(new WrongTokenError('Token not provided, try fetch new one'));
        }
        resolve(token);
      }).then(function (token) {
        req.headers['Authorization'] = '' + prefix + token;
        return next(req);
      }).then(function (res) {
        if (res.status === 401 && tokenRefreshPromise) {
          throw new WrongTokenError('Was recieved status 401 from server', res);
        }
        return res;
      }).catch(function (err) {
        if (err.name === 'WrongTokenError') {
          return tokenRefreshPromise(req, err.res).then(function (newToken) {
            req.headers['Authorization'] = '' + prefix + newToken;
            return next(req); // re-run query with new token
          });
        }

        throw err;
      });
    };
  };
}