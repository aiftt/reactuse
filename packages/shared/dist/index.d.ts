import { RefObject } from 'react';

type Fn = () => void;
type AnyFn = (...args: any[]) => any;
type MaybeRef<T> = T | RefObject<T>;
type MaybeRefOrGetter<T> = T | RefObject<T> | (() => T);
interface Position {
    x: number;
    y: number;
}
interface Size {
    width: number;
    height: number;
}
interface Rect extends Position, Size {
}
type EventFilter<Args extends any[] = any[], This = any> = (invoke: Fn, options: FunctionWrapperOptions<Args, This>) => void;
interface FunctionWrapperOptions<Args extends any[] = any[], This = any> {
    fn: (this: This, ...args: Args) => any;
    args: Args;
    thisArg: This;
}
interface ConfigurableWindow {
    window?: Window;
}
interface ConfigurableDocument {
    document?: Document;
}
interface ConfigurableDocumentOrShadowRoot {
    document?: DocumentOrShadowRoot;
}
interface ConfigurableNavigator {
    navigator?: Navigator;
}
interface ConfigurableLocation {
    location?: Location;
}
type Serializer<T> = {
    read(value: string): T;
    write(value: T): string;
};
interface StorageOptions<T> {
    flush?: 'pre' | 'post' | 'sync';
    deep?: boolean;
    listenToStorageChanges?: boolean;
    writeDefaults?: boolean;
    mergeDefaults?: boolean | ((storageValue: T, defaults: T) => T);
    serializer?: Serializer<T>;
    onError?: (error: any) => void;
}
interface NetworkState {
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
interface AsyncState<Data, Params extends any[] = []> {
    isLoading: boolean;
    isReady: boolean;
    data: Data | undefined;
    error: Error | undefined;
    execute: (...args: Params) => Promise<Data>;
}
interface DebounceFilterOptions {
    maxWait?: number;
    rejectOnCancel?: boolean;
}
interface ThrottleFilterOptions {
    trailing?: boolean;
    leading?: boolean;
    rejectOnCancel?: boolean;
}
type ElementTarget = Element | Window | Document | RefObject<Element> | RefObject<Window> | RefObject<Document>;
type Awaitable<T> = Promise<T> | T;
type Arrayable<T> = T | T[];
type ArgumentsType<T> = T extends (...args: infer U) => any ? U : never;
type Pausable = {
    isActive: boolean;
    pause: Fn;
    resume: Fn;
};
type Stoppable = {
    isPending: boolean;
    stop: Fn;
    start: Fn;
};
type Direction = 'left' | 'right' | 'up' | 'down' | 'none';
type ColorMode = 'light' | 'dark' | 'auto';
type Breakpoints<K extends string = string> = Record<K, number | string>;

declare const DEFAULT_WINDOW: (Window & typeof globalThis) | undefined;
declare const DEFAULT_DOCUMENT: Document | undefined;
declare const DEFAULT_NAVIGATOR: Navigator | undefined;
declare const DEFAULT_LOCATION: Location | undefined;
declare const STORAGE_KEY_PREFIX = "reactuse:";
declare const EVENTS: {
    readonly RESIZE: "resize";
    readonly SCROLL: "scroll";
    readonly CLICK: "click";
    readonly MOUSEDOWN: "mousedown";
    readonly MOUSEUP: "mouseup";
    readonly MOUSEMOVE: "mousemove";
    readonly KEYDOWN: "keydown";
    readonly KEYUP: "keyup";
    readonly FOCUS: "focus";
    readonly BLUR: "blur";
    readonly VISIBILITYCHANGE: "visibilitychange";
    readonly ONLINE: "online";
    readonly OFFLINE: "offline";
    readonly STORAGE: "storage";
    readonly POPSTATE: "popstate";
    readonly HASHCHANGE: "hashchange";
};
declare const BREAKPOINTS: {
    readonly xs: 0;
    readonly sm: 640;
    readonly md: 768;
    readonly lg: 1024;
    readonly xl: 1280;
    readonly '2xl': 1536;
};
declare const COLOR_MODES: {
    readonly LIGHT: "light";
    readonly DARK: "dark";
    readonly AUTO: "auto";
};
declare const DIRECTIONS: {
    readonly LEFT: "left";
    readonly RIGHT: "right";
    readonly UP: "up";
    readonly DOWN: "down";
    readonly NONE: "none";
};
declare const DEFAULT_SERIALIZERS: {
    readonly boolean: {
        readonly read: (v: string) => v is "true";
        readonly write: (v: boolean) => string;
    };
    readonly object: {
        readonly read: (v: string) => any;
        readonly write: (v: any) => string;
    };
    readonly number: {
        readonly read: (v: string) => number | null;
        readonly write: (v: number) => string;
    };
    readonly string: {
        readonly read: (v: string) => string;
        readonly write: (v: string) => string;
    };
    readonly any: {
        readonly read: (v: string) => any;
        readonly write: (v: any) => string;
    };
};
declare const DEFAULT_DEBOUNCE_MS = 300;
declare const DEFAULT_THROTTLE_MS = 100;
declare const DEFAULT_TIMEOUT_MS = 5000;
declare const NETWORK_TYPES: {
    readonly BLUETOOTH: "bluetooth";
    readonly CELLULAR: "cellular";
    readonly ETHERNET: "ethernet";
    readonly NONE: "none";
    readonly WIFI: "wifi";
    readonly WIMAX: "wimax";
    readonly OTHER: "other";
    readonly UNKNOWN: "unknown";
};
declare const EFFECTIVE_TYPES: {
    readonly SLOW_2G: "slow-2g";
    readonly '2G': "2g";
    readonly '3G': "3g";
    readonly '4G': "4g";
};

declare const isClient: boolean;
declare const isDev: boolean;
declare const noop: () => void;
declare function toValue<T>(val: MaybeRefOrGetter<T>): T;
declare function unrefElement<T extends Element>(elRef: ElementTarget): T | undefined;
declare function isRef<T>(val: any): val is {
    current: T;
};
declare function isFunction(val: any): val is Function;
declare function isString(val: any): val is string;
declare function isNumber(val: any): val is number;
declare function isBoolean(val: any): val is boolean;
declare function isObject(val: any): val is Record<string, any>;
declare function isArray(val: any): val is any[];
declare function isDefined<T>(val: T | undefined | null): val is T;
declare function deepClone<T>(obj: T): T;
declare function debounce<T extends (...args: any[]) => any>(fn: T, delay: number): T & {
    cancel: () => void;
};
declare function throttle<T extends (...args: any[]) => any>(fn: T, delay: number): T & {
    cancel: () => void;
};
declare function generateId(prefix?: string): string;
declare function getType(obj: any): string;
declare function merge<T extends Record<string, any>>(target: T, ...sources: Partial<T>[]): T;
declare function get(obj: any, path: string, defaultValue?: any): any;
declare function set(obj: any, path: string, value: any): void;
declare function unique<T>(arr: T[]): T[];
declare function chunk<T>(arr: T[], size: number): T[][];
declare function sleep(ms: number): Promise<void>;
declare function retry<T>(fn: () => Promise<T>, times?: number, delay?: number): Promise<T>;
declare function formatBytes(bytes: number, decimals?: number): string;
declare function createEventEmitter<T extends Record<string, any[]>>(): {
    on<K extends keyof T>(event: K, listener: (...args: T[K]) => void): () => void;
    emit<K extends keyof T>(event: K, ...args: T[K]): void;
    off<K extends keyof T>(event: K, listener?: (...args: T[K]) => void): void;
    clear(): void;
};

export { type AnyFn, type ArgumentsType, type Arrayable, type AsyncState, type Awaitable, BREAKPOINTS, type Breakpoints, COLOR_MODES, type ColorMode, type ConfigurableDocument, type ConfigurableDocumentOrShadowRoot, type ConfigurableLocation, type ConfigurableNavigator, type ConfigurableWindow, DEFAULT_DEBOUNCE_MS, DEFAULT_DOCUMENT, DEFAULT_LOCATION, DEFAULT_NAVIGATOR, DEFAULT_SERIALIZERS, DEFAULT_THROTTLE_MS, DEFAULT_TIMEOUT_MS, DEFAULT_WINDOW, DIRECTIONS, type DebounceFilterOptions, type Direction, EFFECTIVE_TYPES, EVENTS, type ElementTarget, type EventFilter, type Fn, type FunctionWrapperOptions, type MaybeRef, type MaybeRefOrGetter, NETWORK_TYPES, type NetworkState, type Pausable, type Position, type Rect, STORAGE_KEY_PREFIX, type Serializer, type Size, type Stoppable, type StorageOptions, type ThrottleFilterOptions, chunk, createEventEmitter, debounce, deepClone, formatBytes, generateId, get, getType, isArray, isBoolean, isClient, isDefined, isDev, isFunction, isNumber, isObject, isRef, isString, merge, noop, retry, set, sleep, throttle, toValue, unique, unrefElement };
