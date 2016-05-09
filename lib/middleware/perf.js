'use strict';

exports.__esModule = true;
exports.default = performanceMiddleware;
/* eslint-disable no-console */

function performanceMiddleware() {
  var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var logger = opts.logger || console.log.bind(console, '[RELAY-NETWORK]');

  return function (next) {
    return function (req) {
      // get query name here, because `req` can be changed after `next()` call
      var query = req.relayReqType + ' ' + req.relayReqId;

      var start = new Date().getTime();

      return next(req).then(function (res) {
        var end = new Date().getTime();
        logger(end - start + 'ms for ' + query);
        return res;
      });
    };
  };
}
module.exports = exports['default'];