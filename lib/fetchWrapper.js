'use strict';

exports.__esModule = true;

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

exports.default = fetchWrapper;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-use-before-define, no-else-return, prefer-const */

// import 'whatwg-fetch';

function fetchWrapper(reqFromRelay, middlewares) {
  var fetchAfterAllWrappers = function fetchAfterAllWrappers(req) {
    var url = req.url;
    var opts = (0, _objectWithoutProperties3.default)(req, ['url']);


    if (!url) {
      if (req.relayReqType === 'batch-query') {
        url = '/graphql/batch';
      } else {
        url = '/graphql';
      }
    }

    return fetch(url, opts).then();
  };

  var wrappedFetch = compose.apply(undefined, middlewares)(fetchAfterAllWrappers);

  return wrappedFetch(reqFromRelay).then(throwOnServerError).then(function (response) {
    return response.json();
  });
}

/**
 * Composes single-argument functions from right to left. The rightmost
 * function can take multiple arguments as it provides the signature for
 * the resulting composite function.
 *
 * @param {...Function} funcs The functions to compose.
 * @returns {Function} A function obtained by composing the argument functions
 * from right to left. For example, compose(f, g, h) is identical to doing
 * (...args) => f(g(h(...args))).
 */
function compose() {
  for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
  }

  if (funcs.length === 0) {
    return function (arg) {
      return arg;
    };
  } else {
    var _ret = function () {
      var last = funcs[funcs.length - 1];
      var rest = funcs.slice(0, -1);
      return {
        v: function v() {
          return rest.reduceRight(function (composed, f) {
            return f(composed);
          }, last.apply(undefined, arguments));
        }
      };
    }();

    if ((typeof _ret === 'undefined' ? 'undefined' : (0, _typeof3.default)(_ret)) === "object") return _ret.v;
  }
}

function throwOnServerError(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  throw response;
}
module.exports = exports['default'];