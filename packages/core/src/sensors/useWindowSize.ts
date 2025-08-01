import { useState, useEffect } from 'react';
import { isClient } from '@reactuse/shared';
import type { Size } from '@reactuse/shared';

export interface UseWindowSizeOptions {
  /**
   * 窗口大小的初始值
   * @default { width: Infinity, height: Infinity }
   */
  initialWidth?: number;
  initialHeight?: number;
  /**
   * 监听 orientationchange 事件
   * @default true
   */
  listenOrientation?: boolean;
  /**
   * 是否包含滚动条
   * @default true
   */
  includeScrollbar?: boolean;
}

export interface UseWindowSizeReturn {
  /** 窗口宽度 */
  width: number;
  /** 窗口高度 */
  height: number;
}

/**
 * 响应式窗口大小
 * 
 * @param options - 配置选项
 * @returns 窗口大小信息
 */
export function useWindowSize(options: UseWindowSizeOptions = {}): UseWindowSizeReturn {
  const {
    initialWidth = Infinity,
    initialHeight = Infinity,
    listenOrientation = true,
    includeScrollbar = true,
  } = options;

  const [windowSize, setWindowSize] = useState<Size>(() => {
    if (!isClient) {
      return { width: initialWidth, height: initialHeight };
    }
    
    return {
      width: includeScrollbar ? window.innerWidth : document.documentElement.clientWidth,
      height: includeScrollbar ? window.innerHeight : document.documentElement.clientHeight,
    };
  });

  useEffect(() => {
    if (!isClient) return;

    const updateSize = () => {
      setWindowSize({
        width: includeScrollbar ? window.innerWidth : document.documentElement.clientWidth,
        height: includeScrollbar ? window.innerHeight : document.documentElement.clientHeight,
      });
    };

    // 监听窗口大小变化
    window.addEventListener('resize', updateSize, { passive: true });
    
    // 监听设备方向变化
    if (listenOrientation) {
      window.addEventListener('orientationchange', updateSize, { passive: true });
    }

    // 初始化时更新一次
    updateSize();

    return () => {
      window.removeEventListener('resize', updateSize);
      if (listenOrientation) {
        window.removeEventListener('orientationchange', updateSize);
      }
    };
  }, [includeScrollbar, listenOrientation]);

  return windowSize;
}