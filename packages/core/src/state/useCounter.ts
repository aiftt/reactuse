import { useState, useCallback } from 'react';

export interface UseCounterOptions {
  /** 最小值 */
  min?: number;
  /** 最大值 */
  max?: number;
  /** 步长，默认为 1 */
  step?: number;
}

export interface UseCounterReturn {
  /** 当前计数值 */
  count: number;
  /** 增加计数 */
  inc: (delta?: number) => void;
  /** 减少计数 */
  dec: (delta?: number) => void;
  /** 设置计数值 */
  set: (value: number | ((prev: number) => number)) => void;
  /** 重置到初始值 */
  reset: () => void;
  /** 设置到最小值 */
  setMin: () => void;
  /** 设置到最大值 */
  setMax: () => void;
}

/**
 * 响应式计数器 hook
 * 
 * @param initialValue - 初始值，默认为 0
 * @param options - 配置选项
 * @returns 包含计数值和操作方法的对象
 */
export function useCounter(
  initialValue: number = 0,
  options: UseCounterOptions = {}
): UseCounterReturn {
  const { min, max, step = 1 } = options;
  
  // 确保初始值在范围内
  const getValidValue = useCallback((value: number): number => {
    let validValue = value;
    if (min !== undefined && validValue < min) validValue = min;
    if (max !== undefined && validValue > max) validValue = max;
    return validValue;
  }, [min, max]);

  const [count, setCount] = useState<number>(() => getValidValue(initialValue));

  const set = useCallback((value: number | ((prev: number) => number)) => {
    setCount(prev => {
      const newValue = typeof value === 'function' ? value(prev) : value;
      return getValidValue(newValue);
    });
  }, [getValidValue]);

  const inc = useCallback((delta: number = step) => {
    set(prev => prev + delta);
  }, [set, step]);

  const dec = useCallback((delta: number = step) => {
    set(prev => prev - delta);
  }, [set, step]);

  const reset = useCallback(() => {
    set(initialValue);
  }, [set, initialValue]);

  const setMin = useCallback(() => {
    if (min !== undefined) {
      set(min);
    }
  }, [set, min]);

  const setMax = useCallback(() => {
    if (max !== undefined) {
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
    setMax,
  };
}