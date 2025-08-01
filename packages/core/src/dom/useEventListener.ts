import { useEffect, useRef } from 'react';
import { isClient } from '@reactuse/shared';

export interface UseEventListenerOptions {
  /**
   * 事件监听器选项
   */
  capture?: boolean;
  once?: boolean;
  passive?: boolean;
  signal?: AbortSignal;
}

/**
 * 轻松使用 EventListener
 * 
 * @param event - 事件名称
 * @param listener - 事件监听器
 * @param target - 目标元素，默认为 window
 * @param options - 事件监听器选项
 */
export function useEventListener<K extends keyof WindowEventMap>(
  event: K,
  listener: (this: Window, ev: WindowEventMap[K]) => any,
  target?: Window | null,
  options?: UseEventListenerOptions
): void;

export function useEventListener<K extends keyof DocumentEventMap>(
  event: K,
  listener: (this: Document, ev: DocumentEventMap[K]) => any,
  target: Document,
  options?: UseEventListenerOptions
): void;

export function useEventListener<K extends keyof HTMLElementEventMap>(
  event: K,
  listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
  target: HTMLElement | null,
  options?: UseEventListenerOptions
): void;

export function useEventListener(
  event: string,
  listener: EventListener,
  target: EventTarget | null | undefined,
  options?: UseEventListenerOptions
): void;

export function useEventListener(
  event: string,
  listener: EventListener,
  target: EventTarget | null | undefined = isClient ? window : null,
  options: UseEventListenerOptions = {}
): void {
  const listenerRef = useRef(listener);
  const targetRef = useRef(target);
  const optionsRef = useRef(options);

  // 更新 refs
  listenerRef.current = listener;
  targetRef.current = target;
  optionsRef.current = options;

  useEffect(() => {
    if (!isClient) return;
    
    const element = targetRef.current;
    if (!element) return;

    const eventListener: EventListener = (event) => {
      listenerRef.current(event);
    };

    const eventOptions: AddEventListenerOptions = {};
    if (optionsRef.current.capture !== undefined) eventOptions.capture = optionsRef.current.capture;
    if (optionsRef.current.once !== undefined) eventOptions.once = optionsRef.current.once;
    if (optionsRef.current.passive !== undefined) eventOptions.passive = optionsRef.current.passive;
    if (optionsRef.current.signal !== undefined) eventOptions.signal = optionsRef.current.signal;

    element.addEventListener(event, eventListener, eventOptions);

    return () => {
      element.removeEventListener(event, eventListener, eventOptions);
    };
  }, [event]);
}

/**
 * 监听多个事件
 * 
 * @param events - 事件名称数组
 * @param listener - 事件监听器
 * @param target - 目标元素
 * @param options - 事件监听器选项
 */
export function useEventListeners(
  events: string[],
  listener: EventListener,
  target: EventTarget | null | undefined = isClient ? window : null,
  options: UseEventListenerOptions = {}
): void {
  const listenerRef = useRef(listener);
  const targetRef = useRef(target);
  const optionsRef = useRef(options);

  // 更新 refs
  listenerRef.current = listener;
  targetRef.current = target;
  optionsRef.current = options;

  useEffect(() => {
    if (!isClient) return;
    
    const element = targetRef.current;
    if (!element) return;

    const eventListener: EventListener = (event) => {
      listenerRef.current(event);
    };

    const eventOptions: AddEventListenerOptions = {};
    if (optionsRef.current.capture !== undefined) eventOptions.capture = optionsRef.current.capture;
    if (optionsRef.current.once !== undefined) eventOptions.once = optionsRef.current.once;
    if (optionsRef.current.passive !== undefined) eventOptions.passive = optionsRef.current.passive;
    if (optionsRef.current.signal !== undefined) eventOptions.signal = optionsRef.current.signal;

    events.forEach(event => {
      element.addEventListener(event, eventListener, eventOptions);
    });

    return () => {
      events.forEach(event => {
        element.removeEventListener(event, eventListener, eventOptions);
      });
    };
  }, [events]);
}