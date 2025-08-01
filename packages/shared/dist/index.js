// src/constants/index.ts
var DEFAULT_WINDOW = typeof window !== "undefined" ? window : void 0;
var DEFAULT_DOCUMENT = typeof document !== "undefined" ? document : void 0;
var DEFAULT_NAVIGATOR = typeof navigator !== "undefined" ? navigator : void 0;
var DEFAULT_LOCATION = typeof location !== "undefined" ? location : void 0;
var STORAGE_KEY_PREFIX = "reactuse:";
var EVENTS = {
  RESIZE: "resize",
  SCROLL: "scroll",
  CLICK: "click",
  MOUSEDOWN: "mousedown",
  MOUSEUP: "mouseup",
  MOUSEMOVE: "mousemove",
  KEYDOWN: "keydown",
  KEYUP: "keyup",
  FOCUS: "focus",
  BLUR: "blur",
  VISIBILITYCHANGE: "visibilitychange",
  ONLINE: "online",
  OFFLINE: "offline",
  STORAGE: "storage",
  POPSTATE: "popstate",
  HASHCHANGE: "hashchange"
};
var BREAKPOINTS = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536
};
var COLOR_MODES = {
  LIGHT: "light",
  DARK: "dark",
  AUTO: "auto"
};
var DIRECTIONS = {
  LEFT: "left",
  RIGHT: "right",
  UP: "up",
  DOWN: "down",
  NONE: "none"
};
var DEFAULT_SERIALIZERS = {
  boolean: {
    read: (v) => v === "true",
    write: (v) => String(v)
  },
  object: {
    read: (v) => {
      try {
        return JSON.parse(v);
      } catch {
        return null;
      }
    },
    write: (v) => JSON.stringify(v)
  },
  number: {
    read: (v) => {
      const num = Number(v);
      return Number.isNaN(num) ? null : num;
    },
    write: (v) => String(v)
  },
  string: {
    read: (v) => v,
    write: (v) => v
  },
  any: {
    read: (v) => {
      try {
        return JSON.parse(v);
      } catch {
        return v;
      }
    },
    write: (v) => {
      if (typeof v === "string") return v;
      try {
        return JSON.stringify(v);
      } catch {
        return String(v);
      }
    }
  }
};
var DEFAULT_DEBOUNCE_MS = 300;
var DEFAULT_THROTTLE_MS = 100;
var DEFAULT_TIMEOUT_MS = 5e3;
var NETWORK_TYPES = {
  BLUETOOTH: "bluetooth",
  CELLULAR: "cellular",
  ETHERNET: "ethernet",
  NONE: "none",
  WIFI: "wifi",
  WIMAX: "wimax",
  OTHER: "other",
  UNKNOWN: "unknown"
};
var EFFECTIVE_TYPES = {
  SLOW_2G: "slow-2g",
  "2G": "2g",
  "3G": "3g",
  "4G": "4g"
};

// src/utils/index.ts
var isClient = typeof window !== "undefined";
var isDev = (() => {
  try {
    return typeof process !== "undefined" && process.env?.NODE_ENV === "development";
  } catch {
    return false;
  }
})();
var noop = () => {
};
function toValue(val) {
  return typeof val === "function" ? val() : val && typeof val === "object" && "current" in val ? val.current : val;
}
function unrefElement(elRef) {
  const plain = toValue(elRef);
  return plain || void 0;
}
function isRef(val) {
  return val && typeof val === "object" && "current" in val;
}
function isFunction(val) {
  return typeof val === "function";
}
function isString(val) {
  return typeof val === "string";
}
function isNumber(val) {
  return typeof val === "number";
}
function isBoolean(val) {
  return typeof val === "boolean";
}
function isObject(val) {
  return val !== null && typeof val === "object";
}
function isArray(val) {
  return Array.isArray(val);
}
function isDefined(val) {
  return val !== void 0 && val !== null;
}
function deepClone(obj) {
  if (obj === null || typeof obj !== "object") return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map((item) => deepClone(item));
  if (typeof obj === "object") {
    const clonedObj = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  return obj;
}
function debounce(fn, delay) {
  let timeoutId = null;
  const debounced = (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
  debounced.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };
  return debounced;
}
function throttle(fn, delay) {
  let lastCall = 0;
  let timeoutId = null;
  const throttled = (...args) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      fn(...args);
    } else if (!timeoutId) {
      timeoutId = setTimeout(() => {
        lastCall = Date.now();
        timeoutId = null;
        fn(...args);
      }, delay - (now - lastCall));
    }
  };
  throttled.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };
  return throttled;
}
function generateId(prefix = "id") {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}
function getType(obj) {
  return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
}
function merge(target, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();
  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        merge(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }
  return merge(target, ...sources);
}
function get(obj, path, defaultValue) {
  const keys = path.split(".");
  let result = obj;
  for (const key of keys) {
    if (result == null || typeof result !== "object") {
      return defaultValue;
    }
    result = result[key];
  }
  return result !== void 0 ? result : defaultValue;
}
function set(obj, path, value) {
  const keys = path.split(".");
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!(key in current) || !isObject(current[key])) {
      current[key] = {};
    }
    current = current[key];
  }
  const lastKey = keys[keys.length - 1];
  current[lastKey] = value;
}
function unique(arr) {
  return Array.from(new Set(arr));
}
function chunk(arr, size) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function retry(fn, times = 3, delay = 1e3) {
  try {
    return await fn();
  } catch (error) {
    if (times <= 1) throw error;
    await sleep(delay);
    return retry(fn, times - 1, delay);
  }
}
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}
function createEventEmitter() {
  const listeners = {};
  return {
    on(event, listener) {
      if (!listeners[event]) listeners[event] = [];
      listeners[event].push(listener);
      return () => {
        const index = listeners[event].indexOf(listener);
        if (index > -1) listeners[event].splice(index, 1);
      };
    },
    emit(event, ...args) {
      if (listeners[event]) {
        listeners[event].forEach((listener) => listener(...args));
      }
    },
    off(event, listener) {
      if (!listeners[event]) return;
      if (listener) {
        const index = listeners[event].indexOf(listener);
        if (index > -1) listeners[event].splice(index, 1);
      } else {
        listeners[event] = [];
      }
    },
    clear() {
      Object.keys(listeners).forEach((key) => {
        listeners[key] = [];
      });
    }
  };
}

export { BREAKPOINTS, COLOR_MODES, DEFAULT_DEBOUNCE_MS, DEFAULT_DOCUMENT, DEFAULT_LOCATION, DEFAULT_NAVIGATOR, DEFAULT_SERIALIZERS, DEFAULT_THROTTLE_MS, DEFAULT_TIMEOUT_MS, DEFAULT_WINDOW, DIRECTIONS, EFFECTIVE_TYPES, EVENTS, NETWORK_TYPES, STORAGE_KEY_PREFIX, chunk, createEventEmitter, debounce, deepClone, formatBytes, generateId, get, getType, isArray, isBoolean, isClient, isDefined, isDev, isFunction, isNumber, isObject, isRef, isString, merge, noop, retry, set, sleep, throttle, toValue, unique, unrefElement };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map