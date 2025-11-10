(function () {
  const U = document.createElement("link").relList;
  if (U && U.supports && U.supports("modulepreload")) return;
  for (const M of document.querySelectorAll('link[rel="modulepreload"]')) r(M);
  new MutationObserver((M) => {
    for (const C of M)
      if (C.type === "childList")
        for (const G of C.addedNodes)
          G.tagName === "LINK" && G.rel === "modulepreload" && r(G);
  }).observe(document, { childList: !0, subtree: !0 });
  function z(M) {
    const C = {};
    return (
      M.integrity && (C.integrity = M.integrity),
      M.referrerPolicy && (C.referrerPolicy = M.referrerPolicy),
      M.crossOrigin === "use-credentials"
        ? (C.credentials = "include")
        : M.crossOrigin === "anonymous"
        ? (C.credentials = "omit")
        : (C.credentials = "same-origin"),
      C
    );
  }
  function r(M) {
    if (M.ep) return;
    M.ep = !0;
    const C = z(M);
    fetch(M.href, C);
  }
})();
function Bd(h) {
  return h && h.__esModule && Object.prototype.hasOwnProperty.call(h, "default")
    ? h.default
    : h;
}
var sf = { exports: {} },
  Tn = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Sd;
function f0() {
  if (Sd) return Tn;
  Sd = 1;
  var h = Symbol.for("react.transitional.element"),
    U = Symbol.for("react.fragment");
  function z(r, M, C) {
    var G = null;
    if (
      (C !== void 0 && (G = "" + C),
      M.key !== void 0 && (G = "" + M.key),
      "key" in M)
    ) {
      C = {};
      for (var J in M) J !== "key" && (C[J] = M[J]);
    } else C = M;
    return (
      (M = C.ref),
      { $$typeof: h, type: r, key: G, ref: M !== void 0 ? M : null, props: C }
    );
  }
  return (Tn.Fragment = U), (Tn.jsx = z), (Tn.jsxs = z), Tn;
}
var Td;
function s0() {
  return Td || ((Td = 1), (sf.exports = f0())), sf.exports;
}
var f = s0(),
  of = { exports: {} },
  W = {};
/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Ed;
function o0() {
  if (Ed) return W;
  Ed = 1;
  var h = Symbol.for("react.transitional.element"),
    U = Symbol.for("react.portal"),
    z = Symbol.for("react.fragment"),
    r = Symbol.for("react.strict_mode"),
    M = Symbol.for("react.profiler"),
    C = Symbol.for("react.consumer"),
    G = Symbol.for("react.context"),
    J = Symbol.for("react.forward_ref"),
    D = Symbol.for("react.suspense"),
    p = Symbol.for("react.memo"),
    R = Symbol.for("react.lazy"),
    j = Symbol.for("react.activity"),
    V = Symbol.iterator;
  function nt(s) {
    return s === null || typeof s != "object"
      ? null
      : ((s = (V && s[V]) || s["@@iterator"]),
        typeof s == "function" ? s : null);
  }
  var I = {
      isMounted: function () {
        return !1;
      },
      enqueueForceUpdate: function () {},
      enqueueReplaceState: function () {},
      enqueueSetState: function () {},
    },
    dt = Object.assign,
    Mt = {};
  function bt(s, S, _) {
    (this.props = s),
      (this.context = S),
      (this.refs = Mt),
      (this.updater = _ || I);
  }
  (bt.prototype.isReactComponent = {}),
    (bt.prototype.setState = function (s, S) {
      if (typeof s != "object" && typeof s != "function" && s != null)
        throw Error(
          "takes an object of state variables to update or a function which returns an object of state variables."
        );
      this.updater.enqueueSetState(this, s, S, "setState");
    }),
    (bt.prototype.forceUpdate = function (s) {
      this.updater.enqueueForceUpdate(this, s, "forceUpdate");
    });
  function Dt() {}
  Dt.prototype = bt.prototype;
  function ft(s, S, _) {
    (this.props = s),
      (this.context = S),
      (this.refs = Mt),
      (this.updater = _ || I);
  }
  var St = (ft.prototype = new Dt());
  (St.constructor = ft), dt(St, bt.prototype), (St.isPureReactComponent = !0);
  var Y = Array.isArray;
  function X() {}
  var O = { H: null, A: null, T: null, S: null },
    lt = Object.prototype.hasOwnProperty;
  function st(s, S, _) {
    var H = _.ref;
    return {
      $$typeof: h,
      type: s,
      key: S,
      ref: H !== void 0 ? H : null,
      props: _,
    };
  }
  function Ot(s, S) {
    return st(s.type, S, s.props);
  }
  function wt(s) {
    return typeof s == "object" && s !== null && s.$$typeof === h;
  }
  function Ct(s) {
    var S = { "=": "=0", ":": "=2" };
    return (
      "$" +
      s.replace(/[=:]/g, function (_) {
        return S[_];
      })
    );
  }
  var ut = /\/+/g;
  function Yt(s, S) {
    return typeof s == "object" && s !== null && s.key != null
      ? Ct("" + s.key)
      : S.toString(36);
  }
  function K(s) {
    switch (s.status) {
      case "fulfilled":
        return s.value;
      case "rejected":
        throw s.reason;
      default:
        switch (
          (typeof s.status == "string"
            ? s.then(X, X)
            : ((s.status = "pending"),
              s.then(
                function (S) {
                  s.status === "pending" &&
                    ((s.status = "fulfilled"), (s.value = S));
                },
                function (S) {
                  s.status === "pending" &&
                    ((s.status = "rejected"), (s.reason = S));
                }
              )),
          s.status)
        ) {
          case "fulfilled":
            return s.value;
          case "rejected":
            throw s.reason;
        }
    }
    throw s;
  }
  function g(s, S, _, H, Z) {
    var k = typeof s;
    (k === "undefined" || k === "boolean") && (s = null);
    var at = !1;
    if (s === null) at = !0;
    else
      switch (k) {
        case "bigint":
        case "string":
        case "number":
          at = !0;
          break;
        case "object":
          switch (s.$$typeof) {
            case h:
            case U:
              at = !0;
              break;
            case R:
              return (at = s._init), g(at(s._payload), S, _, H, Z);
          }
      }
    if (at)
      return (
        (Z = Z(s)),
        (at = H === "" ? "." + Yt(s, 0) : H),
        Y(Z)
          ? ((_ = ""),
            at != null && (_ = at.replace(ut, "$&/") + "/"),
            g(Z, S, _, "", function (Bl) {
              return Bl;
            }))
          : Z != null &&
            (wt(Z) &&
              (Z = Ot(
                Z,
                _ +
                  (Z.key == null || (s && s.key === Z.key)
                    ? ""
                    : ("" + Z.key).replace(ut, "$&/") + "/") +
                  at
              )),
            S.push(Z)),
        1
      );
    at = 0;
    var Ut = H === "" ? "." : H + ":";
    if (Y(s))
      for (var yt = 0; yt < s.length; yt++)
        (H = s[yt]), (k = Ut + Yt(H, yt)), (at += g(H, S, _, k, Z));
    else if (((yt = nt(s)), typeof yt == "function"))
      for (s = yt.call(s), yt = 0; !(H = s.next()).done; )
        (H = H.value), (k = Ut + Yt(H, yt++)), (at += g(H, S, _, k, Z));
    else if (k === "object") {
      if (typeof s.then == "function") return g(K(s), S, _, H, Z);
      throw (
        ((S = String(s)),
        Error(
          "Objects are not valid as a React child (found: " +
            (S === "[object Object]"
              ? "object with keys {" + Object.keys(s).join(", ") + "}"
              : S) +
            "). If you meant to render a collection of children, use an array instead."
        ))
      );
    }
    return at;
  }
  function A(s, S, _) {
    if (s == null) return s;
    var H = [],
      Z = 0;
    return (
      g(s, H, "", "", function (k) {
        return S.call(_, k, Z++);
      }),
      H
    );
  }
  function B(s) {
    if (s._status === -1) {
      var S = s._result;
      (S = S()),
        S.then(
          function (_) {
            (s._status === 0 || s._status === -1) &&
              ((s._status = 1), (s._result = _));
          },
          function (_) {
            (s._status === 0 || s._status === -1) &&
              ((s._status = 2), (s._result = _));
          }
        ),
        s._status === -1 && ((s._status = 0), (s._result = S));
    }
    if (s._status === 1) return s._result.default;
    throw s._result;
  }
  var et =
      typeof reportError == "function"
        ? reportError
        : function (s) {
            if (
              typeof window == "object" &&
              typeof window.ErrorEvent == "function"
            ) {
              var S = new window.ErrorEvent("error", {
                bubbles: !0,
                cancelable: !0,
                message:
                  typeof s == "object" &&
                  s !== null &&
                  typeof s.message == "string"
                    ? String(s.message)
                    : String(s),
                error: s,
              });
              if (!window.dispatchEvent(S)) return;
            } else if (
              typeof process == "object" &&
              typeof process.emit == "function"
            ) {
              process.emit("uncaughtException", s);
              return;
            }
            console.error(s);
          },
    F = {
      map: A,
      forEach: function (s, S, _) {
        A(
          s,
          function () {
            S.apply(this, arguments);
          },
          _
        );
      },
      count: function (s) {
        var S = 0;
        return (
          A(s, function () {
            S++;
          }),
          S
        );
      },
      toArray: function (s) {
        return (
          A(s, function (S) {
            return S;
          }) || []
        );
      },
      only: function (s) {
        if (!wt(s))
          throw Error(
            "React.Children.only expected to receive a single React element child."
          );
        return s;
      },
    };
  return (
    (W.Activity = j),
    (W.Children = F),
    (W.Component = bt),
    (W.Fragment = z),
    (W.Profiler = M),
    (W.PureComponent = ft),
    (W.StrictMode = r),
    (W.Suspense = D),
    (W.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = O),
    (W.__COMPILER_RUNTIME = {
      __proto__: null,
      c: function (s) {
        return O.H.useMemoCache(s);
      },
    }),
    (W.cache = function (s) {
      return function () {
        return s.apply(null, arguments);
      };
    }),
    (W.cacheSignal = function () {
      return null;
    }),
    (W.cloneElement = function (s, S, _) {
      if (s == null)
        throw Error(
          "The argument must be a React element, but you passed " + s + "."
        );
      var H = dt({}, s.props),
        Z = s.key;
      if (S != null)
        for (k in (S.key !== void 0 && (Z = "" + S.key), S))
          !lt.call(S, k) ||
            k === "key" ||
            k === "__self" ||
            k === "__source" ||
            (k === "ref" && S.ref === void 0) ||
            (H[k] = S[k]);
      var k = arguments.length - 2;
      if (k === 1) H.children = _;
      else if (1 < k) {
        for (var at = Array(k), Ut = 0; Ut < k; Ut++)
          at[Ut] = arguments[Ut + 2];
        H.children = at;
      }
      return st(s.type, Z, H);
    }),
    (W.createContext = function (s) {
      return (
        (s = {
          $$typeof: G,
          _currentValue: s,
          _currentValue2: s,
          _threadCount: 0,
          Provider: null,
          Consumer: null,
        }),
        (s.Provider = s),
        (s.Consumer = { $$typeof: C, _context: s }),
        s
      );
    }),
    (W.createElement = function (s, S, _) {
      var H,
        Z = {},
        k = null;
      if (S != null)
        for (H in (S.key !== void 0 && (k = "" + S.key), S))
          lt.call(S, H) &&
            H !== "key" &&
            H !== "__self" &&
            H !== "__source" &&
            (Z[H] = S[H]);
      var at = arguments.length - 2;
      if (at === 1) Z.children = _;
      else if (1 < at) {
        for (var Ut = Array(at), yt = 0; yt < at; yt++)
          Ut[yt] = arguments[yt + 2];
        Z.children = Ut;
      }
      if (s && s.defaultProps)
        for (H in ((at = s.defaultProps), at))
          Z[H] === void 0 && (Z[H] = at[H]);
      return st(s, k, Z);
    }),
    (W.createRef = function () {
      return { current: null };
    }),
    (W.forwardRef = function (s) {
      return { $$typeof: J, render: s };
    }),
    (W.isValidElement = wt),
    (W.lazy = function (s) {
      return { $$typeof: R, _payload: { _status: -1, _result: s }, _init: B };
    }),
    (W.memo = function (s, S) {
      return { $$typeof: p, type: s, compare: S === void 0 ? null : S };
    }),
    (W.startTransition = function (s) {
      var S = O.T,
        _ = {};
      O.T = _;
      try {
        var H = s(),
          Z = O.S;
        Z !== null && Z(_, H),
          typeof H == "object" &&
            H !== null &&
            typeof H.then == "function" &&
            H.then(X, et);
      } catch (k) {
        et(k);
      } finally {
        S !== null && _.types !== null && (S.types = _.types), (O.T = S);
      }
    }),
    (W.unstable_useCacheRefresh = function () {
      return O.H.useCacheRefresh();
    }),
    (W.use = function (s) {
      return O.H.use(s);
    }),
    (W.useActionState = function (s, S, _) {
      return O.H.useActionState(s, S, _);
    }),
    (W.useCallback = function (s, S) {
      return O.H.useCallback(s, S);
    }),
    (W.useContext = function (s) {
      return O.H.useContext(s);
    }),
    (W.useDebugValue = function () {}),
    (W.useDeferredValue = function (s, S) {
      return O.H.useDeferredValue(s, S);
    }),
    (W.useEffect = function (s, S) {
      return O.H.useEffect(s, S);
    }),
    (W.useEffectEvent = function (s) {
      return O.H.useEffectEvent(s);
    }),
    (W.useId = function () {
      return O.H.useId();
    }),
    (W.useImperativeHandle = function (s, S, _) {
      return O.H.useImperativeHandle(s, S, _);
    }),
    (W.useInsertionEffect = function (s, S) {
      return O.H.useInsertionEffect(s, S);
    }),
    (W.useLayoutEffect = function (s, S) {
      return O.H.useLayoutEffect(s, S);
    }),
    (W.useMemo = function (s, S) {
      return O.H.useMemo(s, S);
    }),
    (W.useOptimistic = function (s, S) {
      return O.H.useOptimistic(s, S);
    }),
    (W.useReducer = function (s, S, _) {
      return O.H.useReducer(s, S, _);
    }),
    (W.useRef = function (s) {
      return O.H.useRef(s);
    }),
    (W.useState = function (s) {
      return O.H.useState(s);
    }),
    (W.useSyncExternalStore = function (s, S, _) {
      return O.H.useSyncExternalStore(s, S, _);
    }),
    (W.useTransition = function () {
      return O.H.useTransition();
    }),
    (W.version = "19.2.0"),
    W
  );
}
var Nd;
function bf() {
  return Nd || ((Nd = 1), (of.exports = o0())), of.exports;
}
var q = bf();
const Rd = Bd(q);
var rf = { exports: {} },
  En = {},
  df = { exports: {} },
  mf = {};
/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Ad;
function r0() {
  return (
    Ad ||
      ((Ad = 1),
      (function (h) {
        function U(g, A) {
          var B = g.length;
          g.push(A);
          t: for (; 0 < B; ) {
            var et = (B - 1) >>> 1,
              F = g[et];
            if (0 < M(F, A)) (g[et] = A), (g[B] = F), (B = et);
            else break t;
          }
        }
        function z(g) {
          return g.length === 0 ? null : g[0];
        }
        function r(g) {
          if (g.length === 0) return null;
          var A = g[0],
            B = g.pop();
          if (B !== A) {
            g[0] = B;
            t: for (var et = 0, F = g.length, s = F >>> 1; et < s; ) {
              var S = 2 * (et + 1) - 1,
                _ = g[S],
                H = S + 1,
                Z = g[H];
              if (0 > M(_, B))
                H < F && 0 > M(Z, _)
                  ? ((g[et] = Z), (g[H] = B), (et = H))
                  : ((g[et] = _), (g[S] = B), (et = S));
              else if (H < F && 0 > M(Z, B)) (g[et] = Z), (g[H] = B), (et = H);
              else break t;
            }
          }
          return A;
        }
        function M(g, A) {
          var B = g.sortIndex - A.sortIndex;
          return B !== 0 ? B : g.id - A.id;
        }
        if (
          ((h.unstable_now = void 0),
          typeof performance == "object" &&
            typeof performance.now == "function")
        ) {
          var C = performance;
          h.unstable_now = function () {
            return C.now();
          };
        } else {
          var G = Date,
            J = G.now();
          h.unstable_now = function () {
            return G.now() - J;
          };
        }
        var D = [],
          p = [],
          R = 1,
          j = null,
          V = 3,
          nt = !1,
          I = !1,
          dt = !1,
          Mt = !1,
          bt = typeof setTimeout == "function" ? setTimeout : null,
          Dt = typeof clearTimeout == "function" ? clearTimeout : null,
          ft = typeof setImmediate < "u" ? setImmediate : null;
        function St(g) {
          for (var A = z(p); A !== null; ) {
            if (A.callback === null) r(p);
            else if (A.startTime <= g)
              r(p), (A.sortIndex = A.expirationTime), U(D, A);
            else break;
            A = z(p);
          }
        }
        function Y(g) {
          if (((dt = !1), St(g), !I))
            if (z(D) !== null) (I = !0), X || ((X = !0), Ct());
            else {
              var A = z(p);
              A !== null && K(Y, A.startTime - g);
            }
        }
        var X = !1,
          O = -1,
          lt = 5,
          st = -1;
        function Ot() {
          return Mt ? !0 : !(h.unstable_now() - st < lt);
        }
        function wt() {
          if (((Mt = !1), X)) {
            var g = h.unstable_now();
            st = g;
            var A = !0;
            try {
              t: {
                (I = !1), dt && ((dt = !1), Dt(O), (O = -1)), (nt = !0);
                var B = V;
                try {
                  l: {
                    for (
                      St(g), j = z(D);
                      j !== null && !(j.expirationTime > g && Ot());

                    ) {
                      var et = j.callback;
                      if (typeof et == "function") {
                        (j.callback = null), (V = j.priorityLevel);
                        var F = et(j.expirationTime <= g);
                        if (((g = h.unstable_now()), typeof F == "function")) {
                          (j.callback = F), St(g), (A = !0);
                          break l;
                        }
                        j === z(D) && r(D), St(g);
                      } else r(D);
                      j = z(D);
                    }
                    if (j !== null) A = !0;
                    else {
                      var s = z(p);
                      s !== null && K(Y, s.startTime - g), (A = !1);
                    }
                  }
                  break t;
                } finally {
                  (j = null), (V = B), (nt = !1);
                }
                A = void 0;
              }
            } finally {
              A ? Ct() : (X = !1);
            }
          }
        }
        var Ct;
        if (typeof ft == "function")
          Ct = function () {
            ft(wt);
          };
        else if (typeof MessageChannel < "u") {
          var ut = new MessageChannel(),
            Yt = ut.port2;
          (ut.port1.onmessage = wt),
            (Ct = function () {
              Yt.postMessage(null);
            });
        } else
          Ct = function () {
            bt(wt, 0);
          };
        function K(g, A) {
          O = bt(function () {
            g(h.unstable_now());
          }, A);
        }
        (h.unstable_IdlePriority = 5),
          (h.unstable_ImmediatePriority = 1),
          (h.unstable_LowPriority = 4),
          (h.unstable_NormalPriority = 3),
          (h.unstable_Profiling = null),
          (h.unstable_UserBlockingPriority = 2),
          (h.unstable_cancelCallback = function (g) {
            g.callback = null;
          }),
          (h.unstable_forceFrameRate = function (g) {
            0 > g || 125 < g
              ? console.error(
                  "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
                )
              : (lt = 0 < g ? Math.floor(1e3 / g) : 5);
          }),
          (h.unstable_getCurrentPriorityLevel = function () {
            return V;
          }),
          (h.unstable_next = function (g) {
            switch (V) {
              case 1:
              case 2:
              case 3:
                var A = 3;
                break;
              default:
                A = V;
            }
            var B = V;
            V = A;
            try {
              return g();
            } finally {
              V = B;
            }
          }),
          (h.unstable_requestPaint = function () {
            Mt = !0;
          }),
          (h.unstable_runWithPriority = function (g, A) {
            switch (g) {
              case 1:
              case 2:
              case 3:
              case 4:
              case 5:
                break;
              default:
                g = 3;
            }
            var B = V;
            V = g;
            try {
              return A();
            } finally {
              V = B;
            }
          }),
          (h.unstable_scheduleCallback = function (g, A, B) {
            var et = h.unstable_now();
            switch (
              (typeof B == "object" && B !== null
                ? ((B = B.delay),
                  (B = typeof B == "number" && 0 < B ? et + B : et))
                : (B = et),
              g)
            ) {
              case 1:
                var F = -1;
                break;
              case 2:
                F = 250;
                break;
              case 5:
                F = 1073741823;
                break;
              case 4:
                F = 1e4;
                break;
              default:
                F = 5e3;
            }
            return (
              (F = B + F),
              (g = {
                id: R++,
                callback: A,
                priorityLevel: g,
                startTime: B,
                expirationTime: F,
                sortIndex: -1,
              }),
              B > et
                ? ((g.sortIndex = B),
                  U(p, g),
                  z(D) === null &&
                    g === z(p) &&
                    (dt ? (Dt(O), (O = -1)) : (dt = !0), K(Y, B - et)))
                : ((g.sortIndex = F),
                  U(D, g),
                  I || nt || ((I = !0), X || ((X = !0), Ct()))),
              g
            );
          }),
          (h.unstable_shouldYield = Ot),
          (h.unstable_wrapCallback = function (g) {
            var A = V;
            return function () {
              var B = V;
              V = A;
              try {
                return g.apply(this, arguments);
              } finally {
                V = B;
              }
            };
          });
      })(mf)),
    mf
  );
}
var jd;
function d0() {
  return jd || ((jd = 1), (df.exports = r0())), df.exports;
}
var hf = { exports: {} },
  It = {};
/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var zd;
function m0() {
  if (zd) return It;
  zd = 1;
  var h = bf();
  function U(D) {
    var p = "https://react.dev/errors/" + D;
    if (1 < arguments.length) {
      p += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var R = 2; R < arguments.length; R++)
        p += "&args[]=" + encodeURIComponent(arguments[R]);
    }
    return (
      "Minified React error #" +
      D +
      "; visit " +
      p +
      " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
    );
  }
  function z() {}
  var r = {
      d: {
        f: z,
        r: function () {
          throw Error(U(522));
        },
        D: z,
        C: z,
        L: z,
        m: z,
        X: z,
        S: z,
        M: z,
      },
      p: 0,
      findDOMNode: null,
    },
    M = Symbol.for("react.portal");
  function C(D, p, R) {
    var j =
      3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: M,
      key: j == null ? null : "" + j,
      children: D,
      containerInfo: p,
      implementation: R,
    };
  }
  var G = h.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function J(D, p) {
    if (D === "font") return "";
    if (typeof p == "string") return p === "use-credentials" ? p : "";
  }
  return (
    (It.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = r),
    (It.createPortal = function (D, p) {
      var R =
        2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
      if (!p || (p.nodeType !== 1 && p.nodeType !== 9 && p.nodeType !== 11))
        throw Error(U(299));
      return C(D, p, null, R);
    }),
    (It.flushSync = function (D) {
      var p = G.T,
        R = r.p;
      try {
        if (((G.T = null), (r.p = 2), D)) return D();
      } finally {
        (G.T = p), (r.p = R), r.d.f();
      }
    }),
    (It.preconnect = function (D, p) {
      typeof D == "string" &&
        (p
          ? ((p = p.crossOrigin),
            (p =
              typeof p == "string"
                ? p === "use-credentials"
                  ? p
                  : ""
                : void 0))
          : (p = null),
        r.d.C(D, p));
    }),
    (It.prefetchDNS = function (D) {
      typeof D == "string" && r.d.D(D);
    }),
    (It.preinit = function (D, p) {
      if (typeof D == "string" && p && typeof p.as == "string") {
        var R = p.as,
          j = J(R, p.crossOrigin),
          V = typeof p.integrity == "string" ? p.integrity : void 0,
          nt = typeof p.fetchPriority == "string" ? p.fetchPriority : void 0;
        R === "style"
          ? r.d.S(D, typeof p.precedence == "string" ? p.precedence : void 0, {
              crossOrigin: j,
              integrity: V,
              fetchPriority: nt,
            })
          : R === "script" &&
            r.d.X(D, {
              crossOrigin: j,
              integrity: V,
              fetchPriority: nt,
              nonce: typeof p.nonce == "string" ? p.nonce : void 0,
            });
      }
    }),
    (It.preinitModule = function (D, p) {
      if (typeof D == "string")
        if (typeof p == "object" && p !== null) {
          if (p.as == null || p.as === "script") {
            var R = J(p.as, p.crossOrigin);
            r.d.M(D, {
              crossOrigin: R,
              integrity: typeof p.integrity == "string" ? p.integrity : void 0,
              nonce: typeof p.nonce == "string" ? p.nonce : void 0,
            });
          }
        } else p == null && r.d.M(D);
    }),
    (It.preload = function (D, p) {
      if (
        typeof D == "string" &&
        typeof p == "object" &&
        p !== null &&
        typeof p.as == "string"
      ) {
        var R = p.as,
          j = J(R, p.crossOrigin);
        r.d.L(D, R, {
          crossOrigin: j,
          integrity: typeof p.integrity == "string" ? p.integrity : void 0,
          nonce: typeof p.nonce == "string" ? p.nonce : void 0,
          type: typeof p.type == "string" ? p.type : void 0,
          fetchPriority:
            typeof p.fetchPriority == "string" ? p.fetchPriority : void 0,
          referrerPolicy:
            typeof p.referrerPolicy == "string" ? p.referrerPolicy : void 0,
          imageSrcSet:
            typeof p.imageSrcSet == "string" ? p.imageSrcSet : void 0,
          imageSizes: typeof p.imageSizes == "string" ? p.imageSizes : void 0,
          media: typeof p.media == "string" ? p.media : void 0,
        });
      }
    }),
    (It.preloadModule = function (D, p) {
      if (typeof D == "string")
        if (p) {
          var R = J(p.as, p.crossOrigin);
          r.d.m(D, {
            as: typeof p.as == "string" && p.as !== "script" ? p.as : void 0,
            crossOrigin: R,
            integrity: typeof p.integrity == "string" ? p.integrity : void 0,
          });
        } else r.d.m(D);
    }),
    (It.requestFormReset = function (D) {
      r.d.r(D);
    }),
    (It.unstable_batchedUpdates = function (D, p) {
      return D(p);
    }),
    (It.useFormState = function (D, p, R) {
      return G.H.useFormState(D, p, R);
    }),
    (It.useFormStatus = function () {
      return G.H.useHostTransitionStatus();
    }),
    (It.version = "19.2.0"),
    It
  );
}
var _d;
function h0() {
  if (_d) return hf.exports;
  _d = 1;
  function h() {
    if (
      !(
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" ||
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"
      )
    )
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(h);
      } catch (U) {
        console.error(U);
      }
  }
  return h(), (hf.exports = m0()), hf.exports;
}
/**
 * @license React
 * react-dom-client.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Dd;
function g0() {
  if (Dd) return En;
  Dd = 1;
  var h = d0(),
    U = bf(),
    z = h0();
  function r(t) {
    var l = "https://react.dev/errors/" + t;
    if (1 < arguments.length) {
      l += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var e = 2; e < arguments.length; e++)
        l += "&args[]=" + encodeURIComponent(arguments[e]);
    }
    return (
      "Minified React error #" +
      t +
      "; visit " +
      l +
      " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
    );
  }
  function M(t) {
    return !(!t || (t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11));
  }
  function C(t) {
    var l = t,
      e = t;
    if (t.alternate) for (; l.return; ) l = l.return;
    else {
      t = l;
      do (l = t), (l.flags & 4098) !== 0 && (e = l.return), (t = l.return);
      while (t);
    }
    return l.tag === 3 ? e : null;
  }
  function G(t) {
    if (t.tag === 13) {
      var l = t.memoizedState;
      if (
        (l === null && ((t = t.alternate), t !== null && (l = t.memoizedState)),
        l !== null)
      )
        return l.dehydrated;
    }
    return null;
  }
  function J(t) {
    if (t.tag === 31) {
      var l = t.memoizedState;
      if (
        (l === null && ((t = t.alternate), t !== null && (l = t.memoizedState)),
        l !== null)
      )
        return l.dehydrated;
    }
    return null;
  }
  function D(t) {
    if (C(t) !== t) throw Error(r(188));
  }
  function p(t) {
    var l = t.alternate;
    if (!l) {
      if (((l = C(t)), l === null)) throw Error(r(188));
      return l !== t ? null : t;
    }
    for (var e = t, a = l; ; ) {
      var n = e.return;
      if (n === null) break;
      var u = n.alternate;
      if (u === null) {
        if (((a = n.return), a !== null)) {
          e = a;
          continue;
        }
        break;
      }
      if (n.child === u.child) {
        for (u = n.child; u; ) {
          if (u === e) return D(n), t;
          if (u === a) return D(n), l;
          u = u.sibling;
        }
        throw Error(r(188));
      }
      if (e.return !== a.return) (e = n), (a = u);
      else {
        for (var i = !1, c = n.child; c; ) {
          if (c === e) {
            (i = !0), (e = n), (a = u);
            break;
          }
          if (c === a) {
            (i = !0), (a = n), (e = u);
            break;
          }
          c = c.sibling;
        }
        if (!i) {
          for (c = u.child; c; ) {
            if (c === e) {
              (i = !0), (e = u), (a = n);
              break;
            }
            if (c === a) {
              (i = !0), (a = u), (e = n);
              break;
            }
            c = c.sibling;
          }
          if (!i) throw Error(r(189));
        }
      }
      if (e.alternate !== a) throw Error(r(190));
    }
    if (e.tag !== 3) throw Error(r(188));
    return e.stateNode.current === e ? t : l;
  }
  function R(t) {
    var l = t.tag;
    if (l === 5 || l === 26 || l === 27 || l === 6) return t;
    for (t = t.child; t !== null; ) {
      if (((l = R(t)), l !== null)) return l;
      t = t.sibling;
    }
    return null;
  }
  var j = Object.assign,
    V = Symbol.for("react.element"),
    nt = Symbol.for("react.transitional.element"),
    I = Symbol.for("react.portal"),
    dt = Symbol.for("react.fragment"),
    Mt = Symbol.for("react.strict_mode"),
    bt = Symbol.for("react.profiler"),
    Dt = Symbol.for("react.consumer"),
    ft = Symbol.for("react.context"),
    St = Symbol.for("react.forward_ref"),
    Y = Symbol.for("react.suspense"),
    X = Symbol.for("react.suspense_list"),
    O = Symbol.for("react.memo"),
    lt = Symbol.for("react.lazy"),
    st = Symbol.for("react.activity"),
    Ot = Symbol.for("react.memo_cache_sentinel"),
    wt = Symbol.iterator;
  function Ct(t) {
    return t === null || typeof t != "object"
      ? null
      : ((t = (wt && t[wt]) || t["@@iterator"]),
        typeof t == "function" ? t : null);
  }
  var ut = Symbol.for("react.client.reference");
  function Yt(t) {
    if (t == null) return null;
    if (typeof t == "function")
      return t.$$typeof === ut ? null : t.displayName || t.name || null;
    if (typeof t == "string") return t;
    switch (t) {
      case dt:
        return "Fragment";
      case bt:
        return "Profiler";
      case Mt:
        return "StrictMode";
      case Y:
        return "Suspense";
      case X:
        return "SuspenseList";
      case st:
        return "Activity";
    }
    if (typeof t == "object")
      switch (t.$$typeof) {
        case I:
          return "Portal";
        case ft:
          return t.displayName || "Context";
        case Dt:
          return (t._context.displayName || "Context") + ".Consumer";
        case St:
          var l = t.render;
          return (
            (t = t.displayName),
            t ||
              ((t = l.displayName || l.name || ""),
              (t = t !== "" ? "ForwardRef(" + t + ")" : "ForwardRef")),
            t
          );
        case O:
          return (
            (l = t.displayName || null), l !== null ? l : Yt(t.type) || "Memo"
          );
        case lt:
          (l = t._payload), (t = t._init);
          try {
            return Yt(t(l));
          } catch {}
      }
    return null;
  }
  var K = Array.isArray,
    g = U.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
    A = z.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
    B = { pending: !1, data: null, method: null, action: null },
    et = [],
    F = -1;
  function s(t) {
    return { current: t };
  }
  function S(t) {
    0 > F || ((t.current = et[F]), (et[F] = null), F--);
  }
  function _(t, l) {
    F++, (et[F] = t.current), (t.current = l);
  }
  var H = s(null),
    Z = s(null),
    k = s(null),
    at = s(null);
  function Ut(t, l) {
    switch ((_(k, l), _(Z, t), _(H, null), l.nodeType)) {
      case 9:
      case 11:
        t = (t = l.documentElement) && (t = t.namespaceURI) ? wr(t) : 0;
        break;
      default:
        if (((t = l.tagName), (l = l.namespaceURI)))
          (l = wr(l)), (t = Vr(l, t));
        else
          switch (t) {
            case "svg":
              t = 1;
              break;
            case "math":
              t = 2;
              break;
            default:
              t = 0;
          }
    }
    S(H), _(H, t);
  }
  function yt() {
    S(H), S(Z), S(k);
  }
  function Bl(t) {
    t.memoizedState !== null && _(at, t);
    var l = H.current,
      e = Vr(l, t.type);
    l !== e && (_(Z, t), _(H, e));
  }
  function te(t) {
    Z.current === t && (S(H), S(Z)),
      at.current === t && (S(at), (bn._currentValue = B));
  }
  var wu, pf;
  function je(t) {
    if (wu === void 0)
      try {
        throw Error();
      } catch (e) {
        var l = e.stack.trim().match(/\n( *(at )?)/);
        (wu = (l && l[1]) || ""),
          (pf =
            -1 <
            e.stack.indexOf(`
    at`)
              ? " (<anonymous>)"
              : -1 < e.stack.indexOf("@")
              ? "@unknown:0:0"
              : "");
      }
    return (
      `
` +
      wu +
      t +
      pf
    );
  }
  var Vu = !1;
  function Ku(t, l) {
    if (!t || Vu) return "";
    Vu = !0;
    var e = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var a = {
        DetermineComponentFrameRoot: function () {
          try {
            if (l) {
              var N = function () {
                throw Error();
              };
              if (
                (Object.defineProperty(N.prototype, "props", {
                  set: function () {
                    throw Error();
                  },
                }),
                typeof Reflect == "object" && Reflect.construct)
              ) {
                try {
                  Reflect.construct(N, []);
                } catch (x) {
                  var b = x;
                }
                Reflect.construct(t, [], N);
              } else {
                try {
                  N.call();
                } catch (x) {
                  b = x;
                }
                t.call(N.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (x) {
                b = x;
              }
              (N = t()) &&
                typeof N.catch == "function" &&
                N.catch(function () {});
            }
          } catch (x) {
            if (x && b && typeof x.stack == "string") return [x.stack, b.stack];
          }
          return [null, null];
        },
      };
      a.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
      var n = Object.getOwnPropertyDescriptor(
        a.DetermineComponentFrameRoot,
        "name"
      );
      n &&
        n.configurable &&
        Object.defineProperty(a.DetermineComponentFrameRoot, "name", {
          value: "DetermineComponentFrameRoot",
        });
      var u = a.DetermineComponentFrameRoot(),
        i = u[0],
        c = u[1];
      if (i && c) {
        var o = i.split(`
`),
          y = c.split(`
`);
        for (
          n = a = 0;
          a < o.length && !o[a].includes("DetermineComponentFrameRoot");

        )
          a++;
        for (; n < y.length && !y[n].includes("DetermineComponentFrameRoot"); )
          n++;
        if (a === o.length || n === y.length)
          for (
            a = o.length - 1, n = y.length - 1;
            1 <= a && 0 <= n && o[a] !== y[n];

          )
            n--;
        for (; 1 <= a && 0 <= n; a--, n--)
          if (o[a] !== y[n]) {
            if (a !== 1 || n !== 1)
              do
                if ((a--, n--, 0 > n || o[a] !== y[n])) {
                  var T =
                    `
` + o[a].replace(" at new ", " at ");
                  return (
                    t.displayName &&
                      T.includes("<anonymous>") &&
                      (T = T.replace("<anonymous>", t.displayName)),
                    T
                  );
                }
              while (1 <= a && 0 <= n);
            break;
          }
      }
    } finally {
      (Vu = !1), (Error.prepareStackTrace = e);
    }
    return (e = t ? t.displayName || t.name : "") ? je(e) : "";
  }
  function Gd(t, l) {
    switch (t.tag) {
      case 26:
      case 27:
      case 5:
        return je(t.type);
      case 16:
        return je("Lazy");
      case 13:
        return t.child !== l && l !== null
          ? je("Suspense Fallback")
          : je("Suspense");
      case 19:
        return je("SuspenseList");
      case 0:
      case 15:
        return Ku(t.type, !1);
      case 11:
        return Ku(t.type.render, !1);
      case 1:
        return Ku(t.type, !0);
      case 31:
        return je("Activity");
      default:
        return "";
    }
  }
  function xf(t) {
    try {
      var l = "",
        e = null;
      do (l += Gd(t, e)), (e = t), (t = t.return);
      while (t);
      return l;
    } catch (a) {
      return (
        `
Error generating stack: ` +
        a.message +
        `
` +
        a.stack
      );
    }
  }
  var Ju = Object.prototype.hasOwnProperty,
    $u = h.unstable_scheduleCallback,
    ku = h.unstable_cancelCallback,
    Xd = h.unstable_shouldYield,
    Ld = h.unstable_requestPaint,
    cl = h.unstable_now,
    Qd = h.unstable_getCurrentPriorityLevel,
    Sf = h.unstable_ImmediatePriority,
    Tf = h.unstable_UserBlockingPriority,
    jn = h.unstable_NormalPriority,
    Zd = h.unstable_LowPriority,
    Ef = h.unstable_IdlePriority,
    wd = h.log,
    Vd = h.unstable_setDisableYieldValue,
    Da = null,
    fl = null;
  function le(t) {
    if (
      (typeof wd == "function" && Vd(t),
      fl && typeof fl.setStrictMode == "function")
    )
      try {
        fl.setStrictMode(Da, t);
      } catch {}
  }
  var sl = Math.clz32 ? Math.clz32 : $d,
    Kd = Math.log,
    Jd = Math.LN2;
  function $d(t) {
    return (t >>>= 0), t === 0 ? 32 : (31 - ((Kd(t) / Jd) | 0)) | 0;
  }
  var zn = 256,
    _n = 262144,
    Dn = 4194304;
  function ze(t) {
    var l = t & 42;
    if (l !== 0) return l;
    switch (t & -t) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
        return 64;
      case 128:
        return 128;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
        return t & 261888;
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return t & 3932160;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return t & 62914560;
      case 67108864:
        return 67108864;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 0;
      default:
        return t;
    }
  }
  function Mn(t, l, e) {
    var a = t.pendingLanes;
    if (a === 0) return 0;
    var n = 0,
      u = t.suspendedLanes,
      i = t.pingedLanes;
    t = t.warmLanes;
    var c = a & 134217727;
    return (
      c !== 0
        ? ((a = c & ~u),
          a !== 0
            ? (n = ze(a))
            : ((i &= c),
              i !== 0
                ? (n = ze(i))
                : e || ((e = c & ~t), e !== 0 && (n = ze(e)))))
        : ((c = a & ~u),
          c !== 0
            ? (n = ze(c))
            : i !== 0
            ? (n = ze(i))
            : e || ((e = a & ~t), e !== 0 && (n = ze(e)))),
      n === 0
        ? 0
        : l !== 0 &&
          l !== n &&
          (l & u) === 0 &&
          ((u = n & -n),
          (e = l & -l),
          u >= e || (u === 32 && (e & 4194048) !== 0))
        ? l
        : n
    );
  }
  function Ma(t, l) {
    return (t.pendingLanes & ~(t.suspendedLanes & ~t.pingedLanes) & l) === 0;
  }
  function kd(t, l) {
    switch (t) {
      case 1:
      case 2:
      case 4:
      case 8:
      case 64:
        return l + 250;
      case 16:
      case 32:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return l + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return -1;
      case 67108864:
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function Nf() {
    var t = Dn;
    return (Dn <<= 1), (Dn & 62914560) === 0 && (Dn = 4194304), t;
  }
  function Wu(t) {
    for (var l = [], e = 0; 31 > e; e++) l.push(t);
    return l;
  }
  function Oa(t, l) {
    (t.pendingLanes |= l),
      l !== 268435456 &&
        ((t.suspendedLanes = 0), (t.pingedLanes = 0), (t.warmLanes = 0));
  }
  function Wd(t, l, e, a, n, u) {
    var i = t.pendingLanes;
    (t.pendingLanes = e),
      (t.suspendedLanes = 0),
      (t.pingedLanes = 0),
      (t.warmLanes = 0),
      (t.expiredLanes &= e),
      (t.entangledLanes &= e),
      (t.errorRecoveryDisabledLanes &= e),
      (t.shellSuspendCounter = 0);
    var c = t.entanglements,
      o = t.expirationTimes,
      y = t.hiddenUpdates;
    for (e = i & ~e; 0 < e; ) {
      var T = 31 - sl(e),
        N = 1 << T;
      (c[T] = 0), (o[T] = -1);
      var b = y[T];
      if (b !== null)
        for (y[T] = null, T = 0; T < b.length; T++) {
          var x = b[T];
          x !== null && (x.lane &= -536870913);
        }
      e &= ~N;
    }
    a !== 0 && Af(t, a, 0),
      u !== 0 && n === 0 && t.tag !== 0 && (t.suspendedLanes |= u & ~(i & ~l));
  }
  function Af(t, l, e) {
    (t.pendingLanes |= l), (t.suspendedLanes &= ~l);
    var a = 31 - sl(l);
    (t.entangledLanes |= l),
      (t.entanglements[a] = t.entanglements[a] | 1073741824 | (e & 261930));
  }
  function jf(t, l) {
    var e = (t.entangledLanes |= l);
    for (t = t.entanglements; e; ) {
      var a = 31 - sl(e),
        n = 1 << a;
      (n & l) | (t[a] & l) && (t[a] |= l), (e &= ~n);
    }
  }
  function zf(t, l) {
    var e = l & -l;
    return (
      (e = (e & 42) !== 0 ? 1 : Fu(e)),
      (e & (t.suspendedLanes | l)) !== 0 ? 0 : e
    );
  }
  function Fu(t) {
    switch (t) {
      case 2:
        t = 1;
        break;
      case 8:
        t = 4;
        break;
      case 32:
        t = 16;
        break;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        t = 128;
        break;
      case 268435456:
        t = 134217728;
        break;
      default:
        t = 0;
    }
    return t;
  }
  function Iu(t) {
    return (
      (t &= -t),
      2 < t ? (8 < t ? ((t & 134217727) !== 0 ? 32 : 268435456) : 8) : 2
    );
  }
  function _f() {
    var t = A.p;
    return t !== 0 ? t : ((t = window.event), t === void 0 ? 32 : hd(t.type));
  }
  function Df(t, l) {
    var e = A.p;
    try {
      return (A.p = t), l();
    } finally {
      A.p = e;
    }
  }
  var ee = Math.random().toString(36).slice(2),
    Jt = "__reactFiber$" + ee,
    tl = "__reactProps$" + ee,
    Ve = "__reactContainer$" + ee,
    Pu = "__reactEvents$" + ee,
    Fd = "__reactListeners$" + ee,
    Id = "__reactHandles$" + ee,
    Mf = "__reactResources$" + ee,
    Ca = "__reactMarker$" + ee;
  function ti(t) {
    delete t[Jt], delete t[tl], delete t[Pu], delete t[Fd], delete t[Id];
  }
  function Ke(t) {
    var l = t[Jt];
    if (l) return l;
    for (var e = t.parentNode; e; ) {
      if ((l = e[Ve] || e[Jt])) {
        if (
          ((e = l.alternate),
          l.child !== null || (e !== null && e.child !== null))
        )
          for (t = Ir(t); t !== null; ) {
            if ((e = t[Jt])) return e;
            t = Ir(t);
          }
        return l;
      }
      (t = e), (e = t.parentNode);
    }
    return null;
  }
  function Je(t) {
    if ((t = t[Jt] || t[Ve])) {
      var l = t.tag;
      if (
        l === 5 ||
        l === 6 ||
        l === 13 ||
        l === 31 ||
        l === 26 ||
        l === 27 ||
        l === 3
      )
        return t;
    }
    return null;
  }
  function Ua(t) {
    var l = t.tag;
    if (l === 5 || l === 26 || l === 27 || l === 6) return t.stateNode;
    throw Error(r(33));
  }
  function $e(t) {
    var l = t[Mf];
    return (
      l ||
        (l = t[Mf] =
          { hoistableStyles: new Map(), hoistableScripts: new Map() }),
      l
    );
  }
  function Vt(t) {
    t[Ca] = !0;
  }
  var Of = new Set(),
    Cf = {};
  function _e(t, l) {
    ke(t, l), ke(t + "Capture", l);
  }
  function ke(t, l) {
    for (Cf[t] = l, t = 0; t < l.length; t++) Of.add(l[t]);
  }
  var Pd = RegExp(
      "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
    ),
    Uf = {},
    Hf = {};
  function tm(t) {
    return Ju.call(Hf, t)
      ? !0
      : Ju.call(Uf, t)
      ? !1
      : Pd.test(t)
      ? (Hf[t] = !0)
      : ((Uf[t] = !0), !1);
  }
  function On(t, l, e) {
    if (tm(l))
      if (e === null) t.removeAttribute(l);
      else {
        switch (typeof e) {
          case "undefined":
          case "function":
          case "symbol":
            t.removeAttribute(l);
            return;
          case "boolean":
            var a = l.toLowerCase().slice(0, 5);
            if (a !== "data-" && a !== "aria-") {
              t.removeAttribute(l);
              return;
            }
        }
        t.setAttribute(l, "" + e);
      }
  }
  function Cn(t, l, e) {
    if (e === null) t.removeAttribute(l);
    else {
      switch (typeof e) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          t.removeAttribute(l);
          return;
      }
      t.setAttribute(l, "" + e);
    }
  }
  function Rl(t, l, e, a) {
    if (a === null) t.removeAttribute(e);
    else {
      switch (typeof a) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          t.removeAttribute(e);
          return;
      }
      t.setAttributeNS(l, e, "" + a);
    }
  }
  function yl(t) {
    switch (typeof t) {
      case "bigint":
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return t;
      case "object":
        return t;
      default:
        return "";
    }
  }
  function Bf(t) {
    var l = t.type;
    return (
      (t = t.nodeName) &&
      t.toLowerCase() === "input" &&
      (l === "checkbox" || l === "radio")
    );
  }
  function lm(t, l, e) {
    var a = Object.getOwnPropertyDescriptor(t.constructor.prototype, l);
    if (
      !t.hasOwnProperty(l) &&
      typeof a < "u" &&
      typeof a.get == "function" &&
      typeof a.set == "function"
    ) {
      var n = a.get,
        u = a.set;
      return (
        Object.defineProperty(t, l, {
          configurable: !0,
          get: function () {
            return n.call(this);
          },
          set: function (i) {
            (e = "" + i), u.call(this, i);
          },
        }),
        Object.defineProperty(t, l, { enumerable: a.enumerable }),
        {
          getValue: function () {
            return e;
          },
          setValue: function (i) {
            e = "" + i;
          },
          stopTracking: function () {
            (t._valueTracker = null), delete t[l];
          },
        }
      );
    }
  }
  function li(t) {
    if (!t._valueTracker) {
      var l = Bf(t) ? "checked" : "value";
      t._valueTracker = lm(t, l, "" + t[l]);
    }
  }
  function Rf(t) {
    if (!t) return !1;
    var l = t._valueTracker;
    if (!l) return !0;
    var e = l.getValue(),
      a = "";
    return (
      t && (a = Bf(t) ? (t.checked ? "true" : "false") : t.value),
      (t = a),
      t !== e ? (l.setValue(t), !0) : !1
    );
  }
  function Un(t) {
    if (
      ((t = t || (typeof document < "u" ? document : void 0)), typeof t > "u")
    )
      return null;
    try {
      return t.activeElement || t.body;
    } catch {
      return t.body;
    }
  }
  var em = /[\n"\\]/g;
  function bl(t) {
    return t.replace(em, function (l) {
      return "\\" + l.charCodeAt(0).toString(16) + " ";
    });
  }
  function ei(t, l, e, a, n, u, i, c) {
    (t.name = ""),
      i != null &&
      typeof i != "function" &&
      typeof i != "symbol" &&
      typeof i != "boolean"
        ? (t.type = i)
        : t.removeAttribute("type"),
      l != null
        ? i === "number"
          ? ((l === 0 && t.value === "") || t.value != l) &&
            (t.value = "" + yl(l))
          : t.value !== "" + yl(l) && (t.value = "" + yl(l))
        : (i !== "submit" && i !== "reset") || t.removeAttribute("value"),
      l != null
        ? ai(t, i, yl(l))
        : e != null
        ? ai(t, i, yl(e))
        : a != null && t.removeAttribute("value"),
      n == null && u != null && (t.defaultChecked = !!u),
      n != null &&
        (t.checked = n && typeof n != "function" && typeof n != "symbol"),
      c != null &&
      typeof c != "function" &&
      typeof c != "symbol" &&
      typeof c != "boolean"
        ? (t.name = "" + yl(c))
        : t.removeAttribute("name");
  }
  function qf(t, l, e, a, n, u, i, c) {
    if (
      (u != null &&
        typeof u != "function" &&
        typeof u != "symbol" &&
        typeof u != "boolean" &&
        (t.type = u),
      l != null || e != null)
    ) {
      if (!((u !== "submit" && u !== "reset") || l != null)) {
        li(t);
        return;
      }
      (e = e != null ? "" + yl(e) : ""),
        (l = l != null ? "" + yl(l) : e),
        c || l === t.value || (t.value = l),
        (t.defaultValue = l);
    }
    (a = a ?? n),
      (a = typeof a != "function" && typeof a != "symbol" && !!a),
      (t.checked = c ? t.checked : !!a),
      (t.defaultChecked = !!a),
      i != null &&
        typeof i != "function" &&
        typeof i != "symbol" &&
        typeof i != "boolean" &&
        (t.name = i),
      li(t);
  }
  function ai(t, l, e) {
    (l === "number" && Un(t.ownerDocument) === t) ||
      t.defaultValue === "" + e ||
      (t.defaultValue = "" + e);
  }
  function We(t, l, e, a) {
    if (((t = t.options), l)) {
      l = {};
      for (var n = 0; n < e.length; n++) l["$" + e[n]] = !0;
      for (e = 0; e < t.length; e++)
        (n = l.hasOwnProperty("$" + t[e].value)),
          t[e].selected !== n && (t[e].selected = n),
          n && a && (t[e].defaultSelected = !0);
    } else {
      for (e = "" + yl(e), l = null, n = 0; n < t.length; n++) {
        if (t[n].value === e) {
          (t[n].selected = !0), a && (t[n].defaultSelected = !0);
          return;
        }
        l !== null || t[n].disabled || (l = t[n]);
      }
      l !== null && (l.selected = !0);
    }
  }
  function Yf(t, l, e) {
    if (
      l != null &&
      ((l = "" + yl(l)), l !== t.value && (t.value = l), e == null)
    ) {
      t.defaultValue !== l && (t.defaultValue = l);
      return;
    }
    t.defaultValue = e != null ? "" + yl(e) : "";
  }
  function Gf(t, l, e, a) {
    if (l == null) {
      if (a != null) {
        if (e != null) throw Error(r(92));
        if (K(a)) {
          if (1 < a.length) throw Error(r(93));
          a = a[0];
        }
        e = a;
      }
      e == null && (e = ""), (l = e);
    }
    (e = yl(l)),
      (t.defaultValue = e),
      (a = t.textContent),
      a === e && a !== "" && a !== null && (t.value = a),
      li(t);
  }
  function Fe(t, l) {
    if (l) {
      var e = t.firstChild;
      if (e && e === t.lastChild && e.nodeType === 3) {
        e.nodeValue = l;
        return;
      }
    }
    t.textContent = l;
  }
  var am = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " "
    )
  );
  function Xf(t, l, e) {
    var a = l.indexOf("--") === 0;
    e == null || typeof e == "boolean" || e === ""
      ? a
        ? t.setProperty(l, "")
        : l === "float"
        ? (t.cssFloat = "")
        : (t[l] = "")
      : a
      ? t.setProperty(l, e)
      : typeof e != "number" || e === 0 || am.has(l)
      ? l === "float"
        ? (t.cssFloat = e)
        : (t[l] = ("" + e).trim())
      : (t[l] = e + "px");
  }
  function Lf(t, l, e) {
    if (l != null && typeof l != "object") throw Error(r(62));
    if (((t = t.style), e != null)) {
      for (var a in e)
        !e.hasOwnProperty(a) ||
          (l != null && l.hasOwnProperty(a)) ||
          (a.indexOf("--") === 0
            ? t.setProperty(a, "")
            : a === "float"
            ? (t.cssFloat = "")
            : (t[a] = ""));
      for (var n in l)
        (a = l[n]), l.hasOwnProperty(n) && e[n] !== a && Xf(t, n, a);
    } else for (var u in l) l.hasOwnProperty(u) && Xf(t, u, l[u]);
  }
  function ni(t) {
    if (t.indexOf("-") === -1) return !1;
    switch (t) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return !1;
      default:
        return !0;
    }
  }
  var nm = new Map([
      ["acceptCharset", "accept-charset"],
      ["htmlFor", "for"],
      ["httpEquiv", "http-equiv"],
      ["crossOrigin", "crossorigin"],
      ["accentHeight", "accent-height"],
      ["alignmentBaseline", "alignment-baseline"],
      ["arabicForm", "arabic-form"],
      ["baselineShift", "baseline-shift"],
      ["capHeight", "cap-height"],
      ["clipPath", "clip-path"],
      ["clipRule", "clip-rule"],
      ["colorInterpolation", "color-interpolation"],
      ["colorInterpolationFilters", "color-interpolation-filters"],
      ["colorProfile", "color-profile"],
      ["colorRendering", "color-rendering"],
      ["dominantBaseline", "dominant-baseline"],
      ["enableBackground", "enable-background"],
      ["fillOpacity", "fill-opacity"],
      ["fillRule", "fill-rule"],
      ["floodColor", "flood-color"],
      ["floodOpacity", "flood-opacity"],
      ["fontFamily", "font-family"],
      ["fontSize", "font-size"],
      ["fontSizeAdjust", "font-size-adjust"],
      ["fontStretch", "font-stretch"],
      ["fontStyle", "font-style"],
      ["fontVariant", "font-variant"],
      ["fontWeight", "font-weight"],
      ["glyphName", "glyph-name"],
      ["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
      ["glyphOrientationVertical", "glyph-orientation-vertical"],
      ["horizAdvX", "horiz-adv-x"],
      ["horizOriginX", "horiz-origin-x"],
      ["imageRendering", "image-rendering"],
      ["letterSpacing", "letter-spacing"],
      ["lightingColor", "lighting-color"],
      ["markerEnd", "marker-end"],
      ["markerMid", "marker-mid"],
      ["markerStart", "marker-start"],
      ["overlinePosition", "overline-position"],
      ["overlineThickness", "overline-thickness"],
      ["paintOrder", "paint-order"],
      ["panose-1", "panose-1"],
      ["pointerEvents", "pointer-events"],
      ["renderingIntent", "rendering-intent"],
      ["shapeRendering", "shape-rendering"],
      ["stopColor", "stop-color"],
      ["stopOpacity", "stop-opacity"],
      ["strikethroughPosition", "strikethrough-position"],
      ["strikethroughThickness", "strikethrough-thickness"],
      ["strokeDasharray", "stroke-dasharray"],
      ["strokeDashoffset", "stroke-dashoffset"],
      ["strokeLinecap", "stroke-linecap"],
      ["strokeLinejoin", "stroke-linejoin"],
      ["strokeMiterlimit", "stroke-miterlimit"],
      ["strokeOpacity", "stroke-opacity"],
      ["strokeWidth", "stroke-width"],
      ["textAnchor", "text-anchor"],
      ["textDecoration", "text-decoration"],
      ["textRendering", "text-rendering"],
      ["transformOrigin", "transform-origin"],
      ["underlinePosition", "underline-position"],
      ["underlineThickness", "underline-thickness"],
      ["unicodeBidi", "unicode-bidi"],
      ["unicodeRange", "unicode-range"],
      ["unitsPerEm", "units-per-em"],
      ["vAlphabetic", "v-alphabetic"],
      ["vHanging", "v-hanging"],
      ["vIdeographic", "v-ideographic"],
      ["vMathematical", "v-mathematical"],
      ["vectorEffect", "vector-effect"],
      ["vertAdvY", "vert-adv-y"],
      ["vertOriginX", "vert-origin-x"],
      ["vertOriginY", "vert-origin-y"],
      ["wordSpacing", "word-spacing"],
      ["writingMode", "writing-mode"],
      ["xmlnsXlink", "xmlns:xlink"],
      ["xHeight", "x-height"],
    ]),
    um =
      /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function Hn(t) {
    return um.test("" + t)
      ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')"
      : t;
  }
  function ql() {}
  var ui = null;
  function ii(t) {
    return (
      (t = t.target || t.srcElement || window),
      t.correspondingUseElement && (t = t.correspondingUseElement),
      t.nodeType === 3 ? t.parentNode : t
    );
  }
  var Ie = null,
    Pe = null;
  function Qf(t) {
    var l = Je(t);
    if (l && (t = l.stateNode)) {
      var e = t[tl] || null;
      t: switch (((t = l.stateNode), l.type)) {
        case "input":
          if (
            (ei(
              t,
              e.value,
              e.defaultValue,
              e.defaultValue,
              e.checked,
              e.defaultChecked,
              e.type,
              e.name
            ),
            (l = e.name),
            e.type === "radio" && l != null)
          ) {
            for (e = t; e.parentNode; ) e = e.parentNode;
            for (
              e = e.querySelectorAll(
                'input[name="' + bl("" + l) + '"][type="radio"]'
              ),
                l = 0;
              l < e.length;
              l++
            ) {
              var a = e[l];
              if (a !== t && a.form === t.form) {
                var n = a[tl] || null;
                if (!n) throw Error(r(90));
                ei(
                  a,
                  n.value,
                  n.defaultValue,
                  n.defaultValue,
                  n.checked,
                  n.defaultChecked,
                  n.type,
                  n.name
                );
              }
            }
            for (l = 0; l < e.length; l++)
              (a = e[l]), a.form === t.form && Rf(a);
          }
          break t;
        case "textarea":
          Yf(t, e.value, e.defaultValue);
          break t;
        case "select":
          (l = e.value), l != null && We(t, !!e.multiple, l, !1);
      }
    }
  }
  var ci = !1;
  function Zf(t, l, e) {
    if (ci) return t(l, e);
    ci = !0;
    try {
      var a = t(l);
      return a;
    } finally {
      if (
        ((ci = !1),
        (Ie !== null || Pe !== null) &&
          (Su(), Ie && ((l = Ie), (t = Pe), (Pe = Ie = null), Qf(l), t)))
      )
        for (l = 0; l < t.length; l++) Qf(t[l]);
    }
  }
  function Ha(t, l) {
    var e = t.stateNode;
    if (e === null) return null;
    var a = e[tl] || null;
    if (a === null) return null;
    e = a[l];
    t: switch (l) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        (a = !a.disabled) ||
          ((t = t.type),
          (a = !(
            t === "button" ||
            t === "input" ||
            t === "select" ||
            t === "textarea"
          ))),
          (t = !a);
        break t;
      default:
        t = !1;
    }
    if (t) return null;
    if (e && typeof e != "function") throw Error(r(231, l, typeof e));
    return e;
  }
  var Yl = !(
      typeof window > "u" ||
      typeof window.document > "u" ||
      typeof window.document.createElement > "u"
    ),
    fi = !1;
  if (Yl)
    try {
      var Ba = {};
      Object.defineProperty(Ba, "passive", {
        get: function () {
          fi = !0;
        },
      }),
        window.addEventListener("test", Ba, Ba),
        window.removeEventListener("test", Ba, Ba);
    } catch {
      fi = !1;
    }
  var ae = null,
    si = null,
    Bn = null;
  function wf() {
    if (Bn) return Bn;
    var t,
      l = si,
      e = l.length,
      a,
      n = "value" in ae ? ae.value : ae.textContent,
      u = n.length;
    for (t = 0; t < e && l[t] === n[t]; t++);
    var i = e - t;
    for (a = 1; a <= i && l[e - a] === n[u - a]; a++);
    return (Bn = n.slice(t, 1 < a ? 1 - a : void 0));
  }
  function Rn(t) {
    var l = t.keyCode;
    return (
      "charCode" in t
        ? ((t = t.charCode), t === 0 && l === 13 && (t = 13))
        : (t = l),
      t === 10 && (t = 13),
      32 <= t || t === 13 ? t : 0
    );
  }
  function qn() {
    return !0;
  }
  function Vf() {
    return !1;
  }
  function ll(t) {
    function l(e, a, n, u, i) {
      (this._reactName = e),
        (this._targetInst = n),
        (this.type = a),
        (this.nativeEvent = u),
        (this.target = i),
        (this.currentTarget = null);
      for (var c in t)
        t.hasOwnProperty(c) && ((e = t[c]), (this[c] = e ? e(u) : u[c]));
      return (
        (this.isDefaultPrevented = (
          u.defaultPrevented != null ? u.defaultPrevented : u.returnValue === !1
        )
          ? qn
          : Vf),
        (this.isPropagationStopped = Vf),
        this
      );
    }
    return (
      j(l.prototype, {
        preventDefault: function () {
          this.defaultPrevented = !0;
          var e = this.nativeEvent;
          e &&
            (e.preventDefault
              ? e.preventDefault()
              : typeof e.returnValue != "unknown" && (e.returnValue = !1),
            (this.isDefaultPrevented = qn));
        },
        stopPropagation: function () {
          var e = this.nativeEvent;
          e &&
            (e.stopPropagation
              ? e.stopPropagation()
              : typeof e.cancelBubble != "unknown" && (e.cancelBubble = !0),
            (this.isPropagationStopped = qn));
        },
        persist: function () {},
        isPersistent: qn,
      }),
      l
    );
  }
  var De = {
      eventPhase: 0,
      bubbles: 0,
      cancelable: 0,
      timeStamp: function (t) {
        return t.timeStamp || Date.now();
      },
      defaultPrevented: 0,
      isTrusted: 0,
    },
    Yn = ll(De),
    Ra = j({}, De, { view: 0, detail: 0 }),
    im = ll(Ra),
    oi,
    ri,
    qa,
    Gn = j({}, Ra, {
      screenX: 0,
      screenY: 0,
      clientX: 0,
      clientY: 0,
      pageX: 0,
      pageY: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      getModifierState: mi,
      button: 0,
      buttons: 0,
      relatedTarget: function (t) {
        return t.relatedTarget === void 0
          ? t.fromElement === t.srcElement
            ? t.toElement
            : t.fromElement
          : t.relatedTarget;
      },
      movementX: function (t) {
        return "movementX" in t
          ? t.movementX
          : (t !== qa &&
              (qa && t.type === "mousemove"
                ? ((oi = t.screenX - qa.screenX), (ri = t.screenY - qa.screenY))
                : (ri = oi = 0),
              (qa = t)),
            oi);
      },
      movementY: function (t) {
        return "movementY" in t ? t.movementY : ri;
      },
    }),
    Kf = ll(Gn),
    cm = j({}, Gn, { dataTransfer: 0 }),
    fm = ll(cm),
    sm = j({}, Ra, { relatedTarget: 0 }),
    di = ll(sm),
    om = j({}, De, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }),
    rm = ll(om),
    dm = j({}, De, {
      clipboardData: function (t) {
        return "clipboardData" in t ? t.clipboardData : window.clipboardData;
      },
    }),
    mm = ll(dm),
    hm = j({}, De, { data: 0 }),
    Jf = ll(hm),
    gm = {
      Esc: "Escape",
      Spacebar: " ",
      Left: "ArrowLeft",
      Up: "ArrowUp",
      Right: "ArrowRight",
      Down: "ArrowDown",
      Del: "Delete",
      Win: "OS",
      Menu: "ContextMenu",
      Apps: "ContextMenu",
      Scroll: "ScrollLock",
      MozPrintableKey: "Unidentified",
    },
    vm = {
      8: "Backspace",
      9: "Tab",
      12: "Clear",
      13: "Enter",
      16: "Shift",
      17: "Control",
      18: "Alt",
      19: "Pause",
      20: "CapsLock",
      27: "Escape",
      32: " ",
      33: "PageUp",
      34: "PageDown",
      35: "End",
      36: "Home",
      37: "ArrowLeft",
      38: "ArrowUp",
      39: "ArrowRight",
      40: "ArrowDown",
      45: "Insert",
      46: "Delete",
      112: "F1",
      113: "F2",
      114: "F3",
      115: "F4",
      116: "F5",
      117: "F6",
      118: "F7",
      119: "F8",
      120: "F9",
      121: "F10",
      122: "F11",
      123: "F12",
      144: "NumLock",
      145: "ScrollLock",
      224: "Meta",
    },
    ym = {
      Alt: "altKey",
      Control: "ctrlKey",
      Meta: "metaKey",
      Shift: "shiftKey",
    };
  function bm(t) {
    var l = this.nativeEvent;
    return l.getModifierState
      ? l.getModifierState(t)
      : (t = ym[t])
      ? !!l[t]
      : !1;
  }
  function mi() {
    return bm;
  }
  var pm = j({}, Ra, {
      key: function (t) {
        if (t.key) {
          var l = gm[t.key] || t.key;
          if (l !== "Unidentified") return l;
        }
        return t.type === "keypress"
          ? ((t = Rn(t)), t === 13 ? "Enter" : String.fromCharCode(t))
          : t.type === "keydown" || t.type === "keyup"
          ? vm[t.keyCode] || "Unidentified"
          : "";
      },
      code: 0,
      location: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      repeat: 0,
      locale: 0,
      getModifierState: mi,
      charCode: function (t) {
        return t.type === "keypress" ? Rn(t) : 0;
      },
      keyCode: function (t) {
        return t.type === "keydown" || t.type === "keyup" ? t.keyCode : 0;
      },
      which: function (t) {
        return t.type === "keypress"
          ? Rn(t)
          : t.type === "keydown" || t.type === "keyup"
          ? t.keyCode
          : 0;
      },
    }),
    xm = ll(pm),
    Sm = j({}, Gn, {
      pointerId: 0,
      width: 0,
      height: 0,
      pressure: 0,
      tangentialPressure: 0,
      tiltX: 0,
      tiltY: 0,
      twist: 0,
      pointerType: 0,
      isPrimary: 0,
    }),
    $f = ll(Sm),
    Tm = j({}, Ra, {
      touches: 0,
      targetTouches: 0,
      changedTouches: 0,
      altKey: 0,
      metaKey: 0,
      ctrlKey: 0,
      shiftKey: 0,
      getModifierState: mi,
    }),
    Em = ll(Tm),
    Nm = j({}, De, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }),
    Am = ll(Nm),
    jm = j({}, Gn, {
      deltaX: function (t) {
        return "deltaX" in t
          ? t.deltaX
          : "wheelDeltaX" in t
          ? -t.wheelDeltaX
          : 0;
      },
      deltaY: function (t) {
        return "deltaY" in t
          ? t.deltaY
          : "wheelDeltaY" in t
          ? -t.wheelDeltaY
          : "wheelDelta" in t
          ? -t.wheelDelta
          : 0;
      },
      deltaZ: 0,
      deltaMode: 0,
    }),
    zm = ll(jm),
    _m = j({}, De, { newState: 0, oldState: 0 }),
    Dm = ll(_m),
    Mm = [9, 13, 27, 32],
    hi = Yl && "CompositionEvent" in window,
    Ya = null;
  Yl && "documentMode" in document && (Ya = document.documentMode);
  var Om = Yl && "TextEvent" in window && !Ya,
    kf = Yl && (!hi || (Ya && 8 < Ya && 11 >= Ya)),
    Wf = " ",
    Ff = !1;
  function If(t, l) {
    switch (t) {
      case "keyup":
        return Mm.indexOf(l.keyCode) !== -1;
      case "keydown":
        return l.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function Pf(t) {
    return (t = t.detail), typeof t == "object" && "data" in t ? t.data : null;
  }
  var ta = !1;
  function Cm(t, l) {
    switch (t) {
      case "compositionend":
        return Pf(l);
      case "keypress":
        return l.which !== 32 ? null : ((Ff = !0), Wf);
      case "textInput":
        return (t = l.data), t === Wf && Ff ? null : t;
      default:
        return null;
    }
  }
  function Um(t, l) {
    if (ta)
      return t === "compositionend" || (!hi && If(t, l))
        ? ((t = wf()), (Bn = si = ae = null), (ta = !1), t)
        : null;
    switch (t) {
      case "paste":
        return null;
      case "keypress":
        if (!(l.ctrlKey || l.altKey || l.metaKey) || (l.ctrlKey && l.altKey)) {
          if (l.char && 1 < l.char.length) return l.char;
          if (l.which) return String.fromCharCode(l.which);
        }
        return null;
      case "compositionend":
        return kf && l.locale !== "ko" ? null : l.data;
      default:
        return null;
    }
  }
  var Hm = {
    color: !0,
    date: !0,
    datetime: !0,
    "datetime-local": !0,
    email: !0,
    month: !0,
    number: !0,
    password: !0,
    range: !0,
    search: !0,
    tel: !0,
    text: !0,
    time: !0,
    url: !0,
    week: !0,
  };
  function ts(t) {
    var l = t && t.nodeName && t.nodeName.toLowerCase();
    return l === "input" ? !!Hm[t.type] : l === "textarea";
  }
  function ls(t, l, e, a) {
    Ie ? (Pe ? Pe.push(a) : (Pe = [a])) : (Ie = a),
      (l = _u(l, "onChange")),
      0 < l.length &&
        ((e = new Yn("onChange", "change", null, e, a)),
        t.push({ event: e, listeners: l }));
  }
  var Ga = null,
    Xa = null;
  function Bm(t) {
    Yr(t, 0);
  }
  function Xn(t) {
    var l = Ua(t);
    if (Rf(l)) return t;
  }
  function es(t, l) {
    if (t === "change") return l;
  }
  var as = !1;
  if (Yl) {
    var gi;
    if (Yl) {
      var vi = "oninput" in document;
      if (!vi) {
        var ns = document.createElement("div");
        ns.setAttribute("oninput", "return;"),
          (vi = typeof ns.oninput == "function");
      }
      gi = vi;
    } else gi = !1;
    as = gi && (!document.documentMode || 9 < document.documentMode);
  }
  function us() {
    Ga && (Ga.detachEvent("onpropertychange", is), (Xa = Ga = null));
  }
  function is(t) {
    if (t.propertyName === "value" && Xn(Xa)) {
      var l = [];
      ls(l, Xa, t, ii(t)), Zf(Bm, l);
    }
  }
  function Rm(t, l, e) {
    t === "focusin"
      ? (us(), (Ga = l), (Xa = e), Ga.attachEvent("onpropertychange", is))
      : t === "focusout" && us();
  }
  function qm(t) {
    if (t === "selectionchange" || t === "keyup" || t === "keydown")
      return Xn(Xa);
  }
  function Ym(t, l) {
    if (t === "click") return Xn(l);
  }
  function Gm(t, l) {
    if (t === "input" || t === "change") return Xn(l);
  }
  function Xm(t, l) {
    return (t === l && (t !== 0 || 1 / t === 1 / l)) || (t !== t && l !== l);
  }
  var ol = typeof Object.is == "function" ? Object.is : Xm;
  function La(t, l) {
    if (ol(t, l)) return !0;
    if (
      typeof t != "object" ||
      t === null ||
      typeof l != "object" ||
      l === null
    )
      return !1;
    var e = Object.keys(t),
      a = Object.keys(l);
    if (e.length !== a.length) return !1;
    for (a = 0; a < e.length; a++) {
      var n = e[a];
      if (!Ju.call(l, n) || !ol(t[n], l[n])) return !1;
    }
    return !0;
  }
  function cs(t) {
    for (; t && t.firstChild; ) t = t.firstChild;
    return t;
  }
  function fs(t, l) {
    var e = cs(t);
    t = 0;
    for (var a; e; ) {
      if (e.nodeType === 3) {
        if (((a = t + e.textContent.length), t <= l && a >= l))
          return { node: e, offset: l - t };
        t = a;
      }
      t: {
        for (; e; ) {
          if (e.nextSibling) {
            e = e.nextSibling;
            break t;
          }
          e = e.parentNode;
        }
        e = void 0;
      }
      e = cs(e);
    }
  }
  function ss(t, l) {
    return t && l
      ? t === l
        ? !0
        : t && t.nodeType === 3
        ? !1
        : l && l.nodeType === 3
        ? ss(t, l.parentNode)
        : "contains" in t
        ? t.contains(l)
        : t.compareDocumentPosition
        ? !!(t.compareDocumentPosition(l) & 16)
        : !1
      : !1;
  }
  function os(t) {
    t =
      t != null &&
      t.ownerDocument != null &&
      t.ownerDocument.defaultView != null
        ? t.ownerDocument.defaultView
        : window;
    for (var l = Un(t.document); l instanceof t.HTMLIFrameElement; ) {
      try {
        var e = typeof l.contentWindow.location.href == "string";
      } catch {
        e = !1;
      }
      if (e) t = l.contentWindow;
      else break;
      l = Un(t.document);
    }
    return l;
  }
  function yi(t) {
    var l = t && t.nodeName && t.nodeName.toLowerCase();
    return (
      l &&
      ((l === "input" &&
        (t.type === "text" ||
          t.type === "search" ||
          t.type === "tel" ||
          t.type === "url" ||
          t.type === "password")) ||
        l === "textarea" ||
        t.contentEditable === "true")
    );
  }
  var Lm = Yl && "documentMode" in document && 11 >= document.documentMode,
    la = null,
    bi = null,
    Qa = null,
    pi = !1;
  function rs(t, l, e) {
    var a =
      e.window === e ? e.document : e.nodeType === 9 ? e : e.ownerDocument;
    pi ||
      la == null ||
      la !== Un(a) ||
      ((a = la),
      "selectionStart" in a && yi(a)
        ? (a = { start: a.selectionStart, end: a.selectionEnd })
        : ((a = (
            (a.ownerDocument && a.ownerDocument.defaultView) ||
            window
          ).getSelection()),
          (a = {
            anchorNode: a.anchorNode,
            anchorOffset: a.anchorOffset,
            focusNode: a.focusNode,
            focusOffset: a.focusOffset,
          })),
      (Qa && La(Qa, a)) ||
        ((Qa = a),
        (a = _u(bi, "onSelect")),
        0 < a.length &&
          ((l = new Yn("onSelect", "select", null, l, e)),
          t.push({ event: l, listeners: a }),
          (l.target = la))));
  }
  function Me(t, l) {
    var e = {};
    return (
      (e[t.toLowerCase()] = l.toLowerCase()),
      (e["Webkit" + t] = "webkit" + l),
      (e["Moz" + t] = "moz" + l),
      e
    );
  }
  var ea = {
      animationend: Me("Animation", "AnimationEnd"),
      animationiteration: Me("Animation", "AnimationIteration"),
      animationstart: Me("Animation", "AnimationStart"),
      transitionrun: Me("Transition", "TransitionRun"),
      transitionstart: Me("Transition", "TransitionStart"),
      transitioncancel: Me("Transition", "TransitionCancel"),
      transitionend: Me("Transition", "TransitionEnd"),
    },
    xi = {},
    ds = {};
  Yl &&
    ((ds = document.createElement("div").style),
    "AnimationEvent" in window ||
      (delete ea.animationend.animation,
      delete ea.animationiteration.animation,
      delete ea.animationstart.animation),
    "TransitionEvent" in window || delete ea.transitionend.transition);
  function Oe(t) {
    if (xi[t]) return xi[t];
    if (!ea[t]) return t;
    var l = ea[t],
      e;
    for (e in l) if (l.hasOwnProperty(e) && e in ds) return (xi[t] = l[e]);
    return t;
  }
  var ms = Oe("animationend"),
    hs = Oe("animationiteration"),
    gs = Oe("animationstart"),
    Qm = Oe("transitionrun"),
    Zm = Oe("transitionstart"),
    wm = Oe("transitioncancel"),
    vs = Oe("transitionend"),
    ys = new Map(),
    Si =
      "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
        " "
      );
  Si.push("scrollEnd");
  function zl(t, l) {
    ys.set(t, l), _e(l, [t]);
  }
  var Ln =
      typeof reportError == "function"
        ? reportError
        : function (t) {
            if (
              typeof window == "object" &&
              typeof window.ErrorEvent == "function"
            ) {
              var l = new window.ErrorEvent("error", {
                bubbles: !0,
                cancelable: !0,
                message:
                  typeof t == "object" &&
                  t !== null &&
                  typeof t.message == "string"
                    ? String(t.message)
                    : String(t),
                error: t,
              });
              if (!window.dispatchEvent(l)) return;
            } else if (
              typeof process == "object" &&
              typeof process.emit == "function"
            ) {
              process.emit("uncaughtException", t);
              return;
            }
            console.error(t);
          },
    pl = [],
    aa = 0,
    Ti = 0;
  function Qn() {
    for (var t = aa, l = (Ti = aa = 0); l < t; ) {
      var e = pl[l];
      pl[l++] = null;
      var a = pl[l];
      pl[l++] = null;
      var n = pl[l];
      pl[l++] = null;
      var u = pl[l];
      if (((pl[l++] = null), a !== null && n !== null)) {
        var i = a.pending;
        i === null ? (n.next = n) : ((n.next = i.next), (i.next = n)),
          (a.pending = n);
      }
      u !== 0 && bs(e, n, u);
    }
  }
  function Zn(t, l, e, a) {
    (pl[aa++] = t),
      (pl[aa++] = l),
      (pl[aa++] = e),
      (pl[aa++] = a),
      (Ti |= a),
      (t.lanes |= a),
      (t = t.alternate),
      t !== null && (t.lanes |= a);
  }
  function Ei(t, l, e, a) {
    return Zn(t, l, e, a), wn(t);
  }
  function Ce(t, l) {
    return Zn(t, null, null, l), wn(t);
  }
  function bs(t, l, e) {
    t.lanes |= e;
    var a = t.alternate;
    a !== null && (a.lanes |= e);
    for (var n = !1, u = t.return; u !== null; )
      (u.childLanes |= e),
        (a = u.alternate),
        a !== null && (a.childLanes |= e),
        u.tag === 22 &&
          ((t = u.stateNode), t === null || t._visibility & 1 || (n = !0)),
        (t = u),
        (u = u.return);
    return t.tag === 3
      ? ((u = t.stateNode),
        n &&
          l !== null &&
          ((n = 31 - sl(e)),
          (t = u.hiddenUpdates),
          (a = t[n]),
          a === null ? (t[n] = [l]) : a.push(l),
          (l.lane = e | 536870912)),
        u)
      : null;
  }
  function wn(t) {
    if (50 < rn) throw ((rn = 0), (Cc = null), Error(r(185)));
    for (var l = t.return; l !== null; ) (t = l), (l = t.return);
    return t.tag === 3 ? t.stateNode : null;
  }
  var na = {};
  function Vm(t, l, e, a) {
    (this.tag = t),
      (this.key = e),
      (this.sibling =
        this.child =
        this.return =
        this.stateNode =
        this.type =
        this.elementType =
          null),
      (this.index = 0),
      (this.refCleanup = this.ref = null),
      (this.pendingProps = l),
      (this.dependencies =
        this.memoizedState =
        this.updateQueue =
        this.memoizedProps =
          null),
      (this.mode = a),
      (this.subtreeFlags = this.flags = 0),
      (this.deletions = null),
      (this.childLanes = this.lanes = 0),
      (this.alternate = null);
  }
  function rl(t, l, e, a) {
    return new Vm(t, l, e, a);
  }
  function Ni(t) {
    return (t = t.prototype), !(!t || !t.isReactComponent);
  }
  function Gl(t, l) {
    var e = t.alternate;
    return (
      e === null
        ? ((e = rl(t.tag, l, t.key, t.mode)),
          (e.elementType = t.elementType),
          (e.type = t.type),
          (e.stateNode = t.stateNode),
          (e.alternate = t),
          (t.alternate = e))
        : ((e.pendingProps = l),
          (e.type = t.type),
          (e.flags = 0),
          (e.subtreeFlags = 0),
          (e.deletions = null)),
      (e.flags = t.flags & 65011712),
      (e.childLanes = t.childLanes),
      (e.lanes = t.lanes),
      (e.child = t.child),
      (e.memoizedProps = t.memoizedProps),
      (e.memoizedState = t.memoizedState),
      (e.updateQueue = t.updateQueue),
      (l = t.dependencies),
      (e.dependencies =
        l === null ? null : { lanes: l.lanes, firstContext: l.firstContext }),
      (e.sibling = t.sibling),
      (e.index = t.index),
      (e.ref = t.ref),
      (e.refCleanup = t.refCleanup),
      e
    );
  }
  function ps(t, l) {
    t.flags &= 65011714;
    var e = t.alternate;
    return (
      e === null
        ? ((t.childLanes = 0),
          (t.lanes = l),
          (t.child = null),
          (t.subtreeFlags = 0),
          (t.memoizedProps = null),
          (t.memoizedState = null),
          (t.updateQueue = null),
          (t.dependencies = null),
          (t.stateNode = null))
        : ((t.childLanes = e.childLanes),
          (t.lanes = e.lanes),
          (t.child = e.child),
          (t.subtreeFlags = 0),
          (t.deletions = null),
          (t.memoizedProps = e.memoizedProps),
          (t.memoizedState = e.memoizedState),
          (t.updateQueue = e.updateQueue),
          (t.type = e.type),
          (l = e.dependencies),
          (t.dependencies =
            l === null
              ? null
              : { lanes: l.lanes, firstContext: l.firstContext })),
      t
    );
  }
  function Vn(t, l, e, a, n, u) {
    var i = 0;
    if (((a = t), typeof t == "function")) Ni(t) && (i = 1);
    else if (typeof t == "string")
      i = Wh(t, e, H.current)
        ? 26
        : t === "html" || t === "head" || t === "body"
        ? 27
        : 5;
    else
      t: switch (t) {
        case st:
          return (t = rl(31, e, l, n)), (t.elementType = st), (t.lanes = u), t;
        case dt:
          return Ue(e.children, n, u, l);
        case Mt:
          (i = 8), (n |= 24);
          break;
        case bt:
          return (
            (t = rl(12, e, l, n | 2)), (t.elementType = bt), (t.lanes = u), t
          );
        case Y:
          return (t = rl(13, e, l, n)), (t.elementType = Y), (t.lanes = u), t;
        case X:
          return (t = rl(19, e, l, n)), (t.elementType = X), (t.lanes = u), t;
        default:
          if (typeof t == "object" && t !== null)
            switch (t.$$typeof) {
              case ft:
                i = 10;
                break t;
              case Dt:
                i = 9;
                break t;
              case St:
                i = 11;
                break t;
              case O:
                i = 14;
                break t;
              case lt:
                (i = 16), (a = null);
                break t;
            }
          (i = 29),
            (e = Error(r(130, t === null ? "null" : typeof t, ""))),
            (a = null);
      }
    return (
      (l = rl(i, e, l, n)), (l.elementType = t), (l.type = a), (l.lanes = u), l
    );
  }
  function Ue(t, l, e, a) {
    return (t = rl(7, t, a, l)), (t.lanes = e), t;
  }
  function Ai(t, l, e) {
    return (t = rl(6, t, null, l)), (t.lanes = e), t;
  }
  function xs(t) {
    var l = rl(18, null, null, 0);
    return (l.stateNode = t), l;
  }
  function ji(t, l, e) {
    return (
      (l = rl(4, t.children !== null ? t.children : [], t.key, l)),
      (l.lanes = e),
      (l.stateNode = {
        containerInfo: t.containerInfo,
        pendingChildren: null,
        implementation: t.implementation,
      }),
      l
    );
  }
  var Ss = new WeakMap();
  function xl(t, l) {
    if (typeof t == "object" && t !== null) {
      var e = Ss.get(t);
      return e !== void 0
        ? e
        : ((l = { value: t, source: l, stack: xf(l) }), Ss.set(t, l), l);
    }
    return { value: t, source: l, stack: xf(l) };
  }
  var ua = [],
    ia = 0,
    Kn = null,
    Za = 0,
    Sl = [],
    Tl = 0,
    ne = null,
    Ml = 1,
    Ol = "";
  function Xl(t, l) {
    (ua[ia++] = Za), (ua[ia++] = Kn), (Kn = t), (Za = l);
  }
  function Ts(t, l, e) {
    (Sl[Tl++] = Ml), (Sl[Tl++] = Ol), (Sl[Tl++] = ne), (ne = t);
    var a = Ml;
    t = Ol;
    var n = 32 - sl(a) - 1;
    (a &= ~(1 << n)), (e += 1);
    var u = 32 - sl(l) + n;
    if (30 < u) {
      var i = n - (n % 5);
      (u = (a & ((1 << i) - 1)).toString(32)),
        (a >>= i),
        (n -= i),
        (Ml = (1 << (32 - sl(l) + n)) | (e << n) | a),
        (Ol = u + t);
    } else (Ml = (1 << u) | (e << n) | a), (Ol = t);
  }
  function zi(t) {
    t.return !== null && (Xl(t, 1), Ts(t, 1, 0));
  }
  function _i(t) {
    for (; t === Kn; )
      (Kn = ua[--ia]), (ua[ia] = null), (Za = ua[--ia]), (ua[ia] = null);
    for (; t === ne; )
      (ne = Sl[--Tl]),
        (Sl[Tl] = null),
        (Ol = Sl[--Tl]),
        (Sl[Tl] = null),
        (Ml = Sl[--Tl]),
        (Sl[Tl] = null);
  }
  function Es(t, l) {
    (Sl[Tl++] = Ml),
      (Sl[Tl++] = Ol),
      (Sl[Tl++] = ne),
      (Ml = l.id),
      (Ol = l.overflow),
      (ne = t);
  }
  var $t = null,
    jt = null,
    mt = !1,
    ue = null,
    El = !1,
    Di = Error(r(519));
  function ie(t) {
    var l = Error(
      r(
        418,
        1 < arguments.length && arguments[1] !== void 0 && arguments[1]
          ? "text"
          : "HTML",
        ""
      )
    );
    throw (wa(xl(l, t)), Di);
  }
  function Ns(t) {
    var l = t.stateNode,
      e = t.type,
      a = t.memoizedProps;
    switch (((l[Jt] = t), (l[tl] = a), e)) {
      case "dialog":
        ct("cancel", l), ct("close", l);
        break;
      case "iframe":
      case "object":
      case "embed":
        ct("load", l);
        break;
      case "video":
      case "audio":
        for (e = 0; e < mn.length; e++) ct(mn[e], l);
        break;
      case "source":
        ct("error", l);
        break;
      case "img":
      case "image":
      case "link":
        ct("error", l), ct("load", l);
        break;
      case "details":
        ct("toggle", l);
        break;
      case "input":
        ct("invalid", l),
          qf(
            l,
            a.value,
            a.defaultValue,
            a.checked,
            a.defaultChecked,
            a.type,
            a.name,
            !0
          );
        break;
      case "select":
        ct("invalid", l);
        break;
      case "textarea":
        ct("invalid", l), Gf(l, a.value, a.defaultValue, a.children);
    }
    (e = a.children),
      (typeof e != "string" && typeof e != "number" && typeof e != "bigint") ||
      l.textContent === "" + e ||
      a.suppressHydrationWarning === !0 ||
      Qr(l.textContent, e)
        ? (a.popover != null && (ct("beforetoggle", l), ct("toggle", l)),
          a.onScroll != null && ct("scroll", l),
          a.onScrollEnd != null && ct("scrollend", l),
          a.onClick != null && (l.onclick = ql),
          (l = !0))
        : (l = !1),
      l || ie(t, !0);
  }
  function As(t) {
    for ($t = t.return; $t; )
      switch ($t.tag) {
        case 5:
        case 31:
        case 13:
          El = !1;
          return;
        case 27:
        case 3:
          El = !0;
          return;
        default:
          $t = $t.return;
      }
  }
  function ca(t) {
    if (t !== $t) return !1;
    if (!mt) return As(t), (mt = !0), !1;
    var l = t.tag,
      e;
    if (
      ((e = l !== 3 && l !== 27) &&
        ((e = l === 5) &&
          ((e = t.type),
          (e =
            !(e !== "form" && e !== "button") || Jc(t.type, t.memoizedProps))),
        (e = !e)),
      e && jt && ie(t),
      As(t),
      l === 13)
    ) {
      if (((t = t.memoizedState), (t = t !== null ? t.dehydrated : null), !t))
        throw Error(r(317));
      jt = Fr(t);
    } else if (l === 31) {
      if (((t = t.memoizedState), (t = t !== null ? t.dehydrated : null), !t))
        throw Error(r(317));
      jt = Fr(t);
    } else
      l === 27
        ? ((l = jt), xe(t.type) ? ((t = Ic), (Ic = null), (jt = t)) : (jt = l))
        : (jt = $t ? Al(t.stateNode.nextSibling) : null);
    return !0;
  }
  function He() {
    (jt = $t = null), (mt = !1);
  }
  function Mi() {
    var t = ue;
    return (
      t !== null &&
        (ul === null ? (ul = t) : ul.push.apply(ul, t), (ue = null)),
      t
    );
  }
  function wa(t) {
    ue === null ? (ue = [t]) : ue.push(t);
  }
  var Oi = s(null),
    Be = null,
    Ll = null;
  function ce(t, l, e) {
    _(Oi, l._currentValue), (l._currentValue = e);
  }
  function Ql(t) {
    (t._currentValue = Oi.current), S(Oi);
  }
  function Ci(t, l, e) {
    for (; t !== null; ) {
      var a = t.alternate;
      if (
        ((t.childLanes & l) !== l
          ? ((t.childLanes |= l), a !== null && (a.childLanes |= l))
          : a !== null && (a.childLanes & l) !== l && (a.childLanes |= l),
        t === e)
      )
        break;
      t = t.return;
    }
  }
  function Ui(t, l, e, a) {
    var n = t.child;
    for (n !== null && (n.return = t); n !== null; ) {
      var u = n.dependencies;
      if (u !== null) {
        var i = n.child;
        u = u.firstContext;
        t: for (; u !== null; ) {
          var c = u;
          u = n;
          for (var o = 0; o < l.length; o++)
            if (c.context === l[o]) {
              (u.lanes |= e),
                (c = u.alternate),
                c !== null && (c.lanes |= e),
                Ci(u.return, e, t),
                a || (i = null);
              break t;
            }
          u = c.next;
        }
      } else if (n.tag === 18) {
        if (((i = n.return), i === null)) throw Error(r(341));
        (i.lanes |= e),
          (u = i.alternate),
          u !== null && (u.lanes |= e),
          Ci(i, e, t),
          (i = null);
      } else i = n.child;
      if (i !== null) i.return = n;
      else
        for (i = n; i !== null; ) {
          if (i === t) {
            i = null;
            break;
          }
          if (((n = i.sibling), n !== null)) {
            (n.return = i.return), (i = n);
            break;
          }
          i = i.return;
        }
      n = i;
    }
  }
  function fa(t, l, e, a) {
    t = null;
    for (var n = l, u = !1; n !== null; ) {
      if (!u) {
        if ((n.flags & 524288) !== 0) u = !0;
        else if ((n.flags & 262144) !== 0) break;
      }
      if (n.tag === 10) {
        var i = n.alternate;
        if (i === null) throw Error(r(387));
        if (((i = i.memoizedProps), i !== null)) {
          var c = n.type;
          ol(n.pendingProps.value, i.value) ||
            (t !== null ? t.push(c) : (t = [c]));
        }
      } else if (n === at.current) {
        if (((i = n.alternate), i === null)) throw Error(r(387));
        i.memoizedState.memoizedState !== n.memoizedState.memoizedState &&
          (t !== null ? t.push(bn) : (t = [bn]));
      }
      n = n.return;
    }
    t !== null && Ui(l, t, e, a), (l.flags |= 262144);
  }
  function Jn(t) {
    for (t = t.firstContext; t !== null; ) {
      if (!ol(t.context._currentValue, t.memoizedValue)) return !0;
      t = t.next;
    }
    return !1;
  }
  function Re(t) {
    (Be = t),
      (Ll = null),
      (t = t.dependencies),
      t !== null && (t.firstContext = null);
  }
  function kt(t) {
    return js(Be, t);
  }
  function $n(t, l) {
    return Be === null && Re(t), js(t, l);
  }
  function js(t, l) {
    var e = l._currentValue;
    if (((l = { context: l, memoizedValue: e, next: null }), Ll === null)) {
      if (t === null) throw Error(r(308));
      (Ll = l),
        (t.dependencies = { lanes: 0, firstContext: l }),
        (t.flags |= 524288);
    } else Ll = Ll.next = l;
    return e;
  }
  var Km =
      typeof AbortController < "u"
        ? AbortController
        : function () {
            var t = [],
              l = (this.signal = {
                aborted: !1,
                addEventListener: function (e, a) {
                  t.push(a);
                },
              });
            this.abort = function () {
              (l.aborted = !0),
                t.forEach(function (e) {
                  return e();
                });
            };
          },
    Jm = h.unstable_scheduleCallback,
    $m = h.unstable_NormalPriority,
    Gt = {
      $$typeof: ft,
      Consumer: null,
      Provider: null,
      _currentValue: null,
      _currentValue2: null,
      _threadCount: 0,
    };
  function Hi() {
    return { controller: new Km(), data: new Map(), refCount: 0 };
  }
  function Va(t) {
    t.refCount--,
      t.refCount === 0 &&
        Jm($m, function () {
          t.controller.abort();
        });
  }
  var Ka = null,
    Bi = 0,
    sa = 0,
    oa = null;
  function km(t, l) {
    if (Ka === null) {
      var e = (Ka = []);
      (Bi = 0),
        (sa = Yc()),
        (oa = {
          status: "pending",
          value: void 0,
          then: function (a) {
            e.push(a);
          },
        });
    }
    return Bi++, l.then(zs, zs), l;
  }
  function zs() {
    if (--Bi === 0 && Ka !== null) {
      oa !== null && (oa.status = "fulfilled");
      var t = Ka;
      (Ka = null), (sa = 0), (oa = null);
      for (var l = 0; l < t.length; l++) (0, t[l])();
    }
  }
  function Wm(t, l) {
    var e = [],
      a = {
        status: "pending",
        value: null,
        reason: null,
        then: function (n) {
          e.push(n);
        },
      };
    return (
      t.then(
        function () {
          (a.status = "fulfilled"), (a.value = l);
          for (var n = 0; n < e.length; n++) (0, e[n])(l);
        },
        function (n) {
          for (a.status = "rejected", a.reason = n, n = 0; n < e.length; n++)
            (0, e[n])(void 0);
        }
      ),
      a
    );
  }
  var _s = g.S;
  g.S = function (t, l) {
    (dr = cl()),
      typeof l == "object" &&
        l !== null &&
        typeof l.then == "function" &&
        km(t, l),
      _s !== null && _s(t, l);
  };
  var qe = s(null);
  function Ri() {
    var t = qe.current;
    return t !== null ? t : At.pooledCache;
  }
  function kn(t, l) {
    l === null ? _(qe, qe.current) : _(qe, l.pool);
  }
  function Ds() {
    var t = Ri();
    return t === null ? null : { parent: Gt._currentValue, pool: t };
  }
  var ra = Error(r(460)),
    qi = Error(r(474)),
    Wn = Error(r(542)),
    Fn = { then: function () {} };
  function Ms(t) {
    return (t = t.status), t === "fulfilled" || t === "rejected";
  }
  function Os(t, l, e) {
    switch (
      ((e = t[e]),
      e === void 0 ? t.push(l) : e !== l && (l.then(ql, ql), (l = e)),
      l.status)
    ) {
      case "fulfilled":
        return l.value;
      case "rejected":
        throw ((t = l.reason), Us(t), t);
      default:
        if (typeof l.status == "string") l.then(ql, ql);
        else {
          if (((t = At), t !== null && 100 < t.shellSuspendCounter))
            throw Error(r(482));
          (t = l),
            (t.status = "pending"),
            t.then(
              function (a) {
                if (l.status === "pending") {
                  var n = l;
                  (n.status = "fulfilled"), (n.value = a);
                }
              },
              function (a) {
                if (l.status === "pending") {
                  var n = l;
                  (n.status = "rejected"), (n.reason = a);
                }
              }
            );
        }
        switch (l.status) {
          case "fulfilled":
            return l.value;
          case "rejected":
            throw ((t = l.reason), Us(t), t);
        }
        throw ((Ge = l), ra);
    }
  }
  function Ye(t) {
    try {
      var l = t._init;
      return l(t._payload);
    } catch (e) {
      throw e !== null && typeof e == "object" && typeof e.then == "function"
        ? ((Ge = e), ra)
        : e;
    }
  }
  var Ge = null;
  function Cs() {
    if (Ge === null) throw Error(r(459));
    var t = Ge;
    return (Ge = null), t;
  }
  function Us(t) {
    if (t === ra || t === Wn) throw Error(r(483));
  }
  var da = null,
    Ja = 0;
  function In(t) {
    var l = Ja;
    return (Ja += 1), da === null && (da = []), Os(da, t, l);
  }
  function $a(t, l) {
    (l = l.props.ref), (t.ref = l !== void 0 ? l : null);
  }
  function Pn(t, l) {
    throw l.$$typeof === V
      ? Error(r(525))
      : ((t = Object.prototype.toString.call(l)),
        Error(
          r(
            31,
            t === "[object Object]"
              ? "object with keys {" + Object.keys(l).join(", ") + "}"
              : t
          )
        ));
  }
  function Hs(t) {
    function l(m, d) {
      if (t) {
        var v = m.deletions;
        v === null ? ((m.deletions = [d]), (m.flags |= 16)) : v.push(d);
      }
    }
    function e(m, d) {
      if (!t) return null;
      for (; d !== null; ) l(m, d), (d = d.sibling);
      return null;
    }
    function a(m) {
      for (var d = new Map(); m !== null; )
        m.key !== null ? d.set(m.key, m) : d.set(m.index, m), (m = m.sibling);
      return d;
    }
    function n(m, d) {
      return (m = Gl(m, d)), (m.index = 0), (m.sibling = null), m;
    }
    function u(m, d, v) {
      return (
        (m.index = v),
        t
          ? ((v = m.alternate),
            v !== null
              ? ((v = v.index), v < d ? ((m.flags |= 67108866), d) : v)
              : ((m.flags |= 67108866), d))
          : ((m.flags |= 1048576), d)
      );
    }
    function i(m) {
      return t && m.alternate === null && (m.flags |= 67108866), m;
    }
    function c(m, d, v, E) {
      return d === null || d.tag !== 6
        ? ((d = Ai(v, m.mode, E)), (d.return = m), d)
        : ((d = n(d, v)), (d.return = m), d);
    }
    function o(m, d, v, E) {
      var w = v.type;
      return w === dt
        ? T(m, d, v.props.children, E, v.key)
        : d !== null &&
          (d.elementType === w ||
            (typeof w == "object" &&
              w !== null &&
              w.$$typeof === lt &&
              Ye(w) === d.type))
        ? ((d = n(d, v.props)), $a(d, v), (d.return = m), d)
        : ((d = Vn(v.type, v.key, v.props, null, m.mode, E)),
          $a(d, v),
          (d.return = m),
          d);
    }
    function y(m, d, v, E) {
      return d === null ||
        d.tag !== 4 ||
        d.stateNode.containerInfo !== v.containerInfo ||
        d.stateNode.implementation !== v.implementation
        ? ((d = ji(v, m.mode, E)), (d.return = m), d)
        : ((d = n(d, v.children || [])), (d.return = m), d);
    }
    function T(m, d, v, E, w) {
      return d === null || d.tag !== 7
        ? ((d = Ue(v, m.mode, E, w)), (d.return = m), d)
        : ((d = n(d, v)), (d.return = m), d);
    }
    function N(m, d, v) {
      if (
        (typeof d == "string" && d !== "") ||
        typeof d == "number" ||
        typeof d == "bigint"
      )
        return (d = Ai("" + d, m.mode, v)), (d.return = m), d;
      if (typeof d == "object" && d !== null) {
        switch (d.$$typeof) {
          case nt:
            return (
              (v = Vn(d.type, d.key, d.props, null, m.mode, v)),
              $a(v, d),
              (v.return = m),
              v
            );
          case I:
            return (d = ji(d, m.mode, v)), (d.return = m), d;
          case lt:
            return (d = Ye(d)), N(m, d, v);
        }
        if (K(d) || Ct(d))
          return (d = Ue(d, m.mode, v, null)), (d.return = m), d;
        if (typeof d.then == "function") return N(m, In(d), v);
        if (d.$$typeof === ft) return N(m, $n(m, d), v);
        Pn(m, d);
      }
      return null;
    }
    function b(m, d, v, E) {
      var w = d !== null ? d.key : null;
      if (
        (typeof v == "string" && v !== "") ||
        typeof v == "number" ||
        typeof v == "bigint"
      )
        return w !== null ? null : c(m, d, "" + v, E);
      if (typeof v == "object" && v !== null) {
        switch (v.$$typeof) {
          case nt:
            return v.key === w ? o(m, d, v, E) : null;
          case I:
            return v.key === w ? y(m, d, v, E) : null;
          case lt:
            return (v = Ye(v)), b(m, d, v, E);
        }
        if (K(v) || Ct(v)) return w !== null ? null : T(m, d, v, E, null);
        if (typeof v.then == "function") return b(m, d, In(v), E);
        if (v.$$typeof === ft) return b(m, d, $n(m, v), E);
        Pn(m, v);
      }
      return null;
    }
    function x(m, d, v, E, w) {
      if (
        (typeof E == "string" && E !== "") ||
        typeof E == "number" ||
        typeof E == "bigint"
      )
        return (m = m.get(v) || null), c(d, m, "" + E, w);
      if (typeof E == "object" && E !== null) {
        switch (E.$$typeof) {
          case nt:
            return (
              (m = m.get(E.key === null ? v : E.key) || null), o(d, m, E, w)
            );
          case I:
            return (
              (m = m.get(E.key === null ? v : E.key) || null), y(d, m, E, w)
            );
          case lt:
            return (E = Ye(E)), x(m, d, v, E, w);
        }
        if (K(E) || Ct(E)) return (m = m.get(v) || null), T(d, m, E, w, null);
        if (typeof E.then == "function") return x(m, d, v, In(E), w);
        if (E.$$typeof === ft) return x(m, d, v, $n(d, E), w);
        Pn(d, E);
      }
      return null;
    }
    function L(m, d, v, E) {
      for (
        var w = null, ht = null, Q = d, tt = (d = 0), rt = null;
        Q !== null && tt < v.length;
        tt++
      ) {
        Q.index > tt ? ((rt = Q), (Q = null)) : (rt = Q.sibling);
        var gt = b(m, Q, v[tt], E);
        if (gt === null) {
          Q === null && (Q = rt);
          break;
        }
        t && Q && gt.alternate === null && l(m, Q),
          (d = u(gt, d, tt)),
          ht === null ? (w = gt) : (ht.sibling = gt),
          (ht = gt),
          (Q = rt);
      }
      if (tt === v.length) return e(m, Q), mt && Xl(m, tt), w;
      if (Q === null) {
        for (; tt < v.length; tt++)
          (Q = N(m, v[tt], E)),
            Q !== null &&
              ((d = u(Q, d, tt)),
              ht === null ? (w = Q) : (ht.sibling = Q),
              (ht = Q));
        return mt && Xl(m, tt), w;
      }
      for (Q = a(Q); tt < v.length; tt++)
        (rt = x(Q, m, tt, v[tt], E)),
          rt !== null &&
            (t &&
              rt.alternate !== null &&
              Q.delete(rt.key === null ? tt : rt.key),
            (d = u(rt, d, tt)),
            ht === null ? (w = rt) : (ht.sibling = rt),
            (ht = rt));
      return (
        t &&
          Q.forEach(function (Ae) {
            return l(m, Ae);
          }),
        mt && Xl(m, tt),
        w
      );
    }
    function $(m, d, v, E) {
      if (v == null) throw Error(r(151));
      for (
        var w = null, ht = null, Q = d, tt = (d = 0), rt = null, gt = v.next();
        Q !== null && !gt.done;
        tt++, gt = v.next()
      ) {
        Q.index > tt ? ((rt = Q), (Q = null)) : (rt = Q.sibling);
        var Ae = b(m, Q, gt.value, E);
        if (Ae === null) {
          Q === null && (Q = rt);
          break;
        }
        t && Q && Ae.alternate === null && l(m, Q),
          (d = u(Ae, d, tt)),
          ht === null ? (w = Ae) : (ht.sibling = Ae),
          (ht = Ae),
          (Q = rt);
      }
      if (gt.done) return e(m, Q), mt && Xl(m, tt), w;
      if (Q === null) {
        for (; !gt.done; tt++, gt = v.next())
          (gt = N(m, gt.value, E)),
            gt !== null &&
              ((d = u(gt, d, tt)),
              ht === null ? (w = gt) : (ht.sibling = gt),
              (ht = gt));
        return mt && Xl(m, tt), w;
      }
      for (Q = a(Q); !gt.done; tt++, gt = v.next())
        (gt = x(Q, m, tt, gt.value, E)),
          gt !== null &&
            (t &&
              gt.alternate !== null &&
              Q.delete(gt.key === null ? tt : gt.key),
            (d = u(gt, d, tt)),
            ht === null ? (w = gt) : (ht.sibling = gt),
            (ht = gt));
      return (
        t &&
          Q.forEach(function (c0) {
            return l(m, c0);
          }),
        mt && Xl(m, tt),
        w
      );
    }
    function Nt(m, d, v, E) {
      if (
        (typeof v == "object" &&
          v !== null &&
          v.type === dt &&
          v.key === null &&
          (v = v.props.children),
        typeof v == "object" && v !== null)
      ) {
        switch (v.$$typeof) {
          case nt:
            t: {
              for (var w = v.key; d !== null; ) {
                if (d.key === w) {
                  if (((w = v.type), w === dt)) {
                    if (d.tag === 7) {
                      e(m, d.sibling),
                        (E = n(d, v.props.children)),
                        (E.return = m),
                        (m = E);
                      break t;
                    }
                  } else if (
                    d.elementType === w ||
                    (typeof w == "object" &&
                      w !== null &&
                      w.$$typeof === lt &&
                      Ye(w) === d.type)
                  ) {
                    e(m, d.sibling),
                      (E = n(d, v.props)),
                      $a(E, v),
                      (E.return = m),
                      (m = E);
                    break t;
                  }
                  e(m, d);
                  break;
                } else l(m, d);
                d = d.sibling;
              }
              v.type === dt
                ? ((E = Ue(v.props.children, m.mode, E, v.key)),
                  (E.return = m),
                  (m = E))
                : ((E = Vn(v.type, v.key, v.props, null, m.mode, E)),
                  $a(E, v),
                  (E.return = m),
                  (m = E));
            }
            return i(m);
          case I:
            t: {
              for (w = v.key; d !== null; ) {
                if (d.key === w)
                  if (
                    d.tag === 4 &&
                    d.stateNode.containerInfo === v.containerInfo &&
                    d.stateNode.implementation === v.implementation
                  ) {
                    e(m, d.sibling),
                      (E = n(d, v.children || [])),
                      (E.return = m),
                      (m = E);
                    break t;
                  } else {
                    e(m, d);
                    break;
                  }
                else l(m, d);
                d = d.sibling;
              }
              (E = ji(v, m.mode, E)), (E.return = m), (m = E);
            }
            return i(m);
          case lt:
            return (v = Ye(v)), Nt(m, d, v, E);
        }
        if (K(v)) return L(m, d, v, E);
        if (Ct(v)) {
          if (((w = Ct(v)), typeof w != "function")) throw Error(r(150));
          return (v = w.call(v)), $(m, d, v, E);
        }
        if (typeof v.then == "function") return Nt(m, d, In(v), E);
        if (v.$$typeof === ft) return Nt(m, d, $n(m, v), E);
        Pn(m, v);
      }
      return (typeof v == "string" && v !== "") ||
        typeof v == "number" ||
        typeof v == "bigint"
        ? ((v = "" + v),
          d !== null && d.tag === 6
            ? (e(m, d.sibling), (E = n(d, v)), (E.return = m), (m = E))
            : (e(m, d), (E = Ai(v, m.mode, E)), (E.return = m), (m = E)),
          i(m))
        : e(m, d);
    }
    return function (m, d, v, E) {
      try {
        Ja = 0;
        var w = Nt(m, d, v, E);
        return (da = null), w;
      } catch (Q) {
        if (Q === ra || Q === Wn) throw Q;
        var ht = rl(29, Q, null, m.mode);
        return (ht.lanes = E), (ht.return = m), ht;
      } finally {
      }
    };
  }
  var Xe = Hs(!0),
    Bs = Hs(!1),
    fe = !1;
  function Yi(t) {
    t.updateQueue = {
      baseState: t.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null,
    };
  }
  function Gi(t, l) {
    (t = t.updateQueue),
      l.updateQueue === t &&
        (l.updateQueue = {
          baseState: t.baseState,
          firstBaseUpdate: t.firstBaseUpdate,
          lastBaseUpdate: t.lastBaseUpdate,
          shared: t.shared,
          callbacks: null,
        });
  }
  function se(t) {
    return { lane: t, tag: 0, payload: null, callback: null, next: null };
  }
  function oe(t, l, e) {
    var a = t.updateQueue;
    if (a === null) return null;
    if (((a = a.shared), (vt & 2) !== 0)) {
      var n = a.pending;
      return (
        n === null ? (l.next = l) : ((l.next = n.next), (n.next = l)),
        (a.pending = l),
        (l = wn(t)),
        bs(t, null, e),
        l
      );
    }
    return Zn(t, a, l, e), wn(t);
  }
  function ka(t, l, e) {
    if (
      ((l = l.updateQueue), l !== null && ((l = l.shared), (e & 4194048) !== 0))
    ) {
      var a = l.lanes;
      (a &= t.pendingLanes), (e |= a), (l.lanes = e), jf(t, e);
    }
  }
  function Xi(t, l) {
    var e = t.updateQueue,
      a = t.alternate;
    if (a !== null && ((a = a.updateQueue), e === a)) {
      var n = null,
        u = null;
      if (((e = e.firstBaseUpdate), e !== null)) {
        do {
          var i = {
            lane: e.lane,
            tag: e.tag,
            payload: e.payload,
            callback: null,
            next: null,
          };
          u === null ? (n = u = i) : (u = u.next = i), (e = e.next);
        } while (e !== null);
        u === null ? (n = u = l) : (u = u.next = l);
      } else n = u = l;
      (e = {
        baseState: a.baseState,
        firstBaseUpdate: n,
        lastBaseUpdate: u,
        shared: a.shared,
        callbacks: a.callbacks,
      }),
        (t.updateQueue = e);
      return;
    }
    (t = e.lastBaseUpdate),
      t === null ? (e.firstBaseUpdate = l) : (t.next = l),
      (e.lastBaseUpdate = l);
  }
  var Li = !1;
  function Wa() {
    if (Li) {
      var t = oa;
      if (t !== null) throw t;
    }
  }
  function Fa(t, l, e, a) {
    Li = !1;
    var n = t.updateQueue;
    fe = !1;
    var u = n.firstBaseUpdate,
      i = n.lastBaseUpdate,
      c = n.shared.pending;
    if (c !== null) {
      n.shared.pending = null;
      var o = c,
        y = o.next;
      (o.next = null), i === null ? (u = y) : (i.next = y), (i = o);
      var T = t.alternate;
      T !== null &&
        ((T = T.updateQueue),
        (c = T.lastBaseUpdate),
        c !== i &&
          (c === null ? (T.firstBaseUpdate = y) : (c.next = y),
          (T.lastBaseUpdate = o)));
    }
    if (u !== null) {
      var N = n.baseState;
      (i = 0), (T = y = o = null), (c = u);
      do {
        var b = c.lane & -536870913,
          x = b !== c.lane;
        if (x ? (ot & b) === b : (a & b) === b) {
          b !== 0 && b === sa && (Li = !0),
            T !== null &&
              (T = T.next =
                {
                  lane: 0,
                  tag: c.tag,
                  payload: c.payload,
                  callback: null,
                  next: null,
                });
          t: {
            var L = t,
              $ = c;
            b = l;
            var Nt = e;
            switch ($.tag) {
              case 1:
                if (((L = $.payload), typeof L == "function")) {
                  N = L.call(Nt, N, b);
                  break t;
                }
                N = L;
                break t;
              case 3:
                L.flags = (L.flags & -65537) | 128;
              case 0:
                if (
                  ((L = $.payload),
                  (b = typeof L == "function" ? L.call(Nt, N, b) : L),
                  b == null)
                )
                  break t;
                N = j({}, N, b);
                break t;
              case 2:
                fe = !0;
            }
          }
          (b = c.callback),
            b !== null &&
              ((t.flags |= 64),
              x && (t.flags |= 8192),
              (x = n.callbacks),
              x === null ? (n.callbacks = [b]) : x.push(b));
        } else
          (x = {
            lane: b,
            tag: c.tag,
            payload: c.payload,
            callback: c.callback,
            next: null,
          }),
            T === null ? ((y = T = x), (o = N)) : (T = T.next = x),
            (i |= b);
        if (((c = c.next), c === null)) {
          if (((c = n.shared.pending), c === null)) break;
          (x = c),
            (c = x.next),
            (x.next = null),
            (n.lastBaseUpdate = x),
            (n.shared.pending = null);
        }
      } while (!0);
      T === null && (o = N),
        (n.baseState = o),
        (n.firstBaseUpdate = y),
        (n.lastBaseUpdate = T),
        u === null && (n.shared.lanes = 0),
        (ge |= i),
        (t.lanes = i),
        (t.memoizedState = N);
    }
  }
  function Rs(t, l) {
    if (typeof t != "function") throw Error(r(191, t));
    t.call(l);
  }
  function qs(t, l) {
    var e = t.callbacks;
    if (e !== null)
      for (t.callbacks = null, t = 0; t < e.length; t++) Rs(e[t], l);
  }
  var ma = s(null),
    tu = s(0);
  function Ys(t, l) {
    (t = Fl), _(tu, t), _(ma, l), (Fl = t | l.baseLanes);
  }
  function Qi() {
    _(tu, Fl), _(ma, ma.current);
  }
  function Zi() {
    (Fl = tu.current), S(ma), S(tu);
  }
  var dl = s(null),
    Nl = null;
  function re(t) {
    var l = t.alternate;
    _(Rt, Rt.current & 1),
      _(dl, t),
      Nl === null &&
        (l === null || ma.current !== null || l.memoizedState !== null) &&
        (Nl = t);
  }
  function wi(t) {
    _(Rt, Rt.current), _(dl, t), Nl === null && (Nl = t);
  }
  function Gs(t) {
    t.tag === 22
      ? (_(Rt, Rt.current), _(dl, t), Nl === null && (Nl = t))
      : de();
  }
  function de() {
    _(Rt, Rt.current), _(dl, dl.current);
  }
  function ml(t) {
    S(dl), Nl === t && (Nl = null), S(Rt);
  }
  var Rt = s(0);
  function lu(t) {
    for (var l = t; l !== null; ) {
      if (l.tag === 13) {
        var e = l.memoizedState;
        if (e !== null && ((e = e.dehydrated), e === null || Wc(e) || Fc(e)))
          return l;
      } else if (
        l.tag === 19 &&
        (l.memoizedProps.revealOrder === "forwards" ||
          l.memoizedProps.revealOrder === "backwards" ||
          l.memoizedProps.revealOrder === "unstable_legacy-backwards" ||
          l.memoizedProps.revealOrder === "together")
      ) {
        if ((l.flags & 128) !== 0) return l;
      } else if (l.child !== null) {
        (l.child.return = l), (l = l.child);
        continue;
      }
      if (l === t) break;
      for (; l.sibling === null; ) {
        if (l.return === null || l.return === t) return null;
        l = l.return;
      }
      (l.sibling.return = l.return), (l = l.sibling);
    }
    return null;
  }
  var Zl = 0,
    P = null,
    Tt = null,
    Xt = null,
    eu = !1,
    ha = !1,
    Le = !1,
    au = 0,
    Ia = 0,
    ga = null,
    Fm = 0;
  function Ht() {
    throw Error(r(321));
  }
  function Vi(t, l) {
    if (l === null) return !1;
    for (var e = 0; e < l.length && e < t.length; e++)
      if (!ol(t[e], l[e])) return !1;
    return !0;
  }
  function Ki(t, l, e, a, n, u) {
    return (
      (Zl = u),
      (P = l),
      (l.memoizedState = null),
      (l.updateQueue = null),
      (l.lanes = 0),
      (g.H = t === null || t.memoizedState === null ? Eo : cc),
      (Le = !1),
      (u = e(a, n)),
      (Le = !1),
      ha && (u = Ls(l, e, a, n)),
      Xs(t),
      u
    );
  }
  function Xs(t) {
    g.H = ln;
    var l = Tt !== null && Tt.next !== null;
    if (((Zl = 0), (Xt = Tt = P = null), (eu = !1), (Ia = 0), (ga = null), l))
      throw Error(r(300));
    t === null ||
      Lt ||
      ((t = t.dependencies), t !== null && Jn(t) && (Lt = !0));
  }
  function Ls(t, l, e, a) {
    P = t;
    var n = 0;
    do {
      if ((ha && (ga = null), (Ia = 0), (ha = !1), 25 <= n))
        throw Error(r(301));
      if (((n += 1), (Xt = Tt = null), t.updateQueue != null)) {
        var u = t.updateQueue;
        (u.lastEffect = null),
          (u.events = null),
          (u.stores = null),
          u.memoCache != null && (u.memoCache.index = 0);
      }
      (g.H = No), (u = l(e, a));
    } while (ha);
    return u;
  }
  function Im() {
    var t = g.H,
      l = t.useState()[0];
    return (
      (l = typeof l.then == "function" ? Pa(l) : l),
      (t = t.useState()[0]),
      (Tt !== null ? Tt.memoizedState : null) !== t && (P.flags |= 1024),
      l
    );
  }
  function Ji() {
    var t = au !== 0;
    return (au = 0), t;
  }
  function $i(t, l, e) {
    (l.updateQueue = t.updateQueue), (l.flags &= -2053), (t.lanes &= ~e);
  }
  function ki(t) {
    if (eu) {
      for (t = t.memoizedState; t !== null; ) {
        var l = t.queue;
        l !== null && (l.pending = null), (t = t.next);
      }
      eu = !1;
    }
    (Zl = 0), (Xt = Tt = P = null), (ha = !1), (Ia = au = 0), (ga = null);
  }
  function Pt() {
    var t = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null,
    };
    return Xt === null ? (P.memoizedState = Xt = t) : (Xt = Xt.next = t), Xt;
  }
  function qt() {
    if (Tt === null) {
      var t = P.alternate;
      t = t !== null ? t.memoizedState : null;
    } else t = Tt.next;
    var l = Xt === null ? P.memoizedState : Xt.next;
    if (l !== null) (Xt = l), (Tt = t);
    else {
      if (t === null)
        throw P.alternate === null ? Error(r(467)) : Error(r(310));
      (Tt = t),
        (t = {
          memoizedState: Tt.memoizedState,
          baseState: Tt.baseState,
          baseQueue: Tt.baseQueue,
          queue: Tt.queue,
          next: null,
        }),
        Xt === null ? (P.memoizedState = Xt = t) : (Xt = Xt.next = t);
    }
    return Xt;
  }
  function nu() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function Pa(t) {
    var l = Ia;
    return (
      (Ia += 1),
      ga === null && (ga = []),
      (t = Os(ga, t, l)),
      (l = P),
      (Xt === null ? l.memoizedState : Xt.next) === null &&
        ((l = l.alternate),
        (g.H = l === null || l.memoizedState === null ? Eo : cc)),
      t
    );
  }
  function uu(t) {
    if (t !== null && typeof t == "object") {
      if (typeof t.then == "function") return Pa(t);
      if (t.$$typeof === ft) return kt(t);
    }
    throw Error(r(438, String(t)));
  }
  function Wi(t) {
    var l = null,
      e = P.updateQueue;
    if ((e !== null && (l = e.memoCache), l == null)) {
      var a = P.alternate;
      a !== null &&
        ((a = a.updateQueue),
        a !== null &&
          ((a = a.memoCache),
          a != null &&
            (l = {
              data: a.data.map(function (n) {
                return n.slice();
              }),
              index: 0,
            })));
    }
    if (
      (l == null && (l = { data: [], index: 0 }),
      e === null && ((e = nu()), (P.updateQueue = e)),
      (e.memoCache = l),
      (e = l.data[l.index]),
      e === void 0)
    )
      for (e = l.data[l.index] = Array(t), a = 0; a < t; a++) e[a] = Ot;
    return l.index++, e;
  }
  function wl(t, l) {
    return typeof l == "function" ? l(t) : l;
  }
  function iu(t) {
    var l = qt();
    return Fi(l, Tt, t);
  }
  function Fi(t, l, e) {
    var a = t.queue;
    if (a === null) throw Error(r(311));
    a.lastRenderedReducer = e;
    var n = t.baseQueue,
      u = a.pending;
    if (u !== null) {
      if (n !== null) {
        var i = n.next;
        (n.next = u.next), (u.next = i);
      }
      (l.baseQueue = n = u), (a.pending = null);
    }
    if (((u = t.baseState), n === null)) t.memoizedState = u;
    else {
      l = n.next;
      var c = (i = null),
        o = null,
        y = l,
        T = !1;
      do {
        var N = y.lane & -536870913;
        if (N !== y.lane ? (ot & N) === N : (Zl & N) === N) {
          var b = y.revertLane;
          if (b === 0)
            o !== null &&
              (o = o.next =
                {
                  lane: 0,
                  revertLane: 0,
                  gesture: null,
                  action: y.action,
                  hasEagerState: y.hasEagerState,
                  eagerState: y.eagerState,
                  next: null,
                }),
              N === sa && (T = !0);
          else if ((Zl & b) === b) {
            (y = y.next), b === sa && (T = !0);
            continue;
          } else
            (N = {
              lane: 0,
              revertLane: y.revertLane,
              gesture: null,
              action: y.action,
              hasEagerState: y.hasEagerState,
              eagerState: y.eagerState,
              next: null,
            }),
              o === null ? ((c = o = N), (i = u)) : (o = o.next = N),
              (P.lanes |= b),
              (ge |= b);
          (N = y.action),
            Le && e(u, N),
            (u = y.hasEagerState ? y.eagerState : e(u, N));
        } else
          (b = {
            lane: N,
            revertLane: y.revertLane,
            gesture: y.gesture,
            action: y.action,
            hasEagerState: y.hasEagerState,
            eagerState: y.eagerState,
            next: null,
          }),
            o === null ? ((c = o = b), (i = u)) : (o = o.next = b),
            (P.lanes |= N),
            (ge |= N);
        y = y.next;
      } while (y !== null && y !== l);
      if (
        (o === null ? (i = u) : (o.next = c),
        !ol(u, t.memoizedState) && ((Lt = !0), T && ((e = oa), e !== null)))
      )
        throw e;
      (t.memoizedState = u),
        (t.baseState = i),
        (t.baseQueue = o),
        (a.lastRenderedState = u);
    }
    return n === null && (a.lanes = 0), [t.memoizedState, a.dispatch];
  }
  function Ii(t) {
    var l = qt(),
      e = l.queue;
    if (e === null) throw Error(r(311));
    e.lastRenderedReducer = t;
    var a = e.dispatch,
      n = e.pending,
      u = l.memoizedState;
    if (n !== null) {
      e.pending = null;
      var i = (n = n.next);
      do (u = t(u, i.action)), (i = i.next);
      while (i !== n);
      ol(u, l.memoizedState) || (Lt = !0),
        (l.memoizedState = u),
        l.baseQueue === null && (l.baseState = u),
        (e.lastRenderedState = u);
    }
    return [u, a];
  }
  function Qs(t, l, e) {
    var a = P,
      n = qt(),
      u = mt;
    if (u) {
      if (e === void 0) throw Error(r(407));
      e = e();
    } else e = l();
    var i = !ol((Tt || n).memoizedState, e);
    if (
      (i && ((n.memoizedState = e), (Lt = !0)),
      (n = n.queue),
      lc(Vs.bind(null, a, n, t), [t]),
      n.getSnapshot !== l || i || (Xt !== null && Xt.memoizedState.tag & 1))
    ) {
      if (
        ((a.flags |= 2048),
        va(9, { destroy: void 0 }, ws.bind(null, a, n, e, l), null),
        At === null)
      )
        throw Error(r(349));
      u || (Zl & 127) !== 0 || Zs(a, l, e);
    }
    return e;
  }
  function Zs(t, l, e) {
    (t.flags |= 16384),
      (t = { getSnapshot: l, value: e }),
      (l = P.updateQueue),
      l === null
        ? ((l = nu()), (P.updateQueue = l), (l.stores = [t]))
        : ((e = l.stores), e === null ? (l.stores = [t]) : e.push(t));
  }
  function ws(t, l, e, a) {
    (l.value = e), (l.getSnapshot = a), Ks(l) && Js(t);
  }
  function Vs(t, l, e) {
    return e(function () {
      Ks(l) && Js(t);
    });
  }
  function Ks(t) {
    var l = t.getSnapshot;
    t = t.value;
    try {
      var e = l();
      return !ol(t, e);
    } catch {
      return !0;
    }
  }
  function Js(t) {
    var l = Ce(t, 2);
    l !== null && il(l, t, 2);
  }
  function Pi(t) {
    var l = Pt();
    if (typeof t == "function") {
      var e = t;
      if (((t = e()), Le)) {
        le(!0);
        try {
          e();
        } finally {
          le(!1);
        }
      }
    }
    return (
      (l.memoizedState = l.baseState = t),
      (l.queue = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: wl,
        lastRenderedState: t,
      }),
      l
    );
  }
  function $s(t, l, e, a) {
    return (t.baseState = e), Fi(t, Tt, typeof a == "function" ? a : wl);
  }
  function Pm(t, l, e, a, n) {
    if (su(t)) throw Error(r(485));
    if (((t = l.action), t !== null)) {
      var u = {
        payload: n,
        action: t,
        next: null,
        isTransition: !0,
        status: "pending",
        value: null,
        reason: null,
        listeners: [],
        then: function (i) {
          u.listeners.push(i);
        },
      };
      g.T !== null ? e(!0) : (u.isTransition = !1),
        a(u),
        (e = l.pending),
        e === null
          ? ((u.next = l.pending = u), ks(l, u))
          : ((u.next = e.next), (l.pending = e.next = u));
    }
  }
  function ks(t, l) {
    var e = l.action,
      a = l.payload,
      n = t.state;
    if (l.isTransition) {
      var u = g.T,
        i = {};
      g.T = i;
      try {
        var c = e(n, a),
          o = g.S;
        o !== null && o(i, c), Ws(t, l, c);
      } catch (y) {
        tc(t, l, y);
      } finally {
        u !== null && i.types !== null && (u.types = i.types), (g.T = u);
      }
    } else
      try {
        (u = e(n, a)), Ws(t, l, u);
      } catch (y) {
        tc(t, l, y);
      }
  }
  function Ws(t, l, e) {
    e !== null && typeof e == "object" && typeof e.then == "function"
      ? e.then(
          function (a) {
            Fs(t, l, a);
          },
          function (a) {
            return tc(t, l, a);
          }
        )
      : Fs(t, l, e);
  }
  function Fs(t, l, e) {
    (l.status = "fulfilled"),
      (l.value = e),
      Is(l),
      (t.state = e),
      (l = t.pending),
      l !== null &&
        ((e = l.next),
        e === l ? (t.pending = null) : ((e = e.next), (l.next = e), ks(t, e)));
  }
  function tc(t, l, e) {
    var a = t.pending;
    if (((t.pending = null), a !== null)) {
      a = a.next;
      do (l.status = "rejected"), (l.reason = e), Is(l), (l = l.next);
      while (l !== a);
    }
    t.action = null;
  }
  function Is(t) {
    t = t.listeners;
    for (var l = 0; l < t.length; l++) (0, t[l])();
  }
  function Ps(t, l) {
    return l;
  }
  function to(t, l) {
    if (mt) {
      var e = At.formState;
      if (e !== null) {
        t: {
          var a = P;
          if (mt) {
            if (jt) {
              l: {
                for (var n = jt, u = El; n.nodeType !== 8; ) {
                  if (!u) {
                    n = null;
                    break l;
                  }
                  if (((n = Al(n.nextSibling)), n === null)) {
                    n = null;
                    break l;
                  }
                }
                (u = n.data), (n = u === "F!" || u === "F" ? n : null);
              }
              if (n) {
                (jt = Al(n.nextSibling)), (a = n.data === "F!");
                break t;
              }
            }
            ie(a);
          }
          a = !1;
        }
        a && (l = e[0]);
      }
    }
    return (
      (e = Pt()),
      (e.memoizedState = e.baseState = l),
      (a = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Ps,
        lastRenderedState: l,
      }),
      (e.queue = a),
      (e = xo.bind(null, P, a)),
      (a.dispatch = e),
      (a = Pi(!1)),
      (u = ic.bind(null, P, !1, a.queue)),
      (a = Pt()),
      (n = { state: l, dispatch: null, action: t, pending: null }),
      (a.queue = n),
      (e = Pm.bind(null, P, n, u, e)),
      (n.dispatch = e),
      (a.memoizedState = t),
      [l, e, !1]
    );
  }
  function lo(t) {
    var l = qt();
    return eo(l, Tt, t);
  }
  function eo(t, l, e) {
    if (
      ((l = Fi(t, l, Ps)[0]),
      (t = iu(wl)[0]),
      typeof l == "object" && l !== null && typeof l.then == "function")
    )
      try {
        var a = Pa(l);
      } catch (i) {
        throw i === ra ? Wn : i;
      }
    else a = l;
    l = qt();
    var n = l.queue,
      u = n.dispatch;
    return (
      e !== l.memoizedState &&
        ((P.flags |= 2048),
        va(9, { destroy: void 0 }, th.bind(null, n, e), null)),
      [a, u, t]
    );
  }
  function th(t, l) {
    t.action = l;
  }
  function ao(t) {
    var l = qt(),
      e = Tt;
    if (e !== null) return eo(l, e, t);
    qt(), (l = l.memoizedState), (e = qt());
    var a = e.queue.dispatch;
    return (e.memoizedState = t), [l, a, !1];
  }
  function va(t, l, e, a) {
    return (
      (t = { tag: t, create: e, deps: a, inst: l, next: null }),
      (l = P.updateQueue),
      l === null && ((l = nu()), (P.updateQueue = l)),
      (e = l.lastEffect),
      e === null
        ? (l.lastEffect = t.next = t)
        : ((a = e.next), (e.next = t), (t.next = a), (l.lastEffect = t)),
      t
    );
  }
  function no() {
    return qt().memoizedState;
  }
  function cu(t, l, e, a) {
    var n = Pt();
    (P.flags |= t),
      (n.memoizedState = va(
        1 | l,
        { destroy: void 0 },
        e,
        a === void 0 ? null : a
      ));
  }
  function fu(t, l, e, a) {
    var n = qt();
    a = a === void 0 ? null : a;
    var u = n.memoizedState.inst;
    Tt !== null && a !== null && Vi(a, Tt.memoizedState.deps)
      ? (n.memoizedState = va(l, u, e, a))
      : ((P.flags |= t), (n.memoizedState = va(1 | l, u, e, a)));
  }
  function uo(t, l) {
    cu(8390656, 8, t, l);
  }
  function lc(t, l) {
    fu(2048, 8, t, l);
  }
  function lh(t) {
    P.flags |= 4;
    var l = P.updateQueue;
    if (l === null) (l = nu()), (P.updateQueue = l), (l.events = [t]);
    else {
      var e = l.events;
      e === null ? (l.events = [t]) : e.push(t);
    }
  }
  function io(t) {
    var l = qt().memoizedState;
    return (
      lh({ ref: l, nextImpl: t }),
      function () {
        if ((vt & 2) !== 0) throw Error(r(440));
        return l.impl.apply(void 0, arguments);
      }
    );
  }
  function co(t, l) {
    return fu(4, 2, t, l);
  }
  function fo(t, l) {
    return fu(4, 4, t, l);
  }
  function so(t, l) {
    if (typeof l == "function") {
      t = t();
      var e = l(t);
      return function () {
        typeof e == "function" ? e() : l(null);
      };
    }
    if (l != null)
      return (
        (t = t()),
        (l.current = t),
        function () {
          l.current = null;
        }
      );
  }
  function oo(t, l, e) {
    (e = e != null ? e.concat([t]) : null), fu(4, 4, so.bind(null, l, t), e);
  }
  function ec() {}
  function ro(t, l) {
    var e = qt();
    l = l === void 0 ? null : l;
    var a = e.memoizedState;
    return l !== null && Vi(l, a[1]) ? a[0] : ((e.memoizedState = [t, l]), t);
  }
  function mo(t, l) {
    var e = qt();
    l = l === void 0 ? null : l;
    var a = e.memoizedState;
    if (l !== null && Vi(l, a[1])) return a[0];
    if (((a = t()), Le)) {
      le(!0);
      try {
        t();
      } finally {
        le(!1);
      }
    }
    return (e.memoizedState = [a, l]), a;
  }
  function ac(t, l, e) {
    return e === void 0 || ((Zl & 1073741824) !== 0 && (ot & 261930) === 0)
      ? (t.memoizedState = l)
      : ((t.memoizedState = e), (t = hr()), (P.lanes |= t), (ge |= t), e);
  }
  function ho(t, l, e, a) {
    return ol(e, l)
      ? e
      : ma.current !== null
      ? ((t = ac(t, e, a)), ol(t, l) || (Lt = !0), t)
      : (Zl & 42) === 0 || ((Zl & 1073741824) !== 0 && (ot & 261930) === 0)
      ? ((Lt = !0), (t.memoizedState = e))
      : ((t = hr()), (P.lanes |= t), (ge |= t), l);
  }
  function go(t, l, e, a, n) {
    var u = A.p;
    A.p = u !== 0 && 8 > u ? u : 8;
    var i = g.T,
      c = {};
    (g.T = c), ic(t, !1, l, e);
    try {
      var o = n(),
        y = g.S;
      if (
        (y !== null && y(c, o),
        o !== null && typeof o == "object" && typeof o.then == "function")
      ) {
        var T = Wm(o, a);
        tn(t, l, T, vl(t));
      } else tn(t, l, a, vl(t));
    } catch (N) {
      tn(t, l, { then: function () {}, status: "rejected", reason: N }, vl());
    } finally {
      (A.p = u),
        i !== null && c.types !== null && (i.types = c.types),
        (g.T = i);
    }
  }
  function eh() {}
  function nc(t, l, e, a) {
    if (t.tag !== 5) throw Error(r(476));
    var n = vo(t).queue;
    go(
      t,
      n,
      l,
      B,
      e === null
        ? eh
        : function () {
            return yo(t), e(a);
          }
    );
  }
  function vo(t) {
    var l = t.memoizedState;
    if (l !== null) return l;
    l = {
      memoizedState: B,
      baseState: B,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: wl,
        lastRenderedState: B,
      },
      next: null,
    };
    var e = {};
    return (
      (l.next = {
        memoizedState: e,
        baseState: e,
        baseQueue: null,
        queue: {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: wl,
          lastRenderedState: e,
        },
        next: null,
      }),
      (t.memoizedState = l),
      (t = t.alternate),
      t !== null && (t.memoizedState = l),
      l
    );
  }
  function yo(t) {
    var l = vo(t);
    l.next === null && (l = t.alternate.memoizedState),
      tn(t, l.next.queue, {}, vl());
  }
  function uc() {
    return kt(bn);
  }
  function bo() {
    return qt().memoizedState;
  }
  function po() {
    return qt().memoizedState;
  }
  function ah(t) {
    for (var l = t.return; l !== null; ) {
      switch (l.tag) {
        case 24:
        case 3:
          var e = vl();
          t = se(e);
          var a = oe(l, t, e);
          a !== null && (il(a, l, e), ka(a, l, e)),
            (l = { cache: Hi() }),
            (t.payload = l);
          return;
      }
      l = l.return;
    }
  }
  function nh(t, l, e) {
    var a = vl();
    (e = {
      lane: a,
      revertLane: 0,
      gesture: null,
      action: e,
      hasEagerState: !1,
      eagerState: null,
      next: null,
    }),
      su(t)
        ? So(l, e)
        : ((e = Ei(t, l, e, a)), e !== null && (il(e, t, a), To(e, l, a)));
  }
  function xo(t, l, e) {
    var a = vl();
    tn(t, l, e, a);
  }
  function tn(t, l, e, a) {
    var n = {
      lane: a,
      revertLane: 0,
      gesture: null,
      action: e,
      hasEagerState: !1,
      eagerState: null,
      next: null,
    };
    if (su(t)) So(l, n);
    else {
      var u = t.alternate;
      if (
        t.lanes === 0 &&
        (u === null || u.lanes === 0) &&
        ((u = l.lastRenderedReducer), u !== null)
      )
        try {
          var i = l.lastRenderedState,
            c = u(i, e);
          if (((n.hasEagerState = !0), (n.eagerState = c), ol(c, i)))
            return Zn(t, l, n, 0), At === null && Qn(), !1;
        } catch {
        } finally {
        }
      if (((e = Ei(t, l, n, a)), e !== null))
        return il(e, t, a), To(e, l, a), !0;
    }
    return !1;
  }
  function ic(t, l, e, a) {
    if (
      ((a = {
        lane: 2,
        revertLane: Yc(),
        gesture: null,
        action: a,
        hasEagerState: !1,
        eagerState: null,
        next: null,
      }),
      su(t))
    ) {
      if (l) throw Error(r(479));
    } else (l = Ei(t, e, a, 2)), l !== null && il(l, t, 2);
  }
  function su(t) {
    var l = t.alternate;
    return t === P || (l !== null && l === P);
  }
  function So(t, l) {
    ha = eu = !0;
    var e = t.pending;
    e === null ? (l.next = l) : ((l.next = e.next), (e.next = l)),
      (t.pending = l);
  }
  function To(t, l, e) {
    if ((e & 4194048) !== 0) {
      var a = l.lanes;
      (a &= t.pendingLanes), (e |= a), (l.lanes = e), jf(t, e);
    }
  }
  var ln = {
    readContext: kt,
    use: uu,
    useCallback: Ht,
    useContext: Ht,
    useEffect: Ht,
    useImperativeHandle: Ht,
    useLayoutEffect: Ht,
    useInsertionEffect: Ht,
    useMemo: Ht,
    useReducer: Ht,
    useRef: Ht,
    useState: Ht,
    useDebugValue: Ht,
    useDeferredValue: Ht,
    useTransition: Ht,
    useSyncExternalStore: Ht,
    useId: Ht,
    useHostTransitionStatus: Ht,
    useFormState: Ht,
    useActionState: Ht,
    useOptimistic: Ht,
    useMemoCache: Ht,
    useCacheRefresh: Ht,
  };
  ln.useEffectEvent = Ht;
  var Eo = {
      readContext: kt,
      use: uu,
      useCallback: function (t, l) {
        return (Pt().memoizedState = [t, l === void 0 ? null : l]), t;
      },
      useContext: kt,
      useEffect: uo,
      useImperativeHandle: function (t, l, e) {
        (e = e != null ? e.concat([t]) : null),
          cu(4194308, 4, so.bind(null, l, t), e);
      },
      useLayoutEffect: function (t, l) {
        return cu(4194308, 4, t, l);
      },
      useInsertionEffect: function (t, l) {
        cu(4, 2, t, l);
      },
      useMemo: function (t, l) {
        var e = Pt();
        l = l === void 0 ? null : l;
        var a = t();
        if (Le) {
          le(!0);
          try {
            t();
          } finally {
            le(!1);
          }
        }
        return (e.memoizedState = [a, l]), a;
      },
      useReducer: function (t, l, e) {
        var a = Pt();
        if (e !== void 0) {
          var n = e(l);
          if (Le) {
            le(!0);
            try {
              e(l);
            } finally {
              le(!1);
            }
          }
        } else n = l;
        return (
          (a.memoizedState = a.baseState = n),
          (t = {
            pending: null,
            lanes: 0,
            dispatch: null,
            lastRenderedReducer: t,
            lastRenderedState: n,
          }),
          (a.queue = t),
          (t = t.dispatch = nh.bind(null, P, t)),
          [a.memoizedState, t]
        );
      },
      useRef: function (t) {
        var l = Pt();
        return (t = { current: t }), (l.memoizedState = t);
      },
      useState: function (t) {
        t = Pi(t);
        var l = t.queue,
          e = xo.bind(null, P, l);
        return (l.dispatch = e), [t.memoizedState, e];
      },
      useDebugValue: ec,
      useDeferredValue: function (t, l) {
        var e = Pt();
        return ac(e, t, l);
      },
      useTransition: function () {
        var t = Pi(!1);
        return (
          (t = go.bind(null, P, t.queue, !0, !1)),
          (Pt().memoizedState = t),
          [!1, t]
        );
      },
      useSyncExternalStore: function (t, l, e) {
        var a = P,
          n = Pt();
        if (mt) {
          if (e === void 0) throw Error(r(407));
          e = e();
        } else {
          if (((e = l()), At === null)) throw Error(r(349));
          (ot & 127) !== 0 || Zs(a, l, e);
        }
        n.memoizedState = e;
        var u = { value: e, getSnapshot: l };
        return (
          (n.queue = u),
          uo(Vs.bind(null, a, u, t), [t]),
          (a.flags |= 2048),
          va(9, { destroy: void 0 }, ws.bind(null, a, u, e, l), null),
          e
        );
      },
      useId: function () {
        var t = Pt(),
          l = At.identifierPrefix;
        if (mt) {
          var e = Ol,
            a = Ml;
          (e = (a & ~(1 << (32 - sl(a) - 1))).toString(32) + e),
            (l = "_" + l + "R_" + e),
            (e = au++),
            0 < e && (l += "H" + e.toString(32)),
            (l += "_");
        } else (e = Fm++), (l = "_" + l + "r_" + e.toString(32) + "_");
        return (t.memoizedState = l);
      },
      useHostTransitionStatus: uc,
      useFormState: to,
      useActionState: to,
      useOptimistic: function (t) {
        var l = Pt();
        l.memoizedState = l.baseState = t;
        var e = {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: null,
          lastRenderedState: null,
        };
        return (
          (l.queue = e), (l = ic.bind(null, P, !0, e)), (e.dispatch = l), [t, l]
        );
      },
      useMemoCache: Wi,
      useCacheRefresh: function () {
        return (Pt().memoizedState = ah.bind(null, P));
      },
      useEffectEvent: function (t) {
        var l = Pt(),
          e = { impl: t };
        return (
          (l.memoizedState = e),
          function () {
            if ((vt & 2) !== 0) throw Error(r(440));
            return e.impl.apply(void 0, arguments);
          }
        );
      },
    },
    cc = {
      readContext: kt,
      use: uu,
      useCallback: ro,
      useContext: kt,
      useEffect: lc,
      useImperativeHandle: oo,
      useInsertionEffect: co,
      useLayoutEffect: fo,
      useMemo: mo,
      useReducer: iu,
      useRef: no,
      useState: function () {
        return iu(wl);
      },
      useDebugValue: ec,
      useDeferredValue: function (t, l) {
        var e = qt();
        return ho(e, Tt.memoizedState, t, l);
      },
      useTransition: function () {
        var t = iu(wl)[0],
          l = qt().memoizedState;
        return [typeof t == "boolean" ? t : Pa(t), l];
      },
      useSyncExternalStore: Qs,
      useId: bo,
      useHostTransitionStatus: uc,
      useFormState: lo,
      useActionState: lo,
      useOptimistic: function (t, l) {
        var e = qt();
        return $s(e, Tt, t, l);
      },
      useMemoCache: Wi,
      useCacheRefresh: po,
    };
  cc.useEffectEvent = io;
  var No = {
    readContext: kt,
    use: uu,
    useCallback: ro,
    useContext: kt,
    useEffect: lc,
    useImperativeHandle: oo,
    useInsertionEffect: co,
    useLayoutEffect: fo,
    useMemo: mo,
    useReducer: Ii,
    useRef: no,
    useState: function () {
      return Ii(wl);
    },
    useDebugValue: ec,
    useDeferredValue: function (t, l) {
      var e = qt();
      return Tt === null ? ac(e, t, l) : ho(e, Tt.memoizedState, t, l);
    },
    useTransition: function () {
      var t = Ii(wl)[0],
        l = qt().memoizedState;
      return [typeof t == "boolean" ? t : Pa(t), l];
    },
    useSyncExternalStore: Qs,
    useId: bo,
    useHostTransitionStatus: uc,
    useFormState: ao,
    useActionState: ao,
    useOptimistic: function (t, l) {
      var e = qt();
      return Tt !== null
        ? $s(e, Tt, t, l)
        : ((e.baseState = t), [t, e.queue.dispatch]);
    },
    useMemoCache: Wi,
    useCacheRefresh: po,
  };
  No.useEffectEvent = io;
  function fc(t, l, e, a) {
    (l = t.memoizedState),
      (e = e(a, l)),
      (e = e == null ? l : j({}, l, e)),
      (t.memoizedState = e),
      t.lanes === 0 && (t.updateQueue.baseState = e);
  }
  var sc = {
    enqueueSetState: function (t, l, e) {
      t = t._reactInternals;
      var a = vl(),
        n = se(a);
      (n.payload = l),
        e != null && (n.callback = e),
        (l = oe(t, n, a)),
        l !== null && (il(l, t, a), ka(l, t, a));
    },
    enqueueReplaceState: function (t, l, e) {
      t = t._reactInternals;
      var a = vl(),
        n = se(a);
      (n.tag = 1),
        (n.payload = l),
        e != null && (n.callback = e),
        (l = oe(t, n, a)),
        l !== null && (il(l, t, a), ka(l, t, a));
    },
    enqueueForceUpdate: function (t, l) {
      t = t._reactInternals;
      var e = vl(),
        a = se(e);
      (a.tag = 2),
        l != null && (a.callback = l),
        (l = oe(t, a, e)),
        l !== null && (il(l, t, e), ka(l, t, e));
    },
  };
  function Ao(t, l, e, a, n, u, i) {
    return (
      (t = t.stateNode),
      typeof t.shouldComponentUpdate == "function"
        ? t.shouldComponentUpdate(a, u, i)
        : l.prototype && l.prototype.isPureReactComponent
        ? !La(e, a) || !La(n, u)
        : !0
    );
  }
  function jo(t, l, e, a) {
    (t = l.state),
      typeof l.componentWillReceiveProps == "function" &&
        l.componentWillReceiveProps(e, a),
      typeof l.UNSAFE_componentWillReceiveProps == "function" &&
        l.UNSAFE_componentWillReceiveProps(e, a),
      l.state !== t && sc.enqueueReplaceState(l, l.state, null);
  }
  function Qe(t, l) {
    var e = l;
    if ("ref" in l) {
      e = {};
      for (var a in l) a !== "ref" && (e[a] = l[a]);
    }
    if ((t = t.defaultProps)) {
      e === l && (e = j({}, e));
      for (var n in t) e[n] === void 0 && (e[n] = t[n]);
    }
    return e;
  }
  function zo(t) {
    Ln(t);
  }
  function _o(t) {
    console.error(t);
  }
  function Do(t) {
    Ln(t);
  }
  function ou(t, l) {
    try {
      var e = t.onUncaughtError;
      e(l.value, { componentStack: l.stack });
    } catch (a) {
      setTimeout(function () {
        throw a;
      });
    }
  }
  function Mo(t, l, e) {
    try {
      var a = t.onCaughtError;
      a(e.value, {
        componentStack: e.stack,
        errorBoundary: l.tag === 1 ? l.stateNode : null,
      });
    } catch (n) {
      setTimeout(function () {
        throw n;
      });
    }
  }
  function oc(t, l, e) {
    return (
      (e = se(e)),
      (e.tag = 3),
      (e.payload = { element: null }),
      (e.callback = function () {
        ou(t, l);
      }),
      e
    );
  }
  function Oo(t) {
    return (t = se(t)), (t.tag = 3), t;
  }
  function Co(t, l, e, a) {
    var n = e.type.getDerivedStateFromError;
    if (typeof n == "function") {
      var u = a.value;
      (t.payload = function () {
        return n(u);
      }),
        (t.callback = function () {
          Mo(l, e, a);
        });
    }
    var i = e.stateNode;
    i !== null &&
      typeof i.componentDidCatch == "function" &&
      (t.callback = function () {
        Mo(l, e, a),
          typeof n != "function" &&
            (ve === null ? (ve = new Set([this])) : ve.add(this));
        var c = a.stack;
        this.componentDidCatch(a.value, {
          componentStack: c !== null ? c : "",
        });
      });
  }
  function uh(t, l, e, a, n) {
    if (
      ((e.flags |= 32768),
      a !== null && typeof a == "object" && typeof a.then == "function")
    ) {
      if (
        ((l = e.alternate),
        l !== null && fa(l, e, n, !0),
        (e = dl.current),
        e !== null)
      ) {
        switch (e.tag) {
          case 31:
          case 13:
            return (
              Nl === null ? Tu() : e.alternate === null && Bt === 0 && (Bt = 3),
              (e.flags &= -257),
              (e.flags |= 65536),
              (e.lanes = n),
              a === Fn
                ? (e.flags |= 16384)
                : ((l = e.updateQueue),
                  l === null ? (e.updateQueue = new Set([a])) : l.add(a),
                  Bc(t, a, n)),
              !1
            );
          case 22:
            return (
              (e.flags |= 65536),
              a === Fn
                ? (e.flags |= 16384)
                : ((l = e.updateQueue),
                  l === null
                    ? ((l = {
                        transitions: null,
                        markerInstances: null,
                        retryQueue: new Set([a]),
                      }),
                      (e.updateQueue = l))
                    : ((e = l.retryQueue),
                      e === null ? (l.retryQueue = new Set([a])) : e.add(a)),
                  Bc(t, a, n)),
              !1
            );
        }
        throw Error(r(435, e.tag));
      }
      return Bc(t, a, n), Tu(), !1;
    }
    if (mt)
      return (
        (l = dl.current),
        l !== null
          ? ((l.flags & 65536) === 0 && (l.flags |= 256),
            (l.flags |= 65536),
            (l.lanes = n),
            a !== Di && ((t = Error(r(422), { cause: a })), wa(xl(t, e))))
          : (a !== Di && ((l = Error(r(423), { cause: a })), wa(xl(l, e))),
            (t = t.current.alternate),
            (t.flags |= 65536),
            (n &= -n),
            (t.lanes |= n),
            (a = xl(a, e)),
            (n = oc(t.stateNode, a, n)),
            Xi(t, n),
            Bt !== 4 && (Bt = 2)),
        !1
      );
    var u = Error(r(520), { cause: a });
    if (
      ((u = xl(u, e)),
      on === null ? (on = [u]) : on.push(u),
      Bt !== 4 && (Bt = 2),
      l === null)
    )
      return !0;
    (a = xl(a, e)), (e = l);
    do {
      switch (e.tag) {
        case 3:
          return (
            (e.flags |= 65536),
            (t = n & -n),
            (e.lanes |= t),
            (t = oc(e.stateNode, a, t)),
            Xi(e, t),
            !1
          );
        case 1:
          if (
            ((l = e.type),
            (u = e.stateNode),
            (e.flags & 128) === 0 &&
              (typeof l.getDerivedStateFromError == "function" ||
                (u !== null &&
                  typeof u.componentDidCatch == "function" &&
                  (ve === null || !ve.has(u)))))
          )
            return (
              (e.flags |= 65536),
              (n &= -n),
              (e.lanes |= n),
              (n = Oo(n)),
              Co(n, t, e, a),
              Xi(e, n),
              !1
            );
      }
      e = e.return;
    } while (e !== null);
    return !1;
  }
  var rc = Error(r(461)),
    Lt = !1;
  function Wt(t, l, e, a) {
    l.child = t === null ? Bs(l, null, e, a) : Xe(l, t.child, e, a);
  }
  function Uo(t, l, e, a, n) {
    e = e.render;
    var u = l.ref;
    if ("ref" in a) {
      var i = {};
      for (var c in a) c !== "ref" && (i[c] = a[c]);
    } else i = a;
    return (
      Re(l),
      (a = Ki(t, l, e, i, u, n)),
      (c = Ji()),
      t !== null && !Lt
        ? ($i(t, l, n), Vl(t, l, n))
        : (mt && c && zi(l), (l.flags |= 1), Wt(t, l, a, n), l.child)
    );
  }
  function Ho(t, l, e, a, n) {
    if (t === null) {
      var u = e.type;
      return typeof u == "function" &&
        !Ni(u) &&
        u.defaultProps === void 0 &&
        e.compare === null
        ? ((l.tag = 15), (l.type = u), Bo(t, l, u, a, n))
        : ((t = Vn(e.type, null, a, l, l.mode, n)),
          (t.ref = l.ref),
          (t.return = l),
          (l.child = t));
    }
    if (((u = t.child), !pc(t, n))) {
      var i = u.memoizedProps;
      if (
        ((e = e.compare), (e = e !== null ? e : La), e(i, a) && t.ref === l.ref)
      )
        return Vl(t, l, n);
    }
    return (
      (l.flags |= 1),
      (t = Gl(u, a)),
      (t.ref = l.ref),
      (t.return = l),
      (l.child = t)
    );
  }
  function Bo(t, l, e, a, n) {
    if (t !== null) {
      var u = t.memoizedProps;
      if (La(u, a) && t.ref === l.ref)
        if (((Lt = !1), (l.pendingProps = a = u), pc(t, n)))
          (t.flags & 131072) !== 0 && (Lt = !0);
        else return (l.lanes = t.lanes), Vl(t, l, n);
    }
    return dc(t, l, e, a, n);
  }
  function Ro(t, l, e, a) {
    var n = a.children,
      u = t !== null ? t.memoizedState : null;
    if (
      (t === null &&
        l.stateNode === null &&
        (l.stateNode = {
          _visibility: 1,
          _pendingMarkers: null,
          _retryCache: null,
          _transitions: null,
        }),
      a.mode === "hidden")
    ) {
      if ((l.flags & 128) !== 0) {
        if (((u = u !== null ? u.baseLanes | e : e), t !== null)) {
          for (a = l.child = t.child, n = 0; a !== null; )
            (n = n | a.lanes | a.childLanes), (a = a.sibling);
          a = n & ~u;
        } else (a = 0), (l.child = null);
        return qo(t, l, u, e, a);
      }
      if ((e & 536870912) !== 0)
        (l.memoizedState = { baseLanes: 0, cachePool: null }),
          t !== null && kn(l, u !== null ? u.cachePool : null),
          u !== null ? Ys(l, u) : Qi(),
          Gs(l);
      else
        return (
          (a = l.lanes = 536870912),
          qo(t, l, u !== null ? u.baseLanes | e : e, e, a)
        );
    } else
      u !== null
        ? (kn(l, u.cachePool), Ys(l, u), de(), (l.memoizedState = null))
        : (t !== null && kn(l, null), Qi(), de());
    return Wt(t, l, n, e), l.child;
  }
  function en(t, l) {
    return (
      (t !== null && t.tag === 22) ||
        l.stateNode !== null ||
        (l.stateNode = {
          _visibility: 1,
          _pendingMarkers: null,
          _retryCache: null,
          _transitions: null,
        }),
      l.sibling
    );
  }
  function qo(t, l, e, a, n) {
    var u = Ri();
    return (
      (u = u === null ? null : { parent: Gt._currentValue, pool: u }),
      (l.memoizedState = { baseLanes: e, cachePool: u }),
      t !== null && kn(l, null),
      Qi(),
      Gs(l),
      t !== null && fa(t, l, a, !0),
      (l.childLanes = n),
      null
    );
  }
  function ru(t, l) {
    return (
      (l = mu({ mode: l.mode, children: l.children }, t.mode)),
      (l.ref = t.ref),
      (t.child = l),
      (l.return = t),
      l
    );
  }
  function Yo(t, l, e) {
    return (
      Xe(l, t.child, null, e),
      (t = ru(l, l.pendingProps)),
      (t.flags |= 2),
      ml(l),
      (l.memoizedState = null),
      t
    );
  }
  function ih(t, l, e) {
    var a = l.pendingProps,
      n = (l.flags & 128) !== 0;
    if (((l.flags &= -129), t === null)) {
      if (mt) {
        if (a.mode === "hidden")
          return (t = ru(l, a)), (l.lanes = 536870912), en(null, t);
        if (
          (wi(l),
          (t = jt)
            ? ((t = Wr(t, El)),
              (t = t !== null && t.data === "&" ? t : null),
              t !== null &&
                ((l.memoizedState = {
                  dehydrated: t,
                  treeContext: ne !== null ? { id: Ml, overflow: Ol } : null,
                  retryLane: 536870912,
                  hydrationErrors: null,
                }),
                (e = xs(t)),
                (e.return = l),
                (l.child = e),
                ($t = l),
                (jt = null)))
            : (t = null),
          t === null)
        )
          throw ie(l);
        return (l.lanes = 536870912), null;
      }
      return ru(l, a);
    }
    var u = t.memoizedState;
    if (u !== null) {
      var i = u.dehydrated;
      if ((wi(l), n))
        if (l.flags & 256) (l.flags &= -257), (l = Yo(t, l, e));
        else if (l.memoizedState !== null)
          (l.child = t.child), (l.flags |= 128), (l = null);
        else throw Error(r(558));
      else if (
        (Lt || fa(t, l, e, !1), (n = (e & t.childLanes) !== 0), Lt || n)
      ) {
        if (
          ((a = At),
          a !== null && ((i = zf(a, e)), i !== 0 && i !== u.retryLane))
        )
          throw ((u.retryLane = i), Ce(t, i), il(a, t, i), rc);
        Tu(), (l = Yo(t, l, e));
      } else
        (t = u.treeContext),
          (jt = Al(i.nextSibling)),
          ($t = l),
          (mt = !0),
          (ue = null),
          (El = !1),
          t !== null && Es(l, t),
          (l = ru(l, a)),
          (l.flags |= 4096);
      return l;
    }
    return (
      (t = Gl(t.child, { mode: a.mode, children: a.children })),
      (t.ref = l.ref),
      (l.child = t),
      (t.return = l),
      t
    );
  }
  function du(t, l) {
    var e = l.ref;
    if (e === null) t !== null && t.ref !== null && (l.flags |= 4194816);
    else {
      if (typeof e != "function" && typeof e != "object") throw Error(r(284));
      (t === null || t.ref !== e) && (l.flags |= 4194816);
    }
  }
  function dc(t, l, e, a, n) {
    return (
      Re(l),
      (e = Ki(t, l, e, a, void 0, n)),
      (a = Ji()),
      t !== null && !Lt
        ? ($i(t, l, n), Vl(t, l, n))
        : (mt && a && zi(l), (l.flags |= 1), Wt(t, l, e, n), l.child)
    );
  }
  function Go(t, l, e, a, n, u) {
    return (
      Re(l),
      (l.updateQueue = null),
      (e = Ls(l, a, e, n)),
      Xs(t),
      (a = Ji()),
      t !== null && !Lt
        ? ($i(t, l, u), Vl(t, l, u))
        : (mt && a && zi(l), (l.flags |= 1), Wt(t, l, e, u), l.child)
    );
  }
  function Xo(t, l, e, a, n) {
    if ((Re(l), l.stateNode === null)) {
      var u = na,
        i = e.contextType;
      typeof i == "object" && i !== null && (u = kt(i)),
        (u = new e(a, u)),
        (l.memoizedState =
          u.state !== null && u.state !== void 0 ? u.state : null),
        (u.updater = sc),
        (l.stateNode = u),
        (u._reactInternals = l),
        (u = l.stateNode),
        (u.props = a),
        (u.state = l.memoizedState),
        (u.refs = {}),
        Yi(l),
        (i = e.contextType),
        (u.context = typeof i == "object" && i !== null ? kt(i) : na),
        (u.state = l.memoizedState),
        (i = e.getDerivedStateFromProps),
        typeof i == "function" && (fc(l, e, i, a), (u.state = l.memoizedState)),
        typeof e.getDerivedStateFromProps == "function" ||
          typeof u.getSnapshotBeforeUpdate == "function" ||
          (typeof u.UNSAFE_componentWillMount != "function" &&
            typeof u.componentWillMount != "function") ||
          ((i = u.state),
          typeof u.componentWillMount == "function" && u.componentWillMount(),
          typeof u.UNSAFE_componentWillMount == "function" &&
            u.UNSAFE_componentWillMount(),
          i !== u.state && sc.enqueueReplaceState(u, u.state, null),
          Fa(l, a, u, n),
          Wa(),
          (u.state = l.memoizedState)),
        typeof u.componentDidMount == "function" && (l.flags |= 4194308),
        (a = !0);
    } else if (t === null) {
      u = l.stateNode;
      var c = l.memoizedProps,
        o = Qe(e, c);
      u.props = o;
      var y = u.context,
        T = e.contextType;
      (i = na), typeof T == "object" && T !== null && (i = kt(T));
      var N = e.getDerivedStateFromProps;
      (T =
        typeof N == "function" ||
        typeof u.getSnapshotBeforeUpdate == "function"),
        (c = l.pendingProps !== c),
        T ||
          (typeof u.UNSAFE_componentWillReceiveProps != "function" &&
            typeof u.componentWillReceiveProps != "function") ||
          ((c || y !== i) && jo(l, u, a, i)),
        (fe = !1);
      var b = l.memoizedState;
      (u.state = b),
        Fa(l, a, u, n),
        Wa(),
        (y = l.memoizedState),
        c || b !== y || fe
          ? (typeof N == "function" && (fc(l, e, N, a), (y = l.memoizedState)),
            (o = fe || Ao(l, e, o, a, b, y, i))
              ? (T ||
                  (typeof u.UNSAFE_componentWillMount != "function" &&
                    typeof u.componentWillMount != "function") ||
                  (typeof u.componentWillMount == "function" &&
                    u.componentWillMount(),
                  typeof u.UNSAFE_componentWillMount == "function" &&
                    u.UNSAFE_componentWillMount()),
                typeof u.componentDidMount == "function" &&
                  (l.flags |= 4194308))
              : (typeof u.componentDidMount == "function" &&
                  (l.flags |= 4194308),
                (l.memoizedProps = a),
                (l.memoizedState = y)),
            (u.props = a),
            (u.state = y),
            (u.context = i),
            (a = o))
          : (typeof u.componentDidMount == "function" && (l.flags |= 4194308),
            (a = !1));
    } else {
      (u = l.stateNode),
        Gi(t, l),
        (i = l.memoizedProps),
        (T = Qe(e, i)),
        (u.props = T),
        (N = l.pendingProps),
        (b = u.context),
        (y = e.contextType),
        (o = na),
        typeof y == "object" && y !== null && (o = kt(y)),
        (c = e.getDerivedStateFromProps),
        (y =
          typeof c == "function" ||
          typeof u.getSnapshotBeforeUpdate == "function") ||
          (typeof u.UNSAFE_componentWillReceiveProps != "function" &&
            typeof u.componentWillReceiveProps != "function") ||
          ((i !== N || b !== o) && jo(l, u, a, o)),
        (fe = !1),
        (b = l.memoizedState),
        (u.state = b),
        Fa(l, a, u, n),
        Wa();
      var x = l.memoizedState;
      i !== N ||
      b !== x ||
      fe ||
      (t !== null && t.dependencies !== null && Jn(t.dependencies))
        ? (typeof c == "function" && (fc(l, e, c, a), (x = l.memoizedState)),
          (T =
            fe ||
            Ao(l, e, T, a, b, x, o) ||
            (t !== null && t.dependencies !== null && Jn(t.dependencies)))
            ? (y ||
                (typeof u.UNSAFE_componentWillUpdate != "function" &&
                  typeof u.componentWillUpdate != "function") ||
                (typeof u.componentWillUpdate == "function" &&
                  u.componentWillUpdate(a, x, o),
                typeof u.UNSAFE_componentWillUpdate == "function" &&
                  u.UNSAFE_componentWillUpdate(a, x, o)),
              typeof u.componentDidUpdate == "function" && (l.flags |= 4),
              typeof u.getSnapshotBeforeUpdate == "function" &&
                (l.flags |= 1024))
            : (typeof u.componentDidUpdate != "function" ||
                (i === t.memoizedProps && b === t.memoizedState) ||
                (l.flags |= 4),
              typeof u.getSnapshotBeforeUpdate != "function" ||
                (i === t.memoizedProps && b === t.memoizedState) ||
                (l.flags |= 1024),
              (l.memoizedProps = a),
              (l.memoizedState = x)),
          (u.props = a),
          (u.state = x),
          (u.context = o),
          (a = T))
        : (typeof u.componentDidUpdate != "function" ||
            (i === t.memoizedProps && b === t.memoizedState) ||
            (l.flags |= 4),
          typeof u.getSnapshotBeforeUpdate != "function" ||
            (i === t.memoizedProps && b === t.memoizedState) ||
            (l.flags |= 1024),
          (a = !1));
    }
    return (
      (u = a),
      du(t, l),
      (a = (l.flags & 128) !== 0),
      u || a
        ? ((u = l.stateNode),
          (e =
            a && typeof e.getDerivedStateFromError != "function"
              ? null
              : u.render()),
          (l.flags |= 1),
          t !== null && a
            ? ((l.child = Xe(l, t.child, null, n)),
              (l.child = Xe(l, null, e, n)))
            : Wt(t, l, e, n),
          (l.memoizedState = u.state),
          (t = l.child))
        : (t = Vl(t, l, n)),
      t
    );
  }
  function Lo(t, l, e, a) {
    return He(), (l.flags |= 256), Wt(t, l, e, a), l.child;
  }
  var mc = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null,
  };
  function hc(t) {
    return { baseLanes: t, cachePool: Ds() };
  }
  function gc(t, l, e) {
    return (t = t !== null ? t.childLanes & ~e : 0), l && (t |= gl), t;
  }
  function Qo(t, l, e) {
    var a = l.pendingProps,
      n = !1,
      u = (l.flags & 128) !== 0,
      i;
    if (
      ((i = u) ||
        (i =
          t !== null && t.memoizedState === null ? !1 : (Rt.current & 2) !== 0),
      i && ((n = !0), (l.flags &= -129)),
      (i = (l.flags & 32) !== 0),
      (l.flags &= -33),
      t === null)
    ) {
      if (mt) {
        if (
          (n ? re(l) : de(),
          (t = jt)
            ? ((t = Wr(t, El)),
              (t = t !== null && t.data !== "&" ? t : null),
              t !== null &&
                ((l.memoizedState = {
                  dehydrated: t,
                  treeContext: ne !== null ? { id: Ml, overflow: Ol } : null,
                  retryLane: 536870912,
                  hydrationErrors: null,
                }),
                (e = xs(t)),
                (e.return = l),
                (l.child = e),
                ($t = l),
                (jt = null)))
            : (t = null),
          t === null)
        )
          throw ie(l);
        return Fc(t) ? (l.lanes = 32) : (l.lanes = 536870912), null;
      }
      var c = a.children;
      return (
        (a = a.fallback),
        n
          ? (de(),
            (n = l.mode),
            (c = mu({ mode: "hidden", children: c }, n)),
            (a = Ue(a, n, e, null)),
            (c.return = l),
            (a.return = l),
            (c.sibling = a),
            (l.child = c),
            (a = l.child),
            (a.memoizedState = hc(e)),
            (a.childLanes = gc(t, i, e)),
            (l.memoizedState = mc),
            en(null, a))
          : (re(l), vc(l, c))
      );
    }
    var o = t.memoizedState;
    if (o !== null && ((c = o.dehydrated), c !== null)) {
      if (u)
        l.flags & 256
          ? (re(l), (l.flags &= -257), (l = yc(t, l, e)))
          : l.memoizedState !== null
          ? (de(), (l.child = t.child), (l.flags |= 128), (l = null))
          : (de(),
            (c = a.fallback),
            (n = l.mode),
            (a = mu({ mode: "visible", children: a.children }, n)),
            (c = Ue(c, n, e, null)),
            (c.flags |= 2),
            (a.return = l),
            (c.return = l),
            (a.sibling = c),
            (l.child = a),
            Xe(l, t.child, null, e),
            (a = l.child),
            (a.memoizedState = hc(e)),
            (a.childLanes = gc(t, i, e)),
            (l.memoizedState = mc),
            (l = en(null, a)));
      else if ((re(l), Fc(c))) {
        if (((i = c.nextSibling && c.nextSibling.dataset), i)) var y = i.dgst;
        (i = y),
          (a = Error(r(419))),
          (a.stack = ""),
          (a.digest = i),
          wa({ value: a, source: null, stack: null }),
          (l = yc(t, l, e));
      } else if (
        (Lt || fa(t, l, e, !1), (i = (e & t.childLanes) !== 0), Lt || i)
      ) {
        if (
          ((i = At),
          i !== null && ((a = zf(i, e)), a !== 0 && a !== o.retryLane))
        )
          throw ((o.retryLane = a), Ce(t, a), il(i, t, a), rc);
        Wc(c) || Tu(), (l = yc(t, l, e));
      } else
        Wc(c)
          ? ((l.flags |= 192), (l.child = t.child), (l = null))
          : ((t = o.treeContext),
            (jt = Al(c.nextSibling)),
            ($t = l),
            (mt = !0),
            (ue = null),
            (El = !1),
            t !== null && Es(l, t),
            (l = vc(l, a.children)),
            (l.flags |= 4096));
      return l;
    }
    return n
      ? (de(),
        (c = a.fallback),
        (n = l.mode),
        (o = t.child),
        (y = o.sibling),
        (a = Gl(o, { mode: "hidden", children: a.children })),
        (a.subtreeFlags = o.subtreeFlags & 65011712),
        y !== null ? (c = Gl(y, c)) : ((c = Ue(c, n, e, null)), (c.flags |= 2)),
        (c.return = l),
        (a.return = l),
        (a.sibling = c),
        (l.child = a),
        en(null, a),
        (a = l.child),
        (c = t.child.memoizedState),
        c === null
          ? (c = hc(e))
          : ((n = c.cachePool),
            n !== null
              ? ((o = Gt._currentValue),
                (n = n.parent !== o ? { parent: o, pool: o } : n))
              : (n = Ds()),
            (c = { baseLanes: c.baseLanes | e, cachePool: n })),
        (a.memoizedState = c),
        (a.childLanes = gc(t, i, e)),
        (l.memoizedState = mc),
        en(t.child, a))
      : (re(l),
        (e = t.child),
        (t = e.sibling),
        (e = Gl(e, { mode: "visible", children: a.children })),
        (e.return = l),
        (e.sibling = null),
        t !== null &&
          ((i = l.deletions),
          i === null ? ((l.deletions = [t]), (l.flags |= 16)) : i.push(t)),
        (l.child = e),
        (l.memoizedState = null),
        e);
  }
  function vc(t, l) {
    return (
      (l = mu({ mode: "visible", children: l }, t.mode)),
      (l.return = t),
      (t.child = l)
    );
  }
  function mu(t, l) {
    return (t = rl(22, t, null, l)), (t.lanes = 0), t;
  }
  function yc(t, l, e) {
    return (
      Xe(l, t.child, null, e),
      (t = vc(l, l.pendingProps.children)),
      (t.flags |= 2),
      (l.memoizedState = null),
      t
    );
  }
  function Zo(t, l, e) {
    t.lanes |= l;
    var a = t.alternate;
    a !== null && (a.lanes |= l), Ci(t.return, l, e);
  }
  function bc(t, l, e, a, n, u) {
    var i = t.memoizedState;
    i === null
      ? (t.memoizedState = {
          isBackwards: l,
          rendering: null,
          renderingStartTime: 0,
          last: a,
          tail: e,
          tailMode: n,
          treeForkCount: u,
        })
      : ((i.isBackwards = l),
        (i.rendering = null),
        (i.renderingStartTime = 0),
        (i.last = a),
        (i.tail = e),
        (i.tailMode = n),
        (i.treeForkCount = u));
  }
  function wo(t, l, e) {
    var a = l.pendingProps,
      n = a.revealOrder,
      u = a.tail;
    a = a.children;
    var i = Rt.current,
      c = (i & 2) !== 0;
    if (
      (c ? ((i = (i & 1) | 2), (l.flags |= 128)) : (i &= 1),
      _(Rt, i),
      Wt(t, l, a, e),
      (a = mt ? Za : 0),
      !c && t !== null && (t.flags & 128) !== 0)
    )
      t: for (t = l.child; t !== null; ) {
        if (t.tag === 13) t.memoizedState !== null && Zo(t, e, l);
        else if (t.tag === 19) Zo(t, e, l);
        else if (t.child !== null) {
          (t.child.return = t), (t = t.child);
          continue;
        }
        if (t === l) break t;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === l) break t;
          t = t.return;
        }
        (t.sibling.return = t.return), (t = t.sibling);
      }
    switch (n) {
      case "forwards":
        for (e = l.child, n = null; e !== null; )
          (t = e.alternate),
            t !== null && lu(t) === null && (n = e),
            (e = e.sibling);
        (e = n),
          e === null
            ? ((n = l.child), (l.child = null))
            : ((n = e.sibling), (e.sibling = null)),
          bc(l, !1, n, e, u, a);
        break;
      case "backwards":
      case "unstable_legacy-backwards":
        for (e = null, n = l.child, l.child = null; n !== null; ) {
          if (((t = n.alternate), t !== null && lu(t) === null)) {
            l.child = n;
            break;
          }
          (t = n.sibling), (n.sibling = e), (e = n), (n = t);
        }
        bc(l, !0, e, null, u, a);
        break;
      case "together":
        bc(l, !1, null, null, void 0, a);
        break;
      default:
        l.memoizedState = null;
    }
    return l.child;
  }
  function Vl(t, l, e) {
    if (
      (t !== null && (l.dependencies = t.dependencies),
      (ge |= l.lanes),
      (e & l.childLanes) === 0)
    )
      if (t !== null) {
        if ((fa(t, l, e, !1), (e & l.childLanes) === 0)) return null;
      } else return null;
    if (t !== null && l.child !== t.child) throw Error(r(153));
    if (l.child !== null) {
      for (
        t = l.child, e = Gl(t, t.pendingProps), l.child = e, e.return = l;
        t.sibling !== null;

      )
        (t = t.sibling),
          (e = e.sibling = Gl(t, t.pendingProps)),
          (e.return = l);
      e.sibling = null;
    }
    return l.child;
  }
  function pc(t, l) {
    return (t.lanes & l) !== 0
      ? !0
      : ((t = t.dependencies), !!(t !== null && Jn(t)));
  }
  function ch(t, l, e) {
    switch (l.tag) {
      case 3:
        Ut(l, l.stateNode.containerInfo),
          ce(l, Gt, t.memoizedState.cache),
          He();
        break;
      case 27:
      case 5:
        Bl(l);
        break;
      case 4:
        Ut(l, l.stateNode.containerInfo);
        break;
      case 10:
        ce(l, l.type, l.memoizedProps.value);
        break;
      case 31:
        if (l.memoizedState !== null) return (l.flags |= 128), wi(l), null;
        break;
      case 13:
        var a = l.memoizedState;
        if (a !== null)
          return a.dehydrated !== null
            ? (re(l), (l.flags |= 128), null)
            : (e & l.child.childLanes) !== 0
            ? Qo(t, l, e)
            : (re(l), (t = Vl(t, l, e)), t !== null ? t.sibling : null);
        re(l);
        break;
      case 19:
        var n = (t.flags & 128) !== 0;
        if (
          ((a = (e & l.childLanes) !== 0),
          a || (fa(t, l, e, !1), (a = (e & l.childLanes) !== 0)),
          n)
        ) {
          if (a) return wo(t, l, e);
          l.flags |= 128;
        }
        if (
          ((n = l.memoizedState),
          n !== null &&
            ((n.rendering = null), (n.tail = null), (n.lastEffect = null)),
          _(Rt, Rt.current),
          a)
        )
          break;
        return null;
      case 22:
        return (l.lanes = 0), Ro(t, l, e, l.pendingProps);
      case 24:
        ce(l, Gt, t.memoizedState.cache);
    }
    return Vl(t, l, e);
  }
  function Vo(t, l, e) {
    if (t !== null)
      if (t.memoizedProps !== l.pendingProps) Lt = !0;
      else {
        if (!pc(t, e) && (l.flags & 128) === 0) return (Lt = !1), ch(t, l, e);
        Lt = (t.flags & 131072) !== 0;
      }
    else (Lt = !1), mt && (l.flags & 1048576) !== 0 && Ts(l, Za, l.index);
    switch (((l.lanes = 0), l.tag)) {
      case 16:
        t: {
          var a = l.pendingProps;
          if (((t = Ye(l.elementType)), (l.type = t), typeof t == "function"))
            Ni(t)
              ? ((a = Qe(t, a)), (l.tag = 1), (l = Xo(null, l, t, a, e)))
              : ((l.tag = 0), (l = dc(null, l, t, a, e)));
          else {
            if (t != null) {
              var n = t.$$typeof;
              if (n === St) {
                (l.tag = 11), (l = Uo(null, l, t, a, e));
                break t;
              } else if (n === O) {
                (l.tag = 14), (l = Ho(null, l, t, a, e));
                break t;
              }
            }
            throw ((l = Yt(t) || t), Error(r(306, l, "")));
          }
        }
        return l;
      case 0:
        return dc(t, l, l.type, l.pendingProps, e);
      case 1:
        return (a = l.type), (n = Qe(a, l.pendingProps)), Xo(t, l, a, n, e);
      case 3:
        t: {
          if ((Ut(l, l.stateNode.containerInfo), t === null))
            throw Error(r(387));
          a = l.pendingProps;
          var u = l.memoizedState;
          (n = u.element), Gi(t, l), Fa(l, a, null, e);
          var i = l.memoizedState;
          if (
            ((a = i.cache),
            ce(l, Gt, a),
            a !== u.cache && Ui(l, [Gt], e, !0),
            Wa(),
            (a = i.element),
            u.isDehydrated)
          )
            if (
              ((u = { element: a, isDehydrated: !1, cache: i.cache }),
              (l.updateQueue.baseState = u),
              (l.memoizedState = u),
              l.flags & 256)
            ) {
              l = Lo(t, l, a, e);
              break t;
            } else if (a !== n) {
              (n = xl(Error(r(424)), l)), wa(n), (l = Lo(t, l, a, e));
              break t;
            } else {
              switch (((t = l.stateNode.containerInfo), t.nodeType)) {
                case 9:
                  t = t.body;
                  break;
                default:
                  t = t.nodeName === "HTML" ? t.ownerDocument.body : t;
              }
              for (
                jt = Al(t.firstChild),
                  $t = l,
                  mt = !0,
                  ue = null,
                  El = !0,
                  e = Bs(l, null, a, e),
                  l.child = e;
                e;

              )
                (e.flags = (e.flags & -3) | 4096), (e = e.sibling);
            }
          else {
            if ((He(), a === n)) {
              l = Vl(t, l, e);
              break t;
            }
            Wt(t, l, a, e);
          }
          l = l.child;
        }
        return l;
      case 26:
        return (
          du(t, l),
          t === null
            ? (e = ed(l.type, null, l.pendingProps, null))
              ? (l.memoizedState = e)
              : mt ||
                ((e = l.type),
                (t = l.pendingProps),
                (a = Du(k.current).createElement(e)),
                (a[Jt] = l),
                (a[tl] = t),
                Ft(a, e, t),
                Vt(a),
                (l.stateNode = a))
            : (l.memoizedState = ed(
                l.type,
                t.memoizedProps,
                l.pendingProps,
                t.memoizedState
              )),
          null
        );
      case 27:
        return (
          Bl(l),
          t === null &&
            mt &&
            ((a = l.stateNode = Pr(l.type, l.pendingProps, k.current)),
            ($t = l),
            (El = !0),
            (n = jt),
            xe(l.type) ? ((Ic = n), (jt = Al(a.firstChild))) : (jt = n)),
          Wt(t, l, l.pendingProps.children, e),
          du(t, l),
          t === null && (l.flags |= 4194304),
          l.child
        );
      case 5:
        return (
          t === null &&
            mt &&
            ((n = a = jt) &&
              ((a = qh(a, l.type, l.pendingProps, El)),
              a !== null
                ? ((l.stateNode = a),
                  ($t = l),
                  (jt = Al(a.firstChild)),
                  (El = !1),
                  (n = !0))
                : (n = !1)),
            n || ie(l)),
          Bl(l),
          (n = l.type),
          (u = l.pendingProps),
          (i = t !== null ? t.memoizedProps : null),
          (a = u.children),
          Jc(n, u) ? (a = null) : i !== null && Jc(n, i) && (l.flags |= 32),
          l.memoizedState !== null &&
            ((n = Ki(t, l, Im, null, null, e)), (bn._currentValue = n)),
          du(t, l),
          Wt(t, l, a, e),
          l.child
        );
      case 6:
        return (
          t === null &&
            mt &&
            ((t = e = jt) &&
              ((e = Yh(e, l.pendingProps, El)),
              e !== null
                ? ((l.stateNode = e), ($t = l), (jt = null), (t = !0))
                : (t = !1)),
            t || ie(l)),
          null
        );
      case 13:
        return Qo(t, l, e);
      case 4:
        return (
          Ut(l, l.stateNode.containerInfo),
          (a = l.pendingProps),
          t === null ? (l.child = Xe(l, null, a, e)) : Wt(t, l, a, e),
          l.child
        );
      case 11:
        return Uo(t, l, l.type, l.pendingProps, e);
      case 7:
        return Wt(t, l, l.pendingProps, e), l.child;
      case 8:
        return Wt(t, l, l.pendingProps.children, e), l.child;
      case 12:
        return Wt(t, l, l.pendingProps.children, e), l.child;
      case 10:
        return (
          (a = l.pendingProps),
          ce(l, l.type, a.value),
          Wt(t, l, a.children, e),
          l.child
        );
      case 9:
        return (
          (n = l.type._context),
          (a = l.pendingProps.children),
          Re(l),
          (n = kt(n)),
          (a = a(n)),
          (l.flags |= 1),
          Wt(t, l, a, e),
          l.child
        );
      case 14:
        return Ho(t, l, l.type, l.pendingProps, e);
      case 15:
        return Bo(t, l, l.type, l.pendingProps, e);
      case 19:
        return wo(t, l, e);
      case 31:
        return ih(t, l, e);
      case 22:
        return Ro(t, l, e, l.pendingProps);
      case 24:
        return (
          Re(l),
          (a = kt(Gt)),
          t === null
            ? ((n = Ri()),
              n === null &&
                ((n = At),
                (u = Hi()),
                (n.pooledCache = u),
                u.refCount++,
                u !== null && (n.pooledCacheLanes |= e),
                (n = u)),
              (l.memoizedState = { parent: a, cache: n }),
              Yi(l),
              ce(l, Gt, n))
            : ((t.lanes & e) !== 0 && (Gi(t, l), Fa(l, null, null, e), Wa()),
              (n = t.memoizedState),
              (u = l.memoizedState),
              n.parent !== a
                ? ((n = { parent: a, cache: a }),
                  (l.memoizedState = n),
                  l.lanes === 0 &&
                    (l.memoizedState = l.updateQueue.baseState = n),
                  ce(l, Gt, a))
                : ((a = u.cache),
                  ce(l, Gt, a),
                  a !== n.cache && Ui(l, [Gt], e, !0))),
          Wt(t, l, l.pendingProps.children, e),
          l.child
        );
      case 29:
        throw l.pendingProps;
    }
    throw Error(r(156, l.tag));
  }
  function Kl(t) {
    t.flags |= 4;
  }
  function xc(t, l, e, a, n) {
    if (((l = (t.mode & 32) !== 0) && (l = !1), l)) {
      if (((t.flags |= 16777216), (n & 335544128) === n))
        if (t.stateNode.complete) t.flags |= 8192;
        else if (br()) t.flags |= 8192;
        else throw ((Ge = Fn), qi);
    } else t.flags &= -16777217;
  }
  function Ko(t, l) {
    if (l.type !== "stylesheet" || (l.state.loading & 4) !== 0)
      t.flags &= -16777217;
    else if (((t.flags |= 16777216), !cd(l)))
      if (br()) t.flags |= 8192;
      else throw ((Ge = Fn), qi);
  }
  function hu(t, l) {
    l !== null && (t.flags |= 4),
      t.flags & 16384 &&
        ((l = t.tag !== 22 ? Nf() : 536870912), (t.lanes |= l), (xa |= l));
  }
  function an(t, l) {
    if (!mt)
      switch (t.tailMode) {
        case "hidden":
          l = t.tail;
          for (var e = null; l !== null; )
            l.alternate !== null && (e = l), (l = l.sibling);
          e === null ? (t.tail = null) : (e.sibling = null);
          break;
        case "collapsed":
          e = t.tail;
          for (var a = null; e !== null; )
            e.alternate !== null && (a = e), (e = e.sibling);
          a === null
            ? l || t.tail === null
              ? (t.tail = null)
              : (t.tail.sibling = null)
            : (a.sibling = null);
      }
  }
  function zt(t) {
    var l = t.alternate !== null && t.alternate.child === t.child,
      e = 0,
      a = 0;
    if (l)
      for (var n = t.child; n !== null; )
        (e |= n.lanes | n.childLanes),
          (a |= n.subtreeFlags & 65011712),
          (a |= n.flags & 65011712),
          (n.return = t),
          (n = n.sibling);
    else
      for (n = t.child; n !== null; )
        (e |= n.lanes | n.childLanes),
          (a |= n.subtreeFlags),
          (a |= n.flags),
          (n.return = t),
          (n = n.sibling);
    return (t.subtreeFlags |= a), (t.childLanes = e), l;
  }
  function fh(t, l, e) {
    var a = l.pendingProps;
    switch ((_i(l), l.tag)) {
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return zt(l), null;
      case 1:
        return zt(l), null;
      case 3:
        return (
          (e = l.stateNode),
          (a = null),
          t !== null && (a = t.memoizedState.cache),
          l.memoizedState.cache !== a && (l.flags |= 2048),
          Ql(Gt),
          yt(),
          e.pendingContext &&
            ((e.context = e.pendingContext), (e.pendingContext = null)),
          (t === null || t.child === null) &&
            (ca(l)
              ? Kl(l)
              : t === null ||
                (t.memoizedState.isDehydrated && (l.flags & 256) === 0) ||
                ((l.flags |= 1024), Mi())),
          zt(l),
          null
        );
      case 26:
        var n = l.type,
          u = l.memoizedState;
        return (
          t === null
            ? (Kl(l),
              u !== null ? (zt(l), Ko(l, u)) : (zt(l), xc(l, n, null, a, e)))
            : u
            ? u !== t.memoizedState
              ? (Kl(l), zt(l), Ko(l, u))
              : (zt(l), (l.flags &= -16777217))
            : ((t = t.memoizedProps),
              t !== a && Kl(l),
              zt(l),
              xc(l, n, t, a, e)),
          null
        );
      case 27:
        if (
          (te(l),
          (e = k.current),
          (n = l.type),
          t !== null && l.stateNode != null)
        )
          t.memoizedProps !== a && Kl(l);
        else {
          if (!a) {
            if (l.stateNode === null) throw Error(r(166));
            return zt(l), null;
          }
          (t = H.current),
            ca(l) ? Ns(l) : ((t = Pr(n, a, e)), (l.stateNode = t), Kl(l));
        }
        return zt(l), null;
      case 5:
        if ((te(l), (n = l.type), t !== null && l.stateNode != null))
          t.memoizedProps !== a && Kl(l);
        else {
          if (!a) {
            if (l.stateNode === null) throw Error(r(166));
            return zt(l), null;
          }
          if (((u = H.current), ca(l))) Ns(l);
          else {
            var i = Du(k.current);
            switch (u) {
              case 1:
                u = i.createElementNS("http://www.w3.org/2000/svg", n);
                break;
              case 2:
                u = i.createElementNS("http://www.w3.org/1998/Math/MathML", n);
                break;
              default:
                switch (n) {
                  case "svg":
                    u = i.createElementNS("http://www.w3.org/2000/svg", n);
                    break;
                  case "math":
                    u = i.createElementNS(
                      "http://www.w3.org/1998/Math/MathML",
                      n
                    );
                    break;
                  case "script":
                    (u = i.createElement("div")),
                      (u.innerHTML = "<script></script>"),
                      (u = u.removeChild(u.firstChild));
                    break;
                  case "select":
                    (u =
                      typeof a.is == "string"
                        ? i.createElement("select", { is: a.is })
                        : i.createElement("select")),
                      a.multiple
                        ? (u.multiple = !0)
                        : a.size && (u.size = a.size);
                    break;
                  default:
                    u =
                      typeof a.is == "string"
                        ? i.createElement(n, { is: a.is })
                        : i.createElement(n);
                }
            }
            (u[Jt] = l), (u[tl] = a);
            t: for (i = l.child; i !== null; ) {
              if (i.tag === 5 || i.tag === 6) u.appendChild(i.stateNode);
              else if (i.tag !== 4 && i.tag !== 27 && i.child !== null) {
                (i.child.return = i), (i = i.child);
                continue;
              }
              if (i === l) break t;
              for (; i.sibling === null; ) {
                if (i.return === null || i.return === l) break t;
                i = i.return;
              }
              (i.sibling.return = i.return), (i = i.sibling);
            }
            l.stateNode = u;
            t: switch ((Ft(u, n, a), n)) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                a = !!a.autoFocus;
                break t;
              case "img":
                a = !0;
                break t;
              default:
                a = !1;
            }
            a && Kl(l);
          }
        }
        return (
          zt(l),
          xc(l, l.type, t === null ? null : t.memoizedProps, l.pendingProps, e),
          null
        );
      case 6:
        if (t && l.stateNode != null) t.memoizedProps !== a && Kl(l);
        else {
          if (typeof a != "string" && l.stateNode === null) throw Error(r(166));
          if (((t = k.current), ca(l))) {
            if (
              ((t = l.stateNode),
              (e = l.memoizedProps),
              (a = null),
              (n = $t),
              n !== null)
            )
              switch (n.tag) {
                case 27:
                case 5:
                  a = n.memoizedProps;
              }
            (t[Jt] = l),
              (t = !!(
                t.nodeValue === e ||
                (a !== null && a.suppressHydrationWarning === !0) ||
                Qr(t.nodeValue, e)
              )),
              t || ie(l, !0);
          } else (t = Du(t).createTextNode(a)), (t[Jt] = l), (l.stateNode = t);
        }
        return zt(l), null;
      case 31:
        if (((e = l.memoizedState), t === null || t.memoizedState !== null)) {
          if (((a = ca(l)), e !== null)) {
            if (t === null) {
              if (!a) throw Error(r(318));
              if (
                ((t = l.memoizedState),
                (t = t !== null ? t.dehydrated : null),
                !t)
              )
                throw Error(r(557));
              t[Jt] = l;
            } else
              He(),
                (l.flags & 128) === 0 && (l.memoizedState = null),
                (l.flags |= 4);
            zt(l), (t = !1);
          } else
            (e = Mi()),
              t !== null &&
                t.memoizedState !== null &&
                (t.memoizedState.hydrationErrors = e),
              (t = !0);
          if (!t) return l.flags & 256 ? (ml(l), l) : (ml(l), null);
          if ((l.flags & 128) !== 0) throw Error(r(558));
        }
        return zt(l), null;
      case 13:
        if (
          ((a = l.memoizedState),
          t === null ||
            (t.memoizedState !== null && t.memoizedState.dehydrated !== null))
        ) {
          if (((n = ca(l)), a !== null && a.dehydrated !== null)) {
            if (t === null) {
              if (!n) throw Error(r(318));
              if (
                ((n = l.memoizedState),
                (n = n !== null ? n.dehydrated : null),
                !n)
              )
                throw Error(r(317));
              n[Jt] = l;
            } else
              He(),
                (l.flags & 128) === 0 && (l.memoizedState = null),
                (l.flags |= 4);
            zt(l), (n = !1);
          } else
            (n = Mi()),
              t !== null &&
                t.memoizedState !== null &&
                (t.memoizedState.hydrationErrors = n),
              (n = !0);
          if (!n) return l.flags & 256 ? (ml(l), l) : (ml(l), null);
        }
        return (
          ml(l),
          (l.flags & 128) !== 0
            ? ((l.lanes = e), l)
            : ((e = a !== null),
              (t = t !== null && t.memoizedState !== null),
              e &&
                ((a = l.child),
                (n = null),
                a.alternate !== null &&
                  a.alternate.memoizedState !== null &&
                  a.alternate.memoizedState.cachePool !== null &&
                  (n = a.alternate.memoizedState.cachePool.pool),
                (u = null),
                a.memoizedState !== null &&
                  a.memoizedState.cachePool !== null &&
                  (u = a.memoizedState.cachePool.pool),
                u !== n && (a.flags |= 2048)),
              e !== t && e && (l.child.flags |= 8192),
              hu(l, l.updateQueue),
              zt(l),
              null)
        );
      case 4:
        return yt(), t === null && Qc(l.stateNode.containerInfo), zt(l), null;
      case 10:
        return Ql(l.type), zt(l), null;
      case 19:
        if ((S(Rt), (a = l.memoizedState), a === null)) return zt(l), null;
        if (((n = (l.flags & 128) !== 0), (u = a.rendering), u === null))
          if (n) an(a, !1);
          else {
            if (Bt !== 0 || (t !== null && (t.flags & 128) !== 0))
              for (t = l.child; t !== null; ) {
                if (((u = lu(t)), u !== null)) {
                  for (
                    l.flags |= 128,
                      an(a, !1),
                      t = u.updateQueue,
                      l.updateQueue = t,
                      hu(l, t),
                      l.subtreeFlags = 0,
                      t = e,
                      e = l.child;
                    e !== null;

                  )
                    ps(e, t), (e = e.sibling);
                  return (
                    _(Rt, (Rt.current & 1) | 2),
                    mt && Xl(l, a.treeForkCount),
                    l.child
                  );
                }
                t = t.sibling;
              }
            a.tail !== null &&
              cl() > pu &&
              ((l.flags |= 128), (n = !0), an(a, !1), (l.lanes = 4194304));
          }
        else {
          if (!n)
            if (((t = lu(u)), t !== null)) {
              if (
                ((l.flags |= 128),
                (n = !0),
                (t = t.updateQueue),
                (l.updateQueue = t),
                hu(l, t),
                an(a, !0),
                a.tail === null &&
                  a.tailMode === "hidden" &&
                  !u.alternate &&
                  !mt)
              )
                return zt(l), null;
            } else
              2 * cl() - a.renderingStartTime > pu &&
                e !== 536870912 &&
                ((l.flags |= 128), (n = !0), an(a, !1), (l.lanes = 4194304));
          a.isBackwards
            ? ((u.sibling = l.child), (l.child = u))
            : ((t = a.last),
              t !== null ? (t.sibling = u) : (l.child = u),
              (a.last = u));
        }
        return a.tail !== null
          ? ((t = a.tail),
            (a.rendering = t),
            (a.tail = t.sibling),
            (a.renderingStartTime = cl()),
            (t.sibling = null),
            (e = Rt.current),
            _(Rt, n ? (e & 1) | 2 : e & 1),
            mt && Xl(l, a.treeForkCount),
            t)
          : (zt(l), null);
      case 22:
      case 23:
        return (
          ml(l),
          Zi(),
          (a = l.memoizedState !== null),
          t !== null
            ? (t.memoizedState !== null) !== a && (l.flags |= 8192)
            : a && (l.flags |= 8192),
          a
            ? (e & 536870912) !== 0 &&
              (l.flags & 128) === 0 &&
              (zt(l), l.subtreeFlags & 6 && (l.flags |= 8192))
            : zt(l),
          (e = l.updateQueue),
          e !== null && hu(l, e.retryQueue),
          (e = null),
          t !== null &&
            t.memoizedState !== null &&
            t.memoizedState.cachePool !== null &&
            (e = t.memoizedState.cachePool.pool),
          (a = null),
          l.memoizedState !== null &&
            l.memoizedState.cachePool !== null &&
            (a = l.memoizedState.cachePool.pool),
          a !== e && (l.flags |= 2048),
          t !== null && S(qe),
          null
        );
      case 24:
        return (
          (e = null),
          t !== null && (e = t.memoizedState.cache),
          l.memoizedState.cache !== e && (l.flags |= 2048),
          Ql(Gt),
          zt(l),
          null
        );
      case 25:
        return null;
      case 30:
        return null;
    }
    throw Error(r(156, l.tag));
  }
  function sh(t, l) {
    switch ((_i(l), l.tag)) {
      case 1:
        return (
          (t = l.flags), t & 65536 ? ((l.flags = (t & -65537) | 128), l) : null
        );
      case 3:
        return (
          Ql(Gt),
          yt(),
          (t = l.flags),
          (t & 65536) !== 0 && (t & 128) === 0
            ? ((l.flags = (t & -65537) | 128), l)
            : null
        );
      case 26:
      case 27:
      case 5:
        return te(l), null;
      case 31:
        if (l.memoizedState !== null) {
          if ((ml(l), l.alternate === null)) throw Error(r(340));
          He();
        }
        return (
          (t = l.flags), t & 65536 ? ((l.flags = (t & -65537) | 128), l) : null
        );
      case 13:
        if (
          (ml(l), (t = l.memoizedState), t !== null && t.dehydrated !== null)
        ) {
          if (l.alternate === null) throw Error(r(340));
          He();
        }
        return (
          (t = l.flags), t & 65536 ? ((l.flags = (t & -65537) | 128), l) : null
        );
      case 19:
        return S(Rt), null;
      case 4:
        return yt(), null;
      case 10:
        return Ql(l.type), null;
      case 22:
      case 23:
        return (
          ml(l),
          Zi(),
          t !== null && S(qe),
          (t = l.flags),
          t & 65536 ? ((l.flags = (t & -65537) | 128), l) : null
        );
      case 24:
        return Ql(Gt), null;
      case 25:
        return null;
      default:
        return null;
    }
  }
  function Jo(t, l) {
    switch ((_i(l), l.tag)) {
      case 3:
        Ql(Gt), yt();
        break;
      case 26:
      case 27:
      case 5:
        te(l);
        break;
      case 4:
        yt();
        break;
      case 31:
        l.memoizedState !== null && ml(l);
        break;
      case 13:
        ml(l);
        break;
      case 19:
        S(Rt);
        break;
      case 10:
        Ql(l.type);
        break;
      case 22:
      case 23:
        ml(l), Zi(), t !== null && S(qe);
        break;
      case 24:
        Ql(Gt);
    }
  }
  function nn(t, l) {
    try {
      var e = l.updateQueue,
        a = e !== null ? e.lastEffect : null;
      if (a !== null) {
        var n = a.next;
        e = n;
        do {
          if ((e.tag & t) === t) {
            a = void 0;
            var u = e.create,
              i = e.inst;
            (a = u()), (i.destroy = a);
          }
          e = e.next;
        } while (e !== n);
      }
    } catch (c) {
      xt(l, l.return, c);
    }
  }
  function me(t, l, e) {
    try {
      var a = l.updateQueue,
        n = a !== null ? a.lastEffect : null;
      if (n !== null) {
        var u = n.next;
        a = u;
        do {
          if ((a.tag & t) === t) {
            var i = a.inst,
              c = i.destroy;
            if (c !== void 0) {
              (i.destroy = void 0), (n = l);
              var o = e,
                y = c;
              try {
                y();
              } catch (T) {
                xt(n, o, T);
              }
            }
          }
          a = a.next;
        } while (a !== u);
      }
    } catch (T) {
      xt(l, l.return, T);
    }
  }
  function $o(t) {
    var l = t.updateQueue;
    if (l !== null) {
      var e = t.stateNode;
      try {
        qs(l, e);
      } catch (a) {
        xt(t, t.return, a);
      }
    }
  }
  function ko(t, l, e) {
    (e.props = Qe(t.type, t.memoizedProps)), (e.state = t.memoizedState);
    try {
      e.componentWillUnmount();
    } catch (a) {
      xt(t, l, a);
    }
  }
  function un(t, l) {
    try {
      var e = t.ref;
      if (e !== null) {
        switch (t.tag) {
          case 26:
          case 27:
          case 5:
            var a = t.stateNode;
            break;
          case 30:
            a = t.stateNode;
            break;
          default:
            a = t.stateNode;
        }
        typeof e == "function" ? (t.refCleanup = e(a)) : (e.current = a);
      }
    } catch (n) {
      xt(t, l, n);
    }
  }
  function Cl(t, l) {
    var e = t.ref,
      a = t.refCleanup;
    if (e !== null)
      if (typeof a == "function")
        try {
          a();
        } catch (n) {
          xt(t, l, n);
        } finally {
          (t.refCleanup = null),
            (t = t.alternate),
            t != null && (t.refCleanup = null);
        }
      else if (typeof e == "function")
        try {
          e(null);
        } catch (n) {
          xt(t, l, n);
        }
      else e.current = null;
  }
  function Wo(t) {
    var l = t.type,
      e = t.memoizedProps,
      a = t.stateNode;
    try {
      t: switch (l) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          e.autoFocus && a.focus();
          break t;
        case "img":
          e.src ? (a.src = e.src) : e.srcSet && (a.srcset = e.srcSet);
      }
    } catch (n) {
      xt(t, t.return, n);
    }
  }
  function Sc(t, l, e) {
    try {
      var a = t.stateNode;
      Oh(a, t.type, e, l), (a[tl] = l);
    } catch (n) {
      xt(t, t.return, n);
    }
  }
  function Fo(t) {
    return (
      t.tag === 5 ||
      t.tag === 3 ||
      t.tag === 26 ||
      (t.tag === 27 && xe(t.type)) ||
      t.tag === 4
    );
  }
  function Tc(t) {
    t: for (;;) {
      for (; t.sibling === null; ) {
        if (t.return === null || Fo(t.return)) return null;
        t = t.return;
      }
      for (
        t.sibling.return = t.return, t = t.sibling;
        t.tag !== 5 && t.tag !== 6 && t.tag !== 18;

      ) {
        if (
          (t.tag === 27 && xe(t.type)) ||
          t.flags & 2 ||
          t.child === null ||
          t.tag === 4
        )
          continue t;
        (t.child.return = t), (t = t.child);
      }
      if (!(t.flags & 2)) return t.stateNode;
    }
  }
  function Ec(t, l, e) {
    var a = t.tag;
    if (a === 5 || a === 6)
      (t = t.stateNode),
        l
          ? (e.nodeType === 9
              ? e.body
              : e.nodeName === "HTML"
              ? e.ownerDocument.body
              : e
            ).insertBefore(t, l)
          : ((l =
              e.nodeType === 9
                ? e.body
                : e.nodeName === "HTML"
                ? e.ownerDocument.body
                : e),
            l.appendChild(t),
            (e = e._reactRootContainer),
            e != null || l.onclick !== null || (l.onclick = ql));
    else if (
      a !== 4 &&
      (a === 27 && xe(t.type) && ((e = t.stateNode), (l = null)),
      (t = t.child),
      t !== null)
    )
      for (Ec(t, l, e), t = t.sibling; t !== null; )
        Ec(t, l, e), (t = t.sibling);
  }
  function gu(t, l, e) {
    var a = t.tag;
    if (a === 5 || a === 6)
      (t = t.stateNode), l ? e.insertBefore(t, l) : e.appendChild(t);
    else if (
      a !== 4 &&
      (a === 27 && xe(t.type) && (e = t.stateNode), (t = t.child), t !== null)
    )
      for (gu(t, l, e), t = t.sibling; t !== null; )
        gu(t, l, e), (t = t.sibling);
  }
  function Io(t) {
    var l = t.stateNode,
      e = t.memoizedProps;
    try {
      for (var a = t.type, n = l.attributes; n.length; )
        l.removeAttributeNode(n[0]);
      Ft(l, a, e), (l[Jt] = t), (l[tl] = e);
    } catch (u) {
      xt(t, t.return, u);
    }
  }
  var Jl = !1,
    Qt = !1,
    Nc = !1,
    Po = typeof WeakSet == "function" ? WeakSet : Set,
    Kt = null;
  function oh(t, l) {
    if (((t = t.containerInfo), (Vc = Ru), (t = os(t)), yi(t))) {
      if ("selectionStart" in t)
        var e = { start: t.selectionStart, end: t.selectionEnd };
      else
        t: {
          e = ((e = t.ownerDocument) && e.defaultView) || window;
          var a = e.getSelection && e.getSelection();
          if (a && a.rangeCount !== 0) {
            e = a.anchorNode;
            var n = a.anchorOffset,
              u = a.focusNode;
            a = a.focusOffset;
            try {
              e.nodeType, u.nodeType;
            } catch {
              e = null;
              break t;
            }
            var i = 0,
              c = -1,
              o = -1,
              y = 0,
              T = 0,
              N = t,
              b = null;
            l: for (;;) {
              for (
                var x;
                N !== e || (n !== 0 && N.nodeType !== 3) || (c = i + n),
                  N !== u || (a !== 0 && N.nodeType !== 3) || (o = i + a),
                  N.nodeType === 3 && (i += N.nodeValue.length),
                  (x = N.firstChild) !== null;

              )
                (b = N), (N = x);
              for (;;) {
                if (N === t) break l;
                if (
                  (b === e && ++y === n && (c = i),
                  b === u && ++T === a && (o = i),
                  (x = N.nextSibling) !== null)
                )
                  break;
                (N = b), (b = N.parentNode);
              }
              N = x;
            }
            e = c === -1 || o === -1 ? null : { start: c, end: o };
          } else e = null;
        }
      e = e || { start: 0, end: 0 };
    } else e = null;
    for (
      Kc = { focusedElem: t, selectionRange: e }, Ru = !1, Kt = l;
      Kt !== null;

    )
      if (
        ((l = Kt), (t = l.child), (l.subtreeFlags & 1028) !== 0 && t !== null)
      )
        (t.return = l), (Kt = t);
      else
        for (; Kt !== null; ) {
          switch (((l = Kt), (u = l.alternate), (t = l.flags), l.tag)) {
            case 0:
              if (
                (t & 4) !== 0 &&
                ((t = l.updateQueue),
                (t = t !== null ? t.events : null),
                t !== null)
              )
                for (e = 0; e < t.length; e++)
                  (n = t[e]), (n.ref.impl = n.nextImpl);
              break;
            case 11:
            case 15:
              break;
            case 1:
              if ((t & 1024) !== 0 && u !== null) {
                (t = void 0),
                  (e = l),
                  (n = u.memoizedProps),
                  (u = u.memoizedState),
                  (a = e.stateNode);
                try {
                  var L = Qe(e.type, n);
                  (t = a.getSnapshotBeforeUpdate(L, u)),
                    (a.__reactInternalSnapshotBeforeUpdate = t);
                } catch ($) {
                  xt(e, e.return, $);
                }
              }
              break;
            case 3:
              if ((t & 1024) !== 0) {
                if (
                  ((t = l.stateNode.containerInfo), (e = t.nodeType), e === 9)
                )
                  kc(t);
                else if (e === 1)
                  switch (t.nodeName) {
                    case "HEAD":
                    case "HTML":
                    case "BODY":
                      kc(t);
                      break;
                    default:
                      t.textContent = "";
                  }
              }
              break;
            case 5:
            case 26:
            case 27:
            case 6:
            case 4:
            case 17:
              break;
            default:
              if ((t & 1024) !== 0) throw Error(r(163));
          }
          if (((t = l.sibling), t !== null)) {
            (t.return = l.return), (Kt = t);
            break;
          }
          Kt = l.return;
        }
  }
  function tr(t, l, e) {
    var a = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        kl(t, e), a & 4 && nn(5, e);
        break;
      case 1:
        if ((kl(t, e), a & 4))
          if (((t = e.stateNode), l === null))
            try {
              t.componentDidMount();
            } catch (i) {
              xt(e, e.return, i);
            }
          else {
            var n = Qe(e.type, l.memoizedProps);
            l = l.memoizedState;
            try {
              t.componentDidUpdate(n, l, t.__reactInternalSnapshotBeforeUpdate);
            } catch (i) {
              xt(e, e.return, i);
            }
          }
        a & 64 && $o(e), a & 512 && un(e, e.return);
        break;
      case 3:
        if ((kl(t, e), a & 64 && ((t = e.updateQueue), t !== null))) {
          if (((l = null), e.child !== null))
            switch (e.child.tag) {
              case 27:
              case 5:
                l = e.child.stateNode;
                break;
              case 1:
                l = e.child.stateNode;
            }
          try {
            qs(t, l);
          } catch (i) {
            xt(e, e.return, i);
          }
        }
        break;
      case 27:
        l === null && a & 4 && Io(e);
      case 26:
      case 5:
        kl(t, e), l === null && a & 4 && Wo(e), a & 512 && un(e, e.return);
        break;
      case 12:
        kl(t, e);
        break;
      case 31:
        kl(t, e), a & 4 && ar(t, e);
        break;
      case 13:
        kl(t, e),
          a & 4 && nr(t, e),
          a & 64 &&
            ((t = e.memoizedState),
            t !== null &&
              ((t = t.dehydrated),
              t !== null && ((e = ph.bind(null, e)), Gh(t, e))));
        break;
      case 22:
        if (((a = e.memoizedState !== null || Jl), !a)) {
          (l = (l !== null && l.memoizedState !== null) || Qt), (n = Jl);
          var u = Qt;
          (Jl = a),
            (Qt = l) && !u ? Wl(t, e, (e.subtreeFlags & 8772) !== 0) : kl(t, e),
            (Jl = n),
            (Qt = u);
        }
        break;
      case 30:
        break;
      default:
        kl(t, e);
    }
  }
  function lr(t) {
    var l = t.alternate;
    l !== null && ((t.alternate = null), lr(l)),
      (t.child = null),
      (t.deletions = null),
      (t.sibling = null),
      t.tag === 5 && ((l = t.stateNode), l !== null && ti(l)),
      (t.stateNode = null),
      (t.return = null),
      (t.dependencies = null),
      (t.memoizedProps = null),
      (t.memoizedState = null),
      (t.pendingProps = null),
      (t.stateNode = null),
      (t.updateQueue = null);
  }
  var _t = null,
    el = !1;
  function $l(t, l, e) {
    for (e = e.child; e !== null; ) er(t, l, e), (e = e.sibling);
  }
  function er(t, l, e) {
    if (fl && typeof fl.onCommitFiberUnmount == "function")
      try {
        fl.onCommitFiberUnmount(Da, e);
      } catch {}
    switch (e.tag) {
      case 26:
        Qt || Cl(e, l),
          $l(t, l, e),
          e.memoizedState
            ? e.memoizedState.count--
            : e.stateNode && ((e = e.stateNode), e.parentNode.removeChild(e));
        break;
      case 27:
        Qt || Cl(e, l);
        var a = _t,
          n = el;
        xe(e.type) && ((_t = e.stateNode), (el = !1)),
          $l(t, l, e),
          gn(e.stateNode),
          (_t = a),
          (el = n);
        break;
      case 5:
        Qt || Cl(e, l);
      case 6:
        if (
          ((a = _t),
          (n = el),
          (_t = null),
          $l(t, l, e),
          (_t = a),
          (el = n),
          _t !== null)
        )
          if (el)
            try {
              (_t.nodeType === 9
                ? _t.body
                : _t.nodeName === "HTML"
                ? _t.ownerDocument.body
                : _t
              ).removeChild(e.stateNode);
            } catch (u) {
              xt(e, l, u);
            }
          else
            try {
              _t.removeChild(e.stateNode);
            } catch (u) {
              xt(e, l, u);
            }
        break;
      case 18:
        _t !== null &&
          (el
            ? ((t = _t),
              $r(
                t.nodeType === 9
                  ? t.body
                  : t.nodeName === "HTML"
                  ? t.ownerDocument.body
                  : t,
                e.stateNode
              ),
              _a(t))
            : $r(_t, e.stateNode));
        break;
      case 4:
        (a = _t),
          (n = el),
          (_t = e.stateNode.containerInfo),
          (el = !0),
          $l(t, l, e),
          (_t = a),
          (el = n);
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        me(2, e, l), Qt || me(4, e, l), $l(t, l, e);
        break;
      case 1:
        Qt ||
          (Cl(e, l),
          (a = e.stateNode),
          typeof a.componentWillUnmount == "function" && ko(e, l, a)),
          $l(t, l, e);
        break;
      case 21:
        $l(t, l, e);
        break;
      case 22:
        (Qt = (a = Qt) || e.memoizedState !== null), $l(t, l, e), (Qt = a);
        break;
      default:
        $l(t, l, e);
    }
  }
  function ar(t, l) {
    if (
      l.memoizedState === null &&
      ((t = l.alternate), t !== null && ((t = t.memoizedState), t !== null))
    ) {
      t = t.dehydrated;
      try {
        _a(t);
      } catch (e) {
        xt(l, l.return, e);
      }
    }
  }
  function nr(t, l) {
    if (
      l.memoizedState === null &&
      ((t = l.alternate),
      t !== null &&
        ((t = t.memoizedState), t !== null && ((t = t.dehydrated), t !== null)))
    )
      try {
        _a(t);
      } catch (e) {
        xt(l, l.return, e);
      }
  }
  function rh(t) {
    switch (t.tag) {
      case 31:
      case 13:
      case 19:
        var l = t.stateNode;
        return l === null && (l = t.stateNode = new Po()), l;
      case 22:
        return (
          (t = t.stateNode),
          (l = t._retryCache),
          l === null && (l = t._retryCache = new Po()),
          l
        );
      default:
        throw Error(r(435, t.tag));
    }
  }
  function vu(t, l) {
    var e = rh(t);
    l.forEach(function (a) {
      if (!e.has(a)) {
        e.add(a);
        var n = xh.bind(null, t, a);
        a.then(n, n);
      }
    });
  }
  function al(t, l) {
    var e = l.deletions;
    if (e !== null)
      for (var a = 0; a < e.length; a++) {
        var n = e[a],
          u = t,
          i = l,
          c = i;
        t: for (; c !== null; ) {
          switch (c.tag) {
            case 27:
              if (xe(c.type)) {
                (_t = c.stateNode), (el = !1);
                break t;
              }
              break;
            case 5:
              (_t = c.stateNode), (el = !1);
              break t;
            case 3:
            case 4:
              (_t = c.stateNode.containerInfo), (el = !0);
              break t;
          }
          c = c.return;
        }
        if (_t === null) throw Error(r(160));
        er(u, i, n),
          (_t = null),
          (el = !1),
          (u = n.alternate),
          u !== null && (u.return = null),
          (n.return = null);
      }
    if (l.subtreeFlags & 13886)
      for (l = l.child; l !== null; ) ur(l, t), (l = l.sibling);
  }
  var _l = null;
  function ur(t, l) {
    var e = t.alternate,
      a = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        al(l, t),
          nl(t),
          a & 4 && (me(3, t, t.return), nn(3, t), me(5, t, t.return));
        break;
      case 1:
        al(l, t),
          nl(t),
          a & 512 && (Qt || e === null || Cl(e, e.return)),
          a & 64 &&
            Jl &&
            ((t = t.updateQueue),
            t !== null &&
              ((a = t.callbacks),
              a !== null &&
                ((e = t.shared.hiddenCallbacks),
                (t.shared.hiddenCallbacks = e === null ? a : e.concat(a)))));
        break;
      case 26:
        var n = _l;
        if (
          (al(l, t),
          nl(t),
          a & 512 && (Qt || e === null || Cl(e, e.return)),
          a & 4)
        ) {
          var u = e !== null ? e.memoizedState : null;
          if (((a = t.memoizedState), e === null))
            if (a === null)
              if (t.stateNode === null) {
                t: {
                  (a = t.type),
                    (e = t.memoizedProps),
                    (n = n.ownerDocument || n);
                  l: switch (a) {
                    case "title":
                      (u = n.getElementsByTagName("title")[0]),
                        (!u ||
                          u[Ca] ||
                          u[Jt] ||
                          u.namespaceURI === "http://www.w3.org/2000/svg" ||
                          u.hasAttribute("itemprop")) &&
                          ((u = n.createElement(a)),
                          n.head.insertBefore(
                            u,
                            n.querySelector("head > title")
                          )),
                        Ft(u, a, e),
                        (u[Jt] = t),
                        Vt(u),
                        (a = u);
                      break t;
                    case "link":
                      var i = ud("link", "href", n).get(a + (e.href || ""));
                      if (i) {
                        for (var c = 0; c < i.length; c++)
                          if (
                            ((u = i[c]),
                            u.getAttribute("href") ===
                              (e.href == null || e.href === ""
                                ? null
                                : e.href) &&
                              u.getAttribute("rel") ===
                                (e.rel == null ? null : e.rel) &&
                              u.getAttribute("title") ===
                                (e.title == null ? null : e.title) &&
                              u.getAttribute("crossorigin") ===
                                (e.crossOrigin == null ? null : e.crossOrigin))
                          ) {
                            i.splice(c, 1);
                            break l;
                          }
                      }
                      (u = n.createElement(a)),
                        Ft(u, a, e),
                        n.head.appendChild(u);
                      break;
                    case "meta":
                      if (
                        (i = ud("meta", "content", n).get(
                          a + (e.content || "")
                        ))
                      ) {
                        for (c = 0; c < i.length; c++)
                          if (
                            ((u = i[c]),
                            u.getAttribute("content") ===
                              (e.content == null ? null : "" + e.content) &&
                              u.getAttribute("name") ===
                                (e.name == null ? null : e.name) &&
                              u.getAttribute("property") ===
                                (e.property == null ? null : e.property) &&
                              u.getAttribute("http-equiv") ===
                                (e.httpEquiv == null ? null : e.httpEquiv) &&
                              u.getAttribute("charset") ===
                                (e.charSet == null ? null : e.charSet))
                          ) {
                            i.splice(c, 1);
                            break l;
                          }
                      }
                      (u = n.createElement(a)),
                        Ft(u, a, e),
                        n.head.appendChild(u);
                      break;
                    default:
                      throw Error(r(468, a));
                  }
                  (u[Jt] = t), Vt(u), (a = u);
                }
                t.stateNode = a;
              } else id(n, t.type, t.stateNode);
            else t.stateNode = nd(n, a, t.memoizedProps);
          else
            u !== a
              ? (u === null
                  ? e.stateNode !== null &&
                    ((e = e.stateNode), e.parentNode.removeChild(e))
                  : u.count--,
                a === null
                  ? id(n, t.type, t.stateNode)
                  : nd(n, a, t.memoizedProps))
              : a === null &&
                t.stateNode !== null &&
                Sc(t, t.memoizedProps, e.memoizedProps);
        }
        break;
      case 27:
        al(l, t),
          nl(t),
          a & 512 && (Qt || e === null || Cl(e, e.return)),
          e !== null && a & 4 && Sc(t, t.memoizedProps, e.memoizedProps);
        break;
      case 5:
        if (
          (al(l, t),
          nl(t),
          a & 512 && (Qt || e === null || Cl(e, e.return)),
          t.flags & 32)
        ) {
          n = t.stateNode;
          try {
            Fe(n, "");
          } catch (L) {
            xt(t, t.return, L);
          }
        }
        a & 4 &&
          t.stateNode != null &&
          ((n = t.memoizedProps), Sc(t, n, e !== null ? e.memoizedProps : n)),
          a & 1024 && (Nc = !0);
        break;
      case 6:
        if ((al(l, t), nl(t), a & 4)) {
          if (t.stateNode === null) throw Error(r(162));
          (a = t.memoizedProps), (e = t.stateNode);
          try {
            e.nodeValue = a;
          } catch (L) {
            xt(t, t.return, L);
          }
        }
        break;
      case 3:
        if (
          ((Cu = null),
          (n = _l),
          (_l = Mu(l.containerInfo)),
          al(l, t),
          (_l = n),
          nl(t),
          a & 4 && e !== null && e.memoizedState.isDehydrated)
        )
          try {
            _a(l.containerInfo);
          } catch (L) {
            xt(t, t.return, L);
          }
        Nc && ((Nc = !1), ir(t));
        break;
      case 4:
        (a = _l),
          (_l = Mu(t.stateNode.containerInfo)),
          al(l, t),
          nl(t),
          (_l = a);
        break;
      case 12:
        al(l, t), nl(t);
        break;
      case 31:
        al(l, t),
          nl(t),
          a & 4 &&
            ((a = t.updateQueue),
            a !== null && ((t.updateQueue = null), vu(t, a)));
        break;
      case 13:
        al(l, t),
          nl(t),
          t.child.flags & 8192 &&
            (t.memoizedState !== null) !=
              (e !== null && e.memoizedState !== null) &&
            (bu = cl()),
          a & 4 &&
            ((a = t.updateQueue),
            a !== null && ((t.updateQueue = null), vu(t, a)));
        break;
      case 22:
        n = t.memoizedState !== null;
        var o = e !== null && e.memoizedState !== null,
          y = Jl,
          T = Qt;
        if (
          ((Jl = y || n),
          (Qt = T || o),
          al(l, t),
          (Qt = T),
          (Jl = y),
          nl(t),
          a & 8192)
        )
          t: for (
            l = t.stateNode,
              l._visibility = n ? l._visibility & -2 : l._visibility | 1,
              n && (e === null || o || Jl || Qt || Ze(t)),
              e = null,
              l = t;
            ;

          ) {
            if (l.tag === 5 || l.tag === 26) {
              if (e === null) {
                o = e = l;
                try {
                  if (((u = o.stateNode), n))
                    (i = u.style),
                      typeof i.setProperty == "function"
                        ? i.setProperty("display", "none", "important")
                        : (i.display = "none");
                  else {
                    c = o.stateNode;
                    var N = o.memoizedProps.style,
                      b =
                        N != null && N.hasOwnProperty("display")
                          ? N.display
                          : null;
                    c.style.display =
                      b == null || typeof b == "boolean" ? "" : ("" + b).trim();
                  }
                } catch (L) {
                  xt(o, o.return, L);
                }
              }
            } else if (l.tag === 6) {
              if (e === null) {
                o = l;
                try {
                  o.stateNode.nodeValue = n ? "" : o.memoizedProps;
                } catch (L) {
                  xt(o, o.return, L);
                }
              }
            } else if (l.tag === 18) {
              if (e === null) {
                o = l;
                try {
                  var x = o.stateNode;
                  n ? kr(x, !0) : kr(o.stateNode, !1);
                } catch (L) {
                  xt(o, o.return, L);
                }
              }
            } else if (
              ((l.tag !== 22 && l.tag !== 23) ||
                l.memoizedState === null ||
                l === t) &&
              l.child !== null
            ) {
              (l.child.return = l), (l = l.child);
              continue;
            }
            if (l === t) break t;
            for (; l.sibling === null; ) {
              if (l.return === null || l.return === t) break t;
              e === l && (e = null), (l = l.return);
            }
            e === l && (e = null),
              (l.sibling.return = l.return),
              (l = l.sibling);
          }
        a & 4 &&
          ((a = t.updateQueue),
          a !== null &&
            ((e = a.retryQueue),
            e !== null && ((a.retryQueue = null), vu(t, e))));
        break;
      case 19:
        al(l, t),
          nl(t),
          a & 4 &&
            ((a = t.updateQueue),
            a !== null && ((t.updateQueue = null), vu(t, a)));
        break;
      case 30:
        break;
      case 21:
        break;
      default:
        al(l, t), nl(t);
    }
  }
  function nl(t) {
    var l = t.flags;
    if (l & 2) {
      try {
        for (var e, a = t.return; a !== null; ) {
          if (Fo(a)) {
            e = a;
            break;
          }
          a = a.return;
        }
        if (e == null) throw Error(r(160));
        switch (e.tag) {
          case 27:
            var n = e.stateNode,
              u = Tc(t);
            gu(t, u, n);
            break;
          case 5:
            var i = e.stateNode;
            e.flags & 32 && (Fe(i, ""), (e.flags &= -33));
            var c = Tc(t);
            gu(t, c, i);
            break;
          case 3:
          case 4:
            var o = e.stateNode.containerInfo,
              y = Tc(t);
            Ec(t, y, o);
            break;
          default:
            throw Error(r(161));
        }
      } catch (T) {
        xt(t, t.return, T);
      }
      t.flags &= -3;
    }
    l & 4096 && (t.flags &= -4097);
  }
  function ir(t) {
    if (t.subtreeFlags & 1024)
      for (t = t.child; t !== null; ) {
        var l = t;
        ir(l),
          l.tag === 5 && l.flags & 1024 && l.stateNode.reset(),
          (t = t.sibling);
      }
  }
  function kl(t, l) {
    if (l.subtreeFlags & 8772)
      for (l = l.child; l !== null; ) tr(t, l.alternate, l), (l = l.sibling);
  }
  function Ze(t) {
    for (t = t.child; t !== null; ) {
      var l = t;
      switch (l.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          me(4, l, l.return), Ze(l);
          break;
        case 1:
          Cl(l, l.return);
          var e = l.stateNode;
          typeof e.componentWillUnmount == "function" && ko(l, l.return, e),
            Ze(l);
          break;
        case 27:
          gn(l.stateNode);
        case 26:
        case 5:
          Cl(l, l.return), Ze(l);
          break;
        case 22:
          l.memoizedState === null && Ze(l);
          break;
        case 30:
          Ze(l);
          break;
        default:
          Ze(l);
      }
      t = t.sibling;
    }
  }
  function Wl(t, l, e) {
    for (e = e && (l.subtreeFlags & 8772) !== 0, l = l.child; l !== null; ) {
      var a = l.alternate,
        n = t,
        u = l,
        i = u.flags;
      switch (u.tag) {
        case 0:
        case 11:
        case 15:
          Wl(n, u, e), nn(4, u);
          break;
        case 1:
          if (
            (Wl(n, u, e),
            (a = u),
            (n = a.stateNode),
            typeof n.componentDidMount == "function")
          )
            try {
              n.componentDidMount();
            } catch (y) {
              xt(a, a.return, y);
            }
          if (((a = u), (n = a.updateQueue), n !== null)) {
            var c = a.stateNode;
            try {
              var o = n.shared.hiddenCallbacks;
              if (o !== null)
                for (n.shared.hiddenCallbacks = null, n = 0; n < o.length; n++)
                  Rs(o[n], c);
            } catch (y) {
              xt(a, a.return, y);
            }
          }
          e && i & 64 && $o(u), un(u, u.return);
          break;
        case 27:
          Io(u);
        case 26:
        case 5:
          Wl(n, u, e), e && a === null && i & 4 && Wo(u), un(u, u.return);
          break;
        case 12:
          Wl(n, u, e);
          break;
        case 31:
          Wl(n, u, e), e && i & 4 && ar(n, u);
          break;
        case 13:
          Wl(n, u, e), e && i & 4 && nr(n, u);
          break;
        case 22:
          u.memoizedState === null && Wl(n, u, e), un(u, u.return);
          break;
        case 30:
          break;
        default:
          Wl(n, u, e);
      }
      l = l.sibling;
    }
  }
  function Ac(t, l) {
    var e = null;
    t !== null &&
      t.memoizedState !== null &&
      t.memoizedState.cachePool !== null &&
      (e = t.memoizedState.cachePool.pool),
      (t = null),
      l.memoizedState !== null &&
        l.memoizedState.cachePool !== null &&
        (t = l.memoizedState.cachePool.pool),
      t !== e && (t != null && t.refCount++, e != null && Va(e));
  }
  function jc(t, l) {
    (t = null),
      l.alternate !== null && (t = l.alternate.memoizedState.cache),
      (l = l.memoizedState.cache),
      l !== t && (l.refCount++, t != null && Va(t));
  }
  function Dl(t, l, e, a) {
    if (l.subtreeFlags & 10256)
      for (l = l.child; l !== null; ) cr(t, l, e, a), (l = l.sibling);
  }
  function cr(t, l, e, a) {
    var n = l.flags;
    switch (l.tag) {
      case 0:
      case 11:
      case 15:
        Dl(t, l, e, a), n & 2048 && nn(9, l);
        break;
      case 1:
        Dl(t, l, e, a);
        break;
      case 3:
        Dl(t, l, e, a),
          n & 2048 &&
            ((t = null),
            l.alternate !== null && (t = l.alternate.memoizedState.cache),
            (l = l.memoizedState.cache),
            l !== t && (l.refCount++, t != null && Va(t)));
        break;
      case 12:
        if (n & 2048) {
          Dl(t, l, e, a), (t = l.stateNode);
          try {
            var u = l.memoizedProps,
              i = u.id,
              c = u.onPostCommit;
            typeof c == "function" &&
              c(
                i,
                l.alternate === null ? "mount" : "update",
                t.passiveEffectDuration,
                -0
              );
          } catch (o) {
            xt(l, l.return, o);
          }
        } else Dl(t, l, e, a);
        break;
      case 31:
        Dl(t, l, e, a);
        break;
      case 13:
        Dl(t, l, e, a);
        break;
      case 23:
        break;
      case 22:
        (u = l.stateNode),
          (i = l.alternate),
          l.memoizedState !== null
            ? u._visibility & 2
              ? Dl(t, l, e, a)
              : cn(t, l)
            : u._visibility & 2
            ? Dl(t, l, e, a)
            : ((u._visibility |= 2),
              ya(t, l, e, a, (l.subtreeFlags & 10256) !== 0 || !1)),
          n & 2048 && Ac(i, l);
        break;
      case 24:
        Dl(t, l, e, a), n & 2048 && jc(l.alternate, l);
        break;
      default:
        Dl(t, l, e, a);
    }
  }
  function ya(t, l, e, a, n) {
    for (
      n = n && ((l.subtreeFlags & 10256) !== 0 || !1), l = l.child;
      l !== null;

    ) {
      var u = t,
        i = l,
        c = e,
        o = a,
        y = i.flags;
      switch (i.tag) {
        case 0:
        case 11:
        case 15:
          ya(u, i, c, o, n), nn(8, i);
          break;
        case 23:
          break;
        case 22:
          var T = i.stateNode;
          i.memoizedState !== null
            ? T._visibility & 2
              ? ya(u, i, c, o, n)
              : cn(u, i)
            : ((T._visibility |= 2), ya(u, i, c, o, n)),
            n && y & 2048 && Ac(i.alternate, i);
          break;
        case 24:
          ya(u, i, c, o, n), n && y & 2048 && jc(i.alternate, i);
          break;
        default:
          ya(u, i, c, o, n);
      }
      l = l.sibling;
    }
  }
  function cn(t, l) {
    if (l.subtreeFlags & 10256)
      for (l = l.child; l !== null; ) {
        var e = t,
          a = l,
          n = a.flags;
        switch (a.tag) {
          case 22:
            cn(e, a), n & 2048 && Ac(a.alternate, a);
            break;
          case 24:
            cn(e, a), n & 2048 && jc(a.alternate, a);
            break;
          default:
            cn(e, a);
        }
        l = l.sibling;
      }
  }
  var fn = 8192;
  function ba(t, l, e) {
    if (t.subtreeFlags & fn)
      for (t = t.child; t !== null; ) fr(t, l, e), (t = t.sibling);
  }
  function fr(t, l, e) {
    switch (t.tag) {
      case 26:
        ba(t, l, e),
          t.flags & fn &&
            t.memoizedState !== null &&
            Fh(e, _l, t.memoizedState, t.memoizedProps);
        break;
      case 5:
        ba(t, l, e);
        break;
      case 3:
      case 4:
        var a = _l;
        (_l = Mu(t.stateNode.containerInfo)), ba(t, l, e), (_l = a);
        break;
      case 22:
        t.memoizedState === null &&
          ((a = t.alternate),
          a !== null && a.memoizedState !== null
            ? ((a = fn), (fn = 16777216), ba(t, l, e), (fn = a))
            : ba(t, l, e));
        break;
      default:
        ba(t, l, e);
    }
  }
  function sr(t) {
    var l = t.alternate;
    if (l !== null && ((t = l.child), t !== null)) {
      l.child = null;
      do (l = t.sibling), (t.sibling = null), (t = l);
      while (t !== null);
    }
  }
  function sn(t) {
    var l = t.deletions;
    if ((t.flags & 16) !== 0) {
      if (l !== null)
        for (var e = 0; e < l.length; e++) {
          var a = l[e];
          (Kt = a), rr(a, t);
        }
      sr(t);
    }
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; ) or(t), (t = t.sibling);
  }
  function or(t) {
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        sn(t), t.flags & 2048 && me(9, t, t.return);
        break;
      case 3:
        sn(t);
        break;
      case 12:
        sn(t);
        break;
      case 22:
        var l = t.stateNode;
        t.memoizedState !== null &&
        l._visibility & 2 &&
        (t.return === null || t.return.tag !== 13)
          ? ((l._visibility &= -3), yu(t))
          : sn(t);
        break;
      default:
        sn(t);
    }
  }
  function yu(t) {
    var l = t.deletions;
    if ((t.flags & 16) !== 0) {
      if (l !== null)
        for (var e = 0; e < l.length; e++) {
          var a = l[e];
          (Kt = a), rr(a, t);
        }
      sr(t);
    }
    for (t = t.child; t !== null; ) {
      switch (((l = t), l.tag)) {
        case 0:
        case 11:
        case 15:
          me(8, l, l.return), yu(l);
          break;
        case 22:
          (e = l.stateNode),
            e._visibility & 2 && ((e._visibility &= -3), yu(l));
          break;
        default:
          yu(l);
      }
      t = t.sibling;
    }
  }
  function rr(t, l) {
    for (; Kt !== null; ) {
      var e = Kt;
      switch (e.tag) {
        case 0:
        case 11:
        case 15:
          me(8, e, l);
          break;
        case 23:
        case 22:
          if (e.memoizedState !== null && e.memoizedState.cachePool !== null) {
            var a = e.memoizedState.cachePool.pool;
            a != null && a.refCount++;
          }
          break;
        case 24:
          Va(e.memoizedState.cache);
      }
      if (((a = e.child), a !== null)) (a.return = e), (Kt = a);
      else
        t: for (e = t; Kt !== null; ) {
          a = Kt;
          var n = a.sibling,
            u = a.return;
          if ((lr(a), a === e)) {
            Kt = null;
            break t;
          }
          if (n !== null) {
            (n.return = u), (Kt = n);
            break t;
          }
          Kt = u;
        }
    }
  }
  var dh = {
      getCacheForType: function (t) {
        var l = kt(Gt),
          e = l.data.get(t);
        return e === void 0 && ((e = t()), l.data.set(t, e)), e;
      },
      cacheSignal: function () {
        return kt(Gt).controller.signal;
      },
    },
    mh = typeof WeakMap == "function" ? WeakMap : Map,
    vt = 0,
    At = null,
    it = null,
    ot = 0,
    pt = 0,
    hl = null,
    he = !1,
    pa = !1,
    zc = !1,
    Fl = 0,
    Bt = 0,
    ge = 0,
    we = 0,
    _c = 0,
    gl = 0,
    xa = 0,
    on = null,
    ul = null,
    Dc = !1,
    bu = 0,
    dr = 0,
    pu = 1 / 0,
    xu = null,
    ve = null,
    Zt = 0,
    ye = null,
    Sa = null,
    Il = 0,
    Mc = 0,
    Oc = null,
    mr = null,
    rn = 0,
    Cc = null;
  function vl() {
    return (vt & 2) !== 0 && ot !== 0 ? ot & -ot : g.T !== null ? Yc() : _f();
  }
  function hr() {
    if (gl === 0)
      if ((ot & 536870912) === 0 || mt) {
        var t = _n;
        (_n <<= 1), (_n & 3932160) === 0 && (_n = 262144), (gl = t);
      } else gl = 536870912;
    return (t = dl.current), t !== null && (t.flags |= 32), gl;
  }
  function il(t, l, e) {
    ((t === At && (pt === 2 || pt === 9)) || t.cancelPendingCommit !== null) &&
      (Ta(t, 0), be(t, ot, gl, !1)),
      Oa(t, e),
      ((vt & 2) === 0 || t !== At) &&
        (t === At &&
          ((vt & 2) === 0 && (we |= e), Bt === 4 && be(t, ot, gl, !1)),
        Ul(t));
  }
  function gr(t, l, e) {
    if ((vt & 6) !== 0) throw Error(r(327));
    var a = (!e && (l & 127) === 0 && (l & t.expiredLanes) === 0) || Ma(t, l),
      n = a ? vh(t, l) : Hc(t, l, !0),
      u = a;
    do {
      if (n === 0) {
        pa && !a && be(t, l, 0, !1);
        break;
      } else {
        if (((e = t.current.alternate), u && !hh(e))) {
          (n = Hc(t, l, !1)), (u = !1);
          continue;
        }
        if (n === 2) {
          if (((u = l), t.errorRecoveryDisabledLanes & u)) var i = 0;
          else
            (i = t.pendingLanes & -536870913),
              (i = i !== 0 ? i : i & 536870912 ? 536870912 : 0);
          if (i !== 0) {
            l = i;
            t: {
              var c = t;
              n = on;
              var o = c.current.memoizedState.isDehydrated;
              if ((o && (Ta(c, i).flags |= 256), (i = Hc(c, i, !1)), i !== 2)) {
                if (zc && !o) {
                  (c.errorRecoveryDisabledLanes |= u), (we |= u), (n = 4);
                  break t;
                }
                (u = ul),
                  (ul = n),
                  u !== null && (ul === null ? (ul = u) : ul.push.apply(ul, u));
              }
              n = i;
            }
            if (((u = !1), n !== 2)) continue;
          }
        }
        if (n === 1) {
          Ta(t, 0), be(t, l, 0, !0);
          break;
        }
        t: {
          switch (((a = t), (u = n), u)) {
            case 0:
            case 1:
              throw Error(r(345));
            case 4:
              if ((l & 4194048) !== l) break;
            case 6:
              be(a, l, gl, !he);
              break t;
            case 2:
              ul = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(r(329));
          }
          if ((l & 62914560) === l && ((n = bu + 300 - cl()), 10 < n)) {
            if ((be(a, l, gl, !he), Mn(a, 0, !0) !== 0)) break t;
            (Il = l),
              (a.timeoutHandle = Kr(
                vr.bind(
                  null,
                  a,
                  e,
                  ul,
                  xu,
                  Dc,
                  l,
                  gl,
                  we,
                  xa,
                  he,
                  u,
                  "Throttled",
                  -0,
                  0
                ),
                n
              ));
            break t;
          }
          vr(a, e, ul, xu, Dc, l, gl, we, xa, he, u, null, -0, 0);
        }
      }
      break;
    } while (!0);
    Ul(t);
  }
  function vr(t, l, e, a, n, u, i, c, o, y, T, N, b, x) {
    if (
      ((t.timeoutHandle = -1),
      (N = l.subtreeFlags),
      N & 8192 || (N & 16785408) === 16785408)
    ) {
      (N = {
        stylesheets: null,
        count: 0,
        imgCount: 0,
        imgBytes: 0,
        suspenseyImages: [],
        waitingForImages: !0,
        waitingForViewTransition: !1,
        unsuspend: ql,
      }),
        fr(l, u, N);
      var L =
        (u & 62914560) === u ? bu - cl() : (u & 4194048) === u ? dr - cl() : 0;
      if (((L = Ih(N, L)), L !== null)) {
        (Il = u),
          (t.cancelPendingCommit = L(
            Nr.bind(null, t, l, u, e, a, n, i, c, o, T, N, null, b, x)
          )),
          be(t, u, i, !y);
        return;
      }
    }
    Nr(t, l, u, e, a, n, i, c, o);
  }
  function hh(t) {
    for (var l = t; ; ) {
      var e = l.tag;
      if (
        (e === 0 || e === 11 || e === 15) &&
        l.flags & 16384 &&
        ((e = l.updateQueue), e !== null && ((e = e.stores), e !== null))
      )
        for (var a = 0; a < e.length; a++) {
          var n = e[a],
            u = n.getSnapshot;
          n = n.value;
          try {
            if (!ol(u(), n)) return !1;
          } catch {
            return !1;
          }
        }
      if (((e = l.child), l.subtreeFlags & 16384 && e !== null))
        (e.return = l), (l = e);
      else {
        if (l === t) break;
        for (; l.sibling === null; ) {
          if (l.return === null || l.return === t) return !0;
          l = l.return;
        }
        (l.sibling.return = l.return), (l = l.sibling);
      }
    }
    return !0;
  }
  function be(t, l, e, a) {
    (l &= ~_c),
      (l &= ~we),
      (t.suspendedLanes |= l),
      (t.pingedLanes &= ~l),
      a && (t.warmLanes |= l),
      (a = t.expirationTimes);
    for (var n = l; 0 < n; ) {
      var u = 31 - sl(n),
        i = 1 << u;
      (a[u] = -1), (n &= ~i);
    }
    e !== 0 && Af(t, e, l);
  }
  function Su() {
    return (vt & 6) === 0 ? (dn(0), !1) : !0;
  }
  function Uc() {
    if (it !== null) {
      if (pt === 0) var t = it.return;
      else (t = it), (Ll = Be = null), ki(t), (da = null), (Ja = 0), (t = it);
      for (; t !== null; ) Jo(t.alternate, t), (t = t.return);
      it = null;
    }
  }
  function Ta(t, l) {
    var e = t.timeoutHandle;
    e !== -1 && ((t.timeoutHandle = -1), Hh(e)),
      (e = t.cancelPendingCommit),
      e !== null && ((t.cancelPendingCommit = null), e()),
      (Il = 0),
      Uc(),
      (At = t),
      (it = e = Gl(t.current, null)),
      (ot = l),
      (pt = 0),
      (hl = null),
      (he = !1),
      (pa = Ma(t, l)),
      (zc = !1),
      (xa = gl = _c = we = ge = Bt = 0),
      (ul = on = null),
      (Dc = !1),
      (l & 8) !== 0 && (l |= l & 32);
    var a = t.entangledLanes;
    if (a !== 0)
      for (t = t.entanglements, a &= l; 0 < a; ) {
        var n = 31 - sl(a),
          u = 1 << n;
        (l |= t[n]), (a &= ~u);
      }
    return (Fl = l), Qn(), e;
  }
  function yr(t, l) {
    (P = null),
      (g.H = ln),
      l === ra || l === Wn
        ? ((l = Cs()), (pt = 3))
        : l === qi
        ? ((l = Cs()), (pt = 4))
        : (pt =
            l === rc
              ? 8
              : l !== null &&
                typeof l == "object" &&
                typeof l.then == "function"
              ? 6
              : 1),
      (hl = l),
      it === null && ((Bt = 1), ou(t, xl(l, t.current)));
  }
  function br() {
    var t = dl.current;
    return t === null
      ? !0
      : (ot & 4194048) === ot
      ? Nl === null
      : (ot & 62914560) === ot || (ot & 536870912) !== 0
      ? t === Nl
      : !1;
  }
  function pr() {
    var t = g.H;
    return (g.H = ln), t === null ? ln : t;
  }
  function xr() {
    var t = g.A;
    return (g.A = dh), t;
  }
  function Tu() {
    (Bt = 4),
      he || ((ot & 4194048) !== ot && dl.current !== null) || (pa = !0),
      ((ge & 134217727) === 0 && (we & 134217727) === 0) ||
        At === null ||
        be(At, ot, gl, !1);
  }
  function Hc(t, l, e) {
    var a = vt;
    vt |= 2;
    var n = pr(),
      u = xr();
    (At !== t || ot !== l) && ((xu = null), Ta(t, l)), (l = !1);
    var i = Bt;
    t: do
      try {
        if (pt !== 0 && it !== null) {
          var c = it,
            o = hl;
          switch (pt) {
            case 8:
              Uc(), (i = 6);
              break t;
            case 3:
            case 2:
            case 9:
            case 6:
              dl.current === null && (l = !0);
              var y = pt;
              if (((pt = 0), (hl = null), Ea(t, c, o, y), e && pa)) {
                i = 0;
                break t;
              }
              break;
            default:
              (y = pt), (pt = 0), (hl = null), Ea(t, c, o, y);
          }
        }
        gh(), (i = Bt);
        break;
      } catch (T) {
        yr(t, T);
      }
    while (!0);
    return (
      l && t.shellSuspendCounter++,
      (Ll = Be = null),
      (vt = a),
      (g.H = n),
      (g.A = u),
      it === null && ((At = null), (ot = 0), Qn()),
      i
    );
  }
  function gh() {
    for (; it !== null; ) Sr(it);
  }
  function vh(t, l) {
    var e = vt;
    vt |= 2;
    var a = pr(),
      n = xr();
    At !== t || ot !== l
      ? ((xu = null), (pu = cl() + 500), Ta(t, l))
      : (pa = Ma(t, l));
    t: do
      try {
        if (pt !== 0 && it !== null) {
          l = it;
          var u = hl;
          l: switch (pt) {
            case 1:
              (pt = 0), (hl = null), Ea(t, l, u, 1);
              break;
            case 2:
            case 9:
              if (Ms(u)) {
                (pt = 0), (hl = null), Tr(l);
                break;
              }
              (l = function () {
                (pt !== 2 && pt !== 9) || At !== t || (pt = 7), Ul(t);
              }),
                u.then(l, l);
              break t;
            case 3:
              pt = 7;
              break t;
            case 4:
              pt = 5;
              break t;
            case 7:
              Ms(u)
                ? ((pt = 0), (hl = null), Tr(l))
                : ((pt = 0), (hl = null), Ea(t, l, u, 7));
              break;
            case 5:
              var i = null;
              switch (it.tag) {
                case 26:
                  i = it.memoizedState;
                case 5:
                case 27:
                  var c = it;
                  if (i ? cd(i) : c.stateNode.complete) {
                    (pt = 0), (hl = null);
                    var o = c.sibling;
                    if (o !== null) it = o;
                    else {
                      var y = c.return;
                      y !== null ? ((it = y), Eu(y)) : (it = null);
                    }
                    break l;
                  }
              }
              (pt = 0), (hl = null), Ea(t, l, u, 5);
              break;
            case 6:
              (pt = 0), (hl = null), Ea(t, l, u, 6);
              break;
            case 8:
              Uc(), (Bt = 6);
              break t;
            default:
              throw Error(r(462));
          }
        }
        yh();
        break;
      } catch (T) {
        yr(t, T);
      }
    while (!0);
    return (
      (Ll = Be = null),
      (g.H = a),
      (g.A = n),
      (vt = e),
      it !== null ? 0 : ((At = null), (ot = 0), Qn(), Bt)
    );
  }
  function yh() {
    for (; it !== null && !Xd(); ) Sr(it);
  }
  function Sr(t) {
    var l = Vo(t.alternate, t, Fl);
    (t.memoizedProps = t.pendingProps), l === null ? Eu(t) : (it = l);
  }
  function Tr(t) {
    var l = t,
      e = l.alternate;
    switch (l.tag) {
      case 15:
      case 0:
        l = Go(e, l, l.pendingProps, l.type, void 0, ot);
        break;
      case 11:
        l = Go(e, l, l.pendingProps, l.type.render, l.ref, ot);
        break;
      case 5:
        ki(l);
      default:
        Jo(e, l), (l = it = ps(l, Fl)), (l = Vo(e, l, Fl));
    }
    (t.memoizedProps = t.pendingProps), l === null ? Eu(t) : (it = l);
  }
  function Ea(t, l, e, a) {
    (Ll = Be = null), ki(l), (da = null), (Ja = 0);
    var n = l.return;
    try {
      if (uh(t, n, l, e, ot)) {
        (Bt = 1), ou(t, xl(e, t.current)), (it = null);
        return;
      }
    } catch (u) {
      if (n !== null) throw ((it = n), u);
      (Bt = 1), ou(t, xl(e, t.current)), (it = null);
      return;
    }
    l.flags & 32768
      ? (mt || a === 1
          ? (t = !0)
          : pa || (ot & 536870912) !== 0
          ? (t = !1)
          : ((he = t = !0),
            (a === 2 || a === 9 || a === 3 || a === 6) &&
              ((a = dl.current),
              a !== null && a.tag === 13 && (a.flags |= 16384))),
        Er(l, t))
      : Eu(l);
  }
  function Eu(t) {
    var l = t;
    do {
      if ((l.flags & 32768) !== 0) {
        Er(l, he);
        return;
      }
      t = l.return;
      var e = fh(l.alternate, l, Fl);
      if (e !== null) {
        it = e;
        return;
      }
      if (((l = l.sibling), l !== null)) {
        it = l;
        return;
      }
      it = l = t;
    } while (l !== null);
    Bt === 0 && (Bt = 5);
  }
  function Er(t, l) {
    do {
      var e = sh(t.alternate, t);
      if (e !== null) {
        (e.flags &= 32767), (it = e);
        return;
      }
      if (
        ((e = t.return),
        e !== null &&
          ((e.flags |= 32768), (e.subtreeFlags = 0), (e.deletions = null)),
        !l && ((t = t.sibling), t !== null))
      ) {
        it = t;
        return;
      }
      it = t = e;
    } while (t !== null);
    (Bt = 6), (it = null);
  }
  function Nr(t, l, e, a, n, u, i, c, o) {
    t.cancelPendingCommit = null;
    do Nu();
    while (Zt !== 0);
    if ((vt & 6) !== 0) throw Error(r(327));
    if (l !== null) {
      if (l === t.current) throw Error(r(177));
      if (
        ((u = l.lanes | l.childLanes),
        (u |= Ti),
        Wd(t, e, u, i, c, o),
        t === At && ((it = At = null), (ot = 0)),
        (Sa = l),
        (ye = t),
        (Il = e),
        (Mc = u),
        (Oc = n),
        (mr = a),
        (l.subtreeFlags & 10256) !== 0 || (l.flags & 10256) !== 0
          ? ((t.callbackNode = null),
            (t.callbackPriority = 0),
            Sh(jn, function () {
              return Dr(), null;
            }))
          : ((t.callbackNode = null), (t.callbackPriority = 0)),
        (a = (l.flags & 13878) !== 0),
        (l.subtreeFlags & 13878) !== 0 || a)
      ) {
        (a = g.T), (g.T = null), (n = A.p), (A.p = 2), (i = vt), (vt |= 4);
        try {
          oh(t, l, e);
        } finally {
          (vt = i), (A.p = n), (g.T = a);
        }
      }
      (Zt = 1), Ar(), jr(), zr();
    }
  }
  function Ar() {
    if (Zt === 1) {
      Zt = 0;
      var t = ye,
        l = Sa,
        e = (l.flags & 13878) !== 0;
      if ((l.subtreeFlags & 13878) !== 0 || e) {
        (e = g.T), (g.T = null);
        var a = A.p;
        A.p = 2;
        var n = vt;
        vt |= 4;
        try {
          ur(l, t);
          var u = Kc,
            i = os(t.containerInfo),
            c = u.focusedElem,
            o = u.selectionRange;
          if (
            i !== c &&
            c &&
            c.ownerDocument &&
            ss(c.ownerDocument.documentElement, c)
          ) {
            if (o !== null && yi(c)) {
              var y = o.start,
                T = o.end;
              if ((T === void 0 && (T = y), "selectionStart" in c))
                (c.selectionStart = y),
                  (c.selectionEnd = Math.min(T, c.value.length));
              else {
                var N = c.ownerDocument || document,
                  b = (N && N.defaultView) || window;
                if (b.getSelection) {
                  var x = b.getSelection(),
                    L = c.textContent.length,
                    $ = Math.min(o.start, L),
                    Nt = o.end === void 0 ? $ : Math.min(o.end, L);
                  !x.extend && $ > Nt && ((i = Nt), (Nt = $), ($ = i));
                  var m = fs(c, $),
                    d = fs(c, Nt);
                  if (
                    m &&
                    d &&
                    (x.rangeCount !== 1 ||
                      x.anchorNode !== m.node ||
                      x.anchorOffset !== m.offset ||
                      x.focusNode !== d.node ||
                      x.focusOffset !== d.offset)
                  ) {
                    var v = N.createRange();
                    v.setStart(m.node, m.offset),
                      x.removeAllRanges(),
                      $ > Nt
                        ? (x.addRange(v), x.extend(d.node, d.offset))
                        : (v.setEnd(d.node, d.offset), x.addRange(v));
                  }
                }
              }
            }
            for (N = [], x = c; (x = x.parentNode); )
              x.nodeType === 1 &&
                N.push({ element: x, left: x.scrollLeft, top: x.scrollTop });
            for (
              typeof c.focus == "function" && c.focus(), c = 0;
              c < N.length;
              c++
            ) {
              var E = N[c];
              (E.element.scrollLeft = E.left), (E.element.scrollTop = E.top);
            }
          }
          (Ru = !!Vc), (Kc = Vc = null);
        } finally {
          (vt = n), (A.p = a), (g.T = e);
        }
      }
      (t.current = l), (Zt = 2);
    }
  }
  function jr() {
    if (Zt === 2) {
      Zt = 0;
      var t = ye,
        l = Sa,
        e = (l.flags & 8772) !== 0;
      if ((l.subtreeFlags & 8772) !== 0 || e) {
        (e = g.T), (g.T = null);
        var a = A.p;
        A.p = 2;
        var n = vt;
        vt |= 4;
        try {
          tr(t, l.alternate, l);
        } finally {
          (vt = n), (A.p = a), (g.T = e);
        }
      }
      Zt = 3;
    }
  }
  function zr() {
    if (Zt === 4 || Zt === 3) {
      (Zt = 0), Ld();
      var t = ye,
        l = Sa,
        e = Il,
        a = mr;
      (l.subtreeFlags & 10256) !== 0 || (l.flags & 10256) !== 0
        ? (Zt = 5)
        : ((Zt = 0), (Sa = ye = null), _r(t, t.pendingLanes));
      var n = t.pendingLanes;
      if (
        (n === 0 && (ve = null),
        Iu(e),
        (l = l.stateNode),
        fl && typeof fl.onCommitFiberRoot == "function")
      )
        try {
          fl.onCommitFiberRoot(Da, l, void 0, (l.current.flags & 128) === 128);
        } catch {}
      if (a !== null) {
        (l = g.T), (n = A.p), (A.p = 2), (g.T = null);
        try {
          for (var u = t.onRecoverableError, i = 0; i < a.length; i++) {
            var c = a[i];
            u(c.value, { componentStack: c.stack });
          }
        } finally {
          (g.T = l), (A.p = n);
        }
      }
      (Il & 3) !== 0 && Nu(),
        Ul(t),
        (n = t.pendingLanes),
        (e & 261930) !== 0 && (n & 42) !== 0
          ? t === Cc
            ? rn++
            : ((rn = 0), (Cc = t))
          : (rn = 0),
        dn(0);
    }
  }
  function _r(t, l) {
    (t.pooledCacheLanes &= l) === 0 &&
      ((l = t.pooledCache), l != null && ((t.pooledCache = null), Va(l)));
  }
  function Nu() {
    return Ar(), jr(), zr(), Dr();
  }
  function Dr() {
    if (Zt !== 5) return !1;
    var t = ye,
      l = Mc;
    Mc = 0;
    var e = Iu(Il),
      a = g.T,
      n = A.p;
    try {
      (A.p = 32 > e ? 32 : e), (g.T = null), (e = Oc), (Oc = null);
      var u = ye,
        i = Il;
      if (((Zt = 0), (Sa = ye = null), (Il = 0), (vt & 6) !== 0))
        throw Error(r(331));
      var c = vt;
      if (
        ((vt |= 4),
        or(u.current),
        cr(u, u.current, i, e),
        (vt = c),
        dn(0, !1),
        fl && typeof fl.onPostCommitFiberRoot == "function")
      )
        try {
          fl.onPostCommitFiberRoot(Da, u);
        } catch {}
      return !0;
    } finally {
      (A.p = n), (g.T = a), _r(t, l);
    }
  }
  function Mr(t, l, e) {
    (l = xl(e, l)),
      (l = oc(t.stateNode, l, 2)),
      (t = oe(t, l, 2)),
      t !== null && (Oa(t, 2), Ul(t));
  }
  function xt(t, l, e) {
    if (t.tag === 3) Mr(t, t, e);
    else
      for (; l !== null; ) {
        if (l.tag === 3) {
          Mr(l, t, e);
          break;
        } else if (l.tag === 1) {
          var a = l.stateNode;
          if (
            typeof l.type.getDerivedStateFromError == "function" ||
            (typeof a.componentDidCatch == "function" &&
              (ve === null || !ve.has(a)))
          ) {
            (t = xl(e, t)),
              (e = Oo(2)),
              (a = oe(l, e, 2)),
              a !== null && (Co(e, a, l, t), Oa(a, 2), Ul(a));
            break;
          }
        }
        l = l.return;
      }
  }
  function Bc(t, l, e) {
    var a = t.pingCache;
    if (a === null) {
      a = t.pingCache = new mh();
      var n = new Set();
      a.set(l, n);
    } else (n = a.get(l)), n === void 0 && ((n = new Set()), a.set(l, n));
    n.has(e) ||
      ((zc = !0), n.add(e), (t = bh.bind(null, t, l, e)), l.then(t, t));
  }
  function bh(t, l, e) {
    var a = t.pingCache;
    a !== null && a.delete(l),
      (t.pingedLanes |= t.suspendedLanes & e),
      (t.warmLanes &= ~e),
      At === t &&
        (ot & e) === e &&
        (Bt === 4 || (Bt === 3 && (ot & 62914560) === ot && 300 > cl() - bu)
          ? (vt & 2) === 0 && Ta(t, 0)
          : (_c |= e),
        xa === ot && (xa = 0)),
      Ul(t);
  }
  function Or(t, l) {
    l === 0 && (l = Nf()), (t = Ce(t, l)), t !== null && (Oa(t, l), Ul(t));
  }
  function ph(t) {
    var l = t.memoizedState,
      e = 0;
    l !== null && (e = l.retryLane), Or(t, e);
  }
  function xh(t, l) {
    var e = 0;
    switch (t.tag) {
      case 31:
      case 13:
        var a = t.stateNode,
          n = t.memoizedState;
        n !== null && (e = n.retryLane);
        break;
      case 19:
        a = t.stateNode;
        break;
      case 22:
        a = t.stateNode._retryCache;
        break;
      default:
        throw Error(r(314));
    }
    a !== null && a.delete(l), Or(t, e);
  }
  function Sh(t, l) {
    return $u(t, l);
  }
  var Au = null,
    Na = null,
    Rc = !1,
    ju = !1,
    qc = !1,
    pe = 0;
  function Ul(t) {
    t !== Na &&
      t.next === null &&
      (Na === null ? (Au = Na = t) : (Na = Na.next = t)),
      (ju = !0),
      Rc || ((Rc = !0), Eh());
  }
  function dn(t, l) {
    if (!qc && ju) {
      qc = !0;
      do
        for (var e = !1, a = Au; a !== null; ) {
          if (t !== 0) {
            var n = a.pendingLanes;
            if (n === 0) var u = 0;
            else {
              var i = a.suspendedLanes,
                c = a.pingedLanes;
              (u = (1 << (31 - sl(42 | t) + 1)) - 1),
                (u &= n & ~(i & ~c)),
                (u = u & 201326741 ? (u & 201326741) | 1 : u ? u | 2 : 0);
            }
            u !== 0 && ((e = !0), Br(a, u));
          } else
            (u = ot),
              (u = Mn(
                a,
                a === At ? u : 0,
                a.cancelPendingCommit !== null || a.timeoutHandle !== -1
              )),
              (u & 3) === 0 || Ma(a, u) || ((e = !0), Br(a, u));
          a = a.next;
        }
      while (e);
      qc = !1;
    }
  }
  function Th() {
    Cr();
  }
  function Cr() {
    ju = Rc = !1;
    var t = 0;
    pe !== 0 && Uh() && (t = pe);
    for (var l = cl(), e = null, a = Au; a !== null; ) {
      var n = a.next,
        u = Ur(a, l);
      u === 0
        ? ((a.next = null),
          e === null ? (Au = n) : (e.next = n),
          n === null && (Na = e))
        : ((e = a), (t !== 0 || (u & 3) !== 0) && (ju = !0)),
        (a = n);
    }
    (Zt !== 0 && Zt !== 5) || dn(t), pe !== 0 && (pe = 0);
  }
  function Ur(t, l) {
    for (
      var e = t.suspendedLanes,
        a = t.pingedLanes,
        n = t.expirationTimes,
        u = t.pendingLanes & -62914561;
      0 < u;

    ) {
      var i = 31 - sl(u),
        c = 1 << i,
        o = n[i];
      o === -1
        ? ((c & e) === 0 || (c & a) !== 0) && (n[i] = kd(c, l))
        : o <= l && (t.expiredLanes |= c),
        (u &= ~c);
    }
    if (
      ((l = At),
      (e = ot),
      (e = Mn(
        t,
        t === l ? e : 0,
        t.cancelPendingCommit !== null || t.timeoutHandle !== -1
      )),
      (a = t.callbackNode),
      e === 0 ||
        (t === l && (pt === 2 || pt === 9)) ||
        t.cancelPendingCommit !== null)
    )
      return (
        a !== null && a !== null && ku(a),
        (t.callbackNode = null),
        (t.callbackPriority = 0)
      );
    if ((e & 3) === 0 || Ma(t, e)) {
      if (((l = e & -e), l === t.callbackPriority)) return l;
      switch ((a !== null && ku(a), Iu(e))) {
        case 2:
        case 8:
          e = Tf;
          break;
        case 32:
          e = jn;
          break;
        case 268435456:
          e = Ef;
          break;
        default:
          e = jn;
      }
      return (
        (a = Hr.bind(null, t)),
        (e = $u(e, a)),
        (t.callbackPriority = l),
        (t.callbackNode = e),
        l
      );
    }
    return (
      a !== null && a !== null && ku(a),
      (t.callbackPriority = 2),
      (t.callbackNode = null),
      2
    );
  }
  function Hr(t, l) {
    if (Zt !== 0 && Zt !== 5)
      return (t.callbackNode = null), (t.callbackPriority = 0), null;
    var e = t.callbackNode;
    if (Nu() && t.callbackNode !== e) return null;
    var a = ot;
    return (
      (a = Mn(
        t,
        t === At ? a : 0,
        t.cancelPendingCommit !== null || t.timeoutHandle !== -1
      )),
      a === 0
        ? null
        : (gr(t, a, l),
          Ur(t, cl()),
          t.callbackNode != null && t.callbackNode === e
            ? Hr.bind(null, t)
            : null)
    );
  }
  function Br(t, l) {
    if (Nu()) return null;
    gr(t, l, !0);
  }
  function Eh() {
    Bh(function () {
      (vt & 6) !== 0 ? $u(Sf, Th) : Cr();
    });
  }
  function Yc() {
    if (pe === 0) {
      var t = sa;
      t === 0 && ((t = zn), (zn <<= 1), (zn & 261888) === 0 && (zn = 256)),
        (pe = t);
    }
    return pe;
  }
  function Rr(t) {
    return t == null || typeof t == "symbol" || typeof t == "boolean"
      ? null
      : typeof t == "function"
      ? t
      : Hn("" + t);
  }
  function qr(t, l) {
    var e = l.ownerDocument.createElement("input");
    return (
      (e.name = l.name),
      (e.value = l.value),
      t.id && e.setAttribute("form", t.id),
      l.parentNode.insertBefore(e, l),
      (t = new FormData(t)),
      e.parentNode.removeChild(e),
      t
    );
  }
  function Nh(t, l, e, a, n) {
    if (l === "submit" && e && e.stateNode === n) {
      var u = Rr((n[tl] || null).action),
        i = a.submitter;
      i &&
        ((l = (l = i[tl] || null)
          ? Rr(l.formAction)
          : i.getAttribute("formAction")),
        l !== null && ((u = l), (i = null)));
      var c = new Yn("action", "action", null, a, n);
      t.push({
        event: c,
        listeners: [
          {
            instance: null,
            listener: function () {
              if (a.defaultPrevented) {
                if (pe !== 0) {
                  var o = i ? qr(n, i) : new FormData(n);
                  nc(
                    e,
                    { pending: !0, data: o, method: n.method, action: u },
                    null,
                    o
                  );
                }
              } else
                typeof u == "function" &&
                  (c.preventDefault(),
                  (o = i ? qr(n, i) : new FormData(n)),
                  nc(
                    e,
                    { pending: !0, data: o, method: n.method, action: u },
                    u,
                    o
                  ));
            },
            currentTarget: n,
          },
        ],
      });
    }
  }
  for (var Gc = 0; Gc < Si.length; Gc++) {
    var Xc = Si[Gc],
      Ah = Xc.toLowerCase(),
      jh = Xc[0].toUpperCase() + Xc.slice(1);
    zl(Ah, "on" + jh);
  }
  zl(ms, "onAnimationEnd"),
    zl(hs, "onAnimationIteration"),
    zl(gs, "onAnimationStart"),
    zl("dblclick", "onDoubleClick"),
    zl("focusin", "onFocus"),
    zl("focusout", "onBlur"),
    zl(Qm, "onTransitionRun"),
    zl(Zm, "onTransitionStart"),
    zl(wm, "onTransitionCancel"),
    zl(vs, "onTransitionEnd"),
    ke("onMouseEnter", ["mouseout", "mouseover"]),
    ke("onMouseLeave", ["mouseout", "mouseover"]),
    ke("onPointerEnter", ["pointerout", "pointerover"]),
    ke("onPointerLeave", ["pointerout", "pointerover"]),
    _e(
      "onChange",
      "change click focusin focusout input keydown keyup selectionchange".split(
        " "
      )
    ),
    _e(
      "onSelect",
      "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
        " "
      )
    ),
    _e("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]),
    _e(
      "onCompositionEnd",
      "compositionend focusout keydown keypress keyup mousedown".split(" ")
    ),
    _e(
      "onCompositionStart",
      "compositionstart focusout keydown keypress keyup mousedown".split(" ")
    ),
    _e(
      "onCompositionUpdate",
      "compositionupdate focusout keydown keypress keyup mousedown".split(" ")
    );
  var mn =
      "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
        " "
      ),
    zh = new Set(
      "beforetoggle cancel close invalid load scroll scrollend toggle"
        .split(" ")
        .concat(mn)
    );
  function Yr(t, l) {
    l = (l & 4) !== 0;
    for (var e = 0; e < t.length; e++) {
      var a = t[e],
        n = a.event;
      a = a.listeners;
      t: {
        var u = void 0;
        if (l)
          for (var i = a.length - 1; 0 <= i; i--) {
            var c = a[i],
              o = c.instance,
              y = c.currentTarget;
            if (((c = c.listener), o !== u && n.isPropagationStopped()))
              break t;
            (u = c), (n.currentTarget = y);
            try {
              u(n);
            } catch (T) {
              Ln(T);
            }
            (n.currentTarget = null), (u = o);
          }
        else
          for (i = 0; i < a.length; i++) {
            if (
              ((c = a[i]),
              (o = c.instance),
              (y = c.currentTarget),
              (c = c.listener),
              o !== u && n.isPropagationStopped())
            )
              break t;
            (u = c), (n.currentTarget = y);
            try {
              u(n);
            } catch (T) {
              Ln(T);
            }
            (n.currentTarget = null), (u = o);
          }
      }
    }
  }
  function ct(t, l) {
    var e = l[Pu];
    e === void 0 && (e = l[Pu] = new Set());
    var a = t + "__bubble";
    e.has(a) || (Gr(l, t, 2, !1), e.add(a));
  }
  function Lc(t, l, e) {
    var a = 0;
    l && (a |= 4), Gr(e, t, a, l);
  }
  var zu = "_reactListening" + Math.random().toString(36).slice(2);
  function Qc(t) {
    if (!t[zu]) {
      (t[zu] = !0),
        Of.forEach(function (e) {
          e !== "selectionchange" && (zh.has(e) || Lc(e, !1, t), Lc(e, !0, t));
        });
      var l = t.nodeType === 9 ? t : t.ownerDocument;
      l === null || l[zu] || ((l[zu] = !0), Lc("selectionchange", !1, l));
    }
  }
  function Gr(t, l, e, a) {
    switch (hd(l)) {
      case 2:
        var n = l0;
        break;
      case 8:
        n = e0;
        break;
      default:
        n = af;
    }
    (e = n.bind(null, l, e, t)),
      (n = void 0),
      !fi ||
        (l !== "touchstart" && l !== "touchmove" && l !== "wheel") ||
        (n = !0),
      a
        ? n !== void 0
          ? t.addEventListener(l, e, { capture: !0, passive: n })
          : t.addEventListener(l, e, !0)
        : n !== void 0
        ? t.addEventListener(l, e, { passive: n })
        : t.addEventListener(l, e, !1);
  }
  function Zc(t, l, e, a, n) {
    var u = a;
    if ((l & 1) === 0 && (l & 2) === 0 && a !== null)
      t: for (;;) {
        if (a === null) return;
        var i = a.tag;
        if (i === 3 || i === 4) {
          var c = a.stateNode.containerInfo;
          if (c === n) break;
          if (i === 4)
            for (i = a.return; i !== null; ) {
              var o = i.tag;
              if ((o === 3 || o === 4) && i.stateNode.containerInfo === n)
                return;
              i = i.return;
            }
          for (; c !== null; ) {
            if (((i = Ke(c)), i === null)) return;
            if (((o = i.tag), o === 5 || o === 6 || o === 26 || o === 27)) {
              a = u = i;
              continue t;
            }
            c = c.parentNode;
          }
        }
        a = a.return;
      }
    Zf(function () {
      var y = u,
        T = ii(e),
        N = [];
      t: {
        var b = ys.get(t);
        if (b !== void 0) {
          var x = Yn,
            L = t;
          switch (t) {
            case "keypress":
              if (Rn(e) === 0) break t;
            case "keydown":
            case "keyup":
              x = xm;
              break;
            case "focusin":
              (L = "focus"), (x = di);
              break;
            case "focusout":
              (L = "blur"), (x = di);
              break;
            case "beforeblur":
            case "afterblur":
              x = di;
              break;
            case "click":
              if (e.button === 2) break t;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              x = Kf;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              x = fm;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              x = Em;
              break;
            case ms:
            case hs:
            case gs:
              x = rm;
              break;
            case vs:
              x = Am;
              break;
            case "scroll":
            case "scrollend":
              x = im;
              break;
            case "wheel":
              x = zm;
              break;
            case "copy":
            case "cut":
            case "paste":
              x = mm;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              x = $f;
              break;
            case "toggle":
            case "beforetoggle":
              x = Dm;
          }
          var $ = (l & 4) !== 0,
            Nt = !$ && (t === "scroll" || t === "scrollend"),
            m = $ ? (b !== null ? b + "Capture" : null) : b;
          $ = [];
          for (var d = y, v; d !== null; ) {
            var E = d;
            if (
              ((v = E.stateNode),
              (E = E.tag),
              (E !== 5 && E !== 26 && E !== 27) ||
                v === null ||
                m === null ||
                ((E = Ha(d, m)), E != null && $.push(hn(d, E, v))),
              Nt)
            )
              break;
            d = d.return;
          }
          0 < $.length &&
            ((b = new x(b, L, null, e, T)), N.push({ event: b, listeners: $ }));
        }
      }
      if ((l & 7) === 0) {
        t: {
          if (
            ((b = t === "mouseover" || t === "pointerover"),
            (x = t === "mouseout" || t === "pointerout"),
            b &&
              e !== ui &&
              (L = e.relatedTarget || e.fromElement) &&
              (Ke(L) || L[Ve]))
          )
            break t;
          if (
            (x || b) &&
            ((b =
              T.window === T
                ? T
                : (b = T.ownerDocument)
                ? b.defaultView || b.parentWindow
                : window),
            x
              ? ((L = e.relatedTarget || e.toElement),
                (x = y),
                (L = L ? Ke(L) : null),
                L !== null &&
                  ((Nt = C(L)),
                  ($ = L.tag),
                  L !== Nt || ($ !== 5 && $ !== 27 && $ !== 6)) &&
                  (L = null))
              : ((x = null), (L = y)),
            x !== L)
          ) {
            if (
              (($ = Kf),
              (E = "onMouseLeave"),
              (m = "onMouseEnter"),
              (d = "mouse"),
              (t === "pointerout" || t === "pointerover") &&
                (($ = $f),
                (E = "onPointerLeave"),
                (m = "onPointerEnter"),
                (d = "pointer")),
              (Nt = x == null ? b : Ua(x)),
              (v = L == null ? b : Ua(L)),
              (b = new $(E, d + "leave", x, e, T)),
              (b.target = Nt),
              (b.relatedTarget = v),
              (E = null),
              Ke(T) === y &&
                (($ = new $(m, d + "enter", L, e, T)),
                ($.target = v),
                ($.relatedTarget = Nt),
                (E = $)),
              (Nt = E),
              x && L)
            )
              l: {
                for ($ = _h, m = x, d = L, v = 0, E = m; E; E = $(E)) v++;
                E = 0;
                for (var w = d; w; w = $(w)) E++;
                for (; 0 < v - E; ) (m = $(m)), v--;
                for (; 0 < E - v; ) (d = $(d)), E--;
                for (; v--; ) {
                  if (m === d || (d !== null && m === d.alternate)) {
                    $ = m;
                    break l;
                  }
                  (m = $(m)), (d = $(d));
                }
                $ = null;
              }
            else $ = null;
            x !== null && Xr(N, b, x, $, !1),
              L !== null && Nt !== null && Xr(N, Nt, L, $, !0);
          }
        }
        t: {
          if (
            ((b = y ? Ua(y) : window),
            (x = b.nodeName && b.nodeName.toLowerCase()),
            x === "select" || (x === "input" && b.type === "file"))
          )
            var ht = es;
          else if (ts(b))
            if (as) ht = Gm;
            else {
              ht = qm;
              var Q = Rm;
            }
          else
            (x = b.nodeName),
              !x ||
              x.toLowerCase() !== "input" ||
              (b.type !== "checkbox" && b.type !== "radio")
                ? y && ni(y.elementType) && (ht = es)
                : (ht = Ym);
          if (ht && (ht = ht(t, y))) {
            ls(N, ht, e, T);
            break t;
          }
          Q && Q(t, b, y),
            t === "focusout" &&
              y &&
              b.type === "number" &&
              y.memoizedProps.value != null &&
              ai(b, "number", b.value);
        }
        switch (((Q = y ? Ua(y) : window), t)) {
          case "focusin":
            (ts(Q) || Q.contentEditable === "true") &&
              ((la = Q), (bi = y), (Qa = null));
            break;
          case "focusout":
            Qa = bi = la = null;
            break;
          case "mousedown":
            pi = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            (pi = !1), rs(N, e, T);
            break;
          case "selectionchange":
            if (Lm) break;
          case "keydown":
          case "keyup":
            rs(N, e, T);
        }
        var tt;
        if (hi)
          t: {
            switch (t) {
              case "compositionstart":
                var rt = "onCompositionStart";
                break t;
              case "compositionend":
                rt = "onCompositionEnd";
                break t;
              case "compositionupdate":
                rt = "onCompositionUpdate";
                break t;
            }
            rt = void 0;
          }
        else
          ta
            ? If(t, e) && (rt = "onCompositionEnd")
            : t === "keydown" &&
              e.keyCode === 229 &&
              (rt = "onCompositionStart");
        rt &&
          (kf &&
            e.locale !== "ko" &&
            (ta || rt !== "onCompositionStart"
              ? rt === "onCompositionEnd" && ta && (tt = wf())
              : ((ae = T),
                (si = "value" in ae ? ae.value : ae.textContent),
                (ta = !0))),
          (Q = _u(y, rt)),
          0 < Q.length &&
            ((rt = new Jf(rt, t, null, e, T)),
            N.push({ event: rt, listeners: Q }),
            tt
              ? (rt.data = tt)
              : ((tt = Pf(e)), tt !== null && (rt.data = tt)))),
          (tt = Om ? Cm(t, e) : Um(t, e)) &&
            ((rt = _u(y, "onBeforeInput")),
            0 < rt.length &&
              ((Q = new Jf("onBeforeInput", "beforeinput", null, e, T)),
              N.push({ event: Q, listeners: rt }),
              (Q.data = tt))),
          Nh(N, t, y, e, T);
      }
      Yr(N, l);
    });
  }
  function hn(t, l, e) {
    return { instance: t, listener: l, currentTarget: e };
  }
  function _u(t, l) {
    for (var e = l + "Capture", a = []; t !== null; ) {
      var n = t,
        u = n.stateNode;
      if (
        ((n = n.tag),
        (n !== 5 && n !== 26 && n !== 27) ||
          u === null ||
          ((n = Ha(t, e)),
          n != null && a.unshift(hn(t, n, u)),
          (n = Ha(t, l)),
          n != null && a.push(hn(t, n, u))),
        t.tag === 3)
      )
        return a;
      t = t.return;
    }
    return [];
  }
  function _h(t) {
    if (t === null) return null;
    do t = t.return;
    while (t && t.tag !== 5 && t.tag !== 27);
    return t || null;
  }
  function Xr(t, l, e, a, n) {
    for (var u = l._reactName, i = []; e !== null && e !== a; ) {
      var c = e,
        o = c.alternate,
        y = c.stateNode;
      if (((c = c.tag), o !== null && o === a)) break;
      (c !== 5 && c !== 26 && c !== 27) ||
        y === null ||
        ((o = y),
        n
          ? ((y = Ha(e, u)), y != null && i.unshift(hn(e, y, o)))
          : n || ((y = Ha(e, u)), y != null && i.push(hn(e, y, o)))),
        (e = e.return);
    }
    i.length !== 0 && t.push({ event: l, listeners: i });
  }
  var Dh = /\r\n?/g,
    Mh = /\u0000|\uFFFD/g;
  function Lr(t) {
    return (typeof t == "string" ? t : "" + t)
      .replace(
        Dh,
        `
`
      )
      .replace(Mh, "");
  }
  function Qr(t, l) {
    return (l = Lr(l)), Lr(t) === l;
  }
  function Et(t, l, e, a, n, u) {
    switch (e) {
      case "children":
        typeof a == "string"
          ? l === "body" || (l === "textarea" && a === "") || Fe(t, a)
          : (typeof a == "number" || typeof a == "bigint") &&
            l !== "body" &&
            Fe(t, "" + a);
        break;
      case "className":
        Cn(t, "class", a);
        break;
      case "tabIndex":
        Cn(t, "tabindex", a);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        Cn(t, e, a);
        break;
      case "style":
        Lf(t, a, u);
        break;
      case "data":
        if (l !== "object") {
          Cn(t, "data", a);
          break;
        }
      case "src":
      case "href":
        if (a === "" && (l !== "a" || e !== "href")) {
          t.removeAttribute(e);
          break;
        }
        if (
          a == null ||
          typeof a == "function" ||
          typeof a == "symbol" ||
          typeof a == "boolean"
        ) {
          t.removeAttribute(e);
          break;
        }
        (a = Hn("" + a)), t.setAttribute(e, a);
        break;
      case "action":
      case "formAction":
        if (typeof a == "function") {
          t.setAttribute(
            e,
            "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')"
          );
          break;
        } else
          typeof u == "function" &&
            (e === "formAction"
              ? (l !== "input" && Et(t, l, "name", n.name, n, null),
                Et(t, l, "formEncType", n.formEncType, n, null),
                Et(t, l, "formMethod", n.formMethod, n, null),
                Et(t, l, "formTarget", n.formTarget, n, null))
              : (Et(t, l, "encType", n.encType, n, null),
                Et(t, l, "method", n.method, n, null),
                Et(t, l, "target", n.target, n, null)));
        if (a == null || typeof a == "symbol" || typeof a == "boolean") {
          t.removeAttribute(e);
          break;
        }
        (a = Hn("" + a)), t.setAttribute(e, a);
        break;
      case "onClick":
        a != null && (t.onclick = ql);
        break;
      case "onScroll":
        a != null && ct("scroll", t);
        break;
      case "onScrollEnd":
        a != null && ct("scrollend", t);
        break;
      case "dangerouslySetInnerHTML":
        if (a != null) {
          if (typeof a != "object" || !("__html" in a)) throw Error(r(61));
          if (((e = a.__html), e != null)) {
            if (n.children != null) throw Error(r(60));
            t.innerHTML = e;
          }
        }
        break;
      case "multiple":
        t.multiple = a && typeof a != "function" && typeof a != "symbol";
        break;
      case "muted":
        t.muted = a && typeof a != "function" && typeof a != "symbol";
        break;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "defaultValue":
      case "defaultChecked":
      case "innerHTML":
      case "ref":
        break;
      case "autoFocus":
        break;
      case "xlinkHref":
        if (
          a == null ||
          typeof a == "function" ||
          typeof a == "boolean" ||
          typeof a == "symbol"
        ) {
          t.removeAttribute("xlink:href");
          break;
        }
        (e = Hn("" + a)),
          t.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", e);
        break;
      case "contentEditable":
      case "spellCheck":
      case "draggable":
      case "value":
      case "autoReverse":
      case "externalResourcesRequired":
      case "focusable":
      case "preserveAlpha":
        a != null && typeof a != "function" && typeof a != "symbol"
          ? t.setAttribute(e, "" + a)
          : t.removeAttribute(e);
        break;
      case "inert":
      case "allowFullScreen":
      case "async":
      case "autoPlay":
      case "controls":
      case "default":
      case "defer":
      case "disabled":
      case "disablePictureInPicture":
      case "disableRemotePlayback":
      case "formNoValidate":
      case "hidden":
      case "loop":
      case "noModule":
      case "noValidate":
      case "open":
      case "playsInline":
      case "readOnly":
      case "required":
      case "reversed":
      case "scoped":
      case "seamless":
      case "itemScope":
        a && typeof a != "function" && typeof a != "symbol"
          ? t.setAttribute(e, "")
          : t.removeAttribute(e);
        break;
      case "capture":
      case "download":
        a === !0
          ? t.setAttribute(e, "")
          : a !== !1 &&
            a != null &&
            typeof a != "function" &&
            typeof a != "symbol"
          ? t.setAttribute(e, a)
          : t.removeAttribute(e);
        break;
      case "cols":
      case "rows":
      case "size":
      case "span":
        a != null &&
        typeof a != "function" &&
        typeof a != "symbol" &&
        !isNaN(a) &&
        1 <= a
          ? t.setAttribute(e, a)
          : t.removeAttribute(e);
        break;
      case "rowSpan":
      case "start":
        a == null || typeof a == "function" || typeof a == "symbol" || isNaN(a)
          ? t.removeAttribute(e)
          : t.setAttribute(e, a);
        break;
      case "popover":
        ct("beforetoggle", t), ct("toggle", t), On(t, "popover", a);
        break;
      case "xlinkActuate":
        Rl(t, "http://www.w3.org/1999/xlink", "xlink:actuate", a);
        break;
      case "xlinkArcrole":
        Rl(t, "http://www.w3.org/1999/xlink", "xlink:arcrole", a);
        break;
      case "xlinkRole":
        Rl(t, "http://www.w3.org/1999/xlink", "xlink:role", a);
        break;
      case "xlinkShow":
        Rl(t, "http://www.w3.org/1999/xlink", "xlink:show", a);
        break;
      case "xlinkTitle":
        Rl(t, "http://www.w3.org/1999/xlink", "xlink:title", a);
        break;
      case "xlinkType":
        Rl(t, "http://www.w3.org/1999/xlink", "xlink:type", a);
        break;
      case "xmlBase":
        Rl(t, "http://www.w3.org/XML/1998/namespace", "xml:base", a);
        break;
      case "xmlLang":
        Rl(t, "http://www.w3.org/XML/1998/namespace", "xml:lang", a);
        break;
      case "xmlSpace":
        Rl(t, "http://www.w3.org/XML/1998/namespace", "xml:space", a);
        break;
      case "is":
        On(t, "is", a);
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        (!(2 < e.length) ||
          (e[0] !== "o" && e[0] !== "O") ||
          (e[1] !== "n" && e[1] !== "N")) &&
          ((e = nm.get(e) || e), On(t, e, a));
    }
  }
  function wc(t, l, e, a, n, u) {
    switch (e) {
      case "style":
        Lf(t, a, u);
        break;
      case "dangerouslySetInnerHTML":
        if (a != null) {
          if (typeof a != "object" || !("__html" in a)) throw Error(r(61));
          if (((e = a.__html), e != null)) {
            if (n.children != null) throw Error(r(60));
            t.innerHTML = e;
          }
        }
        break;
      case "children":
        typeof a == "string"
          ? Fe(t, a)
          : (typeof a == "number" || typeof a == "bigint") && Fe(t, "" + a);
        break;
      case "onScroll":
        a != null && ct("scroll", t);
        break;
      case "onScrollEnd":
        a != null && ct("scrollend", t);
        break;
      case "onClick":
        a != null && (t.onclick = ql);
        break;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "innerHTML":
      case "ref":
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        if (!Cf.hasOwnProperty(e))
          t: {
            if (
              e[0] === "o" &&
              e[1] === "n" &&
              ((n = e.endsWith("Capture")),
              (l = e.slice(2, n ? e.length - 7 : void 0)),
              (u = t[tl] || null),
              (u = u != null ? u[e] : null),
              typeof u == "function" && t.removeEventListener(l, u, n),
              typeof a == "function")
            ) {
              typeof u != "function" &&
                u !== null &&
                (e in t
                  ? (t[e] = null)
                  : t.hasAttribute(e) && t.removeAttribute(e)),
                t.addEventListener(l, a, n);
              break t;
            }
            e in t
              ? (t[e] = a)
              : a === !0
              ? t.setAttribute(e, "")
              : On(t, e, a);
          }
    }
  }
  function Ft(t, l, e) {
    switch (l) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "img":
        ct("error", t), ct("load", t);
        var a = !1,
          n = !1,
          u;
        for (u in e)
          if (e.hasOwnProperty(u)) {
            var i = e[u];
            if (i != null)
              switch (u) {
                case "src":
                  a = !0;
                  break;
                case "srcSet":
                  n = !0;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(r(137, l));
                default:
                  Et(t, l, u, i, e, null);
              }
          }
        n && Et(t, l, "srcSet", e.srcSet, e, null),
          a && Et(t, l, "src", e.src, e, null);
        return;
      case "input":
        ct("invalid", t);
        var c = (u = i = n = null),
          o = null,
          y = null;
        for (a in e)
          if (e.hasOwnProperty(a)) {
            var T = e[a];
            if (T != null)
              switch (a) {
                case "name":
                  n = T;
                  break;
                case "type":
                  i = T;
                  break;
                case "checked":
                  o = T;
                  break;
                case "defaultChecked":
                  y = T;
                  break;
                case "value":
                  u = T;
                  break;
                case "defaultValue":
                  c = T;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (T != null) throw Error(r(137, l));
                  break;
                default:
                  Et(t, l, a, T, e, null);
              }
          }
        qf(t, u, c, o, y, i, n, !1);
        return;
      case "select":
        ct("invalid", t), (a = i = u = null);
        for (n in e)
          if (e.hasOwnProperty(n) && ((c = e[n]), c != null))
            switch (n) {
              case "value":
                u = c;
                break;
              case "defaultValue":
                i = c;
                break;
              case "multiple":
                a = c;
              default:
                Et(t, l, n, c, e, null);
            }
        (l = u),
          (e = i),
          (t.multiple = !!a),
          l != null ? We(t, !!a, l, !1) : e != null && We(t, !!a, e, !0);
        return;
      case "textarea":
        ct("invalid", t), (u = n = a = null);
        for (i in e)
          if (e.hasOwnProperty(i) && ((c = e[i]), c != null))
            switch (i) {
              case "value":
                a = c;
                break;
              case "defaultValue":
                n = c;
                break;
              case "children":
                u = c;
                break;
              case "dangerouslySetInnerHTML":
                if (c != null) throw Error(r(91));
                break;
              default:
                Et(t, l, i, c, e, null);
            }
        Gf(t, a, n, u);
        return;
      case "option":
        for (o in e)
          if (e.hasOwnProperty(o) && ((a = e[o]), a != null))
            switch (o) {
              case "selected":
                t.selected =
                  a && typeof a != "function" && typeof a != "symbol";
                break;
              default:
                Et(t, l, o, a, e, null);
            }
        return;
      case "dialog":
        ct("beforetoggle", t), ct("toggle", t), ct("cancel", t), ct("close", t);
        break;
      case "iframe":
      case "object":
        ct("load", t);
        break;
      case "video":
      case "audio":
        for (a = 0; a < mn.length; a++) ct(mn[a], t);
        break;
      case "image":
        ct("error", t), ct("load", t);
        break;
      case "details":
        ct("toggle", t);
        break;
      case "embed":
      case "source":
      case "link":
        ct("error", t), ct("load", t);
      case "area":
      case "base":
      case "br":
      case "col":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "track":
      case "wbr":
      case "menuitem":
        for (y in e)
          if (e.hasOwnProperty(y) && ((a = e[y]), a != null))
            switch (y) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(r(137, l));
              default:
                Et(t, l, y, a, e, null);
            }
        return;
      default:
        if (ni(l)) {
          for (T in e)
            e.hasOwnProperty(T) &&
              ((a = e[T]), a !== void 0 && wc(t, l, T, a, e, void 0));
          return;
        }
    }
    for (c in e)
      e.hasOwnProperty(c) && ((a = e[c]), a != null && Et(t, l, c, a, e, null));
  }
  function Oh(t, l, e, a) {
    switch (l) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "input":
        var n = null,
          u = null,
          i = null,
          c = null,
          o = null,
          y = null,
          T = null;
        for (x in e) {
          var N = e[x];
          if (e.hasOwnProperty(x) && N != null)
            switch (x) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                o = N;
              default:
                a.hasOwnProperty(x) || Et(t, l, x, null, a, N);
            }
        }
        for (var b in a) {
          var x = a[b];
          if (((N = e[b]), a.hasOwnProperty(b) && (x != null || N != null)))
            switch (b) {
              case "type":
                u = x;
                break;
              case "name":
                n = x;
                break;
              case "checked":
                y = x;
                break;
              case "defaultChecked":
                T = x;
                break;
              case "value":
                i = x;
                break;
              case "defaultValue":
                c = x;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (x != null) throw Error(r(137, l));
                break;
              default:
                x !== N && Et(t, l, b, x, a, N);
            }
        }
        ei(t, i, c, o, y, T, u, n);
        return;
      case "select":
        x = i = c = b = null;
        for (u in e)
          if (((o = e[u]), e.hasOwnProperty(u) && o != null))
            switch (u) {
              case "value":
                break;
              case "multiple":
                x = o;
              default:
                a.hasOwnProperty(u) || Et(t, l, u, null, a, o);
            }
        for (n in a)
          if (
            ((u = a[n]),
            (o = e[n]),
            a.hasOwnProperty(n) && (u != null || o != null))
          )
            switch (n) {
              case "value":
                b = u;
                break;
              case "defaultValue":
                c = u;
                break;
              case "multiple":
                i = u;
              default:
                u !== o && Et(t, l, n, u, a, o);
            }
        (l = c),
          (e = i),
          (a = x),
          b != null
            ? We(t, !!e, b, !1)
            : !!a != !!e &&
              (l != null ? We(t, !!e, l, !0) : We(t, !!e, e ? [] : "", !1));
        return;
      case "textarea":
        x = b = null;
        for (c in e)
          if (
            ((n = e[c]),
            e.hasOwnProperty(c) && n != null && !a.hasOwnProperty(c))
          )
            switch (c) {
              case "value":
                break;
              case "children":
                break;
              default:
                Et(t, l, c, null, a, n);
            }
        for (i in a)
          if (
            ((n = a[i]),
            (u = e[i]),
            a.hasOwnProperty(i) && (n != null || u != null))
          )
            switch (i) {
              case "value":
                b = n;
                break;
              case "defaultValue":
                x = n;
                break;
              case "children":
                break;
              case "dangerouslySetInnerHTML":
                if (n != null) throw Error(r(91));
                break;
              default:
                n !== u && Et(t, l, i, n, a, u);
            }
        Yf(t, b, x);
        return;
      case "option":
        for (var L in e)
          if (
            ((b = e[L]),
            e.hasOwnProperty(L) && b != null && !a.hasOwnProperty(L))
          )
            switch (L) {
              case "selected":
                t.selected = !1;
                break;
              default:
                Et(t, l, L, null, a, b);
            }
        for (o in a)
          if (
            ((b = a[o]),
            (x = e[o]),
            a.hasOwnProperty(o) && b !== x && (b != null || x != null))
          )
            switch (o) {
              case "selected":
                t.selected =
                  b && typeof b != "function" && typeof b != "symbol";
                break;
              default:
                Et(t, l, o, b, a, x);
            }
        return;
      case "img":
      case "link":
      case "area":
      case "base":
      case "br":
      case "col":
      case "embed":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "source":
      case "track":
      case "wbr":
      case "menuitem":
        for (var $ in e)
          (b = e[$]),
            e.hasOwnProperty($) &&
              b != null &&
              !a.hasOwnProperty($) &&
              Et(t, l, $, null, a, b);
        for (y in a)
          if (
            ((b = a[y]),
            (x = e[y]),
            a.hasOwnProperty(y) && b !== x && (b != null || x != null))
          )
            switch (y) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (b != null) throw Error(r(137, l));
                break;
              default:
                Et(t, l, y, b, a, x);
            }
        return;
      default:
        if (ni(l)) {
          for (var Nt in e)
            (b = e[Nt]),
              e.hasOwnProperty(Nt) &&
                b !== void 0 &&
                !a.hasOwnProperty(Nt) &&
                wc(t, l, Nt, void 0, a, b);
          for (T in a)
            (b = a[T]),
              (x = e[T]),
              !a.hasOwnProperty(T) ||
                b === x ||
                (b === void 0 && x === void 0) ||
                wc(t, l, T, b, a, x);
          return;
        }
    }
    for (var m in e)
      (b = e[m]),
        e.hasOwnProperty(m) &&
          b != null &&
          !a.hasOwnProperty(m) &&
          Et(t, l, m, null, a, b);
    for (N in a)
      (b = a[N]),
        (x = e[N]),
        !a.hasOwnProperty(N) ||
          b === x ||
          (b == null && x == null) ||
          Et(t, l, N, b, a, x);
  }
  function Zr(t) {
    switch (t) {
      case "css":
      case "script":
      case "font":
      case "img":
      case "image":
      case "input":
      case "link":
        return !0;
      default:
        return !1;
    }
  }
  function Ch() {
    if (typeof performance.getEntriesByType == "function") {
      for (
        var t = 0, l = 0, e = performance.getEntriesByType("resource"), a = 0;
        a < e.length;
        a++
      ) {
        var n = e[a],
          u = n.transferSize,
          i = n.initiatorType,
          c = n.duration;
        if (u && c && Zr(i)) {
          for (i = 0, c = n.responseEnd, a += 1; a < e.length; a++) {
            var o = e[a],
              y = o.startTime;
            if (y > c) break;
            var T = o.transferSize,
              N = o.initiatorType;
            T &&
              Zr(N) &&
              ((o = o.responseEnd), (i += T * (o < c ? 1 : (c - y) / (o - y))));
          }
          if ((--a, (l += (8 * (u + i)) / (n.duration / 1e3)), t++, 10 < t))
            break;
        }
      }
      if (0 < t) return l / t / 1e6;
    }
    return navigator.connection &&
      ((t = navigator.connection.downlink), typeof t == "number")
      ? t
      : 5;
  }
  var Vc = null,
    Kc = null;
  function Du(t) {
    return t.nodeType === 9 ? t : t.ownerDocument;
  }
  function wr(t) {
    switch (t) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function Vr(t, l) {
    if (t === 0)
      switch (l) {
        case "svg":
          return 1;
        case "math":
          return 2;
        default:
          return 0;
      }
    return t === 1 && l === "foreignObject" ? 0 : t;
  }
  function Jc(t, l) {
    return (
      t === "textarea" ||
      t === "noscript" ||
      typeof l.children == "string" ||
      typeof l.children == "number" ||
      typeof l.children == "bigint" ||
      (typeof l.dangerouslySetInnerHTML == "object" &&
        l.dangerouslySetInnerHTML !== null &&
        l.dangerouslySetInnerHTML.__html != null)
    );
  }
  var $c = null;
  function Uh() {
    var t = window.event;
    return t && t.type === "popstate"
      ? t === $c
        ? !1
        : (($c = t), !0)
      : (($c = null), !1);
  }
  var Kr = typeof setTimeout == "function" ? setTimeout : void 0,
    Hh = typeof clearTimeout == "function" ? clearTimeout : void 0,
    Jr = typeof Promise == "function" ? Promise : void 0,
    Bh =
      typeof queueMicrotask == "function"
        ? queueMicrotask
        : typeof Jr < "u"
        ? function (t) {
            return Jr.resolve(null).then(t).catch(Rh);
          }
        : Kr;
  function Rh(t) {
    setTimeout(function () {
      throw t;
    });
  }
  function xe(t) {
    return t === "head";
  }
  function $r(t, l) {
    var e = l,
      a = 0;
    do {
      var n = e.nextSibling;
      if ((t.removeChild(e), n && n.nodeType === 8))
        if (((e = n.data), e === "/$" || e === "/&")) {
          if (a === 0) {
            t.removeChild(n), _a(l);
            return;
          }
          a--;
        } else if (
          e === "$" ||
          e === "$?" ||
          e === "$~" ||
          e === "$!" ||
          e === "&"
        )
          a++;
        else if (e === "html") gn(t.ownerDocument.documentElement);
        else if (e === "head") {
          (e = t.ownerDocument.head), gn(e);
          for (var u = e.firstChild; u; ) {
            var i = u.nextSibling,
              c = u.nodeName;
            u[Ca] ||
              c === "SCRIPT" ||
              c === "STYLE" ||
              (c === "LINK" && u.rel.toLowerCase() === "stylesheet") ||
              e.removeChild(u),
              (u = i);
          }
        } else e === "body" && gn(t.ownerDocument.body);
      e = n;
    } while (e);
    _a(l);
  }
  function kr(t, l) {
    var e = t;
    t = 0;
    do {
      var a = e.nextSibling;
      if (
        (e.nodeType === 1
          ? l
            ? ((e._stashedDisplay = e.style.display),
              (e.style.display = "none"))
            : ((e.style.display = e._stashedDisplay || ""),
              e.getAttribute("style") === "" && e.removeAttribute("style"))
          : e.nodeType === 3 &&
            (l
              ? ((e._stashedText = e.nodeValue), (e.nodeValue = ""))
              : (e.nodeValue = e._stashedText || "")),
        a && a.nodeType === 8)
      )
        if (((e = a.data), e === "/$")) {
          if (t === 0) break;
          t--;
        } else (e !== "$" && e !== "$?" && e !== "$~" && e !== "$!") || t++;
      e = a;
    } while (e);
  }
  function kc(t) {
    var l = t.firstChild;
    for (l && l.nodeType === 10 && (l = l.nextSibling); l; ) {
      var e = l;
      switch (((l = l.nextSibling), e.nodeName)) {
        case "HTML":
        case "HEAD":
        case "BODY":
          kc(e), ti(e);
          continue;
        case "SCRIPT":
        case "STYLE":
          continue;
        case "LINK":
          if (e.rel.toLowerCase() === "stylesheet") continue;
      }
      t.removeChild(e);
    }
  }
  function qh(t, l, e, a) {
    for (; t.nodeType === 1; ) {
      var n = e;
      if (t.nodeName.toLowerCase() !== l.toLowerCase()) {
        if (!a && (t.nodeName !== "INPUT" || t.type !== "hidden")) break;
      } else if (a) {
        if (!t[Ca])
          switch (l) {
            case "meta":
              if (!t.hasAttribute("itemprop")) break;
              return t;
            case "link":
              if (
                ((u = t.getAttribute("rel")),
                u === "stylesheet" && t.hasAttribute("data-precedence"))
              )
                break;
              if (
                u !== n.rel ||
                t.getAttribute("href") !==
                  (n.href == null || n.href === "" ? null : n.href) ||
                t.getAttribute("crossorigin") !==
                  (n.crossOrigin == null ? null : n.crossOrigin) ||
                t.getAttribute("title") !== (n.title == null ? null : n.title)
              )
                break;
              return t;
            case "style":
              if (t.hasAttribute("data-precedence")) break;
              return t;
            case "script":
              if (
                ((u = t.getAttribute("src")),
                (u !== (n.src == null ? null : n.src) ||
                  t.getAttribute("type") !== (n.type == null ? null : n.type) ||
                  t.getAttribute("crossorigin") !==
                    (n.crossOrigin == null ? null : n.crossOrigin)) &&
                  u &&
                  t.hasAttribute("async") &&
                  !t.hasAttribute("itemprop"))
              )
                break;
              return t;
            default:
              return t;
          }
      } else if (l === "input" && t.type === "hidden") {
        var u = n.name == null ? null : "" + n.name;
        if (n.type === "hidden" && t.getAttribute("name") === u) return t;
      } else return t;
      if (((t = Al(t.nextSibling)), t === null)) break;
    }
    return null;
  }
  function Yh(t, l, e) {
    if (l === "") return null;
    for (; t.nodeType !== 3; )
      if (
        ((t.nodeType !== 1 || t.nodeName !== "INPUT" || t.type !== "hidden") &&
          !e) ||
        ((t = Al(t.nextSibling)), t === null)
      )
        return null;
    return t;
  }
  function Wr(t, l) {
    for (; t.nodeType !== 8; )
      if (
        ((t.nodeType !== 1 || t.nodeName !== "INPUT" || t.type !== "hidden") &&
          !l) ||
        ((t = Al(t.nextSibling)), t === null)
      )
        return null;
    return t;
  }
  function Wc(t) {
    return t.data === "$?" || t.data === "$~";
  }
  function Fc(t) {
    return (
      t.data === "$!" ||
      (t.data === "$?" && t.ownerDocument.readyState !== "loading")
    );
  }
  function Gh(t, l) {
    var e = t.ownerDocument;
    if (t.data === "$~") t._reactRetry = l;
    else if (t.data !== "$?" || e.readyState !== "loading") l();
    else {
      var a = function () {
        l(), e.removeEventListener("DOMContentLoaded", a);
      };
      e.addEventListener("DOMContentLoaded", a), (t._reactRetry = a);
    }
  }
  function Al(t) {
    for (; t != null; t = t.nextSibling) {
      var l = t.nodeType;
      if (l === 1 || l === 3) break;
      if (l === 8) {
        if (
          ((l = t.data),
          l === "$" ||
            l === "$!" ||
            l === "$?" ||
            l === "$~" ||
            l === "&" ||
            l === "F!" ||
            l === "F")
        )
          break;
        if (l === "/$" || l === "/&") return null;
      }
    }
    return t;
  }
  var Ic = null;
  function Fr(t) {
    t = t.nextSibling;
    for (var l = 0; t; ) {
      if (t.nodeType === 8) {
        var e = t.data;
        if (e === "/$" || e === "/&") {
          if (l === 0) return Al(t.nextSibling);
          l--;
        } else
          (e !== "$" && e !== "$!" && e !== "$?" && e !== "$~" && e !== "&") ||
            l++;
      }
      t = t.nextSibling;
    }
    return null;
  }
  function Ir(t) {
    t = t.previousSibling;
    for (var l = 0; t; ) {
      if (t.nodeType === 8) {
        var e = t.data;
        if (e === "$" || e === "$!" || e === "$?" || e === "$~" || e === "&") {
          if (l === 0) return t;
          l--;
        } else (e !== "/$" && e !== "/&") || l++;
      }
      t = t.previousSibling;
    }
    return null;
  }
  function Pr(t, l, e) {
    switch (((l = Du(e)), t)) {
      case "html":
        if (((t = l.documentElement), !t)) throw Error(r(452));
        return t;
      case "head":
        if (((t = l.head), !t)) throw Error(r(453));
        return t;
      case "body":
        if (((t = l.body), !t)) throw Error(r(454));
        return t;
      default:
        throw Error(r(451));
    }
  }
  function gn(t) {
    for (var l = t.attributes; l.length; ) t.removeAttributeNode(l[0]);
    ti(t);
  }
  var jl = new Map(),
    td = new Set();
  function Mu(t) {
    return typeof t.getRootNode == "function"
      ? t.getRootNode()
      : t.nodeType === 9
      ? t
      : t.ownerDocument;
  }
  var Pl = A.d;
  A.d = { f: Xh, r: Lh, D: Qh, C: Zh, L: wh, m: Vh, X: Jh, S: Kh, M: $h };
  function Xh() {
    var t = Pl.f(),
      l = Su();
    return t || l;
  }
  function Lh(t) {
    var l = Je(t);
    l !== null && l.tag === 5 && l.type === "form" ? yo(l) : Pl.r(t);
  }
  var Aa = typeof document > "u" ? null : document;
  function ld(t, l, e) {
    var a = Aa;
    if (a && typeof l == "string" && l) {
      var n = bl(l);
      (n = 'link[rel="' + t + '"][href="' + n + '"]'),
        typeof e == "string" && (n += '[crossorigin="' + e + '"]'),
        td.has(n) ||
          (td.add(n),
          (t = { rel: t, crossOrigin: e, href: l }),
          a.querySelector(n) === null &&
            ((l = a.createElement("link")),
            Ft(l, "link", t),
            Vt(l),
            a.head.appendChild(l)));
    }
  }
  function Qh(t) {
    Pl.D(t), ld("dns-prefetch", t, null);
  }
  function Zh(t, l) {
    Pl.C(t, l), ld("preconnect", t, l);
  }
  function wh(t, l, e) {
    Pl.L(t, l, e);
    var a = Aa;
    if (a && t && l) {
      var n = 'link[rel="preload"][as="' + bl(l) + '"]';
      l === "image" && e && e.imageSrcSet
        ? ((n += '[imagesrcset="' + bl(e.imageSrcSet) + '"]'),
          typeof e.imageSizes == "string" &&
            (n += '[imagesizes="' + bl(e.imageSizes) + '"]'))
        : (n += '[href="' + bl(t) + '"]');
      var u = n;
      switch (l) {
        case "style":
          u = ja(t);
          break;
        case "script":
          u = za(t);
      }
      jl.has(u) ||
        ((t = j(
          {
            rel: "preload",
            href: l === "image" && e && e.imageSrcSet ? void 0 : t,
            as: l,
          },
          e
        )),
        jl.set(u, t),
        a.querySelector(n) !== null ||
          (l === "style" && a.querySelector(vn(u))) ||
          (l === "script" && a.querySelector(yn(u))) ||
          ((l = a.createElement("link")),
          Ft(l, "link", t),
          Vt(l),
          a.head.appendChild(l)));
    }
  }
  function Vh(t, l) {
    Pl.m(t, l);
    var e = Aa;
    if (e && t) {
      var a = l && typeof l.as == "string" ? l.as : "script",
        n =
          'link[rel="modulepreload"][as="' + bl(a) + '"][href="' + bl(t) + '"]',
        u = n;
      switch (a) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          u = za(t);
      }
      if (
        !jl.has(u) &&
        ((t = j({ rel: "modulepreload", href: t }, l)),
        jl.set(u, t),
        e.querySelector(n) === null)
      ) {
        switch (a) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (e.querySelector(yn(u))) return;
        }
        (a = e.createElement("link")),
          Ft(a, "link", t),
          Vt(a),
          e.head.appendChild(a);
      }
    }
  }
  function Kh(t, l, e) {
    Pl.S(t, l, e);
    var a = Aa;
    if (a && t) {
      var n = $e(a).hoistableStyles,
        u = ja(t);
      l = l || "default";
      var i = n.get(u);
      if (!i) {
        var c = { loading: 0, preload: null };
        if ((i = a.querySelector(vn(u)))) c.loading = 5;
        else {
          (t = j({ rel: "stylesheet", href: t, "data-precedence": l }, e)),
            (e = jl.get(u)) && Pc(t, e);
          var o = (i = a.createElement("link"));
          Vt(o),
            Ft(o, "link", t),
            (o._p = new Promise(function (y, T) {
              (o.onload = y), (o.onerror = T);
            })),
            o.addEventListener("load", function () {
              c.loading |= 1;
            }),
            o.addEventListener("error", function () {
              c.loading |= 2;
            }),
            (c.loading |= 4),
            Ou(i, l, a);
        }
        (i = { type: "stylesheet", instance: i, count: 1, state: c }),
          n.set(u, i);
      }
    }
  }
  function Jh(t, l) {
    Pl.X(t, l);
    var e = Aa;
    if (e && t) {
      var a = $e(e).hoistableScripts,
        n = za(t),
        u = a.get(n);
      u ||
        ((u = e.querySelector(yn(n))),
        u ||
          ((t = j({ src: t, async: !0 }, l)),
          (l = jl.get(n)) && tf(t, l),
          (u = e.createElement("script")),
          Vt(u),
          Ft(u, "link", t),
          e.head.appendChild(u)),
        (u = { type: "script", instance: u, count: 1, state: null }),
        a.set(n, u));
    }
  }
  function $h(t, l) {
    Pl.M(t, l);
    var e = Aa;
    if (e && t) {
      var a = $e(e).hoistableScripts,
        n = za(t),
        u = a.get(n);
      u ||
        ((u = e.querySelector(yn(n))),
        u ||
          ((t = j({ src: t, async: !0, type: "module" }, l)),
          (l = jl.get(n)) && tf(t, l),
          (u = e.createElement("script")),
          Vt(u),
          Ft(u, "link", t),
          e.head.appendChild(u)),
        (u = { type: "script", instance: u, count: 1, state: null }),
        a.set(n, u));
    }
  }
  function ed(t, l, e, a) {
    var n = (n = k.current) ? Mu(n) : null;
    if (!n) throw Error(r(446));
    switch (t) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof e.precedence == "string" && typeof e.href == "string"
          ? ((l = ja(e.href)),
            (e = $e(n).hoistableStyles),
            (a = e.get(l)),
            a ||
              ((a = { type: "style", instance: null, count: 0, state: null }),
              e.set(l, a)),
            a)
          : { type: "void", instance: null, count: 0, state: null };
      case "link":
        if (
          e.rel === "stylesheet" &&
          typeof e.href == "string" &&
          typeof e.precedence == "string"
        ) {
          t = ja(e.href);
          var u = $e(n).hoistableStyles,
            i = u.get(t);
          if (
            (i ||
              ((n = n.ownerDocument || n),
              (i = {
                type: "stylesheet",
                instance: null,
                count: 0,
                state: { loading: 0, preload: null },
              }),
              u.set(t, i),
              (u = n.querySelector(vn(t))) &&
                !u._p &&
                ((i.instance = u), (i.state.loading = 5)),
              jl.has(t) ||
                ((e = {
                  rel: "preload",
                  as: "style",
                  href: e.href,
                  crossOrigin: e.crossOrigin,
                  integrity: e.integrity,
                  media: e.media,
                  hrefLang: e.hrefLang,
                  referrerPolicy: e.referrerPolicy,
                }),
                jl.set(t, e),
                u || kh(n, t, e, i.state))),
            l && a === null)
          )
            throw Error(r(528, ""));
          return i;
        }
        if (l && a !== null) throw Error(r(529, ""));
        return null;
      case "script":
        return (
          (l = e.async),
          (e = e.src),
          typeof e == "string" &&
          l &&
          typeof l != "function" &&
          typeof l != "symbol"
            ? ((l = za(e)),
              (e = $e(n).hoistableScripts),
              (a = e.get(l)),
              a ||
                ((a = {
                  type: "script",
                  instance: null,
                  count: 0,
                  state: null,
                }),
                e.set(l, a)),
              a)
            : { type: "void", instance: null, count: 0, state: null }
        );
      default:
        throw Error(r(444, t));
    }
  }
  function ja(t) {
    return 'href="' + bl(t) + '"';
  }
  function vn(t) {
    return 'link[rel="stylesheet"][' + t + "]";
  }
  function ad(t) {
    return j({}, t, { "data-precedence": t.precedence, precedence: null });
  }
  function kh(t, l, e, a) {
    t.querySelector('link[rel="preload"][as="style"][' + l + "]")
      ? (a.loading = 1)
      : ((l = t.createElement("link")),
        (a.preload = l),
        l.addEventListener("load", function () {
          return (a.loading |= 1);
        }),
        l.addEventListener("error", function () {
          return (a.loading |= 2);
        }),
        Ft(l, "link", e),
        Vt(l),
        t.head.appendChild(l));
  }
  function za(t) {
    return '[src="' + bl(t) + '"]';
  }
  function yn(t) {
    return "script[async]" + t;
  }
  function nd(t, l, e) {
    if ((l.count++, l.instance === null))
      switch (l.type) {
        case "style":
          var a = t.querySelector('style[data-href~="' + bl(e.href) + '"]');
          if (a) return (l.instance = a), Vt(a), a;
          var n = j({}, e, {
            "data-href": e.href,
            "data-precedence": e.precedence,
            href: null,
            precedence: null,
          });
          return (
            (a = (t.ownerDocument || t).createElement("style")),
            Vt(a),
            Ft(a, "style", n),
            Ou(a, e.precedence, t),
            (l.instance = a)
          );
        case "stylesheet":
          n = ja(e.href);
          var u = t.querySelector(vn(n));
          if (u) return (l.state.loading |= 4), (l.instance = u), Vt(u), u;
          (a = ad(e)),
            (n = jl.get(n)) && Pc(a, n),
            (u = (t.ownerDocument || t).createElement("link")),
            Vt(u);
          var i = u;
          return (
            (i._p = new Promise(function (c, o) {
              (i.onload = c), (i.onerror = o);
            })),
            Ft(u, "link", a),
            (l.state.loading |= 4),
            Ou(u, e.precedence, t),
            (l.instance = u)
          );
        case "script":
          return (
            (u = za(e.src)),
            (n = t.querySelector(yn(u)))
              ? ((l.instance = n), Vt(n), n)
              : ((a = e),
                (n = jl.get(u)) && ((a = j({}, e)), tf(a, n)),
                (t = t.ownerDocument || t),
                (n = t.createElement("script")),
                Vt(n),
                Ft(n, "link", a),
                t.head.appendChild(n),
                (l.instance = n))
          );
        case "void":
          return null;
        default:
          throw Error(r(443, l.type));
      }
    else
      l.type === "stylesheet" &&
        (l.state.loading & 4) === 0 &&
        ((a = l.instance), (l.state.loading |= 4), Ou(a, e.precedence, t));
    return l.instance;
  }
  function Ou(t, l, e) {
    for (
      var a = e.querySelectorAll(
          'link[rel="stylesheet"][data-precedence],style[data-precedence]'
        ),
        n = a.length ? a[a.length - 1] : null,
        u = n,
        i = 0;
      i < a.length;
      i++
    ) {
      var c = a[i];
      if (c.dataset.precedence === l) u = c;
      else if (u !== n) break;
    }
    u
      ? u.parentNode.insertBefore(t, u.nextSibling)
      : ((l = e.nodeType === 9 ? e.head : e), l.insertBefore(t, l.firstChild));
  }
  function Pc(t, l) {
    t.crossOrigin == null && (t.crossOrigin = l.crossOrigin),
      t.referrerPolicy == null && (t.referrerPolicy = l.referrerPolicy),
      t.title == null && (t.title = l.title);
  }
  function tf(t, l) {
    t.crossOrigin == null && (t.crossOrigin = l.crossOrigin),
      t.referrerPolicy == null && (t.referrerPolicy = l.referrerPolicy),
      t.integrity == null && (t.integrity = l.integrity);
  }
  var Cu = null;
  function ud(t, l, e) {
    if (Cu === null) {
      var a = new Map(),
        n = (Cu = new Map());
      n.set(e, a);
    } else (n = Cu), (a = n.get(e)), a || ((a = new Map()), n.set(e, a));
    if (a.has(t)) return a;
    for (
      a.set(t, null), e = e.getElementsByTagName(t), n = 0;
      n < e.length;
      n++
    ) {
      var u = e[n];
      if (
        !(
          u[Ca] ||
          u[Jt] ||
          (t === "link" && u.getAttribute("rel") === "stylesheet")
        ) &&
        u.namespaceURI !== "http://www.w3.org/2000/svg"
      ) {
        var i = u.getAttribute(l) || "";
        i = t + i;
        var c = a.get(i);
        c ? c.push(u) : a.set(i, [u]);
      }
    }
    return a;
  }
  function id(t, l, e) {
    (t = t.ownerDocument || t),
      t.head.insertBefore(
        e,
        l === "title" ? t.querySelector("head > title") : null
      );
  }
  function Wh(t, l, e) {
    if (e === 1 || l.itemProp != null) return !1;
    switch (t) {
      case "meta":
      case "title":
        return !0;
      case "style":
        if (
          typeof l.precedence != "string" ||
          typeof l.href != "string" ||
          l.href === ""
        )
          break;
        return !0;
      case "link":
        if (
          typeof l.rel != "string" ||
          typeof l.href != "string" ||
          l.href === "" ||
          l.onLoad ||
          l.onError
        )
          break;
        switch (l.rel) {
          case "stylesheet":
            return (
              (t = l.disabled), typeof l.precedence == "string" && t == null
            );
          default:
            return !0;
        }
      case "script":
        if (
          l.async &&
          typeof l.async != "function" &&
          typeof l.async != "symbol" &&
          !l.onLoad &&
          !l.onError &&
          l.src &&
          typeof l.src == "string"
        )
          return !0;
    }
    return !1;
  }
  function cd(t) {
    return !(t.type === "stylesheet" && (t.state.loading & 3) === 0);
  }
  function Fh(t, l, e, a) {
    if (
      e.type === "stylesheet" &&
      (typeof a.media != "string" || matchMedia(a.media).matches !== !1) &&
      (e.state.loading & 4) === 0
    ) {
      if (e.instance === null) {
        var n = ja(a.href),
          u = l.querySelector(vn(n));
        if (u) {
          (l = u._p),
            l !== null &&
              typeof l == "object" &&
              typeof l.then == "function" &&
              (t.count++, (t = Uu.bind(t)), l.then(t, t)),
            (e.state.loading |= 4),
            (e.instance = u),
            Vt(u);
          return;
        }
        (u = l.ownerDocument || l),
          (a = ad(a)),
          (n = jl.get(n)) && Pc(a, n),
          (u = u.createElement("link")),
          Vt(u);
        var i = u;
        (i._p = new Promise(function (c, o) {
          (i.onload = c), (i.onerror = o);
        })),
          Ft(u, "link", a),
          (e.instance = u);
      }
      t.stylesheets === null && (t.stylesheets = new Map()),
        t.stylesheets.set(e, l),
        (l = e.state.preload) &&
          (e.state.loading & 3) === 0 &&
          (t.count++,
          (e = Uu.bind(t)),
          l.addEventListener("load", e),
          l.addEventListener("error", e));
    }
  }
  var lf = 0;
  function Ih(t, l) {
    return (
      t.stylesheets && t.count === 0 && Bu(t, t.stylesheets),
      0 < t.count || 0 < t.imgCount
        ? function (e) {
            var a = setTimeout(function () {
              if ((t.stylesheets && Bu(t, t.stylesheets), t.unsuspend)) {
                var u = t.unsuspend;
                (t.unsuspend = null), u();
              }
            }, 6e4 + l);
            0 < t.imgBytes && lf === 0 && (lf = 62500 * Ch());
            var n = setTimeout(function () {
              if (
                ((t.waitingForImages = !1),
                t.count === 0 &&
                  (t.stylesheets && Bu(t, t.stylesheets), t.unsuspend))
              ) {
                var u = t.unsuspend;
                (t.unsuspend = null), u();
              }
            }, (t.imgBytes > lf ? 50 : 800) + l);
            return (
              (t.unsuspend = e),
              function () {
                (t.unsuspend = null), clearTimeout(a), clearTimeout(n);
              }
            );
          }
        : null
    );
  }
  function Uu() {
    if (
      (this.count--,
      this.count === 0 && (this.imgCount === 0 || !this.waitingForImages))
    ) {
      if (this.stylesheets) Bu(this, this.stylesheets);
      else if (this.unsuspend) {
        var t = this.unsuspend;
        (this.unsuspend = null), t();
      }
    }
  }
  var Hu = null;
  function Bu(t, l) {
    (t.stylesheets = null),
      t.unsuspend !== null &&
        (t.count++,
        (Hu = new Map()),
        l.forEach(Ph, t),
        (Hu = null),
        Uu.call(t));
  }
  function Ph(t, l) {
    if (!(l.state.loading & 4)) {
      var e = Hu.get(t);
      if (e) var a = e.get(null);
      else {
        (e = new Map()), Hu.set(t, e);
        for (
          var n = t.querySelectorAll(
              "link[data-precedence],style[data-precedence]"
            ),
            u = 0;
          u < n.length;
          u++
        ) {
          var i = n[u];
          (i.nodeName === "LINK" || i.getAttribute("media") !== "not all") &&
            (e.set(i.dataset.precedence, i), (a = i));
        }
        a && e.set(null, a);
      }
      (n = l.instance),
        (i = n.getAttribute("data-precedence")),
        (u = e.get(i) || a),
        u === a && e.set(null, n),
        e.set(i, n),
        this.count++,
        (a = Uu.bind(this)),
        n.addEventListener("load", a),
        n.addEventListener("error", a),
        u
          ? u.parentNode.insertBefore(n, u.nextSibling)
          : ((t = t.nodeType === 9 ? t.head : t),
            t.insertBefore(n, t.firstChild)),
        (l.state.loading |= 4);
    }
  }
  var bn = {
    $$typeof: ft,
    Provider: null,
    Consumer: null,
    _currentValue: B,
    _currentValue2: B,
    _threadCount: 0,
  };
  function t0(t, l, e, a, n, u, i, c, o) {
    (this.tag = 1),
      (this.containerInfo = t),
      (this.pingCache = this.current = this.pendingChildren = null),
      (this.timeoutHandle = -1),
      (this.callbackNode =
        this.next =
        this.pendingContext =
        this.context =
        this.cancelPendingCommit =
          null),
      (this.callbackPriority = 0),
      (this.expirationTimes = Wu(-1)),
      (this.entangledLanes =
        this.shellSuspendCounter =
        this.errorRecoveryDisabledLanes =
        this.expiredLanes =
        this.warmLanes =
        this.pingedLanes =
        this.suspendedLanes =
        this.pendingLanes =
          0),
      (this.entanglements = Wu(0)),
      (this.hiddenUpdates = Wu(null)),
      (this.identifierPrefix = a),
      (this.onUncaughtError = n),
      (this.onCaughtError = u),
      (this.onRecoverableError = i),
      (this.pooledCache = null),
      (this.pooledCacheLanes = 0),
      (this.formState = o),
      (this.incompleteTransitions = new Map());
  }
  function fd(t, l, e, a, n, u, i, c, o, y, T, N) {
    return (
      (t = new t0(t, l, e, i, o, y, T, N, c)),
      (l = 1),
      u === !0 && (l |= 24),
      (u = rl(3, null, null, l)),
      (t.current = u),
      (u.stateNode = t),
      (l = Hi()),
      l.refCount++,
      (t.pooledCache = l),
      l.refCount++,
      (u.memoizedState = { element: a, isDehydrated: e, cache: l }),
      Yi(u),
      t
    );
  }
  function sd(t) {
    return t ? ((t = na), t) : na;
  }
  function od(t, l, e, a, n, u) {
    (n = sd(n)),
      a.context === null ? (a.context = n) : (a.pendingContext = n),
      (a = se(l)),
      (a.payload = { element: e }),
      (u = u === void 0 ? null : u),
      u !== null && (a.callback = u),
      (e = oe(t, a, l)),
      e !== null && (il(e, t, l), ka(e, t, l));
  }
  function rd(t, l) {
    if (((t = t.memoizedState), t !== null && t.dehydrated !== null)) {
      var e = t.retryLane;
      t.retryLane = e !== 0 && e < l ? e : l;
    }
  }
  function ef(t, l) {
    rd(t, l), (t = t.alternate) && rd(t, l);
  }
  function dd(t) {
    if (t.tag === 13 || t.tag === 31) {
      var l = Ce(t, 67108864);
      l !== null && il(l, t, 67108864), ef(t, 67108864);
    }
  }
  function md(t) {
    if (t.tag === 13 || t.tag === 31) {
      var l = vl();
      l = Fu(l);
      var e = Ce(t, l);
      e !== null && il(e, t, l), ef(t, l);
    }
  }
  var Ru = !0;
  function l0(t, l, e, a) {
    var n = g.T;
    g.T = null;
    var u = A.p;
    try {
      (A.p = 2), af(t, l, e, a);
    } finally {
      (A.p = u), (g.T = n);
    }
  }
  function e0(t, l, e, a) {
    var n = g.T;
    g.T = null;
    var u = A.p;
    try {
      (A.p = 8), af(t, l, e, a);
    } finally {
      (A.p = u), (g.T = n);
    }
  }
  function af(t, l, e, a) {
    if (Ru) {
      var n = nf(a);
      if (n === null) Zc(t, l, a, qu, e), gd(t, a);
      else if (n0(n, t, l, e, a)) a.stopPropagation();
      else if ((gd(t, a), l & 4 && -1 < a0.indexOf(t))) {
        for (; n !== null; ) {
          var u = Je(n);
          if (u !== null)
            switch (u.tag) {
              case 3:
                if (((u = u.stateNode), u.current.memoizedState.isDehydrated)) {
                  var i = ze(u.pendingLanes);
                  if (i !== 0) {
                    var c = u;
                    for (c.pendingLanes |= 2, c.entangledLanes |= 2; i; ) {
                      var o = 1 << (31 - sl(i));
                      (c.entanglements[1] |= o), (i &= ~o);
                    }
                    Ul(u), (vt & 6) === 0 && ((pu = cl() + 500), dn(0));
                  }
                }
                break;
              case 31:
              case 13:
                (c = Ce(u, 2)), c !== null && il(c, u, 2), Su(), ef(u, 2);
            }
          if (((u = nf(a)), u === null && Zc(t, l, a, qu, e), u === n)) break;
          n = u;
        }
        n !== null && a.stopPropagation();
      } else Zc(t, l, a, null, e);
    }
  }
  function nf(t) {
    return (t = ii(t)), uf(t);
  }
  var qu = null;
  function uf(t) {
    if (((qu = null), (t = Ke(t)), t !== null)) {
      var l = C(t);
      if (l === null) t = null;
      else {
        var e = l.tag;
        if (e === 13) {
          if (((t = G(l)), t !== null)) return t;
          t = null;
        } else if (e === 31) {
          if (((t = J(l)), t !== null)) return t;
          t = null;
        } else if (e === 3) {
          if (l.stateNode.current.memoizedState.isDehydrated)
            return l.tag === 3 ? l.stateNode.containerInfo : null;
          t = null;
        } else l !== t && (t = null);
      }
    }
    return (qu = t), null;
  }
  function hd(t) {
    switch (t) {
      case "beforetoggle":
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "resize":
      case "seeked":
      case "submit":
      case "toggle":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 2;
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "scroll":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 8;
      case "message":
        switch (Qd()) {
          case Sf:
            return 2;
          case Tf:
            return 8;
          case jn:
          case Zd:
            return 32;
          case Ef:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var cf = !1,
    Se = null,
    Te = null,
    Ee = null,
    pn = new Map(),
    xn = new Map(),
    Ne = [],
    a0 =
      "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
        " "
      );
  function gd(t, l) {
    switch (t) {
      case "focusin":
      case "focusout":
        Se = null;
        break;
      case "dragenter":
      case "dragleave":
        Te = null;
        break;
      case "mouseover":
      case "mouseout":
        Ee = null;
        break;
      case "pointerover":
      case "pointerout":
        pn.delete(l.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        xn.delete(l.pointerId);
    }
  }
  function Sn(t, l, e, a, n, u) {
    return t === null || t.nativeEvent !== u
      ? ((t = {
          blockedOn: l,
          domEventName: e,
          eventSystemFlags: a,
          nativeEvent: u,
          targetContainers: [n],
        }),
        l !== null && ((l = Je(l)), l !== null && dd(l)),
        t)
      : ((t.eventSystemFlags |= a),
        (l = t.targetContainers),
        n !== null && l.indexOf(n) === -1 && l.push(n),
        t);
  }
  function n0(t, l, e, a, n) {
    switch (l) {
      case "focusin":
        return (Se = Sn(Se, t, l, e, a, n)), !0;
      case "dragenter":
        return (Te = Sn(Te, t, l, e, a, n)), !0;
      case "mouseover":
        return (Ee = Sn(Ee, t, l, e, a, n)), !0;
      case "pointerover":
        var u = n.pointerId;
        return pn.set(u, Sn(pn.get(u) || null, t, l, e, a, n)), !0;
      case "gotpointercapture":
        return (
          (u = n.pointerId), xn.set(u, Sn(xn.get(u) || null, t, l, e, a, n)), !0
        );
    }
    return !1;
  }
  function vd(t) {
    var l = Ke(t.target);
    if (l !== null) {
      var e = C(l);
      if (e !== null) {
        if (((l = e.tag), l === 13)) {
          if (((l = G(e)), l !== null)) {
            (t.blockedOn = l),
              Df(t.priority, function () {
                md(e);
              });
            return;
          }
        } else if (l === 31) {
          if (((l = J(e)), l !== null)) {
            (t.blockedOn = l),
              Df(t.priority, function () {
                md(e);
              });
            return;
          }
        } else if (l === 3 && e.stateNode.current.memoizedState.isDehydrated) {
          t.blockedOn = e.tag === 3 ? e.stateNode.containerInfo : null;
          return;
        }
      }
    }
    t.blockedOn = null;
  }
  function Yu(t) {
    if (t.blockedOn !== null) return !1;
    for (var l = t.targetContainers; 0 < l.length; ) {
      var e = nf(t.nativeEvent);
      if (e === null) {
        e = t.nativeEvent;
        var a = new e.constructor(e.type, e);
        (ui = a), e.target.dispatchEvent(a), (ui = null);
      } else return (l = Je(e)), l !== null && dd(l), (t.blockedOn = e), !1;
      l.shift();
    }
    return !0;
  }
  function yd(t, l, e) {
    Yu(t) && e.delete(l);
  }
  function u0() {
    (cf = !1),
      Se !== null && Yu(Se) && (Se = null),
      Te !== null && Yu(Te) && (Te = null),
      Ee !== null && Yu(Ee) && (Ee = null),
      pn.forEach(yd),
      xn.forEach(yd);
  }
  function Gu(t, l) {
    t.blockedOn === l &&
      ((t.blockedOn = null),
      cf ||
        ((cf = !0),
        h.unstable_scheduleCallback(h.unstable_NormalPriority, u0)));
  }
  var Xu = null;
  function bd(t) {
    Xu !== t &&
      ((Xu = t),
      h.unstable_scheduleCallback(h.unstable_NormalPriority, function () {
        Xu === t && (Xu = null);
        for (var l = 0; l < t.length; l += 3) {
          var e = t[l],
            a = t[l + 1],
            n = t[l + 2];
          if (typeof a != "function") {
            if (uf(a || e) === null) continue;
            break;
          }
          var u = Je(e);
          u !== null &&
            (t.splice(l, 3),
            (l -= 3),
            nc(u, { pending: !0, data: n, method: e.method, action: a }, a, n));
        }
      }));
  }
  function _a(t) {
    function l(o) {
      return Gu(o, t);
    }
    Se !== null && Gu(Se, t),
      Te !== null && Gu(Te, t),
      Ee !== null && Gu(Ee, t),
      pn.forEach(l),
      xn.forEach(l);
    for (var e = 0; e < Ne.length; e++) {
      var a = Ne[e];
      a.blockedOn === t && (a.blockedOn = null);
    }
    for (; 0 < Ne.length && ((e = Ne[0]), e.blockedOn === null); )
      vd(e), e.blockedOn === null && Ne.shift();
    if (((e = (t.ownerDocument || t).$$reactFormReplay), e != null))
      for (a = 0; a < e.length; a += 3) {
        var n = e[a],
          u = e[a + 1],
          i = n[tl] || null;
        if (typeof u == "function") i || bd(e);
        else if (i) {
          var c = null;
          if (u && u.hasAttribute("formAction")) {
            if (((n = u), (i = u[tl] || null))) c = i.formAction;
            else if (uf(n) !== null) continue;
          } else c = i.action;
          typeof c == "function" ? (e[a + 1] = c) : (e.splice(a, 3), (a -= 3)),
            bd(e);
        }
      }
  }
  function pd() {
    function t(u) {
      u.canIntercept &&
        u.info === "react-transition" &&
        u.intercept({
          handler: function () {
            return new Promise(function (i) {
              return (n = i);
            });
          },
          focusReset: "manual",
          scroll: "manual",
        });
    }
    function l() {
      n !== null && (n(), (n = null)), a || setTimeout(e, 20);
    }
    function e() {
      if (!a && !navigation.transition) {
        var u = navigation.currentEntry;
        u &&
          u.url != null &&
          navigation.navigate(u.url, {
            state: u.getState(),
            info: "react-transition",
            history: "replace",
          });
      }
    }
    if (typeof navigation == "object") {
      var a = !1,
        n = null;
      return (
        navigation.addEventListener("navigate", t),
        navigation.addEventListener("navigatesuccess", l),
        navigation.addEventListener("navigateerror", l),
        setTimeout(e, 100),
        function () {
          (a = !0),
            navigation.removeEventListener("navigate", t),
            navigation.removeEventListener("navigatesuccess", l),
            navigation.removeEventListener("navigateerror", l),
            n !== null && (n(), (n = null));
        }
      );
    }
  }
  function ff(t) {
    this._internalRoot = t;
  }
  (Lu.prototype.render = ff.prototype.render =
    function (t) {
      var l = this._internalRoot;
      if (l === null) throw Error(r(409));
      var e = l.current,
        a = vl();
      od(e, a, t, l, null, null);
    }),
    (Lu.prototype.unmount = ff.prototype.unmount =
      function () {
        var t = this._internalRoot;
        if (t !== null) {
          this._internalRoot = null;
          var l = t.containerInfo;
          od(t.current, 2, null, t, null, null), Su(), (l[Ve] = null);
        }
      });
  function Lu(t) {
    this._internalRoot = t;
  }
  Lu.prototype.unstable_scheduleHydration = function (t) {
    if (t) {
      var l = _f();
      t = { blockedOn: null, target: t, priority: l };
      for (var e = 0; e < Ne.length && l !== 0 && l < Ne[e].priority; e++);
      Ne.splice(e, 0, t), e === 0 && vd(t);
    }
  };
  var xd = U.version;
  if (xd !== "19.2.0") throw Error(r(527, xd, "19.2.0"));
  A.findDOMNode = function (t) {
    var l = t._reactInternals;
    if (l === void 0)
      throw typeof t.render == "function"
        ? Error(r(188))
        : ((t = Object.keys(t).join(",")), Error(r(268, t)));
    return (
      (t = p(l)),
      (t = t !== null ? R(t) : null),
      (t = t === null ? null : t.stateNode),
      t
    );
  };
  var i0 = {
    bundleType: 0,
    version: "19.2.0",
    rendererPackageName: "react-dom",
    currentDispatcherRef: g,
    reconcilerVersion: "19.2.0",
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Qu = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Qu.isDisabled && Qu.supportsFiber)
      try {
        (Da = Qu.inject(i0)), (fl = Qu);
      } catch {}
  }
  return (
    (En.createRoot = function (t, l) {
      if (!M(t)) throw Error(r(299));
      var e = !1,
        a = "",
        n = zo,
        u = _o,
        i = Do;
      return (
        l != null &&
          (l.unstable_strictMode === !0 && (e = !0),
          l.identifierPrefix !== void 0 && (a = l.identifierPrefix),
          l.onUncaughtError !== void 0 && (n = l.onUncaughtError),
          l.onCaughtError !== void 0 && (u = l.onCaughtError),
          l.onRecoverableError !== void 0 && (i = l.onRecoverableError)),
        (l = fd(t, 1, !1, null, null, e, a, null, n, u, i, pd)),
        (t[Ve] = l.current),
        Qc(t),
        new ff(l)
      );
    }),
    (En.hydrateRoot = function (t, l, e) {
      if (!M(t)) throw Error(r(299));
      var a = !1,
        n = "",
        u = zo,
        i = _o,
        c = Do,
        o = null;
      return (
        e != null &&
          (e.unstable_strictMode === !0 && (a = !0),
          e.identifierPrefix !== void 0 && (n = e.identifierPrefix),
          e.onUncaughtError !== void 0 && (u = e.onUncaughtError),
          e.onCaughtError !== void 0 && (i = e.onCaughtError),
          e.onRecoverableError !== void 0 && (c = e.onRecoverableError),
          e.formState !== void 0 && (o = e.formState)),
        (l = fd(t, 1, !0, l, e ?? null, a, n, o, u, i, c, pd)),
        (l.context = sd(null)),
        (e = l.current),
        (a = vl()),
        (a = Fu(a)),
        (n = se(a)),
        (n.callback = null),
        oe(e, n, a),
        (e = a),
        (l.current.lanes = e),
        Oa(l, e),
        Ul(l),
        (t[Ve] = l.current),
        Qc(t),
        new Lu(l)
      );
    }),
    (En.version = "19.2.0"),
    En
  );
}
var Md;
function v0() {
  if (Md) return rf.exports;
  Md = 1;
  function h() {
    if (
      !(
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" ||
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"
      )
    )
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(h);
      } catch (U) {
        console.error(U);
      }
  }
  return h(), (rf.exports = g0()), rf.exports;
}
var y0 = v0();
const b0 = Bd(y0),
  Od = [
    {
      id: 1,
      name: "Trần Sơn Kiệt",
      title: "Giám đốc",
      imgSrc:
        "https://www.appsheet.com/template/gettablefileurl?appName=Appsheet-325045268&tableName=Kho%20%E1%BA%A3nh&fileName=Kho%20%E1%BA%A3nh_Images%2Fa08d129a.%E1%BA%A2nh.081603.png",
    },
    {
      id: 2,
      name: "Leader 2",
      title: "Trưởng phòng",
      imgSrc:
        "https://www.appsheet.com/template/gettablefileurl?appName=Appsheet-325045268&tableName=Kho%20%E1%BA%A3nh&fileName=Kho%20%E1%BA%A3nh_Images%2F08a11f88.%E1%BA%A2nh.081549.png",
    },
    {
      id: 3,
      name: "Nhân sự 1",
      title: "Tư vấn viên",
      imgSrc:
        "https://www.appsheet.com/template/gettablefileurl?appName=Appsheet-325045268&tableName=Kho%20%E1%BA%A3nh&fileName=Kho%20%E1%BA%A3nh_Images%2F95848698.%E1%BA%A2nh.081544.png",
    },
    {
      id: 4,
      name: "Nhân sự 2",
      title: "Giáo vụ",
      imgSrc:
        "https://www.appsheet.com/template/gettablefileurl?appName=Appsheet-325045268&tableName=Kho%20%E1%BA%A3nh&fileName=Kho%20%E1%BA%A3nh_Images%2F5ad65ff6.%E1%BA%A2nh.081554.png",
    },
    {
      id: 5,
      name: "Nhân sự 3",
      title: "Hỗ trợ kỹ thuật",
      imgSrc:
        "https://www.appsheet.com/template/gettablefileurl?appName=Appsheet-325045268&tableName=Kho%20%E1%BA%A3nh&fileName=Kho%20%E1%BA%A3nh_Images%2Fbd8bee3f.%E1%BA%A2nh.081559.png",
    },
  ],
  p0 = [...Od, ...Od],
  x0 = ({ onNavigate: h }) =>
    f.jsxs(f.Fragment, {
      children: [
        f.jsx("header", {
          className: "site-header",
          children: f.jsxs("div", {
            className: "container",
            children: [
              f.jsx("div", {
                className: "logo",
                children: f.jsx("a", {
                  href: "#",
                  children: f.jsx("img", {
                    src: "https://www.appsheet.com/template/gettablefileurl?appName=Upcode-325045268&tableName=D%E1%BB%B1%20%C3%A1n&fileName=D%E1%BB%B1%20%C3%A1n_Images%2F305fbfb4.%E1%BA%A2nh%20Logo.025506.png",
                    alt: "Logo Trí Tuệ 8+",
                  }),
                }),
              }),
              f.jsxs("nav", {
                className: "auth-buttons",
                children: [
                  f.jsx("a", {
                    href: "#",
                    className: "btn btn--secondary",
                    children: "Đăng nhập",
                  }),
                  f.jsx("a", {
                    href: "#",
                    className: "btn btn--primary",
                    children: "Đăng ký",
                  }),
                ],
              }),
            ],
          }),
        }),
        f.jsxs("main", {
          children: [
            f.jsx("section", {
              className: "hero-section",
              children: f.jsxs("div", {
                className: "hero-content-wrapper",
                children: [
                  f.jsxs("div", {
                    className: "hero-left",
                    children: [
                      f.jsxs("h1", {
                        children: [
                          "THỜI KHÓA BIỂU",
                          f.jsx("span", {
                            className: "h1-subtitle",
                            children: "Trí Tuệ 8+",
                          }),
                        ],
                      }),
                      f.jsx("button", {
                        onClick: h,
                        className: "btn btn--primary hero-btn",
                        children: "Xem Lịch Học Ngay",
                      }),
                    ],
                  }),
                  f.jsx("div", {
                    className: "hero-right",
                    children: f.jsx("p", {
                      className: "hero-slogan",
                      children: "Your path to academic excellence",
                    }),
                  }),
                ],
              }),
            }),
            f.jsxs("section", {
              className: "team-section",
              children: [
                f.jsxs("div", {
                  className: "container team-section-header",
                  children: [
                    f.jsx("h2", {
                      className: "section-title",
                      children: "Đội Ngũ Tận Tâm",
                    }),
                    f.jsx("p", {
                      className: "section-subtitle",
                      children:
                        "Gặp gỡ những con người tuyệt vời luôn sẵn sàng hỗ trợ bạn.",
                    }),
                  ],
                }),
                f.jsx("div", {
                  className: "slider-container",
                  children: f.jsx("div", {
                    className: "slider-track",
                    children: p0.map((U, z) =>
                      f.jsxs(
                        "div",
                        {
                          className: "team-member",
                          children: [
                            f.jsx("img", {
                              className: "team-member__image",
                              src: U.imgSrc,
                              alt: U.name,
                            }),
                            f.jsxs("div", {
                              className: "team-member__info",
                              children: [
                                f.jsx("h3", {
                                  className: "team-member__name",
                                  children: U.name,
                                }),
                                f.jsx("p", {
                                  className: "team-member__title",
                                  children: U.title,
                                }),
                              ],
                            }),
                          ],
                        },
                        z
                      )
                    ),
                  }),
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  S0 = 50,
  gf = 2,
  Cd = ({ items: h, defaultIndex: U = 0, onUpdate: z }) => {
    const [r, M] = q.useState(U),
      C = q.useRef(null),
      G = q.useRef(null),
      J = q.useCallback(
        (p) => {
          if (!C.current) return;
          const j = 95 - (r + gf) * S0;
          (C.current.style.transition = p
            ? "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
            : "none"),
            (C.current.style.transform = `translate3d(0, ${j}px, 0)`),
            (C.current.style.willChange = "transform");
        },
        [r]
      );
    q.useEffect(() => {
      J(!0);
    }, [r, J]),
      q.useEffect(() => {
        const p = setTimeout(() => {
          z(h[r]);
        }, 100);
        return () => clearTimeout(p);
      }, [r, h, z]);
    const D = (p) => {
      p.preventDefault(), p.stopPropagation();
      const R = Math.abs(p.deltaY) > 50 ? (p.deltaY > 0 ? 1 : -1) : 0;
      R !== 0 && M((j) => Math.max(0, Math.min(h.length - 1, j + R)));
    };
    return f.jsxs("div", {
      ref: G,
      className:
        "w-full md:w-[100px] h-[240px] relative overflow-hidden bg-[#f1f3f5] rounded-xl cursor-pointer select-none",
      onWheel: D,
      children: [
        f.jsx("div", {
          className:
            "absolute left-1 right-1 h-[50px] bg-black/5 border-t border-b border-line rounded-lg pointer-events-none z-10",
          style: { top: "calc(50% - 25px + 3px)" },
        }),
        f.jsxs("div", {
          ref: C,
          className: "absolute w-full left-0 right-0",
          children: [
            Array.from({ length: gf }).map((p, R) =>
              f.jsx("div", { className: "h-[50px] w-full" }, `pad-start-${R}`)
            ),
            h.map((p, R) =>
              f.jsx(
                "div",
                {
                  onClick: (j) => {
                    j.stopPropagation(), M(R);
                  },
                  className: `h-[50px] w-full flex items-center justify-center text-2xl transition-colors duration-150 select-none cursor-pointer hover:bg-black/5 ${
                    r === R
                      ? "text-brand font-extrabold text-[34px]"
                      : "text-muted font-bold"
                  }`,
                  style: { lineHeight: "50px" },
                  children: p,
                },
                p
              )
            ),
            Array.from({ length: gf }).map((p, R) =>
              f.jsx("div", { className: "h-[50px] w-full" }, `pad-end-${R}`)
            ),
          ],
        }),
      ],
    });
  },
  Ud = ({ value: h, onChange: U, onClose: z }) => {
    const [r, M] = h.split(":"),
      [C, G] = q.useState(r),
      [J, D] = q.useState(M),
      p = Array.from({ length: 24 }, (V, nt) => String(nt).padStart(2, "0")),
      R = Array.from({ length: 60 }, (V, nt) => String(nt).padStart(2, "0")),
      j = () => {
        U(`${C}:${J}`), z();
      };
    return f.jsx("div", {
      className:
        "fixed inset-0 bg-ink/50 backdrop-blur-sm flex items-center justify-center z-[2000] p-4 animate-modalFadeIn",
      onClick: z,
      children: f.jsxs("div", {
        className:
          "bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md animate-modalContentSlideIn",
        onClick: (V) => V.stopPropagation(),
        children: [
          f.jsxs("div", {
            className: "text-center mb-6",
            children: [
              f.jsx("h3", {
                className: "text-2xl font-bold text-gray-800 mb-4",
                children: "Chọn thời gian",
              }),
              f.jsxs("div", {
                className:
                  "flex items-center justify-center gap-2 text-5xl font-bold text-brand",
                children: [
                  f.jsx("span", { children: C }),
                  f.jsx("span", { className: "opacity-50", children: ":" }),
                  f.jsx("span", { children: J }),
                ],
              }),
            ],
          }),
          f.jsxs("div", {
            className: "flex items-center justify-center gap-4 mb-6",
            children: [
              f.jsxs("div", {
                className: "flex-1 max-w-[140px]",
                children: [
                  f.jsx("p", {
                    className:
                      "text-center text-sm font-semibold text-gray-600 mb-2",
                    children: "Giờ",
                  }),
                  f.jsx(Cd, {
                    items: p,
                    defaultIndex: p.indexOf(C),
                    onUpdate: G,
                  }),
                ],
              }),
              f.jsx("div", {
                className: "flex items-center h-[240px] pt-6",
                children: f.jsx("span", {
                  className: "text-4xl font-bold text-gray-400",
                  children: ":",
                }),
              }),
              f.jsxs("div", {
                className: "flex-1 max-w-[140px]",
                children: [
                  f.jsx("p", {
                    className:
                      "text-center text-sm font-semibold text-gray-600 mb-2",
                    children: "Phút",
                  }),
                  f.jsx(Cd, {
                    items: R,
                    defaultIndex: R.indexOf(J),
                    onUpdate: D,
                  }),
                ],
              }),
            ],
          }),
          f.jsxs("div", {
            className: "flex gap-3 justify-end",
            children: [
              f.jsx("button", {
                onClick: z,
                className:
                  "px-6 py-3 bg-gray-200 text-gray-800 rounded-xl font-semibold transition hover:bg-gray-300",
                children: "Hủy",
              }),
              f.jsx("button", {
                onClick: j,
                className:
                  "px-6 py-3 bg-brand text-white rounded-xl font-semibold transition hover:bg-brand/90 hover:shadow-lg",
                children: "Xác nhận",
              }),
            ],
          }),
        ],
      }),
    });
  },
  T0 =
    "https://upedu2-5df07-default-rtdb.asia-southeast1.firebasedatabase.app/datasheet",
  Nn = `${T0}/Kanban.json`,
  E0 = ({
    task: h,
    onDoubleClick: U,
    isEditing: z,
    onSave: r,
    onCancel: M,
    onDelete: C,
  }) => {
    var Ot, wt, Ct;
    const [G, J] = q.useState(h.title),
      [D, p] = q.useState(h.subtitle),
      [R, j] = q.useState(h.assignee || ""),
      [V, nt] = q.useState(h.video || ""),
      [I, dt] = q.useState(h.file || ""),
      [Mt, bt] = q.useState(h.text || ""),
      [Dt, ft] = q.useState(
        ((Ot = h.day) == null ? void 0 : Ot.toString()) || ""
      ),
      [St, Y] = q.useState(
        ((wt = h.month) == null ? void 0 : wt.toString()) || ""
      ),
      [X, O] = q.useState(
        ((Ct = h.hour) == null ? void 0 : Ct.toString()) || ""
      ),
      lt = () => {
        r(h.id, {
          title: G,
          subtitle: D,
          assignee: R,
          video: V,
          file: I,
          text: Mt,
          day: Dt ? parseInt(Dt) : void 0,
          month: St ? parseInt(St) : void 0,
          hour: X ? parseInt(X) : void 0,
        });
      };
    if (
      (q.useEffect(() => {
        if (z) {
          const ut = new Date();
          ft(ut.getDate().toString()),
            Y((ut.getMonth() + 1).toString()),
            O(ut.getHours().toString());
        }
      }, [z]),
      z)
    )
      return f.jsxs("div", {
        className:
          "bg-white p-3 rounded-lg shadow-soft mb-3 border-l-4 border-study ring-2 ring-study cursor-default",
        children: [
          f.jsx("input", {
            type: "text",
            value: G,
            onChange: (ut) => J(ut.target.value),
            placeholder: "Tiêu đề",
            className:
              "w-full border border-line rounded-md p-1.5 text-base font-semibold mb-1.5",
          }),
          f.jsx("input", {
            type: "text",
            value: D,
            onChange: (ut) => p(ut.target.value),
            placeholder: "Mô tả",
            className:
              "w-full border border-line rounded-md p-1.5 text-sm text-muted mb-1.5",
          }),
          f.jsx("input", {
            type: "text",
            value: R,
            onChange: (ut) => j(ut.target.value),
            placeholder: "Người thực hiện",
            className:
              "w-full border border-line rounded-md p-1.5 text-sm mb-1.5",
          }),
          f.jsx("input", {
            type: "text",
            value: V,
            onChange: (ut) => nt(ut.target.value),
            placeholder: "Video URL (YouTube)",
            className:
              "w-full border border-line rounded-md p-1.5 text-sm mb-1.5",
          }),
          f.jsx("label", {
            className: "block text-xs font-semibold mb-1",
            children: "File đính kèm:",
          }),
          f.jsx("input", {
            type: "file",
            onChange: (ut) => {
              var K;
              const Yt = (K = ut.target.files) == null ? void 0 : K[0];
              if (Yt) {
                const g = new FileReader();
                (g.onload = (A) => {
                  var B;
                  dt((B = A.target) == null ? void 0 : B.result);
                }),
                  g.readAsDataURL(Yt);
              }
            },
            className:
              "w-full border border-line rounded-md p-1.5 text-sm mb-1.5",
          }),
          f.jsx("textarea", {
            value: Mt,
            onChange: (ut) => bt(ut.target.value),
            placeholder: "Nội dung chi tiết",
            className:
              "w-full border border-line rounded-md p-1.5 text-sm mb-1.5",
            rows: 3,
          }),
          f.jsxs("div", {
            className: "grid grid-cols-3 gap-2 mb-2",
            children: [
              f.jsxs("div", {
                children: [
                  f.jsx("label", {
                    className: "text-xs text-muted",
                    children: "Ngày",
                  }),
                  f.jsx("input", {
                    type: "number",
                    value: Dt,
                    onChange: (ut) => ft(ut.target.value),
                    className:
                      "w-full border border-line rounded-md p-1.5 text-sm",
                  }),
                ],
              }),
              f.jsxs("div", {
                children: [
                  f.jsx("label", {
                    className: "text-xs text-muted",
                    children: "Tháng",
                  }),
                  f.jsx("input", {
                    type: "number",
                    value: St,
                    onChange: (ut) => Y(ut.target.value),
                    className:
                      "w-full border border-line rounded-md p-1.5 text-sm",
                  }),
                ],
              }),
              f.jsxs("div", {
                children: [
                  f.jsx("label", {
                    className: "text-xs text-muted",
                    children: "Giờ",
                  }),
                  f.jsx("input", {
                    type: "number",
                    value: X,
                    onChange: (ut) => O(ut.target.value),
                    className:
                      "w-full border border-line rounded-md p-1.5 text-sm",
                  }),
                ],
              }),
            ],
          }),
          f.jsxs("div", {
            className: "flex gap-2 mt-2.5",
            children: [
              f.jsx("button", {
                onClick: lt,
                className:
                  "border-none px-3 py-1.5 rounded-md font-semibold cursor-pointer bg-green-500 text-white",
                children: "Lưu",
              }),
              f.jsx("button", {
                onClick: M,
                className:
                  "border-none px-3 py-1.5 rounded-md font-semibold cursor-pointer bg-[#f1f3f5] text-ink",
                children: "Hủy",
              }),
            ],
          }),
        ],
      });
    const st = () =>
      h.status === "done"
        ? "bg-green-100 border-green-500 text-green-800"
        : h.status === "inprogress"
        ? "bg-yellow-100 border-yellow-500 text-yellow-800"
        : "bg-blue-100 border-blue-500 text-blue-800";
    return f.jsxs("div", {
      id: h.id,
      draggable: !0,
      onDoubleClick: () => U(h),
      className: `kanban-card bg-white p-3 rounded-lg shadow-soft cursor-grab active:cursor-grabbing border-l-4 ${
        h.type === "study" ? "border-study" : "border-brand"
      } relative group`,
      children: [
        f.jsx("button", {
          onClick: (ut) => {
            ut.stopPropagation(), C(h.id);
          },
          className:
            "absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10",
          title: "Xóa task",
          children: "×",
        }),
        f.jsxs("div", {
          className: "flex items-start gap-2 mb-2",
          children: [
            f.jsxs("div", {
              className: "flex-1",
              children: [
                f.jsx("p", {
                  className: "text-base font-semibold m-0 pr-6",
                  children: h.title,
                }),
                f.jsx("small", {
                  className: "text-muted mt-1 block",
                  children: h.subtitle,
                }),
              ],
            }),
            f.jsx("span", {
              className: `px-2 py-0.5 rounded-full text-xs font-semibold ${st()}`,
              children:
                h.status === "done"
                  ? "✓"
                  : h.status === "inprogress"
                  ? "⋯"
                  : "○",
            }),
          ],
        }),
        h.video &&
          f.jsx("div", {
            className: "mt-2",
            children: f.jsx("iframe", {
              src: h.video.replace("watch?v=", "embed/").split("&")[0],
              className: "w-full h-32 rounded-lg",
              allowFullScreen: !0,
              title: "Video",
            }),
          }),
        h.file &&
          f.jsx("div", {
            className: "mt-2",
            children: h.file.startsWith("data:")
              ? f.jsx("a", {
                  href: h.file,
                  download: !0,
                  className:
                    "block p-2 bg-gray-100 border border-line rounded-lg text-ink font-medium break-all no-underline hover:bg-gray-200",
                  children: "📎 Tải file đính kèm",
                })
              : f.jsxs("a", {
                  href: h.file,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className:
                    "block p-2 bg-gray-100 border border-line rounded-lg text-ink font-medium break-all no-underline hover:bg-gray-200",
                  children: ["📎 ", h.file],
                }),
          }),
        h.text &&
          f.jsxs("div", {
            className: "mt-2 group/item relative",
            children: [
              f.jsx("div", {
                className: "text-xs text-muted cursor-pointer hover:text-brand",
                children: "📄 Xem nội dung...",
              }),
              f.jsx("div", {
                className:
                  "absolute z-50 left-0 top-full mt-1 w-64 bg-white p-3 rounded-lg shadow-large border border-line opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible transition-all",
                children: f.jsx("p", {
                  className: "text-sm text-ink whitespace-pre-wrap",
                  children: h.text,
                }),
              }),
            ],
          }),
        h.assignee &&
          f.jsxs("div", {
            className: "mt-2 text-xs text-muted",
            children: ["👤 ", h.assignee],
          }),
        (h.day || h.month || h.hour) &&
          f.jsxs("div", {
            className: "mt-2 text-xs text-muted",
            children: ["📅 ", h.day, "/", h.month, " - ", h.hour, ":00"],
          }),
        h.attachment &&
          f.jsxs("div", {
            className: "mt-3",
            children: [
              h.attachment.type === "image" &&
                f.jsx("img", {
                  src: h.attachment.url,
                  alt: "attachment",
                  className: "max-w-full rounded-lg",
                }),
              h.attachment.type === "video" &&
                f.jsx("div", {
                  className: "relative w-full pb-[56.25%] h-0",
                  children: f.jsx("iframe", {
                    src: h.attachment.url,
                    title: "YouTube video",
                    className:
                      "absolute top-0 left-0 w-full h-full border-0 rounded-lg",
                    allowFullScreen: !0,
                  }),
                }),
              h.attachment.type === "file" &&
                f.jsxs("a", {
                  href: h.attachment.url,
                  className:
                    "block p-2 bg-gray-100 border border-line rounded-lg text-ink font-medium break-all no-underline hover:bg-gray-200",
                  children: ["🔗 ", h.attachment.name],
                }),
            ],
          }),
      ],
    });
  },
  vf = ({
    title: h,
    status: U,
    children: z,
    onDragOver: r,
    onDrop: M,
    onDragLeave: C,
    taskCount: G,
  }) =>
    f.jsxs("div", {
      className:
        "bg-[#f1f3f5] p-4 rounded-xl flex flex-col h-full overflow-hidden transition-colors",
      "data-status": U,
      onDragOver: r,
      onDrop: M,
      onDragLeave: C,
      children: [
        f.jsxs("h3", {
          className:
            "mt-0 text-base font-bold pb-3 mb-4 border-b-2 border-line shrink-0",
          children: [
            h,
            " ",
            f.jsxs("span", {
              className: "font-normal text-muted",
              children: ["(", G, ")"],
            }),
          ],
        }),
        f.jsx("div", {
          className: "overflow-y-auto flex-grow pr-1 space-y-3",
          children: z,
        }),
      ],
    }),
  N0 = ({ isOpen: h, onClose: U, event: z, onUpdate: r }) => {
    const [M, C] = q.useState([]),
      [G, J] = q.useState(null),
      D = q.useRef(null);
    if (
      (q.useEffect(() => {
        (async () => {
          if (z)
            try {
              const X = await fetch(`${Nn.split(".json")[0]}/${z.id}.json`);
              if (X.ok) {
                const O = await X.json();
                if (O && O.Tasks) {
                  const lt = O.Tasks.map((st) => ({
                    id: st.Id,
                    title: st.Title,
                    subtitle: st.Subtitle,
                    status: st.Status,
                    type: st.Type,
                    assignee: st.Assignee,
                    video: st.Video,
                    file: st.File,
                    text: st.Text,
                    day: st.Day,
                    month: st.Month,
                    hour: st.Hour,
                    attachment: st.Attachment,
                  }));
                  C(lt);
                } else C([]);
              } else C([]);
            } catch (X) {
              console.error("Error loading Kanban data:", X), C([]);
            }
          else C([]);
        })();
      }, [z]),
      q.useEffect(() => {
        const Y = (X) => {
          if (G && D.current && !D.current.contains(X.target)) {
            const O = M.find((lt) => lt.id === G);
            if (O) {
              const lt = document.getElementById(O.id);
              lt && !lt.contains(X.target) && J(null);
            }
          }
        };
        return (
          document.addEventListener("click", Y),
          () => document.removeEventListener("click", Y)
        );
      }, [G, M]),
      !h)
    )
      return null;
    const p = (Y) => ({
        Id: Y.id,
        Title: Y.title,
        Subtitle: Y.subtitle,
        Status: Y.status,
        Type: Y.type,
        Assignee: Y.assignee || null,
        Video: Y.video || null,
        File: Y.file || null,
        Text: Y.text || null,
        Day: Y.day || null,
        Month: Y.month || null,
        Hour: Y.hour || null,
        Attachment: Y.attachment || null,
      }),
      R = (Y, X) => {
        Y.dataTransfer.setData("taskId", X),
          setTimeout(() => {
            const O = document.getElementById(X);
            O && O.classList.add("opacity-50", "shadow-large");
          }, 0);
      },
      j = (Y, X) => {
        const O = document.getElementById(X);
        O && O.classList.remove("opacity-50", "shadow-large");
      },
      V = (Y) => {
        Y.preventDefault();
        const X = Y.target.closest("[data-status]");
        X &&
          (document
            .querySelectorAll("[data-status]")
            .forEach((O) => O.classList.remove("bg-brand-light")),
          X.classList.add("bg-brand-light"));
      },
      nt = (Y) => {
        const X = Y.target.closest("[data-status]");
        X && X.classList.remove("bg-brand-light");
      },
      I = async (Y) => {
        Y.preventDefault();
        const X = Y.target.closest("[data-status]");
        if (X && z) {
          X.classList.remove("bg-brand-light");
          const O = Y.dataTransfer.getData("taskId"),
            lt = X.getAttribute("data-status"),
            st = M.map((Ot) => (Ot.id === O ? { ...Ot, status: lt } : Ot));
          C(st);
          try {
            const Ot = { Id: z.id, Task: z["Tên công việc"], Tasks: st.map(p) };
            if (
              !(
                await fetch(`${Nn.split(".json")[0]}/${z.id}.json`, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(Ot),
                })
              ).ok
            )
              throw new Error("Failed to update task status");
            r && r();
          } catch (Ot) {
            console.error("Error updating task status:", Ot);
          }
        }
      },
      dt = (Y) => {
        J(Y.id);
      },
      Mt = async (Y, X) => {
        const O = M.map((lt) => (lt.id === Y ? { ...lt, ...X } : lt));
        if ((C(O), J(null), z))
          try {
            const lt = { Id: z.id, Task: z["Tên công việc"], Tasks: O.map(p) };
            if (
              !(
                await fetch(`${Nn.split(".json")[0]}/${z.id}.json`, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(lt),
                })
              ).ok
            )
              throw new Error("Failed to save task");
            r && r();
          } catch (lt) {
            console.error("Error saving task:", lt);
          }
      },
      bt = () => {
        J(null);
      },
      Dt = async (Y) => {
        const X = M.filter((O) => O.id !== Y);
        if ((C(X), z))
          try {
            const O = { Id: z.id, Task: z["Tên công việc"], Tasks: X.map(p) };
            if (
              !(
                await fetch(`${Nn.split(".json")[0]}/${z.id}.json`, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(O),
                })
              ).ok
            )
              throw new Error("Failed to delete task");
            r && r();
          } catch (O) {
            console.error("Error deleting task:", O);
          }
      },
      ft = {
        todo: M.filter((Y) => Y.status === "todo"),
        inprogress: M.filter((Y) => Y.status === "inprogress"),
        done: M.filter((Y) => Y.status === "done"),
      },
      St = (Y) =>
        Y.map((X) =>
          f.jsx(
            "div",
            {
              onDragStart: (O) => R(O, X.id),
              onDragEnd: (O) => j(O, X.id),
              children: f.jsx(E0, {
                task: X,
                onDoubleClick: dt,
                isEditing: G === X.id,
                onSave: Mt,
                onCancel: bt,
                onDelete: Dt,
              }),
            },
            X.id
          )
        );
    return f.jsx("div", {
      className:
        "fixed inset-0 bg-ink/50 backdrop-blur-sm flex items-center justify-center z-[1000] p-4 animate-modalFadeIn",
      children: f.jsxs("div", {
        ref: D,
        className:
          "bg-white p-4 sm:p-8 rounded-xl shadow-large w-full max-w-6xl relative animate-modalContentSlideIn h-[90vh] flex flex-col",
        children: [
          f.jsx("button", {
            onClick: U,
            className:
              "absolute top-3 right-3 bg-transparent border-none w-9 h-9 rounded-full text-2xl leading-none cursor-pointer text-muted transition-all hover:bg-[#f1f3f5] hover:text-ink hover:rotate-90",
            children: "×",
          }),
          f.jsxs("div", {
            className: "flex items-center justify-between mb-6 shrink-0",
            children: [
              f.jsxs("h2", {
                className:
                  "mt-0 text-xl md:text-2xl border-l-4 border-brand pl-4",
                children: ["Kanban: ", z ? z["Tên công việc"] : "Board"],
              }),
              f.jsx("button", {
                onClick: async () => {
                  const Y = {
                      id: `k-${Date.now()}`,
                      title: "Task mới",
                      subtitle: "Mô tả task",
                      status: "todo",
                      type:
                        (z == null ? void 0 : z.Loại) === "LichThi"
                          ? "exam"
                          : "study",
                    },
                    X = [...M, Y];
                  if ((C(X), z))
                    try {
                      const O = {
                        Id: z.id,
                        Task: z["Tên công việc"],
                        Tasks: X.map(p),
                      };
                      if (
                        !(
                          await fetch(`${Nn.split(".json")[0]}/${z.id}.json`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(O),
                          })
                        ).ok
                      )
                        throw new Error("Failed to add task");
                      r && r();
                    } catch (O) {
                      console.error("Error adding task:", O);
                    }
                },
                className:
                  "h-10 px-4 rounded-xl border border-brand bg-brand text-white font-semibold transition hover:-translate-y-0.5 hover:shadow-medium text-base",
                children: "+ Thêm Task",
              }),
            ],
          }),
          f.jsxs("div", {
            className:
              "grid grid-cols-1 md:grid-cols-3 gap-5 flex-grow overflow-hidden",
            children: [
              f.jsx(vf, {
                title: "Cần làm",
                status: "todo",
                taskCount: ft.todo.length,
                onDragOver: V,
                onDrop: I,
                onDragLeave: nt,
                children: St(ft.todo),
              }),
              f.jsx(vf, {
                title: "Đang thực hiện",
                status: "inprogress",
                taskCount: ft.inprogress.length,
                onDragOver: V,
                onDrop: I,
                onDragLeave: nt,
                children: St(ft.inprogress),
              }),
              f.jsx(vf, {
                title: "Hoàn thành",
                status: "done",
                taskCount: ft.done.length,
                onDragOver: V,
                onDrop: I,
                onDragLeave: nt,
                children: St(ft.done),
              }),
            ],
          }),
        ],
      }),
    });
  },
  A0 = ({ onClick: h }) =>
    f.jsx("button", {
      onClick: h,
      className:
        "fixed bottom-4 right-4 md:bottom-8 md:right-8 w-16 h-16 bg-brand rounded-full shadow-large flex items-center justify-center text-white text-4xl leading-none cursor-pointer z-[999] transition-all hover:scale-110 hover:rotate-12 hover:bg-brand-dark",
      "aria-label": "Add new task",
      children: "+",
    }),
  An =
    "https://upedu2-5df07-default-rtdb.asia-southeast1.firebasedatabase.app/datasheet",
  Hd = `${An}/Th%E1%BB%9Di_kho%C3%A1_bi%E1%BB%83u.json`,
  j0 = `${An}/Danh_s%C3%A1ch_h%E1%BB%8Dc_sinh.json`,
  z0 = `${An}/Gi%C3%A1o_vi%C3%AAn.json`,
  yf = (h) => {
    const U = new Date(h);
    U.setHours(0, 0, 0, 0);
    const z = U.getDay(),
      r = U.getDate() - z + (z === 0 ? -6 : 1);
    return new Date(U.setDate(r));
  },
  _0 = (h) =>
    h.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }),
  Zu = (h) => h.toISOString().slice(0, 10),
  qd = (h) => {
    const U = h.split(" - "),
      z = U.length >= 3 ? U[2] : "";
    return (
      {
        Mathematics: {
          bg: "bg-blue-50",
          border: "border-l-blue-500",
          text: "text-blue-700",
        },
        Chemistry: {
          bg: "bg-green-50",
          border: "border-l-green-500",
          text: "text-green-700",
        },
        Physics: {
          bg: "bg-purple-50",
          border: "border-l-purple-500",
          text: "text-purple-700",
        },
        Biology: {
          bg: "bg-emerald-50",
          border: "border-l-emerald-500",
          text: "text-emerald-700",
        },
        Economics: {
          bg: "bg-yellow-50",
          border: "border-l-yellow-600",
          text: "text-yellow-700",
        },
        Business: {
          bg: "bg-orange-50",
          border: "border-l-orange-500",
          text: "text-orange-700",
        },
        Psychology: {
          bg: "bg-pink-50",
          border: "border-l-pink-500",
          text: "text-pink-700",
        },
        Literature: {
          bg: "bg-red-50",
          border: "border-l-red-500",
          text: "text-red-700",
        },
        English: {
          bg: "bg-indigo-50",
          border: "border-l-indigo-500",
          text: "text-indigo-700",
        },
        Chinese: {
          bg: "bg-rose-50",
          border: "border-l-rose-500",
          text: "text-rose-700",
        },
      }[z] || {
        bg: "bg-gray-50",
        border: "border-l-gray-500",
        text: "text-gray-700",
      }
    );
  },
  D0 = ({ event: h, isToday: U, onCardClick: z, onDelete: r, onEdit: M }) => {
    const C = qd(h["Tên công việc"]),
      G = (D) => {
        D.stopPropagation(),
          window.confirm(
            `Bạn có chắc muốn xóa lịch học "${h["Tên công việc"]}"?`
          ) && r(h);
      },
      J = (D) => {
        D.stopPropagation(), M(h);
      };
    return f.jsxs("div", {
      onClick: () => z(h),
      className: `group relative w-full p-3 rounded-xl shadow-soft cursor-pointer overflow-hidden transition-all duration-300 ease-in-out animate-fadeIn border ${
        U ? "border-brand shadow-medium" : "border-transparent"
      } ${C.bg} border-l-4 ${
        C.border
      } hover:-translate-y-0.5 hover:shadow-large hover:p-4 hover:z-20`,
      children: [
        f.jsx("div", {
          className: `font-semibold text-base line-clamp-1 group-hover:line-clamp-none group-hover:font-bold ${C.text}`,
          children: h["Tên công việc"],
        }),
        f.jsxs("div", {
          className:
            "max-h-0 opacity-0 transition-all duration-300 ease-in-out group-hover:max-h-40 group-hover:opacity-100 text-base",
          children: [
            f.jsxs("div", {
              className: "mt-1.5",
              children: [h["Giờ bắt đầu"], " - ", h["Giờ kết thúc"]],
            }),
            f.jsxs("div", {
              className: "mt-1",
              children: ["📍 ", h["Địa điểm"]],
            }),
            f.jsxs("div", {
              className: "mt-2.5",
              children: ["🧑‍🏫 ", h["Giáo viên phụ trách"]],
            }),
            h["Học sinh"] &&
              h["Học sinh"].length > 0 &&
              f.jsxs("div", {
                className: "mt-2.5 text-muted",
                children: ["🧑‍🎓 ", h["Học sinh"].join(", ")],
              }),
          ],
        }),
        f.jsxs("div", {
          className:
            "absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2",
          children: [
            f.jsx("button", {
              onClick: J,
              className:
                "bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-3 py-1.5 text-sm font-semibold shadow-md hover:shadow-lg flex items-center gap-1",
              title: "Sửa lịch học",
              children: "✏️ Sửa",
            }),
            f.jsx("button", {
              onClick: G,
              className:
                "bg-red-500 hover:bg-red-600 text-white rounded-lg px-3 py-1.5 text-sm font-semibold shadow-md hover:shadow-lg flex items-center gap-1",
              title: "Xóa lịch học",
              children: "🗑️ Xóa",
            }),
          ],
        }),
      ],
    });
  },
  M0 = () => {
    const [h, U] = q.useState([]),
      [z, r] = q.useState(new Date()),
      [M, C] = q.useState("all"),
      [G, J] = q.useState(null),
      [D, p] = q.useState(null),
      [R, j] = q.useState(!1),
      [V, nt] = q.useState(!1),
      [I, dt] = q.useState(!1),
      [Mt, bt] = q.useState(!1),
      [Dt, ft] = q.useState(null),
      St = q.useRef(!0),
      Y = q.useCallback(async () => {
        try {
          const g = await (await fetch(Hd)).json();
          if (g) {
            const A = Object.keys(g).map((B) => ({ id: B, ...g[B] }));
            U(A);
          }
        } catch (K) {
          console.error("Error fetching schedule data:", K);
        }
      }, []);
    q.useEffect(() => {
      Y();
    }, [Y]),
      q.useEffect(() => {
        if (h.length > 0 && St.current) {
          St.current = !1;
          const K = new Date(),
            g = yf(new Date()),
            A = yf(z);
          if (g.getTime() !== A.getTime()) return;
          const B = (K.getDay() + 6) % 7,
            et = K.getHours();
          let F = 0;
          et >= 12 && et < 18 ? (F = 1) : et >= 18 && (F = 2),
            setTimeout(() => {
              const s = document.getElementById(`slot-${B}-${F}`);
              s == null ||
                s.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                  inline: "center",
                });
            }, 200);
        }
      }, [h, z]);
    const X = q.useMemo(() => {
        const K = yf(z);
        return Array.from({ length: 7 }).map((g, A) => {
          const B = new Date(K);
          return B.setDate(K.getDate() + A), B;
        });
      }, [z]),
      O = q.useMemo(() => {
        const K = X[0],
          g = new Date(X[6]);
        return (
          g.setHours(23, 59, 59, 999),
          h
            .filter((A) => {
              if (!A.Ngày) return !1;
              const B = new Date(A.Ngày);
              return B >= K && B <= g;
            })
            .filter((A) =>
              M === "all" ? !0 : (A.Loại === "LichThi" ? "exam" : "study") === M
            )
        );
      }, [h, X, M]),
      lt = async (K, g) => {
        try {
          const A = g
            ? `${An}/Th%E1%BB%9Di_kho%C3%A1_bi%E1%BB%83u/${g}.json`
            : Hd;
          if (
            !(
              await fetch(A, {
                method: g ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(K),
              })
            ).ok
          )
            throw new Error(`Failed to ${g ? "update" : "add"} event`);
          await Y(), dt(!1), p(null);
        } catch (A) {
          console.error("Error saving event:", A);
        }
      },
      st = async (K) => {
        try {
          console.log("Deleting event:", K);
          const g = `${An}/Th%E1%BB%9Di_kho%C3%A1_bi%E1%BB%83u/${K.id}.json`;
          console.log("Delete URL:", g);
          const A = await fetch(g, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
          });
          if (
            (console.log("Delete response status:", A.status),
            console.log("Delete response ok:", A.ok),
            !A.ok)
          ) {
            const B = await A.text();
            throw (
              (console.error("Delete error response:", B),
              new Error(`Failed to delete event: ${A.status} - ${B}`))
            );
          }
          console.log("Event deleted successfully, refreshing..."),
            await Y(),
            (G == null ? void 0 : G.id) === K.id && (j(!1), J(null)),
            Mt && (bt(!1), setTimeout(() => bt(!0), 100)),
            console.log("Delete completed successfully");
        } catch (g) {
          console.error("Error deleting event:", g),
            alert(`Không thể xóa lịch học. Lỗi: ${g}`);
        }
      },
      Ot = (K) => {
        const g = document.querySelector(".overflow-x-auto"),
          A = (g == null ? void 0 : g.scrollLeft) || 0;
        J(K),
          j(!0),
          setTimeout(() => {
            g == null || g.scrollTo({ left: A, behavior: "smooth" });
          }, 100);
      },
      wt = () => {
        j(!1), nt(!0);
      },
      Ct = (K) => {
        console.log("Opening edit modal for event:", K),
          p(K),
          j(!1),
          setTimeout(() => {
            dt(!0);
          }, 100);
      },
      ut = (K, g) => {
        ft(K), bt(!0);
      },
      Yt = new Date();
    return (
      Yt.setHours(0, 0, 0, 0),
      f.jsxs("div", {
        className: "my-4 md:my-8 p-2 sm:p-4",
        children: [
          f.jsxs("div", {
            className:
              "bg-paper border border-line rounded-none md:rounded-2xl shadow-medium overflow-hidden",
            children: [
              f.jsx(O0, {
                currentDate: z,
                setCurrentDate: r,
                activeFilter: M,
                setActiveFilter: C,
              }),
              f.jsxs("div", {
                className: "relative overflow-x-auto",
                children: [
                  f.jsx("div", {
                    className:
                      "absolute inset-0 bg-contain md:bg-cover bg-no-repeat bg-center opacity-5 pointer-events-none",
                    style: {
                      backgroundImage:
                        "url('https://www.appsheet.com/template/gettablefileurl?appName=Upcode-325045268&tableName=D%E1%BB%B1%20%C3%A1n&fileName=D%E1%BB%B1%20%C3%A1n_Images%2F305fbfb4.%E1%BA%A2nh%20Logo.025506.png')",
                    },
                  }),
                  f.jsxs("div", {
                    className:
                      "grid grid-cols-[100px_repeat(7,minmax(160px,1fr))] md:grid-cols-[120px_repeat(7,minmax(180px,1fr))] relative z-10",
                    children: [
                      f.jsx("div", {
                        className: "sticky left-0 z-20 bg-gray-50/80",
                      }),
                      [
                        "Thứ 2",
                        "Thứ 3",
                        "Thứ 4",
                        "Thứ 5",
                        "Thứ 6",
                        "Thứ 7",
                        "Chủ nhật",
                      ].map((K, g) => {
                        const A = X[g].getTime() === Yt.getTime();
                        return f.jsxs(
                          "div",
                          {
                            className: `p-4 text-center font-bold text-base border-l border-line bg-gray-50/80 sticky top-0 z-10 ${
                              A
                                ? "bg-brand-light text-brand-dark border-b-2 border-brand"
                                : "border-b"
                            }`,
                            children: [
                              K,
                              f.jsx("small", {
                                className: `block font-medium mt-1 text-sm ${
                                  A ? "text-brand" : "text-muted"
                                }`,
                                children: _0(X[g]),
                              }),
                            ],
                          },
                          K
                        );
                      }),
                      ["Sáng", "Chiều", "Tối"].map((K, g) =>
                        f.jsxs(
                          Rd.Fragment,
                          {
                            children: [
                              f.jsx("div", {
                                className:
                                  "p-4 text-right font-semibold text-muted sticky left-0 z-20 bg-gray-50/80 border-b border-line",
                                children: K,
                              }),
                              X.map((A, B) => {
                                const et = O.filter((F) => {
                                  const s = new Date(F.Ngày);
                                  if (
                                    s.getFullYear() !== A.getFullYear() ||
                                    s.getMonth() !== A.getMonth() ||
                                    s.getDate() !== A.getDate()
                                  )
                                    return !1;
                                  const S = parseInt(
                                    (F["Giờ bắt đầu"] || "0:0").split(":")[0]
                                  );
                                  return K === "Sáng"
                                    ? S < 12
                                    : K === "Chiều"
                                    ? S >= 12 && S < 18
                                    : K === "Tối"
                                    ? S >= 18
                                    : !1;
                                }).sort((F, s) =>
                                  (F["Giờ bắt đầu"] || "00:00").localeCompare(
                                    s["Giờ bắt đầu"] || "00:00"
                                  )
                                );
                                return f.jsxs(
                                  "div",
                                  {
                                    id: `slot-${B}-${g}`,
                                    onClick: () => ut(A),
                                    className:
                                      "relative p-3 border-b border-l border-line h-[180px] flex flex-col overflow-hidden cursor-pointer hover:bg-gray-50 transition-colors",
                                    children: [
                                      et.length > 0 &&
                                        f.jsx("span", {
                                          className:
                                            "absolute top-1.5 right-1.5 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-brand font-bold text-white text-sm",
                                          children: et.length,
                                        }),
                                      f.jsx("div", {
                                        className:
                                          "overflow-y-auto flex-grow scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400",
                                        style: { scrollBehavior: "smooth" },
                                        onClick: (F) => F.stopPropagation(),
                                        children: f.jsx("div", {
                                          className: "flex flex-col gap-2 pr-1",
                                          children: et.map((F) =>
                                            f.jsx(
                                              D0,
                                              {
                                                event: F,
                                                isToday:
                                                  A.getTime() === Yt.getTime(),
                                                onCardClick: Ot,
                                                onDelete: st,
                                                onEdit: Ct,
                                              },
                                              F.id
                                            )
                                          ),
                                        }),
                                      }),
                                    ],
                                  },
                                  `${K}-${B}`
                                );
                              }),
                            ],
                          },
                          K
                        )
                      ),
                    ],
                  }),
                ],
              }),
            ],
          }),
          f.jsx(A0, { onClick: () => dt(!0) }),
          f.jsx(C0, {
            isOpen: Mt,
            onClose: () => bt(!1),
            date: Dt,
            allEvents: h,
            onEventClick: (K) => {
              J(K), bt(!1), j(!0);
            },
            onAddTask: () => {
              bt(!1), dt(!0);
            },
            onDelete: st,
            onEdit: (K) => {
              p(K), bt(!1), dt(!0);
            },
          }),
          f.jsx(U0, {
            isOpen: R,
            onClose: () => j(!1),
            event: G,
            onViewKanban: wt,
            onEdit: Ct,
          }),
          f.jsx(N0, {
            isOpen: V,
            onClose: () => nt(!1),
            event: G,
            onUpdate: Y,
          }),
          f.jsx(H0, {
            isOpen: I,
            onClose: () => {
              dt(!1), p(null);
            },
            onSaveTask: lt,
            eventToEdit: D,
          }),
        ],
      })
    );
  },
  O0 = ({
    currentDate: h,
    setCurrentDate: U,
    activeFilter: z,
    setActiveFilter: r,
  }) => {
    const M = (G) => {
        const J = new Date(h);
        J.setDate(J.getDate() + G), U(J);
      },
      C = [
        { key: "all", label: "Tất cả", color: "brand" },
        { key: "study", label: "Lịch học", color: "study" },
        { key: "exam", label: "Lịch thi", color: "brand" },
      ];
    return f.jsxs("div", {
      className:
        "flex items-center gap-4 p-4 sm:p-6 border-b border-line flex-wrap bg-white",
      children: [
        f.jsxs("div", {
          className:
            "flex items-center gap-4 text-xl sm:text-2xl md:text-3xl font-bold mr-auto w-full md:w-auto mb-2 md:mb-0",
          children: [
            f.jsx("img", {
              src: "https://www.appsheet.com/template/gettablefileurl?appName=Upcode-325045268&tableName=D%E1%BB%B1%20%C3%A1n&fileName=D%E1%BB%B1%20%C3%A1n_Images%2F305fbfb4.%E1%BA%A2nh%20Logo.025506.png",
              alt: "logo",
              className: "h-16 sm:h-20 w-auto",
            }),
            f.jsxs("div", {
              className: "flex flex-col",
              children: [
                f.jsx("span", {
                  className: "text-2xl sm:text-3xl md:text-4xl",
                  children: "THỜI KHÓA BIỂU",
                }),
                f.jsx("span", {
                  className: "text-lg sm:text-xl md:text-2xl text-brand",
                  children: "Trí Tuệ 8+",
                }),
              ],
            }),
          ],
        }),
        f.jsx("div", {
          className:
            "flex items-center gap-2 bg-gray-100 p-1.5 rounded-full w-full md:w-auto justify-center",
          children: C.map(({ key: G, label: J, color: D }) =>
            f.jsxs(
              "button",
              {
                onClick: () => r(G),
                className: `flex items-center gap-2 px-4 py-2 rounded-full text-base font-semibold transition-all ${
                  z === G ? `text-${D} bg-white shadow-soft` : "text-muted"
                }`,
                children: [
                  f.jsx("span", {
                    className: `w-2 h-2 rounded-full bg-current ${
                      z === G ? "opacity-100" : "opacity-50"
                    }`,
                  }),
                  J,
                ],
              },
              G
            )
          ),
        }),
        f.jsxs("div", {
          className:
            "flex items-center gap-2 w-full md:w-auto flex-wrap justify-center",
          children: [
            f.jsx("input", {
              type: "date",
              value: Zu(h),
              onChange: (G) => U(new Date(G.target.value)),
              className:
                "h-10 px-3 rounded-xl border border-line bg-white font-semibold text-base",
            }),
            f.jsx("button", {
              onClick: () => U(new Date()),
              className:
                "h-10 px-4 rounded-xl border border-brand bg-brand text-white font-semibold transition hover:-translate-y-0.5 hover:shadow-medium text-base",
              children: "Hiện tại",
            }),
            f.jsx("button", {
              onClick: () => M(-7),
              className:
                "h-10 px-4 rounded-xl border border-line bg-white font-semibold transition hover:-translate-y-0.5 hover:shadow-medium text-base",
              children: "‹ Trở về",
            }),
            f.jsx("button", {
              onClick: () => M(7),
              className:
                "h-10 px-4 rounded-xl border border-line bg-white font-semibold transition hover:-translate-y-0.5 hover:shadow-medium text-base",
              children: "Tiếp ›",
            }),
          ],
        }),
      ],
    });
  },
  C0 = ({
    isOpen: h,
    onClose: U,
    date: z,
    allEvents: r,
    onEventClick: M,
    onAddTask: C,
    onDelete: G,
    onEdit: J,
  }) => {
    if (!h || !z) return null;
    const D = r.filter((j) =>
        j.Ngày ? new Date(j.Ngày).toDateString() === z.toDateString() : !1
      ),
      p = D.reduce((j, V) => {
        const nt = V["Giáo viên phụ trách"] || "Chưa phân công";
        return j[nt] || (j[nt] = []), j[nt].push(V), j;
      }, {});
    Object.keys(p).forEach((j) => {
      p[j].sort((V, nt) => {
        const I = V["Giờ bắt đầu"] || "00:00",
          dt = nt["Giờ bắt đầu"] || "00:00";
        return I.localeCompare(dt);
      });
    });
    const R = Object.keys(p).sort();
    return f.jsx("div", {
      className:
        "fixed inset-0 bg-ink/50 backdrop-blur-sm flex items-center justify-center z-[1000] p-4 animate-modalFadeIn",
      onClick: U,
      children: f.jsxs("div", {
        className:
          "bg-white p-8 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-modalContentSlideIn",
        onClick: (j) => j.stopPropagation(),
        children: [
          f.jsx("button", {
            onClick: U,
            className:
              "absolute top-6 right-6 bg-transparent border-none w-12 h-12 rounded-full text-3xl leading-none cursor-pointer text-muted transition-all hover:bg-[#f1f3f5] hover:text-ink hover:rotate-90",
            children: "×",
          }),
          f.jsxs("h2", {
            className: "text-3xl font-bold text-brand mb-2",
            children: [
              "📅 Lịch học ngày ",
              z.toLocaleDateString("vi-VN", {
                weekday: "long",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              }),
            ],
          }),
          f.jsxs("p", {
            className: "text-gray-600 mb-6 text-lg",
            children: [
              "Tổng cộng: ",
              f.jsx("span", {
                className: "font-bold text-brand",
                children: D.length,
              }),
              " buổi học",
            ],
          }),
          D.length === 0
            ? f.jsxs("div", {
                className: "text-center py-16",
                children: [
                  f.jsx("div", { className: "text-6xl mb-4", children: "📭" }),
                  f.jsx("p", {
                    className: "text-xl text-gray-500 mb-6",
                    children: "Chưa có lịch học nào trong ngày này",
                  }),
                  f.jsx("button", {
                    onClick: C,
                    className:
                      "px-8 py-4 bg-brand text-white rounded-2xl font-bold transition hover:-translate-y-1 hover:shadow-2xl text-xl",
                    children: "➕ Thêm lịch học mới",
                  }),
                ],
              })
            : f.jsxs("div", {
                className: "space-y-8",
                children: [
                  R.map((j) => {
                    const V = p[j],
                      nt = V.length;
                    return f.jsxs(
                      "div",
                      {
                        className: "space-y-4",
                        children: [
                          f.jsxs("div", {
                            className:
                              "flex items-center gap-3 pb-3 border-b-2 border-brand/30",
                            children: [
                              f.jsx("div", {
                                className:
                                  "w-12 h-12 rounded-full bg-brand flex items-center justify-center text-white text-xl font-bold",
                                children: "🧑‍🏫",
                              }),
                              f.jsxs("div", {
                                children: [
                                  f.jsx("h3", {
                                    className: "text-2xl font-bold text-brand",
                                    children: j,
                                  }),
                                  f.jsxs("p", {
                                    className: "text-sm text-gray-600",
                                    children: [nt, " buổi học"],
                                  }),
                                ],
                              }),
                            ],
                          }),
                          f.jsx("div", {
                            className: "space-y-3 ml-4",
                            children: V.map((I) => {
                              const dt = qd(I["Tên công việc"]),
                                Mt = (Dt) => {
                                  Dt.stopPropagation(),
                                    window.confirm(
                                      `Bạn có chắc muốn xóa lịch học "${I["Tên công việc"]}"?`
                                    ) && G(I);
                                },
                                bt = (Dt) => {
                                  Dt.stopPropagation(), J(I);
                                };
                              return f.jsxs(
                                "div",
                                {
                                  className: `group relative ${dt.bg} ${dt.border} border-l-8 rounded-2xl p-5 cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1`,
                                  children: [
                                    f.jsxs("div", {
                                      onClick: () => M(I),
                                      className:
                                        "flex items-start justify-between gap-4",
                                      children: [
                                        f.jsxs("div", {
                                          className: "flex-1",
                                          children: [
                                            f.jsx("h4", {
                                              className: `text-xl font-bold ${dt.text} mb-2`,
                                              children: I["Tên công việc"],
                                            }),
                                            f.jsxs("div", {
                                              className:
                                                "grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700",
                                              children: [
                                                f.jsxs("div", {
                                                  className:
                                                    "flex items-center gap-2",
                                                  children: [
                                                    f.jsx("span", {
                                                      className: "text-lg",
                                                      children: "🕒",
                                                    }),
                                                    f.jsxs("span", {
                                                      className:
                                                        "font-semibold",
                                                      children: [
                                                        I["Giờ bắt đầu"],
                                                        " - ",
                                                        I["Giờ kết thúc"],
                                                      ],
                                                    }),
                                                  ],
                                                }),
                                                f.jsxs("div", {
                                                  className:
                                                    "flex items-center gap-2",
                                                  children: [
                                                    f.jsx("span", {
                                                      className: "text-lg",
                                                      children: "📍",
                                                    }),
                                                    f.jsx("span", {
                                                      children: I["Địa điểm"],
                                                    }),
                                                  ],
                                                }),
                                                I["Học sinh"] &&
                                                  I["Học sinh"].length > 0 &&
                                                  f.jsxs("div", {
                                                    className:
                                                      "flex items-center gap-2 md:col-span-2",
                                                    children: [
                                                      f.jsx("span", {
                                                        className: "text-lg",
                                                        children: "🧑‍🎓",
                                                      }),
                                                      f.jsx("span", {
                                                        children:
                                                          I["Học sinh"].join(
                                                            ", "
                                                          ),
                                                      }),
                                                    ],
                                                  }),
                                              ],
                                            }),
                                          ],
                                        }),
                                        f.jsx("div", {
                                          className: `text-3xl font-bold ${dt.text}`,
                                          children: "→",
                                        }),
                                      ],
                                    }),
                                    f.jsxs("div", {
                                      className:
                                        "absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2 z-10",
                                      children: [
                                        f.jsx("button", {
                                          onClick: bt,
                                          className:
                                            "bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-3 py-2 text-sm font-semibold shadow-md hover:shadow-lg flex items-center gap-1",
                                          title: "Sửa lịch học",
                                          children: "✏️ Sửa",
                                        }),
                                        f.jsx("button", {
                                          onClick: Mt,
                                          className:
                                            "bg-red-500 hover:bg-red-600 text-white rounded-lg px-3 py-2 text-sm font-semibold shadow-md hover:shadow-lg flex items-center gap-1",
                                          title: "Xóa lịch học",
                                          children: "🗑️ Xóa",
                                        }),
                                      ],
                                    }),
                                  ],
                                },
                                I.id
                              );
                            }),
                          }),
                        ],
                      },
                      j
                    );
                  }),
                  f.jsx("button", {
                    onClick: C,
                    className:
                      "w-full mt-6 px-8 py-4 bg-gray-100 text-brand rounded-2xl font-bold transition hover:bg-brand hover:text-white hover:shadow-xl text-xl border-2 border-dashed border-brand",
                    children: "➕ Thêm lịch học mới",
                  }),
                ],
              }),
        ],
      }),
    });
  },
  U0 = ({ isOpen: h, onClose: U, event: z, onViewKanban: r, onEdit: M }) => {
    if (!h || !z) return null;
    const C = z.Loại === "LichThi";
    return f.jsx("div", {
      className:
        "fixed inset-0 bg-ink/50 backdrop-blur-sm flex items-center justify-center z-[1000] p-0 animate-modalFadeIn",
      onClick: U,
      children: f.jsxs("div", {
        className:
          "bg-white p-8 sm:p-12 md:p-16 w-full h-full relative overflow-y-auto animate-modalContentSlideIn",
        onClick: (G) => G.stopPropagation(),
        children: [
          f.jsx("button", {
            onClick: U,
            className:
              "absolute top-6 right-6 bg-transparent border-none w-12 h-12 rounded-full text-3xl leading-none cursor-pointer text-muted transition-all hover:bg-[#f1f3f5] hover:text-ink hover:rotate-90",
            children: "×",
          }),
          f.jsxs("div", {
            className: "max-w-4xl mx-auto mt-8",
            children: [
              f.jsx("h2", {
                className: `mt-0 text-3xl sm:text-4xl md:text-5xl font-bold border-l-8 pl-6 mb-8 ${
                  C ? "border-brand text-brand" : "border-study text-study"
                }`,
                children: z["Tên công việc"],
              }),
              f.jsxs("div", {
                className: "space-y-6 text-xl sm:text-2xl",
                children: [
                  f.jsxs("div", {
                    className:
                      "flex items-center gap-4 p-6 bg-gray-50 rounded-2xl",
                    children: [
                      f.jsx("span", { className: "text-4xl", children: "🕒" }),
                      f.jsxs("div", {
                        children: [
                          f.jsx("p", {
                            className:
                              "font-semibold text-gray-600 text-lg mb-1",
                            children: "Thời gian",
                          }),
                          f.jsxs("p", {
                            className: "text-gray-900 font-bold",
                            children: [
                              z["Giờ bắt đầu"],
                              " - ",
                              z["Giờ kết thúc"],
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                  f.jsxs("div", {
                    className:
                      "flex items-center gap-4 p-6 bg-gray-50 rounded-2xl",
                    children: [
                      f.jsx("span", { className: "text-4xl", children: "📍" }),
                      f.jsxs("div", {
                        children: [
                          f.jsx("p", {
                            className:
                              "font-semibold text-gray-600 text-lg mb-1",
                            children: "Địa điểm",
                          }),
                          f.jsx("p", {
                            className: "text-gray-900 font-bold",
                            children: z["Địa điểm"],
                          }),
                        ],
                      }),
                    ],
                  }),
                  f.jsxs("div", {
                    className:
                      "flex items-center gap-4 p-6 bg-gray-50 rounded-2xl",
                    children: [
                      f.jsx("span", { className: "text-4xl", children: "🧑‍🏫" }),
                      f.jsxs("div", {
                        children: [
                          f.jsx("p", {
                            className:
                              "font-semibold text-gray-600 text-lg mb-1",
                            children: "Giáo viên phụ trách",
                          }),
                          f.jsx("p", {
                            className: "text-gray-900 font-bold",
                            children: z["Giáo viên phụ trách"],
                          }),
                        ],
                      }),
                    ],
                  }),
                  z["Học sinh"] &&
                    z["Học sinh"].length > 0 &&
                    f.jsxs("div", {
                      className: "p-6 bg-gray-50 rounded-2xl",
                      children: [
                        f.jsxs("div", {
                          className: "flex items-center gap-4 mb-4",
                          children: [
                            f.jsx("span", {
                              className: "text-4xl",
                              children: "🧑‍🎓",
                            }),
                            f.jsx("p", {
                              className: "font-semibold text-gray-600 text-lg",
                              children: "Học sinh tham gia",
                            }),
                          ],
                        }),
                        f.jsx("div", {
                          className: "flex flex-wrap gap-3 ml-16",
                          children: z["Học sinh"].map((G) =>
                            f.jsx(
                              "span",
                              {
                                className:
                                  "bg-white border-2 border-brand text-brand px-5 py-3 rounded-full text-lg font-semibold shadow-sm",
                                children: G,
                              },
                              G
                            )
                          ),
                        }),
                      ],
                    }),
                ],
              }),
              f.jsxs("div", {
                className: "mt-12 flex gap-4 flex-wrap justify-center",
                children: [
                  f.jsx("button", {
                    onClick: () => M(z),
                    className:
                      "px-8 py-4 bg-brand text-white rounded-2xl font-bold transition hover:-translate-y-1 hover:shadow-2xl text-xl",
                    children: "✏️ Sửa thông tin",
                  }),
                  f.jsx("button", {
                    onClick: r,
                    className:
                      "px-8 py-4 bg-study text-white rounded-2xl font-bold transition hover:-translate-y-1 hover:shadow-2xl text-xl",
                    children: "📋 Xem Kanban",
                  }),
                  f.jsx("button", {
                    onClick: U,
                    className:
                      "px-8 py-4 bg-gray-300 text-gray-800 rounded-2xl font-bold transition hover:-translate-y-1 hover:shadow-2xl text-xl",
                    children: "Đóng",
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    });
  },
  H0 = ({ isOpen: h, onClose: U, onSaveTask: z, eventToEdit: r }) => {
    const M = !!r,
      [C, G] = q.useState(""),
      [J, D] = q.useState("study"),
      [p, R] = q.useState(""),
      [j, V] = q.useState(Zu(new Date())),
      [nt, I] = q.useState(""),
      [dt, Mt] = q.useState(!1),
      [bt, Dt] = q.useState(!1),
      [ft, St] = q.useState("00:00"),
      [Y, X] = q.useState("00:00"),
      [O, lt] = q.useState("1"),
      [st, Ot] = q.useState(""),
      [wt, Ct] = q.useState([]),
      [ut, Yt] = q.useState([]),
      [K, g] = q.useState([]),
      [A, B] = q.useState("");
    q.useEffect(() => {
      const s = ut.join(", "),
        S = A,
        _ = [];
      s && _.push(s), S && _.push(S), p && _.push(p);
      const H = _.join(" - ");
      G(H), console.log("✅ Auto-generated Task Name:", H);
    }, [ut, A, p]),
      q.useEffect(() => {
        const s = parseFloat(O) || 0,
          [S, _] = ft.split(":").map((Ut) => parseInt(Ut) || 0),
          H = s * 60,
          Z = S * 60 + _ + H,
          k = Math.floor(Z / 60) % 24,
          at = Math.round(Z % 60);
        X(`${String(k).padStart(2, "0")}:${String(at).padStart(2, "0")}`);
      }, [ft, O]);
    const et = q.useCallback(() => {
      const s = new Date();
      G(""),
        D("study"),
        R(""),
        V(Zu(s)),
        I(""),
        St(
          `${String(s.getHours()).padStart(2, "0")}:${String(
            s.getMinutes()
          ).padStart(2, "0")}`
        ),
        lt("1"),
        X(
          `${String(s.getHours() + 1 > 23 ? 23 : s.getHours() + 1).padStart(
            2,
            "0"
          )}:${String(s.getMinutes()).padStart(2, "0")}`
        ),
        Yt([]),
        B("");
    }, []);
    q.useEffect(() => {
      if (h)
        if (r) {
          console.log("Loading event to edit:", r);
          const s = r.Loại;
          D(s === "LichHoc" || s === "CV" ? "study" : "exam");
          const _ = (r["Tên công việc"] || "").split(" - ");
          if (_.length >= 3) {
            let Z = _[2];
            (Z === "Lịch học" || Z === "Lịch thi") && (Z = ""), R(Z);
          }
          let H = r.Ngày || Zu(new Date());
          H.includes("T") && (H = H.split("T")[0]),
            V(H),
            I(r["Địa điểm"] || ""),
            r["Giờ bắt đầu"] ? St(r["Giờ bắt đầu"]) : St("00:00"),
            r["Giờ kết thúc"] ? X(r["Giờ kết thúc"]) : X("23:00"),
            B(r["Giáo viên phụ trách"] || ""),
            Yt(r["Học sinh"] || []);
        } else et();
    }, [r, h, et]),
      q.useEffect(() => {
        if (h) {
          const s = async (S, _, H, Z) => {
            try {
              const at = await (await fetch(S)).json();
              if (at) {
                const Ut = Object.keys(at)
                  .map((yt) => ({ id: at[yt][H] || yt, name: at[yt][Z] }))
                  .filter((yt) => yt.name);
                _(Ut);
              }
            } catch (k) {
              console.error(`Error fetching from ${S}:`, k);
            }
          };
          s(j0, Ct, "Mã học sinh", "Họ và tên"),
            s(z0, g, "Mã giáo viên", "Họ và tên");
        }
      }, [h]),
      q.useEffect(() => {
        const [s, S] = ft.split(":").map((te) => parseInt(te) || 0),
          [_, H] = Y.split(":").map((te) => parseInt(te) || 0),
          Z = s * 60 + S,
          k = _ * 60 + H;
        if (k <= Z) {
          Ot("Giờ kết thúc không hợp lệ");
          return;
        }
        const at = k - Z,
          Ut = Math.floor(at / 60),
          yt = at % 60;
        let Bl = "Tổng: ";
        Ut > 0 && (Bl += `${Ut} giờ `),
          yt > 0 && (Bl += `${yt} phút`),
          Ot(Bl.trim());
      }, [ft, Y]);
    const F = (s) => {
      s.preventDefault(),
        z(
          {
            "Tên công việc": C,
            Loại: J === "study" ? "LichHoc" : "LichThi",
            Ngày: j,
            "Địa điểm": nt,
            "Giáo viên phụ trách": A,
            "Giờ bắt đầu": ft,
            "Giờ kết thúc": Y,
            "Học sinh": ut,
          },
          r == null ? void 0 : r.id
        );
    };
    return h
      ? f.jsxs("div", {
          className:
            "fixed inset-0 bg-ink/50 backdrop-blur-sm flex items-center justify-center z-[1000] p-4 animate-modalFadeIn",
          children: [
            f.jsxs("div", {
              className:
                "bg-white p-5 sm:p-8 rounded-xl shadow-large w-full max-w-lg relative animate-modalContentSlideIn max-h-[90vh] overflow-y-auto",
              onMouseDown: (s) => s.stopPropagation(),
              children: [
                f.jsx("button", {
                  onClick: U,
                  className:
                    "absolute top-3 right-3 bg-transparent border-none w-9 h-9 rounded-full text-2xl leading-none cursor-pointer text-muted transition-all hover:bg-[#f1f3f5] hover:text-ink hover:rotate-90",
                  children: "×",
                }),
                f.jsx("h2", {
                  className: "mt-0 text-xl md:text-2xl mb-6",
                  children: M ? "Cập nhật công việc" : "Thêm công việc mới",
                }),
                f.jsxs("form", {
                  onSubmit: F,
                  children: [
                    f.jsxs("div", {
                      className: "space-y-4",
                      children: [
                        f.jsx(Hl, {
                          label: "Môn học",
                          children: f.jsxs("select", {
                            value: p,
                            onChange: (s) => R(s.target.value),
                            required: !0,
                            children: [
                              f.jsx("option", {
                                value: "",
                                children: "-- Chọn môn học --",
                              }),
                              f.jsx("option", {
                                value: "Mathematics",
                                children: "Mathematics",
                              }),
                              f.jsx("option", {
                                value: "Chemistry",
                                children: "Chemistry",
                              }),
                              f.jsx("option", {
                                value: "Physics",
                                children: "Physics",
                              }),
                              f.jsx("option", {
                                value: "Biology",
                                children: "Biology",
                              }),
                              f.jsx("option", {
                                value: "Economics",
                                children: "Economics",
                              }),
                              f.jsx("option", {
                                value: "Business",
                                children: "Business",
                              }),
                              f.jsx("option", {
                                value: "Psychology",
                                children: "Psychology",
                              }),
                              f.jsx("option", {
                                value: "Literature",
                                children: "Literature",
                              }),
                              f.jsx("option", {
                                value: "English",
                                children: "English",
                              }),
                              f.jsx("option", {
                                value: "Chinese",
                                children: "Chinese",
                              }),
                            ],
                          }),
                        }),
                        f.jsx(Hl, {
                          label: "Giáo viên phụ trách",
                          children: f.jsx(B0, {
                            teachers: K,
                            selectedTeacher: A,
                            setSelectedTeacher: B,
                          }),
                        }),
                        f.jsx(Hl, {
                          label: "Học sinh",
                          children: f.jsx(R0, {
                            students: wt,
                            selectedStudents: ut,
                            setSelectedStudents: Yt,
                          }),
                        }),
                        f.jsx(Hl, {
                          label: "Tên công việc (Tự động)",
                          children: f.jsx("div", {
                            className: "relative",
                            children: f.jsx("input", {
                              value:
                                C ||
                                "Chưa có - Vui lòng chọn đủ: Môn học, Giáo viên, Học sinh",
                              readOnly: !0,
                              type: "text",
                              className:
                                "bg-gray-100 cursor-not-allowed font-semibold",
                              placeholder: "Học sinh - Giáo viên - Môn học",
                              title: `subjectName: ${p}, teacher: ${A}, students: ${ut.length}`,
                            }),
                          }),
                        }),
                        f.jsx(Hl, {
                          label: "Ngày",
                          children: f.jsx("input", {
                            value: j,
                            onChange: (s) => V(s.target.value),
                            type: "date",
                            required: !0,
                          }),
                        }),
                        f.jsxs("div", {
                          className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
                          children: [
                            f.jsx(Hl, {
                              label: "Giờ bắt đầu",
                              children: f.jsxs("div", {
                                onClick: () => Mt(!0),
                                className:
                                  "w-full p-3 pl-10 rounded-xl border border-line text-lg font-semibold bg-white cursor-pointer select-none text-center relative hover:border-brand transition",
                                children: [
                                  f.jsx("span", {
                                    className:
                                      "absolute left-3 top-1/2 -translate-y-1/2 text-2xl",
                                    children: "🕒",
                                  }),
                                  ft,
                                ],
                              }),
                            }),
                            f.jsx(Hl, {
                              label: "Số giờ",
                              children: f.jsx("input", {
                                value: O,
                                onChange: (s) => lt(s.target.value),
                                type: "number",
                                min: "0.5",
                                max: "24",
                                step: "0.5",
                                placeholder: "1",
                                className:
                                  "w-full p-3 rounded-xl border border-line text-lg font-semibold text-center",
                              }),
                            }),
                            f.jsx(Hl, {
                              label: "Giờ kết thúc",
                              children: f.jsxs("div", {
                                onClick: () => Dt(!0),
                                className:
                                  "w-full p-3 pl-10 rounded-xl border border-line text-lg font-semibold bg-white cursor-pointer select-none text-center relative hover:border-brand transition",
                                children: [
                                  f.jsx("span", {
                                    className:
                                      "absolute left-3 top-1/2 -translate-y-1/2 text-2xl",
                                    children: "🕒",
                                  }),
                                  Y,
                                ],
                              }),
                            }),
                          ],
                        }),
                        f.jsx(Hl, {
                          label: "Tổng số giờ",
                          children: f.jsx("div", {
                            className: `text-lg font-semibold p-2.5 rounded-lg text-center ${
                              st.includes("không hợp lệ")
                                ? "text-red-600 bg-red-100"
                                : "text-brand bg-brand-light"
                            }`,
                            children: st,
                          }),
                        }),
                        f.jsx(Hl, {
                          label: "Địa điểm",
                          children: f.jsx("input", {
                            value: nt,
                            onChange: (s) => I(s.target.value),
                            type: "text",
                            placeholder: "VD: Phòng A1-203",
                          }),
                        }),
                      ],
                    }),
                    f.jsx("div", {
                      className: "flex gap-3 mt-6",
                      children: f.jsx("button", {
                        type: "submit",
                        className:
                          "h-11 px-6 rounded-xl border border-brand bg-brand text-white font-semibold transition hover:-translate-y-0.5 hover:shadow-medium text-base",
                        children: M ? "Cập nhật" : "Thêm công việc",
                      }),
                    }),
                  ],
                }),
              ],
            }),
            dt && f.jsx(Ud, { value: ft, onChange: St, onClose: () => Mt(!1) }),
            bt && f.jsx(Ud, { value: Y, onChange: X, onClose: () => Dt(!1) }),
          ],
        })
      : null;
  },
  Hl = ({ label: h, children: U }) =>
    f.jsxs("div", {
      children: [
        f.jsx("label", {
          className: "block mb-2 font-bold text-lg text-brand",
          children: h,
        }),
        f.jsx("div", {
          className:
            "[&_input]:w-full [&_input]:p-3 [&_input]:rounded-xl [&_input]:border [&_input]:border-line [&_input]:text-base [&_input]:font-semibold [&_input]:transition [&_input]:focus:outline-none [&_input]:focus:border-brand [&_input]:focus:ring-2 [&_input]:focus:ring-brand/30 [&_select]:w-full [&_select]:p-3 [&_select]:rounded-xl [&_select]:border [&_select]:border-line [&_select]:text-base [&_select]:font-semibold [&_select]:transition [&_select]:focus:outline-none [&_select]:focus:border-brand [&_select]:focus:ring-2 [&_select]:focus:ring-brand/30",
          children: U,
        }),
      ],
    }),
  B0 = ({ teachers: h, selectedTeacher: U, setSelectedTeacher: z }) => {
    const [r, M] = q.useState(""),
      [C, G] = q.useState(!1),
      J = q.useRef(null);
    q.useEffect(() => {
      M(U);
    }, [U]),
      q.useEffect(() => {
        const R = (j) => {
          J.current && !J.current.contains(j.target) && (G(!1), M(U));
        };
        return (
          document.addEventListener("mousedown", R),
          () => document.removeEventListener("mousedown", R)
        );
      }, [U]);
    const D = q.useMemo(
        () => h.filter((R) => R.name.toLowerCase().includes(r.toLowerCase())),
        [h, r]
      ),
      p = (R) => {
        z(R), M(R), G(!1);
      };
    return f.jsxs("div", {
      className: "relative",
      ref: J,
      children: [
        f.jsx("input", {
          type: "text",
          value: r,
          onChange: (R) => M(R.target.value),
          onFocus: () => G(!0),
          placeholder: "Tìm và chọn giáo viên...",
        }),
        C &&
          f.jsx("div", {
            className:
              "absolute top-full mt-1.5 w-full z-30 bg-white rounded-xl shadow-lg border border-line max-h-60 overflow-y-auto",
            children: f.jsx("ul", {
              children:
                D.length > 0
                  ? D.map((R) =>
                      f.jsx(
                        "li",
                        {
                          onClick: () => p(R.name),
                          className:
                            "p-3 cursor-pointer hover:bg-gray-100 text-base",
                          children: R.name,
                        },
                        R.id
                      )
                    )
                  : f.jsx("li", {
                      className: "p-3 text-muted text-center text-base",
                      children: "Không tìm thấy giáo viên.",
                    }),
            }),
          }),
      ],
    });
  },
  R0 = ({ students: h, selectedStudents: U, setSelectedStudents: z }) => {
    const [r, M] = q.useState(""),
      [C, G] = q.useState(!1),
      J = q.useRef(null);
    q.useEffect(() => {
      const j = (V) => {
        const nt = V.target;
        J.current && !J.current.contains(nt) && G(!1);
      };
      return (
        C &&
          (document.addEventListener("mousedown", j, !0),
          document.addEventListener("click", j, !0)),
        () => {
          document.removeEventListener("mousedown", j, !0),
            document.removeEventListener("click", j, !0);
        }
      );
    }, [C]);
    const D = q.useMemo(
        () =>
          h.filter(
            (j) =>
              !U.includes(j.name) &&
              j.name.toLowerCase().includes(r.toLowerCase())
          ),
        [h, U, r]
      ),
      p = (j) => {
        z(U.filter((V) => V !== j));
      },
      R = (j) => {
        z([...U, j]), M("");
      };
    return f.jsxs("div", {
      className: "relative",
      ref: J,
      children: [
        f.jsxs("div", {
          className:
            "w-full flex flex-wrap gap-2 items-center p-2 rounded-xl border border-line bg-white min-h-[52px]",
          children: [
            U.map((j) =>
              f.jsxs(
                "span",
                {
                  className:
                    "flex items-center gap-1.5 bg-brand-light text-brand-dark px-2.5 py-1 rounded-full text-base font-medium",
                  children: [
                    j,
                    f.jsx("button", {
                      type: "button",
                      onClick: () => p(j),
                      className: "text-brand-dark hover:text-red-500 font-bold",
                      children: "×",
                    }),
                  ],
                },
                j
              )
            ),
            f.jsx("input", {
              type: "text",
              value: r,
              onChange: (j) => M(j.target.value),
              onFocus: () => G(!0),
              placeholder: "Tìm và chọn học sinh...",
              className:
                "flex-grow p-1 border-none outline-none focus:ring-0 text-base",
            }),
          ],
        }),
        C &&
          f.jsx("div", {
            className:
              "absolute top-full mt-1.5 w-full z-20 bg-white rounded-xl shadow-lg border border-line max-h-60 overflow-y-auto",
            children: f.jsx("ul", {
              children:
                D.length > 0
                  ? D.map((j) =>
                      f.jsx(
                        "li",
                        {
                          onClick: () => R(j.name),
                          className:
                            "p-3 cursor-pointer hover:bg-gray-100 text-base",
                          children: j.name,
                        },
                        j.id
                      )
                    )
                  : f.jsx("li", {
                      className: "p-3 text-muted text-center text-base",
                      children: "Không tìm thấy học sinh.",
                    }),
            }),
          }),
      ],
    });
  },
  q0 = () => {
    const [h, U] = q.useState(!1),
      z = () => {
        U(!0);
      };
    return h ? f.jsx(M0, {}) : f.jsx(x0, { onNavigate: z });
  },
  Yd = document.getElementById("root");
if (!Yd) throw new Error("Could not find root element to mount to");
const Y0 = b0.createRoot(Yd);
Y0.render(f.jsx(Rd.StrictMode, { children: f.jsx(q0, {}) }));
