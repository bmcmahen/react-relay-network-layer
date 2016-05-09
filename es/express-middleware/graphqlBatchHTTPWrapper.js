import _extends from "babel-runtime/helpers/extends";
import _Promise from "babel-runtime/core-js/promise";
export default function (graphqlHTTPMiddleware) {
  return function (req, res, next) {
    var subResponses = [];
    _Promise.all(req.body.map(function (data) {
      return new _Promise(function (resolve) {
        var subRequest = _extends({
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
}