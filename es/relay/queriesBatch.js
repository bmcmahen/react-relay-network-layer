import _Promise from 'babel-runtime/core-js/promise';
import _JSON$stringify from 'babel-runtime/core-js/json/stringify';
import _Object$keys from 'babel-runtime/core-js/object/keys';
import { queryPost } from './_query';

export default function queriesBatch(relayRequestList, fetchWithMiddleware) {
  var requestMap = {};
  relayRequestList.forEach(function (req) {
    var reqId = req.getID();
    requestMap[reqId] = req;
  });

  var req = {
    relayReqId: 'BATCH_QUERY:' + _Object$keys(requestMap).join(':'),
    relayReqObj: relayRequestList,
    relayReqType: 'batch-query',
    method: 'POST',
    headers: {
      Accept: '*/*',
      'Content-Type': 'application/json'
    }
  };

  req.body = _JSON$stringify(_Object$keys(requestMap).map(function (id) {
    return {
      id: id,
      query: requestMap[id].getQueryString(),
      variables: requestMap[id].getVariables()
    };
  }));

  return fetchWithMiddleware(req).then(function (payloadList) {
    payloadList.forEach(function (_ref) {
      var id = _ref.id;
      var payload = _ref.payload;

      var relayRequest = requestMap[id];
      if (relayRequest) {
        queryPost(relayRequest, new _Promise(function (resolve) {
          resolve(payload);
        }));
      }
    });
  });
}