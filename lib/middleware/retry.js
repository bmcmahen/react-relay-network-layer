'use strict';

exports.__esModule = true;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.default = retryMiddleware;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-console */

var timeoutError = new Error("fetch timeout");

function isFunction(value) {
  return !!(value && value.constructor && value.call && value.apply);
}

function promiseTimeoutDelay(promise, timeoutMS) {
  var delayMS = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
  var forceRetryWhenDelay = arguments[3];

  return new _promise2.default(function (resolve, reject) {
    var timeoutPromise = function timeoutPromise() {
      var timeoutId = setTimeout(function () {
        reject(timeoutError);
      }, timeoutMS);

      promise.then(function (res) {
        clearTimeout(timeoutId);
        resolve(res);
      }, function (err) {
        clearTimeout(timeoutId);
        reject(err);
      });
    };

    if (delayMS > 0) {
      (function () {
        var delayInProgress = true;
        var delayId = setTimeout(function () {
          delayInProgress = false;
          timeoutPromise();
        }, delayMS);

        if (forceRetryWhenDelay) {
          forceRetryWhenDelay(function () {
            if (delayInProgress) {
              clearTimeout(delayId);
              timeoutPromise();
            }
          }, delayMS);
        }
      })();
    } else {
      timeoutPromise();
    }
  });
}

function retryMiddleware() {
  var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var fetchTimeout = opts.fetchTimeout || 15000;
  var retryDelays = opts.retryDelays || [1000, 3000];
  var statusCodes = opts.statusCodes || false;
  var logger = opts.logger || console.log.bind(console, '[RELAY-NETWORK]');
  var allowMutations = opts.allowMutations || false;
  var forceRetry = opts.forceRetry || false;

  var retryAfterMs = function retryAfterMs() {
    return false;
  };
  if (retryDelays) {
    if (Array.isArray(retryDelays)) {
      retryAfterMs = function retryAfterMs(attempt) {
        if (retryDelays.length >= attempt) {
          return retryDelays[attempt - 1];
        }
        return false;
      };
    } else if (isFunction(retryDelays)) {
      retryAfterMs = retryDelays;
    }
  }

  return function (next) {
    return function (req) {
      if (req.relayReqType === 'mutation' && !allowMutations) {
        return next(req);
      }

      var attempt = 0;

      var sendTimedRequest = function sendTimedRequest(timeout) {
        var delay = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

        attempt++;
        return promiseTimeoutDelay(next(req), timeout, delay, forceRetry).then(function (res) {
          var statusError = false;
          if (statusCodes) {
            statusError = statusCodes.indexOf(res.status) !== -1;
          } else {
            statusError = res.status < 200 || res.status > 300;
          }

          if (statusError) {
            var retryDelayMS = retryAfterMs(attempt);
            if (retryDelayMS) {
              logger('response status ' + res.status + ', retrying after ' + retryDelayMS + ' ms');
              return sendTimedRequest(timeout, retryDelayMS);
            }
          }

          return res;
        }).catch(function (err) {
          if (err === timeoutError) {
            var retryDelayMS = retryAfterMs(attempt);
            if (retryDelayMS) {
              logger('response timeout, retrying after ' + retryDelayMS + ' ms');
              return sendTimedRequest(timeout, retryDelayMS);
            }
          }

          return new _promise2.default(function (resolve, reject) {
            return reject(err);
          });
        });
      };

      return sendTimedRequest(fetchTimeout, 0);
    };
  };
}
module.exports = exports['default'];