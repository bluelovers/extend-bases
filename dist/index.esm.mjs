import { shim as e } from "array.prototype.flatmap";

import { shim as t } from "reflect.ownkeys";

import { classWithoutCallParentConstructor as r } from "class-without-call-parent-constructor";

function onlyUnique(e, t, r) {
  return r.indexOf(e) === t;
}

void 0 === Reflect.ownKeys && t(), void 0 === Array.prototype.flatMap && e();

const n = Symbol.for("extend-bases#bases");

function extendStatics(e, t) {
  for (const r of Reflect.ownKeys(t)) "length" !== r && "prototype" !== r && "name" !== r && Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
}

function bases(...e) {
  class Self2 extends(r(e[0])){
    constructor(...e) {
      return super(), Reflect.defineProperty(this, n, {
        configurable: !1,
        enumerable: !1,
        value: e,
        writable: !1
      }), new Proxy(this, {
        isExtensible: e => Reflect.isExtensible(e) && e[n].every(Reflect.isExtensible),
        preventExtensions: e => Reflect.preventExtensions(e) && e[n].every(Reflect.preventExtensions),
        getOwnPropertyDescriptor(e, t) {
          let r = Reflect.getOwnPropertyDescriptor(e, t);
          for (const o of e[n]) {
            if (null != r) break;
            r = Reflect.getOwnPropertyDescriptor(o, t);
          }
          return r;
        },
        has: (e, t) => Reflect.has(e, t) || e[n].some((e => Reflect.has(e, t))),
        get(e, t, r) {
          if (console.log("target", t, t in e, Object.getOwnPropertyDescriptor(e, t)), console.log("receiver", t, t in r, Object.getOwnPropertyDescriptor(r, t)), 
          t in e) return e[t];
          for (const r of e[n]) if (console.log("base", t in r), t in r) return r[t];
          return e[t];
        },
        set(e, t, r) {
          if (t in e) return e[t] = r, !0;
          for (const o of e[n]) if (t in o) return o[t] = r, !0;
          return e[t] = r, !0;
        },
        deleteProperty(e, t) {
          if (t in e) return Reflect.deleteProperty(e, t);
          for (const r of e[n]) if (t in r) return Reflect.deleteProperty(r, t);
          return Reflect.deleteProperty(e, t);
        },
        enumerate: e => Reflect.ownKeys(e).concat(e[n].flatMap(Reflect.ownKeys)).filter(onlyUnique),
        ownKeys: e => Reflect.ownKeys(e).concat(e[n].flatMap(Reflect.ownKeys)).filter(onlyUnique),
        defineProperty: (e, t, r) => Reflect.defineProperty(e, t, r)
      });
    }
  }
  return function setPrototypeToProxy(e, t) {
    const r = e.prototype;
    for (let o = t.length - 1; o >= 0; o--) {
      const s = t[o].prototype;
      extendStatics(e, t[o]);
      for (const e of Reflect.ownKeys(s)) if (e !== n && Object.prototype.hasOwnProperty.call(s, e)) {
        const t = s[e];
        "constructor" !== e && "function" == typeof t && (r[e] = function(...e) {
          return t.apply(this[n][o], e);
        });
      }
    }
    Object.freeze(r);
  }(Self2, e), Self2;
}

function defineProperties(e, t) {
  for (const r of Reflect.ownKeys(t)) {
    if ("string" != typeof r) continue;
    let n = r, o = !0;
    r.startsWith("readonly ") && (o = !1, n = r.slice(9)), Reflect.defineProperty(e, n, {
      value: t[r],
      writable: o,
      configurable: !0,
      enumerable: !0
    });
  }
}

function isInstanceOf(e, t) {
  if (e instanceof t) return !0;
  if (n in e && Array.isArray(e[n])) for (const r of e[n]) if (isInstanceOf(r, t)) return !0;
  return !1;
}

export { n as SymbolBases, bases, bases as default, defineProperties, isInstanceOf };
//# sourceMappingURL=index.esm.mjs.map
