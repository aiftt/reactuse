import { useState, useCallback } from 'react';

export interface UseToggleReturn {
  /** 当前状态值 */
  value: boolean;
  /** 切换状态 */
  toggle: () => void;
  /** 设置为 true */
  setTrue: () => void;
  /** 设置为 false */
  setFalse: () => void;
  /** 设置状态值 */
  setValue: (value: boolean | ((prev: boolean) => boolean)) => void;
}

/**
 * 响应式布尔值切换 hook
 * 
 * @param initialValue - 初始值，默认为 false
 * @returns 包含状态值和操作方法的对象
 */
export function useToggle(initialValue: boolean = false): UseToggleReturn {
  const [value, setValue] = useState<boolean>(initialValue);

  const toggle = useCallback(() => {
    setValue(prev => !prev);
  }, []);

  const setTrue = useCallback(() => {
    setValue(true);
  }, []);

  const setFalse = useCallback(() => {
    setValue(false);
  }, []);

  const setValueCallback = useCallback((newValue: boolean | ((prev: boolean) => boolean)) => {
    setValue(newValue);
  }, []);

  return {
    value,
    toggle,
    setTrue,
    setFalse,
    setValue: setValueCallback,
  };
}

/**
 * 带有多个值的切换 hook
 * 
 * @param values - 可切换的值数组
 * @param initialIndex - 初始索引，默认为 0
 * @returns 包含当前值、索引和切换方法的对象
 */
export function useToggleValues<T>(
  values: readonly T[],
  initialIndex: number = 0
): {
  value: T;
  index: number;
  next: () => void;
  prev: () => void;
  set: (index: number) => void;
  setValue: (value: T) => void;
} {
  const [index, setIndex] = useState<number>(
    Math.max(0, Math.min(initialIndex, values.length - 1))
  );

  const next = useCallback(() => {
    setIndex(prev => (prev + 1) % values.length);
  }, [values.length]);

  const prev = useCallback(() => {
    setIndex(prev => (prev - 1 + values.length) % values.length);
  }, [values.length]);

  const set = useCallback((newIndex: number) => {
    if (newIndex >= 0 && newIndex < values.length) {
      setIndex(newIndex);
    }
  }, [values.length]);

  const setValue = useCallback((value: T) => {
    const newIndex = values.indexOf(value);
    if (newIndex !== -1) {
      setIndex(newIndex);
    }
  }, [values]);

  return {
    value: values[index]!,
    index,
    next,
    prev,
    set,
    setValue,
  };
}