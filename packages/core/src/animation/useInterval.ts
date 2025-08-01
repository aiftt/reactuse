import { useEffect, useRef, useCallback } from 'react';

export interface UseIntervalOptions {
  /** 是否立即开始，默认为 true */
  immediate?: boolean;
  /** 是否在组件卸载时自动清理，默认为 true */
  immediateCallback?: boolean;
}

export interface UseIntervalReturn {
  /** 是否正在运行 */
  isActive: boolean;
  /** 暂停定时器 */
  pause: () => void;
  /** 恢复定时器 */
  resume: () => void;
  /** 重新开始定时器 */
  restart: () => void;
}

/**
 * 响应式定时器 hook
 * 
 * @param callback - 定时执行的回调函数
 * @param interval - 间隔时间（毫秒），null 表示暂停
 * @param options - 配置选项
 * @returns 定时器控制对象
 */
export function useInterval(
  callback: () => void,
  interval: number | null = 1000,
  options: UseIntervalOptions = {}
): UseIntervalReturn {
  const { immediate = true, immediateCallback = false } = options;
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const callbackRef = useRef(callback);
  const isActiveRef = useRef(false);

  // 更新回调函数引用
  callbackRef.current = callback;

  const clear = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    isActiveRef.current = false;
  }, []);

  const start = useCallback(() => {
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

  const pause = useCallback(() => {
    clear();
  }, [clear]);

  const resume = useCallback(() => {
    if (interval !== null) {
      start();
    }
  }, [interval, start]);

  const restart = useCallback(() => {
    start();
  }, [start]);

  // 当 interval 变化时重新启动定时器
  useEffect(() => {
    if (immediate && interval !== null) {
      start();
    }
    return clear;
  }, [interval, immediate, start, clear]);

  // 组件卸载时清理定时器
  useEffect(() => {
    return clear;
  }, [clear]);

  return {
    isActive: isActiveRef.current,
    pause,
    resume,
    restart
  };
}

/**
 * 简化版本的 useInterval，只接受回调和间隔时间
 * 
 * @param callback - 定时执行的回调函数
 * @param interval - 间隔时间（毫秒），null 表示暂停
 */
export function useIntervalFn(
  callback: () => void,
  interval: number | null = 1000
): UseIntervalReturn {
  return useInterval(callback, interval);
}