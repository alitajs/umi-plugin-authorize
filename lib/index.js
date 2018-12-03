"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _assert = _interopRequireDefault(require("assert"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ref:
// - https://umijs.org/plugin/develop.html
function patchRoutes(routes, authorize) {
  routes.forEach(route => {
    if (route.routes) {
      patchRoutes(route.routes, authorize);
    } else {
      authorize.forEach(auth => {
        const guard = auth.guard,
              include = auth.include,
              exclude = auth.exclude; //exclude和include可能是正则表达式或者字符串

        if ((!exclude || exclude instanceof RegExp && !exclude.test(route.path) || route.path && typeof exclude === "string" && route.path.indexOf(exclude) === -1) && (include && include instanceof RegExp && include.test(route.path) || route.path && typeof include === "string" && route.path.indexOf(include) !== -1)) {
          (0, _assert.default)(Array.isArray(guard), `The guard must be Array, but got ${guard}`);
          route.Routes = guard;
        }
      });
    }
  });
}

function _default(api, opts = {}) {
  api.modifyRoutes(routes => {
    if (opts.authorize) {
      (0, _assert.default)(Array.isArray(opts.authorize), `The authorize must be Array, but got ${opts.authorize}`);
      patchRoutes(routes, opts.authorize);
    }

    return routes;
  });
}