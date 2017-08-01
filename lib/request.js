'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = request;

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function request(baseUrl, path, options) {
  return (0, _nodeFetch2.default)(baseUrl + path, options).then(function (res) {
    var headers = {};
    res.headers.forEach(function (value, name) {
      return headers[name] = value;
    });

    var response = {
      status: res.status,
      headers: headers
    };

    if (res.status !== 204) {
      return res.json().then(function (body) {
        return _extends({}, response, { body: body });
      });
    }

    return Promise.resolve(response);
  }).then(function (response) {
    if (response.status >= 200 && response.status < 300) {
      return Promise.resolve(response);
    }

    return Promise.reject(response);
  });
};