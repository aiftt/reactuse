import { useState, useEffect, useRef } from 'react';
import { isClient } from '@reactuse/shared';
import type { Position } from '@reactuse/shared';

export interface UseMouseOptions {
  /**
   * 鼠标位置的初始值
   * @default { x: 0, y: 0 }
   */
  initialValue?: Position;
  /**
   * 监听目标元素，默认为 window
   * @default window
   */
  target?: Element | Window | null;
  /**
   * 监听 touch 事件
   * @default true
   */
  touch?: boolean;
  /**
   * 重置鼠标位置到初始值当鼠标离开目标元素
   * @default false
   */
  resetOnTouchEnds?: boolean;
  /**
   * 初始值的鼠标位置类型
   * @default 'page'
   */
  type?: 'page' | 'client' | 'screen';
}

export interface UseMouseReturn {
  /** 鼠标 X 坐标 */
  x: number;
  /** 鼠标 Y 坐标 */
  y: number;
  /** 源事件 */
  sourceType: 'mouse' | 'touch' | null;
}

/**
 * 响应式鼠标位置
 * 
 * @param options - 配置选项
 * @returns 鼠标位置信息
 */
export function useMouse(options: UseMouseOptions = {}): UseMouseReturn {
  const {
    initialValue = { x: 0, y: 0 },
    target,
    touch = true,
    resetOnTouchEnds = false,
    type = 'page',
  } = options;

  const [position, setPosition] = useState<Position>(initialValue);
  const [sourceType, setSourceType] = useState<'mouse' | 'touch' | null>(null);
  const targetRef = useRef<Element | Window | null>(target || (isClient ? window : null));

  useEffect(() => {
    if (!isClient) return;

    const element = targetRef.current || window;

    const getPosition = (event: MouseEvent | TouchEvent): Position => {
      if ('touches' in event) {
        const touch = event.touches[0];
        if (!touch) return initialValue;
        
        switch (type) {
          case 'screen':
            return { x: touch.screenX, y: touch.screenY };
          case 'client':
            return { x: touch.clientX, y: touch.clientY };
          case 'page':
          default:
            return { x: touch.pageX, y: touch.pageY };
        }
      } else {
        switch (type) {
          case 'screen':
            return { x: event.screenX, y: event.screenY };
          case 'client':
            return { x: event.clientX, y: event.clientY };
          case 'page':
          default:
            return { x: event.pageX, y: event.pageY };
        }
      }
    };

    const handleMouseMove = (event: Event) => {
      setPosition(getPosition(event as MouseEvent));
      setSourceType('mouse');
    };

    const handleTouchMove = (event: Event) => {
      const touchEvent = event as TouchEvent;
      if (touchEvent.touches.length > 0) {
        setPosition(getPosition(touchEvent));
        setSourceType('touch');
      }
    };

    const handleTouchEnd = () => {
      if (resetOnTouchEnds) {
        setPosition(initialValue);
        setSourceType(null);
      }
    };

    // 添加鼠标事件监听
    element.addEventListener('mousemove', handleMouseMove as EventListener, { passive: true });
    
    // 添加触摸事件监听
    if (touch) {
      element.addEventListener('touchmove', handleTouchMove as EventListener, { passive: true });
      if (resetOnTouchEnds) {
        element.addEventListener('touchend', handleTouchEnd, { passive: true });
      }
    }

    return () => {
      element.removeEventListener('mousemove', handleMouseMove as EventListener);
      if (touch) {
        element.removeEventListener('touchmove', handleTouchMove as EventListener);
        if (resetOnTouchEnds) {
          element.removeEventListener('touchend', handleTouchEnd);
        }
      }
    };
  }, [initialValue, touch, resetOnTouchEnds, type]);

  // 更新 target ref
  useEffect(() => {
    targetRef.current = target || (isClient ? window : null);
  }, [target]);

  return {
    x: position.x,
    y: position.y,
    sourceType,
  };
}

/**
 * 响应式鼠标在元素内的位置
 * 
 * @param target - 目标元素
 * @param options - 配置选项
 * @returns 鼠标在元素内的位置信息
 */
export function useMouseInElement(
  target: Element | null,
  options: Omit<UseMouseOptions, 'target'> = {}
): UseMouseReturn & {
  /** 鼠标相对于元素的 X 坐标 */
  elementX: number;
  /** 鼠标相对于元素的 Y 坐标 */
  elementY: number;
  /** 鼠标相对于元素的 X 坐标（百分比） */
  elementPositionX: number;
  /** 鼠标相对于元素的 Y 坐标（百分比） */
  elementPositionY: number;
  /** 鼠标是否在元素内 */
  isOutside: boolean;
} {
  const mouse = useMouse({ ...options, target: target || null });
  const [elementPosition, setElementPosition] = useState({
    elementX: 0,
    elementY: 0,
    elementPositionX: 0,
    elementPositionY: 0,
    isOutside: true,
  });

  useEffect(() => {
    if (!target || !isClient) return;

    const updateElementPosition = () => {
      const rect = target.getBoundingClientRect();
      const elementX = mouse.x - rect.left - window.pageXOffset;
      const elementY = mouse.y - rect.top - window.pageYOffset;
      const elementPositionX = elementX / rect.width;
      const elementPositionY = elementY / rect.height;
      const isOutside = elementX < 0 || elementY < 0 || elementX > rect.width || elementY > rect.height;

      setElementPosition({
        elementX,
        elementY,
        elementPositionX,
        elementPositionY,
        isOutside,
      });
    };

    updateElementPosition();
  }, [mouse.x, mouse.y, target]);

  return {
    ...mouse,
    ...elementPosition,
  };
}