import { useState, useEffect, useRef, useCallback } from 'react';

export interface UseTimeoutOptions {
  /** 是否立即开始，默认为 true */
  immediate?: boolean;
  /** 是否在组件卸载时自动清理，默认为 true */
  immediateCallback?: boolean;
}

export interface UseTimeoutReturn {
  /** 是否准备就绪（超时已触发） */
  ready: boolean;
  /** 是否正在运行 */
  isPending: boolean;
  /** 开始或重新开始定时器 */
  start: () => void;
  /** 停止定时器 */
  stop: () => void;
  /** 重新开始定时器 */
  restart: () => void;
}

/**
 * 响应式超时定时器 hook
 * 
 * @param callback - 超时后执行的回调函数
 * @param delay - 延迟时间（毫秒），null 表示不启动
 * @param options - 配置选项
 * @returns 定时器控制对象
 */
export function useTimeout(
  callback: () => void,
  delay: number | null = 1000,
  options: UseTimeoutOptions = {}
): UseTimeoutReturn {
  const { immediate = true, immediateCallback = false } = options;
  
  const [ready, setReady] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const callbackRef = useRef(callback);

  // 更新回调函数引用
  callbackRef.current = callback;

  const clear = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsPending(false);
  }, []);

  const start = useCallback(() => {
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

  const stop = useCallback(() => {
    clear();
    setReady(false);
  }, [clear]);

  const restart = useCallback(() => {
    stop();
    start();
  }, [start, stop]);

  // 当 delay 变化时重新启动定时器
  useEffect(() => {
    if (immediate && delay !== null) {
      start();
    }
    return clear;
  }, [delay, immediate, start, clear]);

  // 组件卸载时清理定时器
  useEffect(() => {
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

/**
 * 简化版本的 useTimeout，只接受回调和延迟时间
 * 
 * @param callback - 超时后执行的回调函数
 * @param delay - 延迟时间（毫秒），null 表示不启动
 */
export function useTimeoutFn(
  callback: () => void,
  delay: number | null = 1000
): UseTimeoutReturn {
  return useTimeout(callback, delay);
}