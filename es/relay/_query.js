import _JSON$stringify from 'babel-runtime/core-js/json/stringify';
/* eslint-disable no-param-reassign, prefer-template */

import formatRequestErrors from '../formatRequestErrors';

export function queryPre(relayRequest) {
  var req = {
    relayReqId: relayRequest.getID(),
    relayReqObj: relayRequest,
    relayReqType: 'query',
    method: 'POST',
    headers: {
      Accept: '*/*',
      'Content-Type': 'application/json'
    }
  };

  req.body = _JSON$stringify({
    query: relayRequest.getQueryString(),
    variables: relayRequest.getVariables()
  });

  return req;
}

export function queryPost(relayRequest, fetchPromise) {
  return fetchPromise.then(function (payload) {
    if (payload.hasOwnProperty('errors')) {
      var error = new Error('Server request for query `' + relayRequest.getDebugName() + '` ' + 'failed for the following reasons:\n\n' + formatRequestErrors(relayRequest, payload.errors));
      error.source = payload;
      relayRequest.reject(error);
    } else if (!payload.hasOwnProperty('data')) {
      relayRequest.reject(new Error('Server response was missing for query `' + relayRequest.getDebugName() + '`.'));
    } else {
      relayRequest.resolve({ response: payload.data });
    }
  }).catch(function (error) {
    return relayRequest.reject(error);
  });
}