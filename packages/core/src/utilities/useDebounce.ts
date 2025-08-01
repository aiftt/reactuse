import { useState, useEffect, useRef } from 'react';

export interface UseDebounceOptions {
  /** 延迟时间（毫秒），默认为 300 */
  delay?: number;
  /** 是否在首次调用时立即执行，默认为 false */
  leading?: boolean;
  /** 是否在延迟结束后执行，默认为 true */
  trailing?: boolean;
  /** 最大等待时间（毫秒），超过此时间强制执行 */
  maxWait?: number;
}

/**
 * 防抖 hook，延迟执行函数直到停止调用一段时间后
 * 
 * @param value - 需要防抖的值
 * @param delay - 延迟时间（毫秒），默认为 300
 * @returns 防抖后的值
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * 防抖函数 hook，返回一个防抖后的函数
 * 
 * @param fn - 需要防抖的函数
 * @param options - 防抖选项
 * @returns 防抖后的函数和取消函数
 */
export function useDebounceFn<T extends (...args: any[]) => any>(
  fn: T,
  options: UseDebounceOptions = {}
): {
  /** 防抖后的函数 */
  run: T;
  /** 取消防抖 */
  cancel: () => void;
  /** 立即执行 */
  flush: () => void;
} {
  const {
    delay = 300,
    leading = false,
    trailing = true,
    maxWait
  } = options;

  const fnRef = useRef(fn);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const maxTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastCallTimeRef = useRef<number>(0);
  const lastInvokeTimeRef = useRef<number>(0);
  const argsRef = useRef<Parameters<T>>();
  const resultRef = useRef<ReturnType<T>>();

  // 更新函数引用
  fnRef.current = fn;

  const invokeFunc = (time: number) => {
    const args = argsRef.current!;
    argsRef.current = undefined;
    lastInvokeTimeRef.current = time;
    resultRef.current = fnRef.current(...args);
    return resultRef.current;
  };

  const leadingEdge = (time: number) => {
    lastInvokeTimeRef.current = time;
    timerRef.current = setTimeout(timerExpired, delay);
    return leading ? invokeFunc(time) : resultRef.current;
  };

  const remainingWait = (time: number) => {
    const timeSinceLastCall = time - lastCallTimeRef.current;
    const timeSinceLastInvoke = time - lastInvokeTimeRef.current;
    const timeWaiting = delay - timeSinceLastCall;

    return maxWait !== undefined
      ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting;
  };

  const shouldInvoke = (time: number) => {
    const timeSinceLastCall = time - lastCallTimeRef.current;
    const timeSinceLastInvoke = time - lastInvokeTimeRef.current;

    return (
      lastCallTimeRef.current === 0 ||
      timeSinceLastCall >= delay ||
      timeSinceLastCall < 0 ||
      (maxWait !== undefined && timeSinceLastInvoke >= maxWait)
    );
  };

  const timerExpired = () => {
    const time = Date.now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    timerRef.current = setTimeout(timerExpired, remainingWait(time));
    return resultRef.current;
  };

  const trailingEdge = (time: number) => {
    timerRef.current = null;

    if (trailing && argsRef.current) {
      return invokeFunc(time);
    }
    argsRef.current = undefined;
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
    argsRef.current = undefined;
  };

  const flush = () => {
    return timerRef.current === null ? resultRef.current : trailingEdge(Date.now());
  };

  const debounced = ((...args: Parameters<T>) => {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    lastCallTimeRef.current = time;
    argsRef.current = args;

    if (isInvoking) {
      if (timerRef.current === null) {
        return leadingEdge(lastCallTimeRef.current);
      }
      if (maxWait !== undefined) {
        timerRef.current = setTimeout(timerExpired, delay);
        return invokeFunc(lastCallTimeRef.current);
      }
    }
    if (timerRef.current === null) {
      timerRef.current = setTimeout(timerExpired, delay);
    }
    return resultRef.current;
  }) as T;

  // 清理副作用
  useEffect(() => {
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