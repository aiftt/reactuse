import { useState, useRef } from 'react';
import { useInterval } from './useInterval';

export interface UseNowOptions {
  /** 更新间隔（毫秒），默认为 1000 */
  interval?: number;
  /** 是否立即开始更新，默认为 true */
  immediate?: boolean;
  /** 自定义时间获取函数，默认为 () => new Date() */
  now?: () => Date;
}

/**
 * 响应式当前时间 hook
 * 
 * @param options - 配置选项
 * @returns 当前时间的 Date 对象
 */
export function useNow(options: UseNowOptions = {}): Date {
  const {
    interval = 1000,
    immediate = true,
    now = () => new Date()
  } = options;
  
  const [currentTime, setCurrentTime] = useState<Date>(now);
  const nowRef = useRef(now);
  
  // 更新时间获取函数引用
  nowRef.current = now;
  
  const updateTime = () => {
    setCurrentTime(nowRef.current());
  };
  
  // 使用 useInterval 定期更新时间
  useInterval(updateTime, interval, { immediate });
  
  return currentTime;
}

/**
 * 响应式当前时间戳 hook
 * 
 * @param options - 配置选项
 * @returns 当前时间戳（毫秒）
 */
export function useTimestamp(options: UseNowOptions = {}): number {
  const {
    interval = 1000,
    immediate = true,
    now = () => new Date()
  } = options;
  
  const [timestamp, setTimestamp] = useState<number>(now().getTime());
  const nowRef = useRef(now);
  
  // 更新时间获取函数引用
  nowRef.current = now;
  
  const updateTimestamp = () => {
    setTimestamp(nowRef.current().getTime());
  };
  
  // 使用 useInterval 定期更新时间戳
  useInterval(updateTimestamp, interval, { immediate });
  
  return timestamp;
}

/**
 * 高精度时间戳 hook（使用 performance.now()）
 * 
 * @param options - 配置选项
 * @returns 高精度时间戳
 */
export function usePerformanceNow(options: Omit<UseNowOptions, 'now'> = {}): number {
  const {
    interval = 16, // 默认 60fps
    immediate = true
  } = options;
  
  const [performanceTime, setPerformanceTime] = useState<number>(
    typeof performance !== 'undefined' ? performance.now() : Date.now()
  );
  
  const updatePerformanceTime = () => {
    setPerformanceTime(
      typeof performance !== 'undefined' ? performance.now() : Date.now()
    );
  };
  
  // 使用 useInterval 定期更新高精度时间戳
  useInterval(updatePerformanceTime, interval, { immediate });
  
  return performanceTime;
}