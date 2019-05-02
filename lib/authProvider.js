'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.authProvider = undefined;

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _reactAdmin = require('react-admin');

var _storage = require('./storage');

var _storage2 = _interopRequireDefault(_storage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var authProvider = function authProvider(loginApiUrl) {
  var noAccessPage = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '/login';

  return function (type, params) {
    if (type === _reactAdmin.AUTH_LOGIN) {
      var request = new Request(loginApiUrl, {
        method: 'POST',
        body: JSON.stringify(params),
        headers: new Headers({ 'Content-Type': 'application/json' })
      });
      return fetch(request).then(function (response) {
        if (response.status < 200 || response.status >= 300) {
          throw new Error(response.statusText);
        }
        return response.json();
      }).then(function (_ref) {
        var ttl = _ref.ttl,
            data = (0, _objectWithoutProperties3.default)(_ref, ['ttl']);

        _storage2.default.save('lbtoken', data, ttl);
      });
    }
    if (type === _reactAdmin.AUTH_LOGOUT) {
      _storage2.default.remove('lbtoken');
      return Promise.resolve();
    }
    if (type === _reactAdmin.AUTH_ERROR) {
      var status = params.status;

      if (status === 401 || status === 403) {
        _storage2.default.remove('lbtoken');
        return Promise.reject();
      }
      return Promise.resolve();
    }
    if (type === _reactAdmin.AUTH_CHECK) {
      var token = _storage2.default.load('lbtoken');
      if (token && token.id) {
        return Promise.resolve();
      } else {
        _storage2.default.remove('lbtoken');
        return Promise.reject({ redirectTo: noAccessPage });
      }
    }
    return Promise.reject('Unknown method');
  };
};
exports.authProvider = authProvider;