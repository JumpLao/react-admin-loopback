'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _reactAdmin = require('react-admin');

var _storage = require('./storage');

var _storage2 = _interopRequireDefault(_storage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fetchJson = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(url) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var requestHeaders, response, text, o, status, statusText, headers, body, json;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            requestHeaders = options.headers || new Headers({ Accept: 'application/json' });

            if (!requestHeaders.has('Content-Type') && !(options && options.body && options.body instanceof FormData)) {
              requestHeaders.set('Content-Type', 'application/json');
            }
            if (options.user && options.user.authenticated && options.user.token) {
              requestHeaders.set('Authorization', options.user.token);
            }
            _context.next = 5;
            return fetch(url, (0, _extends3.default)({}, options, { headers: requestHeaders }));

          case 5:
            response = _context.sent;
            _context.next = 8;
            return response.text();

          case 8:
            text = _context.sent;
            o = {
              status: response.status,
              statusText: response.statusText,
              headers: response.headers,
              body: text
            };
            status = o.status, statusText = o.statusText, headers = o.headers, body = o.body;
            json = void 0;

            try {
              json = JSON.parse(body);
            } catch (e) {
              // not json, no big deal
            }

            if (!(status < 200 || status >= 300)) {
              _context.next = 15;
              break;
            }

            return _context.abrupt('return', Promise.reject(new _reactAdmin.HttpError(json && json.error && json.error.message || statusText, status, json)));

          case 15:
            return _context.abrupt('return', Promise.resolve({ status: status, headers: headers, body: body, json: json }));

          case 16:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function fetchJson(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.default = function (url) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  options.user = {
    authenticated: true,
    token: _storage2.default.load('lbtoken').id
  };
  return fetchJson(url, options);
};