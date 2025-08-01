'use strict';

var react = require('react');
var shared = require('@reactuse/shared');

// src/state/useLocalStorage.ts
function useLocalStorage(key, defaultValue, options = {}) {
  const {
    serializer = shared.DEFAULT_SERIALIZERS.any,
    syncAcrossTabs = true,
    onError = console.error
  } = options;
  const getStoredValue = react.useCallback(() => {
    if (!shared.isClient) return defaultValue;
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;
      return serializer.read(item);
    } catch (error) {
      onError(error);
      return defaultValue;
    }
  }, [key, defaultValue, serializer, onError]);
  const [storedValue, setStoredValue] = react.useState(getStoredValue);
  const isUpdatingRef = react.useRef(false);
  const setValue = react.useCallback((value) => {
    if (!shared.isClient) return;
    try {
      isUpdatingRef.current = true;
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (valueToStore === void 0) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, serializer.write(valueToStore));
      }
    } catch (error) {
      onError(error);
    } finally {
      isUpdatingRef.current = false;
    }
  }, [key, storedValue, serializer, onError]);
  const removeValue = react.useCallback(() => {
    if (!shared.isClient) return;
    try {
      isUpdatingRef.current = true;
      localStorage.removeItem(key);
      setStoredValue(defaultValue);
    } catch (error) {
      onError(error);
    } finally {
      isUpdatingRef.current = false;
    }
  }, [key, defaultValue, onError]);
  react.useEffect(() => {
    if (!shared.isClient || !syncAcrossTabs) return;
    const handleStorageChange = (e) => {
      if (e.key === key && e.storageArea === localStorage && !isUpdatingRef.current) {
        try {
          if (e.newValue === null) {
            setStoredValue(defaultValue);
          } else {
            setStoredValue(serializer.read(e.newValue));
          }
        } catch (error) {
          onError(error);
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key, defaultValue, serializer, syncAcrossTabs, onError]);
  react.useEffect(() => {
    const currentValue = getStoredValue();
    if (currentValue !== storedValue) {
      setStoredValue(currentValue);
    }
  }, [getStoredValue, storedValue]);
  return [storedValue, setValue, removeValue];
}
function useLocalStorageString(key, defaultValue = "", options) {
  return useLocalStorage(key, defaultValue, {
    ...options,
    serializer: shared.DEFAULT_SERIALIZERS.string
  });
}
function useLocalStorageNumber(key, defaultValue = 0, options) {
  return useLocalStorage(key, defaultValue, {
    ...options,
    serializer: {
      read: (v) => {
        const num = Number(v);
        return Number.isNaN(num) ? defaultValue : num;
      },
      write: (v) => String(v)
    }
  });
}
function useLocalStorageBoolean(key, defaultValue = false, options) {
  return useLocalStorage(key, defaultValue, {
    ...options,
    serializer: shared.DEFAULT_SERIALIZERS.boolean
  });
}
function useLocalStorageObject(key, defaultValue, options) {
  return useLocalStorage(key, defaultValue, {
    ...options,
    serializer: shared.DEFAULT_SERIALIZERS.object
  });
}
function useSessionStorage(key, defaultValue, options = {}) {
  const {
    serializer = shared.DEFAULT_SERIALIZERS.any,
    syncAcrossTabs = true,
    onError = console.error
  } = options;
  const getStoredValue = react.useCallback(() => {
    if (!shared.isClient) return defaultValue;
    try {
      const item = sessionStorage.getItem(key);
      if (item === null) return defaultValue;
      return serializer.read(item);
    } catch (error) {
      onError(error);
      return defaultValue;
    }
  }, [key, defaultValue, serializer, onError]);
  const [storedValue, setStoredValue] = react.useState(getStoredValue);
  const isUpdatingRef = react.useRef(false);
  const setValue = react.useCallback((value) => {
    if (!shared.isClient) return;
    try {
      isUpdatingRef.current = true;
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (valueToStore === void 0) {
        sessionStorage.removeItem(key);
      } else {
        sessionStorage.setItem(key, serializer.write(valueToStore));
      }
    } catch (error) {
      onError(error);
    } finally {
      isUpdatingRef.current = false;
    }
  }, [key, storedValue, serializer, onError]);
  const removeValue = react.useCallback(() => {
    if (!shared.isClient) return;
    try {
      isUpdatingRef.current = true;
      sessionStorage.removeItem(key);
      setStoredValue(defaultValue);
    } catch (error) {
      onError(error);
    } finally {
      isUpdatingRef.current = false;
    }
  }, [key, defaultValue, onError]);
  react.useEffect(() => {
    if (!shared.isClient || !syncAcrossTabs) return;
    const handleStorageChange = (e) => {
      if (e.key === key && e.storageArea === sessionStorage && !isUpdatingRef.current) {
        try {
          if (e.newValue === null) {
            setStoredValue(defaultValue);
          } else {
            setStoredValue(serializer.read(e.newValue));
          }
        } catch (error) {
          onError(error);
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key, defaultValue, serializer, syncAcrossTabs, onError]);
  react.useEffect(() => {
    const currentValue = getStoredValue();
    if (currentValue !== storedValue) {
      setStoredValue(currentValue);
    }
  }, [getStoredValue, storedValue]);
  return [storedValue, setValue, removeValue];
}
function useSessionStorageString(key, defaultValue = "", options) {
  return useSessionStorage(key, defaultValue, {
    ...options,
    serializer: shared.DEFAULT_SERIALIZERS.string
  });
}
function useSessionStorageNumber(key, defaultValue = 0, options) {
  return useSessionStorage(key, defaultValue, {
    ...options,
    serializer: {
      read: (v) => {
        const num = Number(v);
        return Number.isNaN(num) ? defaultValue : num;
      },
      write: (v) => String(v)
    }
  });
}
function useSessionStorageBoolean(key, defaultValue = false, options) {
  return useSessionStorage(key, defaultValue, {
    ...options,
    serializer: shared.DEFAULT_SERIALIZERS.boolean
  });
}
function useSessionStorageObject(key, defaultValue, options) {
  return useSessionStorage(key, defaultValue, {
    ...options,
    serializer: shared.DEFAULT_SERIALIZERS.object
  });
}
function useToggle(initialValue = false) {
  const [value, setValue] = react.useState(initialValue);
  const toggle = react.useCallback(() => {
    setValue((prev) => !prev);
  }, []);
  const setTrue = react.useCallback(() => {
    setValue(true);
  }, []);
  const setFalse = react.useCallback(() => {
    setValue(false);
  }, []);
  const setValueCallback = react.useCallback((newValue) => {
    setValue(newValue);
  }, []);
  return {
    value,
    toggle,
    setTrue,
    setFalse,
    setValue: setValueCallback
  };
}
function useToggleValues(values, initialIndex = 0) {
  const [index, setIndex] = react.useState(
    Math.max(0, Math.min(initialIndex, values.length - 1))
  );
  const next = react.useCallback(() => {
    setIndex((prev2) => (prev2 + 1) % values.length);
  }, [values.length]);
  const prev = react.useCallback(() => {
    setIndex((prev2) => (prev2 - 1 + values.length) % values.length);
  }, [values.length]);
  const set = react.useCallback((newIndex) => {
    if (newIndex >= 0 && newIndex < values.length) {
      setIndex(newIndex);
    }
  }, [values.length]);
  const setValue = react.useCallback((value) => {
    const newIndex = values.indexOf(value);
    if (newIndex !== -1) {
      setIndex(newIndex);
    }
  }, [values]);
  return {
    value: values[index],
    index,
    next,
    prev,
    set,
    setValue
  };
}
function useCounter(initialValue = 0, options = {}) {
  const { min, max, step = 1 } = options;
  const getValidValue = react.useCallback((value) => {
    let validValue = value;
    if (min !== void 0 && validValue < min) validValue = min;
    if (max !== void 0 && validValue > max) validValue = max;
    return validValue;
  }, [min, max]);
  const [count, setCount] = react.useState(() => getValidValue(initialValue));
  const set = react.useCallback((value) => {
    setCount((prev) => {
      const newValue = typeof value === "function" ? value(prev) : value;
      return getValidValue(newValue);
    });
  }, [getValidValue]);
  const inc = react.useCallback((delta = step) => {
    set((prev) => prev + delta);
  }, [set, step]);
  const dec = react.useCallback((delta = step) => {
    set((prev) => prev - delta);
  }, [set, step]);
  const reset = react.useCallback(() => {
    set(initialValue);
  }, [set, initialValue]);
  const setMin = react.useCallback(() => {
    if (min !== void 0) {
      set(min);
    }
  }, [set, min]);
  const setMax = react.useCallback(() => {
    if (max !== void 0) {
      set(max);
    }
  }, [set, max]);
  return {
    count,
    inc,
    dec,
    set,
    reset,
    setMin,
    setMax
  };
}
var globalStates = /* @__PURE__ */ new Map();
function createGlobalState(key, initialValue) {
  if (!globalStates.has(key)) {
    globalStates.set(key, {
      listeners: /* @__PURE__ */ new Set(),
      value: initialValue
    });
  }
  return function useGlobalState() {
    const globalState = globalStates.get(key);
    const [localValue, setLocalValue] = react.useState(globalState.value);
    react.useEffect(() => {
      const listener = (newValue) => {
        setLocalValue(newValue);
      };
      globalState.listeners.add(listener);
      if (localValue !== globalState.value) {
        setLocalValue(globalState.value);
      }
      return () => {
        globalState.listeners.delete(listener);
      };
    }, []);
    const setGlobalValue = react.useCallback((newValue) => {
      const globalState2 = globalStates.get(key);
      const nextValue = typeof newValue === "function" ? newValue(globalState2.value) : newValue;
      globalState2.value = nextValue;
      globalState2.listeners.forEach((listener) => {
        listener(nextValue);
      });
    }, []);
    return [localValue, setGlobalValue];
  };
}
function getGlobalState(key) {
  const globalState = globalStates.get(key);
  return globalState?.value;
}
function setGlobalState(key, value) {
  const globalState = globalStates.get(key);
  if (!globalState) {
    console.warn(`Global state with key "${String(key)}" does not exist`);
    return;
  }
  const nextValue = typeof value === "function" ? value(globalState.value) : value;
  globalState.value = nextValue;
  globalState.listeners.forEach((listener) => {
    listener(nextValue);
  });
}
function resetGlobalState(key, initialValue) {
  const globalState = globalStates.get(key);
  if (!globalState) {
    console.warn(`Global state with key "${String(key)}" does not exist`);
    return;
  }
  globalState.value = initialValue;
  globalState.listeners.forEach((listener) => {
    listener(initialValue);
  });
}
function destroyGlobalState(key) {
  globalStates.delete(key);
}
function useMouse(options = {}) {
  const {
    initialValue = { x: 0, y: 0 },
    target,
    touch = true,
    resetOnTouchEnds = false,
    type = "page"
  } = options;
  const [position, setPosition] = react.useState(initialValue);
  const [sourceType, setSourceType] = react.useState(null);
  const targetRef = react.useRef(target || (shared.isClient ? window : null));
  react.useEffect(() => {
    if (!shared.isClient) return;
    const element = targetRef.current || window;
    const getPosition = (event) => {
      if ("touches" in event) {
        const touch2 = event.touches[0];
        if (!touch2) return initialValue;
        switch (type) {
          case "screen":
            return { x: touch2.screenX, y: touch2.screenY };
          case "client":
            return { x: touch2.clientX, y: touch2.clientY };
          case "page":
          default:
            return { x: touch2.pageX, y: touch2.pageY };
        }
      } else {
        switch (type) {
          case "screen":
            return { x: event.screenX, y: event.screenY };
          case "client":
            return { x: event.clientX, y: event.clientY };
          case "page":
          default:
            return { x: event.pageX, y: event.pageY };
        }
      }
    };
    const handleMouseMove = (event) => {
      setPosition(getPosition(event));
      setSourceType("mouse");
    };
    const handleTouchMove = (event) => {
      const touchEvent = event;
      if (touchEvent.touches.length > 0) {
        setPosition(getPosition(touchEvent));
        setSourceType("touch");
      }
    };
    const handleTouchEnd = () => {
      if (resetOnTouchEnds) {
        setPosition(initialValue);
        setSourceType(null);
      }
    };
    element.addEventListener("mousemove", handleMouseMove, { passive: true });
    if (touch) {
      element.addEventListener("touchmove", handleTouchMove, { passive: true });
      if (resetOnTouchEnds) {
        element.addEventListener("touchend", handleTouchEnd, { passive: true });
      }
    }
    return () => {
      element.removeEventListener("mousemove", handleMouseMove);
      if (touch) {
        element.removeEventListener("touchmove", handleTouchMove);
        if (resetOnTouchEnds) {
          element.removeEventListener("touchend", handleTouchEnd);
        }
      }
    };
  }, [initialValue, touch, resetOnTouchEnds, type]);
  react.useEffect(() => {
    targetRef.current = target || (shared.isClient ? window : null);
  }, [target]);
  return {
    x: position.x,
    y: position.y,
    sourceType
  };
}
function useMouseInElement(target, options = {}) {
  const mouse = useMouse({ ...options, target: target || null });
  const [elementPosition, setElementPosition] = react.useState({
    elementX: 0,
    elementY: 0,
    elementPositionX: 0,
    elementPositionY: 0,
    isOutside: true
  });
  react.useEffect(() => {
    if (!target || !shared.isClient) return;
    const updateElementPosition = () => {
      const rect = target.getBoundingClientRect();
      const elementX = mouse.x - rect.left - window.pageXOffset;
      const elementY = mouse.y - rect.top - window.pageYOffset;
      const elementPositionX = elementX / rect.width;
      const elementPositionY = elementY / rect.height;
      const isOutside = elementX < 0 || elementY < 0 || elementX > rect.width || elementY > rect.height;
      setElementPosition({
        elementX,
        elementY,
        elementPositionX,
        elementPositionY,
        isOutside
      });
    };
    updateElementPosition();
  }, [mouse.x, mouse.y, target]);
  return {
    ...mouse,
    ...elementPosition
  };
}
function useWindowSize(options = {}) {
  const {
    initialWidth = Infinity,
    initialHeight = Infinity,
    listenOrientation = true,
    includeScrollbar = true
  } = options;
  const [windowSize, setWindowSize] = react.useState(() => {
    if (!shared.isClient) {
      return { width: initialWidth, height: initialHeight };
    }
    return {
      width: includeScrollbar ? window.innerWidth : document.documentElement.clientWidth,
      height: includeScrollbar ? window.innerHeight : document.documentElement.clientHeight
    };
  });
  react.useEffect(() => {
    if (!shared.isClient) return;
    const updateSize = () => {
      setWindowSize({
        width: includeScrollbar ? window.innerWidth : document.documentElement.clientWidth,
        height: includeScrollbar ? window.innerHeight : document.documentElement.clientHeight
      });
    };
    window.addEventListener("resize", updateSize, { passive: true });
    if (listenOrientation) {
      window.addEventListener("orientationchange", updateSize, { passive: true });
    }
    updateSize();
    return () => {
      window.removeEventListener("resize", updateSize);
      if (listenOrientation) {
        window.removeEventListener("orientationchange", updateSize);
      }
    };
  }, [includeScrollbar, listenOrientation]);
  return windowSize;
}
function useEventListener(event, listener, target = shared.isClient ? window : null, options = {}) {
  const listenerRef = react.useRef(listener);
  const targetRef = react.useRef(target);
  const optionsRef = react.useRef(options);
  listenerRef.current = listener;
  targetRef.current = target;
  optionsRef.current = options;
  react.useEffect(() => {
    if (!shared.isClient) return;
    const element = targetRef.current;
    if (!element) return;
    const eventListener = (event2) => {
      listenerRef.current(event2);
    };
    const eventOptions = {};
    if (optionsRef.current.capture !== void 0) eventOptions.capture = optionsRef.current.capture;
    if (optionsRef.current.once !== void 0) eventOptions.once = optionsRef.current.once;
    if (optionsRef.current.passive !== void 0) eventOptions.passive = optionsRef.current.passive;
    if (optionsRef.current.signal !== void 0) eventOptions.signal = optionsRef.current.signal;
    element.addEventListener(event, eventListener, eventOptions);
    return () => {
      element.removeEventListener(event, eventListener, eventOptions);
    };
  }, [event]);
}
function useEventListeners(events, listener, target = shared.isClient ? window : null, options = {}) {
  const listenerRef = react.useRef(listener);
  const targetRef = react.useRef(target);
  const optionsRef = react.useRef(options);
  listenerRef.current = listener;
  targetRef.current = target;
  optionsRef.current = options;
  react.useEffect(() => {
    if (!shared.isClient) return;
    const element = targetRef.current;
    if (!element) return;
    const eventListener = (event) => {
      listenerRef.current(event);
    };
    const eventOptions = {};
    if (optionsRef.current.capture !== void 0) eventOptions.capture = optionsRef.current.capture;
    if (optionsRef.current.once !== void 0) eventOptions.once = optionsRef.current.once;
    if (optionsRef.current.passive !== void 0) eventOptions.passive = optionsRef.current.passive;
    if (optionsRef.current.signal !== void 0) eventOptions.signal = optionsRef.current.signal;
    events.forEach((event) => {
      element.addEventListener(event, eventListener, eventOptions);
    });
    return () => {
      events.forEach((event) => {
        element.removeEventListener(event, eventListener, eventOptions);
      });
    };
  }, [events]);
}
function useClickOutside(target, handler, options = {}) {
  const {
    events = ["mousedown", "touchstart"],
    detect = defaultDetect,
    ignore = []
  } = options;
  const handlerRef = react.useRef(handler);
  const targetRef = react.useRef(target);
  const ignoreRef = react.useRef(ignore);
  handlerRef.current = handler;
  targetRef.current = target;
  ignoreRef.current = ignore;
  const listener = react.useCallback((event) => {
    const targetElement = getTargetElement(targetRef.current);
    if (!targetElement) return;
    if (!detect(event, targetElement)) return;
    const ignoreElements = ignoreRef.current.map((item) => getTargetElement(item)).filter(Boolean);
    if (ignoreElements.some((element) => element.contains(event.target))) {
      return;
    }
    handlerRef.current(event);
  }, [detect]);
  events.forEach((eventName) => {
    useEventListener(eventName, listener, document, { passive: true });
  });
}
function defaultDetect(event, target) {
  return !target.contains(event.target);
}
function getTargetElement(target) {
  if (typeof target === "string") {
    return document.querySelector(target);
  }
  if (target && "current" in target) {
    return target.current;
  }
  if (target instanceof Element) {
    return target;
  }
  return null;
}
function useClickOutsideMultiple(targets, handler, options = {}) {
  const {
    events = ["mousedown", "touchstart"],
    detect = defaultDetect,
    ignore = []
  } = options;
  const handlerRef = react.useRef(handler);
  const targetsRef = react.useRef(targets);
  const ignoreRef = react.useRef(ignore);
  handlerRef.current = handler;
  targetsRef.current = targets;
  ignoreRef.current = ignore;
  const listener = react.useCallback((event) => {
    const targetElements = targetsRef.current.map((target) => getTargetElement(target)).filter(Boolean);
    if (targetElements.length === 0) return;
    const isInsideAnyTarget = targetElements.some((element) => {
      return !detect(event, element);
    });
    if (isInsideAnyTarget) return;
    const ignoreElements = ignoreRef.current.map((item) => getTargetElement(item)).filter(Boolean);
    if (ignoreElements.some((element) => element.contains(event.target))) {
      return;
    }
    handlerRef.current(event);
  }, [detect]);
  events.forEach((eventName) => {
    useEventListener(eventName, listener, document, { passive: true });
  });
}
function useDark(options = {}) {
  const {
    storageKey = "reactuse-color-scheme",
    initialValue,
    listenToSystemChanges = true,
    selector = "html",
    darkClass = "dark",
    lightClass = "",
    valueDark = "dark",
    valueLight = "light"
  } = options;
  const getSystemDark2 = react.useCallback(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }, []);
  const getInitialValue = react.useCallback(() => {
    if (initialValue !== void 0) return initialValue;
    return getSystemDark2();
  }, [initialValue, getSystemDark2]);
  const [store, setStore] = useLocalStorage(
    storageKey,
    getInitialValue()
  );
  const isDark = store === true || typeof store === "string" && store === valueDark;
  const updateDOM = react.useCallback((dark) => {
    if (typeof window === "undefined") return;
    const element = document.querySelector(selector);
    if (!element) return;
    if (dark) {
      if (lightClass) element.classList.remove(lightClass);
      if (darkClass) element.classList.add(darkClass);
    } else {
      if (darkClass) element.classList.remove(darkClass);
      if (lightClass) element.classList.add(lightClass);
    }
  }, [selector, darkClass, lightClass]);
  const setDark = react.useCallback((value) => {
    const newValue = value ? valueDark : valueLight;
    setStore(newValue);
    updateDOM(value);
  }, [setStore, updateDOM, valueDark, valueLight]);
  const toggle = react.useCallback(() => {
    setDark(!isDark);
  }, [isDark, setDark]);
  react.useEffect(() => {
    if (!listenToSystemChanges || initialValue !== void 0 || typeof window === "undefined") {
      return;
    }
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (event) => {
      setDark(event.matches);
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [listenToSystemChanges, initialValue, setDark]);
  react.useEffect(() => {
    updateDOM(isDark);
  }, [isDark, updateDOM]);
  return [isDark, setDark, toggle];
}
function getSystemDark() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}
function useColorMode(options = {}) {
  const {
    storageKey = "reactuse-color-mode",
    initialValue = "auto",
    selector = "html",
    darkClass = "dark",
    lightClass = "light",
    autoClass = "auto",
    modes = {},
    listenToSystemChanges = true,
    attribute = "data-color-mode",
    useAttribute = false
  } = options;
  const getSystemMode = react.useCallback(() => {
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }, []);
  const [mode, setStoredMode] = useLocalStorage(
    storageKey,
    initialValue
  );
  const systemMode = getSystemMode();
  const resolvedMode = mode === "auto" ? systemMode : mode;
  const updateDOM = react.useCallback((targetMode) => {
    if (typeof window === "undefined") return;
    const element = document.querySelector(selector);
    if (!element) return;
    if (useAttribute) {
      element.setAttribute(attribute, targetMode);
    } else {
      const allClasses = [lightClass, darkClass, autoClass, ...Object.values(modes)];
      element.classList.remove(...allClasses.filter(Boolean));
      const targetClass = targetMode === "dark" ? darkClass : lightClass;
      if (targetClass) {
        element.classList.add(targetClass);
      }
    }
  }, [selector, useAttribute, attribute, lightClass, darkClass, autoClass, modes]);
  const setMode = react.useCallback((newMode) => {
    setStoredMode(newMode);
    const resolvedNewMode = newMode === "auto" ? getSystemMode() : newMode;
    updateDOM(resolvedNewMode);
  }, [setStoredMode, getSystemMode, updateDOM]);
  react.useEffect(() => {
    if (!listenToSystemChanges || typeof window === "undefined") {
      return;
    }
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (mode === "auto") {
        const newSystemMode = getSystemMode();
        updateDOM(newSystemMode);
      }
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [mode, listenToSystemChanges, getSystemMode, updateDOM]);
  react.useEffect(() => {
    updateDOM(resolvedMode);
  }, [resolvedMode, updateDOM]);
  return [mode, setMode, systemMode];
}
function getSystemColorMode() {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function toggleColorMode(currentMode) {
  if (currentMode === "auto") {
    return getSystemColorMode() === "dark" ? "light" : "dark";
  }
  return currentMode === "dark" ? "light" : "dark";
}
function useClipboard(options = {}) {
  const {
    copiedDuring = 1500,
    legacy = true,
    source = "clipboard"
  } = options;
  const [text, setText] = react.useState("");
  const [copied, setCopied] = react.useState(false);
  const timeoutRef = react.useRef();
  const isSupported = typeof navigator !== "undefined" && "clipboard" in navigator;
  const copy = react.useCallback(async (value) => {
    if (!value) return;
    try {
      if (isSupported) {
        await navigator.clipboard.writeText(value);
      } else if (legacy) {
        await copyTextLegacy(value);
      } else {
        throw new Error("Clipboard API not supported and legacy method disabled");
      }
      setText(value);
      setCopied(true);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setCopied(false);
      }, copiedDuring);
    } catch (error) {
      console.error("Failed to copy text to clipboard:", error);
      throw error;
    }
  }, [isSupported, legacy, copiedDuring]);
  const read = react.useCallback(async () => {
    if (!isSupported) {
      console.warn("Clipboard API not supported");
      return;
    }
    try {
      let clipboardText = "";
      if (source === "clipboard") {
        clipboardText = await navigator.clipboard.readText();
      } else if (source === "selection") {
        const selection = window.getSelection();
        clipboardText = selection ? selection.toString() : "";
      }
      setText(clipboardText);
    } catch (error) {
      console.error("Failed to read clipboard:", error);
      throw error;
    }
  }, [isSupported, source]);
  return {
    text,
    isSupported,
    copied,
    copy,
    read
  };
}
function copyTextLegacy(text) {
  return new Promise((resolve, reject) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.left = "-999999px";
    textarea.style.top = "-999999px";
    document.body.appendChild(textarea);
    try {
      textarea.focus();
      textarea.select();
      const successful = document.execCommand("copy");
      if (successful) {
        resolve();
      } else {
        reject(new Error("execCommand copy failed"));
      }
    } catch (error) {
      reject(error);
    } finally {
      document.body.removeChild(textarea);
    }
  });
}
function isClipboardSupported() {
  return typeof navigator !== "undefined" && "clipboard" in navigator;
}
function isClipboardReadSupported() {
  return isClipboardSupported() && "readText" in navigator.clipboard;
}
function isClipboardWriteSupported() {
  return isClipboardSupported() && "writeText" in navigator.clipboard;
}
function useFetch(url, options = {}) {
  const {
    method = "GET",
    headers,
    body,
    mode,
    credentials,
    cache,
    redirect,
    referrer,
    referrerPolicy,
    integrity,
    keepalive,
    signal,
    timeout,
    immediate = true,
    retries = 0,
    retryDelay = 1e3,
    beforeFetch,
    afterFetch,
    onFetchError
  } = options;
  const [data, setData] = react.useState(null);
  const [error, setError] = react.useState(null);
  const [isLoading, setIsLoading] = react.useState(false);
  const [isFinished, setIsFinished] = react.useState(false);
  const [aborted, setAborted] = react.useState(false);
  const [statusCode, setStatusCode] = react.useState(null);
  const [response, setResponse] = react.useState(null);
  const abortControllerRef = react.useRef(null);
  const timeoutRef = react.useRef(null);
  const canAbort = abortControllerRef.current !== null;
  const abort = react.useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setAborted(true);
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);
  const execute = react.useCallback(async (throwOnFailed = false, overrideOptions = {}) => {
    const mergedOptions = { ...options, ...overrideOptions };
    let currentUrl = url;
    let requestOptions = {
      method: mergedOptions.method || method
    };
    const finalHeaders = mergedOptions.headers || headers;
    if (finalHeaders) {
      requestOptions.headers = finalHeaders;
    }
    const finalBody = mergedOptions.body !== void 0 ? mergedOptions.body : body;
    if (finalBody !== void 0) {
      requestOptions.body = finalBody;
    }
    const finalMode = mergedOptions.mode || mode;
    if (finalMode) {
      requestOptions.mode = finalMode;
    }
    const finalCredentials = mergedOptions.credentials || credentials;
    if (finalCredentials) {
      requestOptions.credentials = finalCredentials;
    }
    const finalCache = mergedOptions.cache || cache;
    if (finalCache) {
      requestOptions.cache = finalCache;
    }
    const finalRedirect = mergedOptions.redirect || redirect;
    if (finalRedirect) {
      requestOptions.redirect = finalRedirect;
    }
    const finalReferrer = mergedOptions.referrer || referrer;
    if (finalReferrer) {
      requestOptions.referrer = finalReferrer;
    }
    const finalReferrerPolicy = mergedOptions.referrerPolicy || referrerPolicy;
    if (finalReferrerPolicy) {
      requestOptions.referrerPolicy = finalReferrerPolicy;
    }
    const finalIntegrity = mergedOptions.integrity || integrity;
    if (finalIntegrity) {
      requestOptions.integrity = finalIntegrity;
    }
    const finalKeepalive = mergedOptions.keepalive !== void 0 ? mergedOptions.keepalive : keepalive;
    if (finalKeepalive !== void 0) {
      requestOptions.keepalive = finalKeepalive;
    }
    abortControllerRef.current = new AbortController();
    requestOptions.signal = signal || abortControllerRef.current.signal;
    setIsLoading(true);
    setIsFinished(false);
    setError(null);
    setAborted(false);
    if (timeout) {
      timeoutRef.current = setTimeout(() => {
        abort();
      }, timeout);
    }
    try {
      if (beforeFetch) {
        const ctx = {
          url: currentUrl,
          options: requestOptions,
          cancel: abort
        };
        const result = await beforeFetch(ctx);
        if (result) {
          currentUrl = result.url || currentUrl;
          requestOptions = { ...requestOptions, ...result.options };
        }
      }
      let currentRetries = 0;
      let lastError;
      while (currentRetries <= retries) {
        try {
          const fetchResponse = await fetch(currentUrl, requestOptions);
          setResponse(fetchResponse);
          setStatusCode(fetchResponse.status);
          if (!fetchResponse.ok) {
            throw new Error(`HTTP Error: ${fetchResponse.status} ${fetchResponse.statusText}`);
          }
          let responseData;
          const contentType = fetchResponse.headers.get("content-type");
          if (contentType?.includes("application/json")) {
            responseData = await fetchResponse.json();
          } else if (contentType?.includes("text/")) {
            responseData = await fetchResponse.text();
          } else {
            responseData = await fetchResponse.blob();
          }
          if (afterFetch) {
            const ctx = {
              response: fetchResponse,
              data: responseData
            };
            const result = await afterFetch(ctx);
            if (result?.data !== void 0) {
              responseData = result.data;
            }
          }
          setData(responseData);
          setIsLoading(false);
          setIsFinished(true);
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
          return responseData;
        } catch (err) {
          lastError = err;
          currentRetries++;
          if (currentRetries <= retries) {
            await new Promise((resolve) => setTimeout(resolve, retryDelay));
          }
        }
      }
      throw lastError;
    } catch (err) {
      const fetchError = err;
      if (onFetchError) {
        const ctx = {
          error: fetchError,
          data: null
        };
        await onFetchError(ctx);
      }
      setError(fetchError);
      setIsLoading(false);
      setIsFinished(true);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (throwOnFailed) {
        throw fetchError;
      }
    }
  }, [url, options, method, headers, body, mode, credentials, cache, redirect, referrer, referrerPolicy, integrity, keepalive, signal, timeout, retries, retryDelay, beforeFetch, afterFetch, onFetchError, abort]);
  const json = react.useCallback(async () => {
    if (!response) throw new Error("No response available");
    return response.json();
  }, [response]);
  const text = react.useCallback(async () => {
    if (!response) throw new Error("No response available");
    return response.text();
  }, [response]);
  const blob = react.useCallback(async () => {
    if (!response) throw new Error("No response available");
    return response.blob();
  }, [response]);
  const arrayBuffer = react.useCallback(async () => {
    if (!response) throw new Error("No response available");
    return response.arrayBuffer();
  }, [response]);
  const formData = react.useCallback(async () => {
    if (!response) throw new Error("No response available");
    return response.formData();
  }, [response]);
  react.useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);
  react.useEffect(() => {
    return () => {
      abort();
    };
  }, []);
  return {
    data,
    error,
    isLoading,
    isFinished,
    canAbort,
    aborted,
    statusCode,
    response,
    execute,
    abort,
    json,
    text,
    blob,
    arrayBuffer,
    formData
  };
}
function createFetch(baseUrl = "", options = {}) {
  return function(url, fetchOptions = {}) {
    const fullUrl = url.startsWith("http") ? url : `${baseUrl}${url}`;
    const mergedOptions = { ...options, ...fetchOptions };
    return useFetch(fullUrl, mergedOptions);
  };
}
function useInterval(callback, interval = 1e3, options = {}) {
  const { immediate = true, immediateCallback = false } = options;
  const intervalRef = react.useRef(null);
  const callbackRef = react.useRef(callback);
  const isActiveRef = react.useRef(false);
  callbackRef.current = callback;
  const clear = react.useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    isActiveRef.current = false;
  }, []);
  const start = react.useCallback(() => {
    if (interval === null || interval <= 0) return;
    clear();
    if (immediateCallback) {
      callbackRef.current();
    }
    intervalRef.current = setInterval(() => {
      callbackRef.current();
    }, interval);
    isActiveRef.current = true;
  }, [interval, immediateCallback, clear]);
  const pause = react.useCallback(() => {
    clear();
  }, [clear]);
  const resume = react.useCallback(() => {
    if (interval !== null) {
      start();
    }
  }, [interval, start]);
  const restart = react.useCallback(() => {
    start();
  }, [start]);
  react.useEffect(() => {
    if (immediate && interval !== null) {
      start();
    }
    return clear;
  }, [interval, immediate, start, clear]);
  react.useEffect(() => {
    return clear;
  }, [clear]);
  return {
    isActive: isActiveRef.current,
    pause,
    resume,
    restart
  };
}
function useIntervalFn(callback, interval = 1e3) {
  return useInterval(callback, interval);
}
function useTimeout(callback, delay = 1e3, options = {}) {
  const { immediate = true, immediateCallback = false } = options;
  const [ready, setReady] = react.useState(false);
  const [isPending, setIsPending] = react.useState(false);
  const timeoutRef = react.useRef(null);
  const callbackRef = react.useRef(callback);
  callbackRef.current = callback;
  const clear = react.useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsPending(false);
  }, []);
  const start = react.useCallback(() => {
    if (delay === null || delay < 0) return;
    clear();
    setReady(false);
    setIsPending(true);
    if (immediateCallback) {
      callbackRef.current();
      setReady(true);
      setIsPending(false);
      return;
    }
    timeoutRef.current = setTimeout(() => {
      callbackRef.current();
      setReady(true);
      setIsPending(false);
      timeoutRef.current = null;
    }, delay);
  }, [delay, immediateCallback, clear]);
  const stop = react.useCallback(() => {
    clear();
    setReady(false);
  }, [clear]);
  const restart = react.useCallback(() => {
    stop();
    start();
  }, [start, stop]);
  react.useEffect(() => {
    if (immediate && delay !== null) {
      start();
    }
    return clear;
  }, [delay, immediate, start, clear]);
  react.useEffect(() => {
    return clear;
  }, [clear]);
  return {
    ready,
    isPending,
    start,
    stop,
    restart
  };
}
function useTimeoutFn(callback, delay = 1e3) {
  return useTimeout(callback, delay);
}
function useNow(options = {}) {
  const {
    interval = 1e3,
    immediate = true,
    now = () => /* @__PURE__ */ new Date()
  } = options;
  const [currentTime, setCurrentTime] = react.useState(now);
  const nowRef = react.useRef(now);
  nowRef.current = now;
  const updateTime = () => {
    setCurrentTime(nowRef.current());
  };
  useInterval(updateTime, interval, { immediate });
  return currentTime;
}
function useTimestamp(options = {}) {
  const {
    interval = 1e3,
    immediate = true,
    now = () => /* @__PURE__ */ new Date()
  } = options;
  const [timestamp, setTimestamp] = react.useState(now().getTime());
  const nowRef = react.useRef(now);
  nowRef.current = now;
  const updateTimestamp = () => {
    setTimestamp(nowRef.current().getTime());
  };
  useInterval(updateTimestamp, interval, { immediate });
  return timestamp;
}
function usePerformanceNow(options = {}) {
  const {
    interval = 16,
    // 默认 60fps
    immediate = true
  } = options;
  const [performanceTime, setPerformanceTime] = react.useState(
    typeof performance !== "undefined" ? performance.now() : Date.now()
  );
  const updatePerformanceTime = () => {
    setPerformanceTime(
      typeof performance !== "undefined" ? performance.now() : Date.now()
    );
  };
  useInterval(updatePerformanceTime, interval, { immediate });
  return performanceTime;
}
function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = react.useState(value);
  react.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);
  return debouncedValue;
}
function useDebounceFn(fn, options = {}) {
  const {
    delay = 300,
    leading = false,
    trailing = true,
    maxWait
  } = options;
  const fnRef = react.useRef(fn);
  const timerRef = react.useRef(null);
  const maxTimerRef = react.useRef(null);
  const lastCallTimeRef = react.useRef(0);
  const lastInvokeTimeRef = react.useRef(0);
  const argsRef = react.useRef();
  const resultRef = react.useRef();
  fnRef.current = fn;
  const invokeFunc = (time) => {
    const args = argsRef.current;
    argsRef.current = void 0;
    lastInvokeTimeRef.current = time;
    resultRef.current = fnRef.current(...args);
    return resultRef.current;
  };
  const leadingEdge = (time) => {
    lastInvokeTimeRef.current = time;
    timerRef.current = setTimeout(timerExpired, delay);
    return leading ? invokeFunc(time) : resultRef.current;
  };
  const remainingWait = (time) => {
    const timeSinceLastCall = time - lastCallTimeRef.current;
    const timeSinceLastInvoke = time - lastInvokeTimeRef.current;
    const timeWaiting = delay - timeSinceLastCall;
    return maxWait !== void 0 ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
  };
  const shouldInvoke = (time) => {
    const timeSinceLastCall = time - lastCallTimeRef.current;
    const timeSinceLastInvoke = time - lastInvokeTimeRef.current;
    return lastCallTimeRef.current === 0 || timeSinceLastCall >= delay || timeSinceLastCall < 0 || maxWait !== void 0 && timeSinceLastInvoke >= maxWait;
  };
  const timerExpired = () => {
    const time = Date.now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    timerRef.current = setTimeout(timerExpired, remainingWait(time));
    return resultRef.current;
  };
  const trailingEdge = (time) => {
    timerRef.current = null;
    if (trailing && argsRef.current) {
      return invokeFunc(time);
    }
    argsRef.current = void 0;
    return resultRef.current;
  };
  const cancel = () => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (maxTimerRef.current !== null) {
      clearTimeout(maxTimerRef.current);
      maxTimerRef.current = null;
    }
    lastInvokeTimeRef.current = 0;
    lastCallTimeRef.current = 0;
    argsRef.current = void 0;
  };
  const flush = () => {
    return timerRef.current === null ? resultRef.current : trailingEdge(Date.now());
  };
  const debounced = (...args) => {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);
    lastCallTimeRef.current = time;
    argsRef.current = args;
    if (isInvoking) {
      if (timerRef.current === null) {
        return leadingEdge(lastCallTimeRef.current);
      }
      if (maxWait !== void 0) {
        timerRef.current = setTimeout(timerExpired, delay);
        return invokeFunc(lastCallTimeRef.current);
      }
    }
    if (timerRef.current === null) {
      timerRef.current = setTimeout(timerExpired, delay);
    }
    return resultRef.current;
  };
  react.useEffect(() => {
    return () => {
      cancel();
    };
  }, []);
  return {
    run: debounced,
    cancel,
    flush
  };
}
function useThrottle(value, delay = 300) {
  const [throttledValue, setThrottledValue] = react.useState(value);
  const lastExecuted = react.useRef(0);
  const timeoutRef = react.useRef(null);
  react.useEffect(() => {
    const now = Date.now();
    const timeSinceLastExecution = now - lastExecuted.current;
    if (timeSinceLastExecution >= delay) {
      setThrottledValue(value);
      lastExecuted.current = now;
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setThrottledValue(value);
        lastExecuted.current = Date.now();
      }, delay - timeSinceLastExecution);
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay]);
  return throttledValue;
}
function useThrottleFn(fn, options = {}) {
  const {
    delay = 300,
    leading = true,
    trailing = true
  } = options;
  const fnRef = react.useRef(fn);
  const timerRef = react.useRef(null);
  const lastCallTimeRef = react.useRef(0);
  const lastInvokeTimeRef = react.useRef(0);
  const argsRef = react.useRef();
  const resultRef = react.useRef();
  fnRef.current = fn;
  const invokeFunc = (time) => {
    const args = argsRef.current;
    argsRef.current = void 0;
    lastInvokeTimeRef.current = time;
    resultRef.current = fnRef.current(...args);
    return resultRef.current;
  };
  const leadingEdge = (time) => {
    lastInvokeTimeRef.current = time;
    timerRef.current = setTimeout(timerExpired, delay);
    return leading ? invokeFunc(time) : resultRef.current;
  };
  const remainingWait = (time) => {
    const timeSinceLastInvoke = time - lastInvokeTimeRef.current;
    const timeWaiting = delay - timeSinceLastInvoke;
    return timeWaiting;
  };
  const shouldInvoke = (time) => {
    const timeSinceLastCall = time - lastCallTimeRef.current;
    const timeSinceLastInvoke = time - lastInvokeTimeRef.current;
    return lastCallTimeRef.current === 0 || timeSinceLastInvoke >= delay || timeSinceLastCall < 0;
  };
  const timerExpired = () => {
    const time = Date.now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    timerRef.current = setTimeout(timerExpired, remainingWait(time));
    return resultRef.current;
  };
  const trailingEdge = (time) => {
    timerRef.current = null;
    if (trailing && argsRef.current) {
      return invokeFunc(time);
    }
    argsRef.current = void 0;
    return resultRef.current;
  };
  const cancel = () => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    lastInvokeTimeRef.current = 0;
    lastCallTimeRef.current = 0;
    argsRef.current = void 0;
  };
  const flush = () => {
    return timerRef.current === null ? resultRef.current : trailingEdge(Date.now());
  };
  const throttled = (...args) => {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);
    lastCallTimeRef.current = time;
    argsRef.current = args;
    if (isInvoking) {
      if (timerRef.current === null) {
        return leadingEdge(lastCallTimeRef.current);
      }
    }
    if (timerRef.current === null) {
      timerRef.current = setTimeout(timerExpired, delay);
    }
    return resultRef.current;
  };
  react.useEffect(() => {
    return () => {
      cancel();
    };
  }, []);
  return {
    run: throttled,
    cancel,
    flush
  };
}

