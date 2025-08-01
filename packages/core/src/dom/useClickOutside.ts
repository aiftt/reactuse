import { useRef, useCallback } from 'react';
import { useEventListener } from './useEventListener';
import type { ElementTarget } from '@reactuse/shared';

export interface UseClickOutsideOptions {
  /**
   * 监听的事件类型
   * @default ['mousedown', 'touchstart']
   */
  events?: string[];
  /**
   * 检测点击是否在目标元素外部的自定义函数
   */
  detect?: (event: Event, target: Element) => boolean;
  /**
   * 忽略的元素列表
   */
  ignore?: (ElementTarget | string)[];
}

/**
 * 监听元素外部的点击
 * 
 * @param target - 目标元素
 * @param handler - 点击外部时的回调函数
 * @param options - 配置选项
 */
export function useClickOutside(
  target: ElementTarget,
  handler: (event: Event) => void,
  options: UseClickOutsideOptions = {}
): void {
  const {
    events = ['mousedown', 'touchstart'],
    detect = defaultDetect,
    ignore = [],
  } = options;

  const handlerRef = useRef(handler);
  const targetRef = useRef(target);
  const ignoreRef = useRef(ignore);

  // 更新 refs
  handlerRef.current = handler;
  targetRef.current = target;
  ignoreRef.current = ignore;

  const listener = useCallback((event: Event) => {
    const targetElement = getTargetElement(targetRef.current);
    if (!targetElement) return;

    // 检查是否点击在目标元素内部
    if (!detect(event, targetElement)) return;

    // 检查是否点击在忽略的元素内部
    const ignoreElements = ignoreRef.current
      .map(item => getTargetElement(item))
      .filter(Boolean) as Element[];

    if (ignoreElements.some(element => element.contains(event.target as Node))) {
      return;
    }

    handlerRef.current(event);
  }, [detect]);

  // 监听指定的事件
  events.forEach(eventName => {
    useEventListener(eventName, listener, document, { passive: true });
  });
}

/**
 * 默认的检测函数
 */
function defaultDetect(event: Event, target: Element): boolean {
  return !target.contains(event.target as Node);
}

/**
 * 获取目标元素
 */
function getTargetElement(target: ElementTarget | string): Element | null {
  if (typeof target === 'string') {
    return document.querySelector(target);
  }
  
  if (target && 'current' in target) {
    return target.current as Element | null;
  }
  
  if (target instanceof Element) {
    return target;
  }
  
  return null;
}

/**
 * 监听多个元素外部的点击
 * 
 * @param targets - 目标元素数组
 * @param handler - 点击外部时的回调函数
 * @param options - 配置选项
 */
export function useClickOutsideMultiple(
  targets: ElementTarget[],
  handler: (event: Event) => void,
  options: UseClickOutsideOptions = {}
): void {
  const {
    events = ['mousedown', 'touchstart'],
    detect = defaultDetect,
    ignore = [],
  } = options;

  const handlerRef = useRef(handler);
  const targetsRef = useRef(targets);
  const ignoreRef = useRef(ignore);

  // 更新 refs
  handlerRef.current = handler;
  targetsRef.current = targets;
  ignoreRef.current = ignore;

  const listener = useCallback((event: Event) => {
    const targetElements = targetsRef.current
      .map(target => getTargetElement(target))
      .filter(Boolean) as Element[];

    if (targetElements.length === 0) return;

    // 检查是否点击在任何目标元素内部
    const isInsideAnyTarget = targetElements.some(element => {
      return !detect(event, element);
    });

    if (isInsideAnyTarget) return;

    // 检查是否点击在忽略的元素内部
    const ignoreElements = ignoreRef.current
      .map(item => getTargetElement(item))
      .filter(Boolean) as Element[];

    if (ignoreElements.some(element => element.contains(event.target as Node))) {
      return;
    }

    handlerRef.current(event);
  }, [detect]);

  // 监听指定的事件
  events.forEach(eventName => {
    useEventListener(eventName, listener, document, { passive: true });
  });
}