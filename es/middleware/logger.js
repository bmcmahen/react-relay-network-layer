/* eslint-disable no-console */

export default function perfMiddleware() {
  var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var logger = opts.logger || console.log.bind(console, '[RELAY-NETWORK]');

  return function (next) {
    return function (req) {
      var query = req.relayReqType + ' ' + req.relayReqId;

      logger('Run ' + query, req);
      return next(req).then(function (res) {
        if (res.status !== 200) {
          logger('Status ' + res.status + ': ' + res.statusText + ' for ' + query, req, res);

          if (res.status === 400 && req.relayReqType === 'batch-query') {
            logger('WARNING: You got 400 error for \'batch-query\', probably problem on server side.\n          You should connect wrapper:\n\n          import graphqlHTTP from \'express-graphql\';\n          import { graphqlBatchHTTPWrapper } from \'react-relay-network-layer\';\n\n          const graphQLMiddleware = graphqlHTTP({ schema: GraphQLSchema });\n\n          app.use(\'/graphql/batch\', bodyParser.json(), graphqlBatchHTTPWrapper(graphQLMiddleware));\n          app.use(\'/graphql\', graphQLMiddleware);\n          ');
          }
        }
        return res;
      });
    };
  };
}