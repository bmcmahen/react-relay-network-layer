"use strict";

exports.__esModule = true;

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

exports.default = function (graphqlHTTPMiddleware) {
  return function (req, res, next) {
    var subResponses = [];
    _promise2.default.all(req.body.map(function (data) {
      return new _promise2.default(function (resolve) {
        var subRequest = (0, _extends3.default)({
          __proto__: req.__proto__ }, req, {
          body: data
        });
        var subResponse = {
          status: function status(st) {
            this._status = st;return this;
          },
          set: function set() {
            return this;
          },
          send: function send(payload) {
            resolve({ status: this._status, id: data.id, payload: payload });
          }
        };
        subResponses.push(subResponse);
        graphqlHTTPMiddleware(subRequest, subResponse);
      });
    })).then(function (responses) {
      var response = [];
      responses.forEach(function (_ref) {
        var status = _ref.status;
        var id = _ref.id;
        var payload = _ref.payload;

        if (status) {
          res.status(status);
        }
        response.push({
          id: id,
          payload: JSON.parse(payload)
        });
      });
      res.send(response);
      next();
    });
  };
};

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];