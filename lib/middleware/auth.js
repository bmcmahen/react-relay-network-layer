'use strict';

exports.__esModule = true;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

exports.default = authMiddleware;

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var WrongTokenError = function (_Error) {
  (0, _inherits3.default)(WrongTokenError, _Error);

  function WrongTokenError(msg) {
    var res = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    (0, _classCallCheck3.default)(this, WrongTokenError);

    var _this = (0, _possibleConstructorReturn3.default)(this, _Error.call(this, msg));

    _this.res = res;
    _this.name = 'WrongTokenError';
    return _this;
  }

  return WrongTokenError;
}(Error); /* eslint-disable no-param-reassign, arrow-body-style */

function authMiddleware() {
  var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var tokenOrThunk = opts.token;
  var tokenRefreshPromise = opts.tokenRefreshPromise;
  var _opts$prefix = opts.prefix;
  var prefix = _opts$prefix === undefined ? 'Bearer ' : _opts$prefix;


  return function (next) {
    return function (req) {
      return new _promise2.default(function (resolve, reject) {
        var token = (0, _utils.isFunction)(tokenOrThunk) ? tokenOrThunk(req) : tokenOrThunk;
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
module.exports = exports['default'];