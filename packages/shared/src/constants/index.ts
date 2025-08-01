// 默认配置常量
export const DEFAULT_WINDOW = typeof window !== 'undefined' ? window : undefined;
export const DEFAULT_DOCUMENT = typeof document !== 'undefined' ? document : undefined;
export const DEFAULT_NAVIGATOR = typeof navigator !== 'undefined' ? navigator : undefined;
export const DEFAULT_LOCATION = typeof location !== 'undefined' ? location : undefined;

// 存储相关常量
export const STORAGE_KEY_PREFIX = 'reactuse:';

// 事件名称常量
export const EVENTS = {
  RESIZE: 'resize',
  SCROLL: 'scroll',
  CLICK: 'click',
  MOUSEDOWN: 'mousedown',
  MOUSEUP: 'mouseup',
  MOUSEMOVE: 'mousemove',
  KEYDOWN: 'keydown',
  KEYUP: 'keyup',
  FOCUS: 'focus',
  BLUR: 'blur',
  VISIBILITYCHANGE: 'visibilitychange',
  ONLINE: 'online',
  OFFLINE: 'offline',
  STORAGE: 'storage',
  POPSTATE: 'popstate',
  HASHCHANGE: 'hashchange',
} as const;

// 媒体查询断点
export const BREAKPOINTS = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

// 颜色模式
export const COLOR_MODES = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto',
} as const;

// 方向常量
export const DIRECTIONS = {
  LEFT: 'left',
  RIGHT: 'right',
  UP: 'up',
  DOWN: 'down',
  NONE: 'none',
} as const;

// 默认序列化器
export const DEFAULT_SERIALIZERS = {
  boolean: {
    read: (v: string) => v === 'true',
    write: (v: boolean) => String(v),
  },
  object: {
    read: (v: string) => {
      try {
        return JSON.parse(v);
      } catch {
        return null;
      }
    },
    write: (v: any) => JSON.stringify(v),
  },
  number: {
    read: (v: string) => {
      const num = Number(v);
      return Number.isNaN(num) ? null : num;
    },
    write: (v: number) => String(v),
  },
  string: {
    read: (v: string) => v,
    write: (v: string) => v,
  },
  any: {
    read: (v: string) => {
      try {
        return JSON.parse(v);
      } catch {
        return v;
      }
    },
    write: (v: any) => {
      if (typeof v === 'string') return v;
      try {
        return JSON.stringify(v);
      } catch {
        return String(v);
      }
    },
  },
} as const;

// 默认防抖延迟
export const DEFAULT_DEBOUNCE_MS = 300;

// 默认节流延迟
export const DEFAULT_THROTTLE_MS = 100;

// 默认超时时间
export const DEFAULT_TIMEOUT_MS = 5000;

// 网络类型
export const NETWORK_TYPES = {
  BLUETOOTH: 'bluetooth',
  CELLULAR: 'cellular',
  ETHERNET: 'ethernet',
  NONE: 'none',
  WIFI: 'wifi',
  WIMAX: 'wimax',
  OTHER: 'other',
  UNKNOWN: 'unknown',
} as const;

// 有效连接类型
export const EFFECTIVE_TYPES = {
  SLOW_2G: 'slow-2g',
  '2G': '2g',
  '3G': '3g',
  '4G': '4g',
} as const;