exports.createFetch = createFetch;
exports.createGlobalState = createGlobalState;
exports.destroyGlobalState = destroyGlobalState;
exports.getGlobalState = getGlobalState;
exports.getSystemColorMode = getSystemColorMode;
exports.getSystemDark = getSystemDark;
exports.isClipboardReadSupported = isClipboardReadSupported;
exports.isClipboardSupported = isClipboardSupported;
exports.isClipboardWriteSupported = isClipboardWriteSupported;
exports.resetGlobalState = resetGlobalState;
exports.setGlobalState = setGlobalState;
exports.toggleColorMode = toggleColorMode;
exports.useClickOutside = useClickOutside;
exports.useClickOutsideMultiple = useClickOutsideMultiple;
exports.useClipboard = useClipboard;
exports.useColorMode = useColorMode;
exports.useCounter = useCounter;
exports.useDark = useDark;
exports.useDebounce = useDebounce;
exports.useDebounceFn = useDebounceFn;
exports.useEventListener = useEventListener;
exports.useEventListeners = useEventListeners;
exports.useFetch = useFetch;
exports.useInterval = useInterval;
exports.useIntervalFn = useIntervalFn;
exports.useLocalStorage = useLocalStorage;
exports.useLocalStorageBoolean = useLocalStorageBoolean;
exports.useLocalStorageNumber = useLocalStorageNumber;
exports.useLocalStorageObject = useLocalStorageObject;
exports.useLocalStorageString = useLocalStorageString;
exports.useMouse = useMouse;
exports.useMouseInElement = useMouseInElement;
exports.useNow = useNow;
exports.usePerformanceNow = usePerformanceNow;
exports.useSessionStorage = useSessionStorage;
exports.useSessionStorageBoolean = useSessionStorageBoolean;
exports.useSessionStorageNumber = useSessionStorageNumber;
exports.useSessionStorageObject = useSessionStorageObject;
exports.useSessionStorageString = useSessionStorageString;
exports.useThrottle = useThrottle;
exports.useThrottleFn = useThrottleFn;
exports.useTimeout = useTimeout;
exports.useTimeoutFn = useTimeoutFn;
exports.useTimestamp = useTimestamp;
exports.useToggle = useToggle;
exports.useToggleValues = useToggleValues;
exports.useWindowSize = useWindowSize;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map