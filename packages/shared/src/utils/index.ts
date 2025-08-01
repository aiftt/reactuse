import type { MaybeRefOrGetter, ElementTarget } from '../types';

// 判断是否为浏览器环境
export const isClient = typeof window !== 'undefined';

// 判断是否为开发环境
export const isDev = (() => {
  try {
    return typeof process !== 'undefined' && process.env?.NODE_ENV === 'development';
  } catch {
    return false;
  }
})();

// 空函数
export const noop = () => {};

// 获取值的工具函数
export function toValue<T>(val: MaybeRefOrGetter<T>): T {
  return typeof val === 'function'
    ? (val as any)()
    : val && typeof val === 'object' && 'current' in val
    ? val.current
    : val;
}

// 获取元素的工具函数
export function unrefElement<T extends Element>(
  elRef: ElementTarget
): T | undefined {
  const plain = toValue(elRef);
  return (plain as T) || undefined;
}

// 类型守卫
export function isRef<T>(val: any): val is { current: T } {
  return val && typeof val === 'object' && 'current' in val;
}

export function isFunction(val: any): val is Function {
  return typeof val === 'function';
}

export function isString(val: any): val is string {
  return typeof val === 'string';
}

export function isNumber(val: any): val is number {
  return typeof val === 'number';
}

export function isBoolean(val: any): val is boolean {
  return typeof val === 'boolean';
}

export function isObject(val: any): val is Record<string, any> {
  return val !== null && typeof val === 'object';
}

export function isArray(val: any): val is any[] {
  return Array.isArray(val);
}

export function isDefined<T>(val: T | undefined | null): val is T {
  return val !== undefined && val !== null;
}

// 深度克隆
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as T;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as T;
  if (typeof obj === 'object') {
    const clonedObj = {} as T;
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  return obj;
}

// 防抖函数
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): T & { cancel: () => void } {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  
  const debounced = ((...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  }) as T & { cancel: () => void };
  
  debounced.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };
  
  return debounced;
}

// 节流函数
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): T & { cancel: () => void } {
  let lastCall = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  
  const throttled = ((...args: Parameters<T>) => {
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
  }) as T & { cancel: () => void };
  
  throttled.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };
  
  return throttled;
}

// 生成唯一 ID
export function generateId(prefix = 'id'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

// 获取对象的类型字符串
export function getType(obj: any): string {
  return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
}

// 合并对象
export function merge<T extends Record<string, any>>(
  target: T,
  ...sources: Partial<T>[]
): T {
  if (!sources.length) return target;
  const source = sources.shift();
  
  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        merge(target[key], source[key] as any);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }
  
  return merge(target, ...sources);
}

// 获取嵌套对象的值
export function get(obj: any, path: string, defaultValue?: any): any {
  const keys = path.split('.');
  let result = obj;
  
  for (const key of keys) {
    if (result == null || typeof result !== 'object') {
      return defaultValue;
    }
    result = result[key];
  }
  
  return result !== undefined ? result : defaultValue;
}

// 设置嵌套对象的值
export function set(obj: any, path: string, value: any): void {
  const keys = path.split('.');
  let current = obj;
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]!;
    if (!(key in current) || !isObject(current[key])) {
      current[key] = {};
    }
    current = current[key];
  }
  
  const lastKey = keys[keys.length - 1]!;
  current[lastKey] = value;
}

// 数组去重
export function unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

// 数组分块
export function chunk<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

// 延迟执行
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 重试函数
export async function retry<T>(
  fn: () => Promise<T>,
  times: number = 3,
  delay: number = 1000
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (times <= 1) throw error;
    await sleep(delay);
    return retry(fn, times - 1, delay);
  }
}

// 格式化字节大小
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// 创建事件发射器
export function createEventEmitter<T extends Record<string, any[]>>() {
  const listeners: { [K in keyof T]?: Array<(...args: T[K]) => void> } = {};
  
  return {
    on<K extends keyof T>(event: K, listener: (...args: T[K]) => void) {
      if (!listeners[event]) listeners[event] = [];
      listeners[event]!.push(listener);
      
      return () => {
        const index = listeners[event]!.indexOf(listener);
        if (index > -1) listeners[event]!.splice(index, 1);
      };
    },
    
    emit<K extends keyof T>(event: K, ...args: T[K]) {
      if (listeners[event]) {
        listeners[event]!.forEach(listener => listener(...args));
      }
    },
    
    off<K extends keyof T>(event: K, listener?: (...args: T[K]) => void) {
      if (!listeners[event]) return;
      
      if (listener) {
        const index = listeners[event]!.indexOf(listener);
        if (index > -1) listeners[event]!.splice(index, 1);
      } else {
        listeners[event] = [];
      }
    },
    
    clear() {
      Object.keys(listeners).forEach(key => {
        listeners[key as keyof T] = [];
      });
    },
  };
}