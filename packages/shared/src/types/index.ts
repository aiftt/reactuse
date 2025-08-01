import type { RefObject } from 'react';

// 基础类型定义
export type Fn = () => void;
export type AnyFn = (...args: any[]) => any;

// 可能的值类型
export type MaybeRef<T> = T | RefObject<T>;
export type MaybeRefOrGetter<T> = T | RefObject<T> | (() => T);

// 位置相关类型
export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Rect extends Position, Size {}

// 事件相关类型
export type EventFilter<Args extends any[] = any[], This = any> = (
  invoke: Fn,
  options: FunctionWrapperOptions<Args, This>
) => void;

export interface FunctionWrapperOptions<Args extends any[] = any[], This = any> {
  fn: (this: This, ...args: Args) => any;
  args: Args;
  thisArg: This;
}

// 配置选项类型
export interface ConfigurableWindow {
  window?: Window;
}

export interface ConfigurableDocument {
  document?: Document;
}

export interface ConfigurableDocumentOrShadowRoot {
  document?: DocumentOrShadowRoot;
}

export interface ConfigurableNavigator {
  navigator?: Navigator;
}

export interface ConfigurableLocation {
  location?: Location;
}

// 存储相关类型
export type Serializer<T> = {
  read(value: string): T;
  write(value: T): string;
};

export interface StorageOptions<T> {
  flush?: 'pre' | 'post' | 'sync';
  deep?: boolean;
  listenToStorageChanges?: boolean;
  writeDefaults?: boolean;
  mergeDefaults?: boolean | ((storageValue: T, defaults: T) => T);
  serializer?: Serializer<T>;
  onError?: (error: any) => void;
}

// 网络相关类型
export interface NetworkState {
  isOnline: boolean;
  offlineAt: Date | undefined;
  onlineAt: Date | undefined;
  downlink: number | undefined;
  downlinkMax: number | undefined;
  rtt: number | undefined;
  effectiveType: string | undefined;
  saveData: boolean | undefined;
  type: 'bluetooth' | 'cellular' | 'ethernet' | 'none' | 'wifi' | 'wimax' | 'other' | 'unknown';
}

// 异步状态类型
export interface AsyncState<Data, Params extends any[] = []> {
  isLoading: boolean;
  isReady: boolean;
  data: Data | undefined;
  error: Error | undefined;
  execute: (...args: Params) => Promise<Data>;
}

// 防抖节流选项
export interface DebounceFilterOptions {
  maxWait?: number;
  rejectOnCancel?: boolean;
}

export interface ThrottleFilterOptions {
  trailing?: boolean;
  leading?: boolean;
  rejectOnCancel?: boolean;
}

// 元素相关类型
export type ElementTarget = Element | Window | Document | RefObject<Element> | RefObject<Window> | RefObject<Document>;

// 工具类型
export type Awaitable<T> = Promise<T> | T;
export type Arrayable<T> = T | T[];
export type ArgumentsType<T> = T extends (...args: infer U) => any ? U : never;
export type Pausable = {
  isActive: boolean;
  pause: Fn;
  resume: Fn;
};

export type Stoppable = {
  isPending: boolean;
  stop: Fn;
  start: Fn;
};

// 方向类型
export type Direction = 'left' | 'right' | 'up' | 'down' | 'none';

// 颜色模式类型
export type ColorMode = 'light' | 'dark' | 'auto';

// 断点类型
export type Breakpoints<K extends string = string> = Record<K, number | string>;