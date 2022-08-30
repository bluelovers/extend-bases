'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var array_prototype_flatmap = require('array.prototype.flatmap');
var reflect_ownkeys = require('reflect.ownkeys');
var classWithoutCallParentConstructor = require('class-without-call-parent-constructor');

if (typeof Reflect.ownKeys === "undefined") {
  reflect_ownkeys.shim();
}

if (typeof Array.prototype.flatMap === "undefined") {
  array_prototype_flatmap.shim();
}

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

const SymbolBases = /*#__PURE__*/Symbol.for('extend-bases#bases');

function extendStatics(derived, base) {
  for (const p of Reflect.ownKeys(base)) {
    if (p === "length" || p === "prototype" || p === "name") {
      continue;
    }

    if (Object.prototype.hasOwnProperty.call(base, p)) {
      derived[p] = base[p];
    }
  }
}

function setPrototypeToProxy(self, baseClasses) {
  const proto = self.prototype;

  for (let i = baseClasses.length - 1; i >= 0; i--) {
    const basePrototype = baseClasses[i].prototype;
    extendStatics(self, baseClasses[i]);

    for (const nextKey of Reflect.ownKeys(basePrototype)) {
      if (nextKey !== SymbolBases && Object.prototype.hasOwnProperty.call(basePrototype, nextKey)) {
        const val = basePrototype[nextKey];

        if (nextKey !== "constructor" && typeof val === "function") {
          proto[nextKey] = function (...args) {
            return val.apply(this[SymbolBases][i], args);
          };
        }
      }
    }
  }

  Object.freeze(proto);
  return self;
}

function bases(...baseClasses) {
  class Self2 extends classWithoutCallParentConstructor.classWithoutCallParentConstructor(baseClasses[0]) {
    constructor(...baseInstances) {
      super();
      Reflect.defineProperty(this, SymbolBases, {
        configurable: false,
        enumerable: false,
        value: baseInstances,
        writable: false
      });
      return new Proxy(this, {
        isExtensible(target) {
          return Reflect.isExtensible(target) && target[SymbolBases].every(Reflect.isExtensible);
        },

        preventExtensions(target) {
          return Reflect.preventExtensions(target) && target[SymbolBases].every(Reflect.preventExtensions);
        },

        getOwnPropertyDescriptor(target, p) {
          let pd = Reflect.getOwnPropertyDescriptor(target, p);

          for (const base of target[SymbolBases]) {
            if (pd != null) {
              break;
            }

            pd = Reflect.getOwnPropertyDescriptor(base, p);
          }

          return pd;
        },

        has(target, p) {
          return Reflect.has(target, p) || target[SymbolBases].some(base => Reflect.has(base, p));
        },

        get(target, p, receiver) {
          console.log('target', p, p in target, Object.getOwnPropertyDescriptor(target, p));
          console.log('receiver', p, p in receiver, Object.getOwnPropertyDescriptor(receiver, p));

          if (p in target) {
            return target[p];
          }

          for (const base of target[SymbolBases]) {
            console.log('base', p in base);

            if (p in base) {
              return base[p];
            }
          }

          return target[p];
        },

        set(target, p, value) {
          if (p in target) {
            target[p] = value;
            return true;
          }

          for (const base of target[SymbolBases]) {
            if (p in base) {
              base[p] = value;
              return true;
            }
          }

          target[p] = value;
          return true;
        },

        deleteProperty(target, p) {
          if (p in target) {
            return Reflect.deleteProperty(target, p);
          }

          for (const base of target[SymbolBases]) {
            if (p in base) {
              return Reflect.deleteProperty(base, p);
            }
          }

          return Reflect.deleteProperty(target, p);
        },

        enumerate(target) {
          return Reflect.ownKeys(target).concat(target[SymbolBases].flatMap(Reflect.ownKeys)).filter(onlyUnique);
        },

        ownKeys(target) {
          return Reflect.ownKeys(target).concat(target[SymbolBases].flatMap(Reflect.ownKeys)).filter(onlyUnique);
        },

        defineProperty(target, p, attributes) {
          return Reflect.defineProperty(target, p, attributes);
        }

      });
    }

  }

  setPrototypeToProxy(Self2, baseClasses);
  return Self2;
}
function defineProperties(v, props) {
  for (const prop of Reflect.ownKeys(props)) {
    if (typeof prop !== "string") {
      continue;
    }

    let propName = prop;
    let isWritable = true;

    if (prop.startsWith("readonly ")) {
      isWritable = false;
      propName = prop.slice(9);
    }

    Reflect.defineProperty(v, propName, {
      value: props[prop],
      writable: isWritable,
      configurable: true,
      enumerable: true
    });
  }
}
function isInstanceOf(v, cls) {
  if (v instanceof cls) {
    return true;
  }

  if (SymbolBases in v && Array.isArray(v[SymbolBases])) {
    for (const base of v[SymbolBases]) {
      if (isInstanceOf(base, cls)) {
        return true;
      }
    }
  }

  return false;
}

exports.SymbolBases = SymbolBases;
exports.bases = bases;
exports["default"] = bases;
exports.defineProperties = defineProperties;
exports.isInstanceOf = isInstanceOf;
//# sourceMappingURL=index.cjs.development.cjs.map
