import _Promise from 'babel-runtime/core-js/promise';
import { queryPre, queryPost } from './_query';

export default function queries(relayRequestList, fetchWithMiddleware) {
  return _Promise.all(relayRequestList.map(function (relayRequest) {
    var req = queryPre(relayRequest);
    var fetchPromise = fetchWithMiddleware(req);
    return queryPost(relayRequest, fetchPromise);
  }));
}