import { useState, useEffect, useRef } from 'react';

export interface UseThrottleOptions {
  /** 节流间隔时间（毫秒），默认为 300 */
  delay?: number;
  /** 是否在首次调用时立即执行，默认为 true */
  leading?: boolean;
  /** 是否在节流结束后执行最后一次调用，默认为 true */
  trailing?: boolean;
}

/**
 * 节流 hook，限制值更新的频率
 * 
 * @param value - 需要节流的值
 * @param delay - 节流间隔时间（毫秒），默认为 300
 * @returns 节流后的值
 */
export function useThrottle<T>(value: T, delay: number = 300): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastExecuted = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const now = Date.now();
    const timeSinceLastExecution = now - lastExecuted.current;

    if (timeSinceLastExecution >= delay) {
      // 如果距离上次执行已经超过延迟时间，立即更新
      setThrottledValue(value);
      lastExecuted.current = now;
    } else {
      // 否则设置定时器在剩余时间后更新
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

/**
 * 节流函数 hook，返回一个节流后的函数
 * 
 * @param fn - 需要节流的函数
 * @param options - 节流选项
 * @returns 节流后的函数和取消函数
 */
export function useThrottleFn<T extends (...args: any[]) => any>(
  fn: T,
  options: UseThrottleOptions = {}
): {
  /** 节流后的函数 */
  run: T;
  /** 取消节流 */
  cancel: () => void;
  /** 立即执行 */
  flush: () => void;
} {
  const {
    delay = 300,
    leading = true,
    trailing = true
  } = options;

  const fnRef = useRef(fn);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
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
    const timeSinceLastInvoke = time - lastInvokeTimeRef.current;
    const timeWaiting = delay - timeSinceLastInvoke;
    
    return timeWaiting;
  };

  const shouldInvoke = (time: number) => {
    const timeSinceLastCall = time - lastCallTimeRef.current;
    const timeSinceLastInvoke = time - lastInvokeTimeRef.current;

    return (
      lastCallTimeRef.current === 0 ||
      timeSinceLastInvoke >= delay ||
      timeSinceLastCall < 0
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
    lastInvokeTimeRef.current = 0;
    lastCallTimeRef.current = 0;
    argsRef.current = undefined;
  };

  const flush = () => {
    return timerRef.current === null ? resultRef.current : trailingEdge(Date.now());
  };

  const throttled = ((...args: Parameters<T>) => {
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
  }) as T;

  // 清理副作用
  useEffect(() => {
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