'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = reducer;

var _objectPathImmutable = require('object-path-immutable');

var _objectPathImmutable2 = _interopRequireDefault(_objectPathImmutable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var initialState = {};

function reducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];

  if (action.type === 'requests/invalidate') {
    var _action$payload = action.payload,
        actionName = _action$payload.actionName,
        _params = _action$payload.params;


    if (_params) {
      if (state[actionName] && state[actionName][JSON.stringify(_params)]) {
        return _objectPathImmutable2.default.set(state, [actionName, JSON.stringify(_params), 'invalid'], true);
      }
    } else if (state[actionName]) {
      return Object.keys(state[actionName]).reduce(function (acc, params) {
        return _objectPathImmutable2.default.set(acc, [actionName, params, 'invalid'], true);
      }, state);
    }

    return state;
  }

  if (!action.meta || !action.meta.api) {
    return state;
  }

  var _action$meta = action.meta,
      metaType = _action$meta.type,
      name = _action$meta.name,
      params = _action$meta.params;


  if (metaType === 'request') {
    var newState = state;

    newState = _objectPathImmutable2.default.set(newState, [name, JSON.stringify(params), 'isLoading'], true);

    newState = _objectPathImmutable2.default.set(newState, [name, JSON.stringify(params), 'error'], null);

    newState = _objectPathImmutable2.default.del(newState, [name, JSON.stringify(params), 'invalid']);

    return newState;
  } else if (metaType === 'response' && action.payload) {
    var _newState = state;

    if (action.payload.body) {
      var _action$payload$body = action.payload.body,
          data = _action$payload$body.data,
          meta = _action$payload$body.meta;


      var normalizedData = void 0;

      if (Array.isArray(data)) {
        normalizedData = data.map(function (record) {
          return { id: record.id, type: record.type };
        });
      } else if (data && data.id) {
        normalizedData = { id: data.id, type: data.type };
      } else {
        normalizedData = null;
      }

      _newState = _objectPathImmutable2.default.set(_newState, [name, JSON.stringify(params), 'response'], normalizedData);

      if (meta) {
        _newState = _objectPathImmutable2.default.set(_newState, [name, JSON.stringify(params), 'meta'], meta);
      }
    }

    _newState = _objectPathImmutable2.default.set(_newState, [name, JSON.stringify(params), 'headers'], action.payload.headers);

    _newState = _objectPathImmutable2.default.set(_newState, [name, JSON.stringify(params), 'status'], action.payload.status);

    _newState = _objectPathImmutable2.default.set(_newState, [name, JSON.stringify(params), 'isLoading'], false);

    return _newState;
  } else if (metaType === 'error') {
    var _newState2 = state;

    _newState2 = _objectPathImmutable2.default.set(_newState2, [name, JSON.stringify(params), 'isLoading'], false);

    _newState2 = _objectPathImmutable2.default.set(_newState2, [name, JSON.stringify(params), 'response'], null);

    if (action.payload instanceof Error) {

      _newState2 = _objectPathImmutable2.default.set(_newState2, [name, JSON.stringify(params), 'error'], action.payload.message);

      _newState2 = _objectPathImmutable2.default.del(_newState2, [name, JSON.stringify(params), 'headers']);

      _newState2 = _objectPathImmutable2.default.del(_newState2, [name, JSON.stringify(params), 'status']);
    } else {

      _newState2 = _objectPathImmutable2.default.set(_newState2, [name, JSON.stringify(params), 'error'], action.payload.body);

      _newState2 = _objectPathImmutable2.default.set(_newState2, [name, JSON.stringify(params), 'headers'], action.payload.headers);

      _newState2 = _objectPathImmutable2.default.set(_newState2, [name, JSON.stringify(params), 'status'], action.payload.status);
    }

    return _newState2;
  }

  return state;
}