/* eslint-disable prefer-template */

/**
 * Formats an error response from GraphQL server request.
 */
export default function formatRequestErrors(request, errors) {
  var CONTEXT_BEFORE = 20;
  var CONTEXT_LENGTH = 60;

  var queryLines = request.getQueryString().split('\n');
  return errors.map(function (_ref, ii) {
    var locations = _ref.locations;
    var message = _ref.message;

    var prefix = ii + 1 + '. ';
    var indent = ' '.repeat(prefix.length);

    // custom errors thrown in graphql-server may not have locations
    var locationMessage = locations ? '\n' + locations.map(function (_ref2) {
      var column = _ref2.column;
      var line = _ref2.line;

      var queryLine = queryLines[line - 1];
      var offset = Math.min(column - 1, CONTEXT_BEFORE);
      return [queryLine.substr(column - 1 - offset, CONTEXT_LENGTH), ' '.repeat(offset) + '^^^'].map(function (messageLine) {
        return indent + messageLine;
      }).join('\n');
    }).join('\n') : '';
    return prefix + message + locationMessage;
  }).join('\n');
}