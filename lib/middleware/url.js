'use strict';

exports.__esModule = true;

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

exports.default = urlMiddleware;

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function urlMiddleware() {
  var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var urlOrThunk = opts.url || '/graphql';
  var batchUrlOrThunk = opts.batchUrl || '/graphql/batch';
  var fetchOpts = opts.opts;

  return function (next) {
    return function (req) {
      if (fetchOpts) {
        var headers = fetchOpts.headers;
        var otherOpts = (0, _objectWithoutProperties3.default)(fetchOpts, ['headers']);

        (0, _assign2.default)(req, otherOpts);
        if (headers) {
          (0, _assign2.default)(req.headers, headers);
        }
      }

      var url = void 0;
      if (req.relayReqType === 'batch-query') {
        url = batchUrlOrThunk;
      } else {
        url = urlOrThunk;
      }

      req.url = (0, _utils.isFunction)(url) ? url(req) : url;

      return next(req);
    };
  };
} /* eslint-disable no-param-reassign */

module.exports = exports['default'];