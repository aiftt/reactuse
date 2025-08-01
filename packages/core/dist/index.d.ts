import { StorageOptions, Position, ElementTarget, ColorMode } from '@reactuse/shared';

interface UseLocalStorageOptions<T> extends Omit<StorageOptions<T>, 'listenToStorageChanges'> {
    /**
     * 监听存储变化
     * @default true
     */
    syncAcrossTabs?: boolean;
}
/**
 * 响应式 localStorage hook
 *
 * @param key - 存储键名
 * @param defaultValue - 默认值
 * @param options - 配置选项
 * @returns [value, setValue, removeValue]
 */
declare function useLocalStorage<T = string>(key: string, defaultValue: T, options?: UseLocalStorageOptions<T>): [T, (value: T | ((prev: T) => T)) => void, () => void];
declare function useLocalStorageString(key: string, defaultValue?: string, options?: Omit<UseLocalStorageOptions<string>, 'serializer'>): [string, (value: string | ((prev: string) => string)) => void, () => void];
declare function useLocalStorageNumber(key: string, defaultValue?: number, options?: Omit<UseLocalStorageOptions<number>, 'serializer'>): [number, (value: number | ((prev: number) => number)) => void, () => void];
declare function useLocalStorageBoolean(key: string, defaultValue?: boolean, options?: Omit<UseLocalStorageOptions<boolean>, 'serializer'>): [boolean, (value: boolean | ((prev: boolean) => boolean)) => void, () => void];
declare function useLocalStorageObject<T extends Record<string, any>>(key: string, defaultValue: T, options?: Omit<UseLocalStorageOptions<T>, 'serializer'>): [T, (value: T | ((prev: T) => T)) => void, () => void];

interface UseSessionStorageOptions<T> extends Omit<StorageOptions<T>, 'listenToStorageChanges'> {
    /**
     * 监听存储变化
     * @default true
     */
    syncAcrossTabs?: boolean;
}
/**
 * 响应式 sessionStorage hook
 *
 * @param key - 存储键名
 * @param defaultValue - 默认值
 * @param options - 配置选项
 * @returns [value, setValue, removeValue]
 */
declare function useSessionStorage<T = string>(key: string, defaultValue: T, options?: UseSessionStorageOptions<T>): [T, (value: T | ((prev: T) => T)) => void, () => void];
declare function useSessionStorageString(key: string, defaultValue?: string, options?: Omit<UseSessionStorageOptions<string>, 'serializer'>): [string, (value: string | ((prev: string) => string)) => void, () => void];
declare function useSessionStorageNumber(key: string, defaultValue?: number, options?: Omit<UseSessionStorageOptions<number>, 'serializer'>): [number, (value: number | ((prev: number) => number)) => void, () => void];
declare function useSessionStorageBoolean(key: string, defaultValue?: boolean, options?: Omit<UseSessionStorageOptions<boolean>, 'serializer'>): [boolean, (value: boolean | ((prev: boolean) => boolean)) => void, () => void];
declare function useSessionStorageObject<T extends Record<string, any>>(key: string, defaultValue: T, options?: Omit<UseSessionStorageOptions<T>, 'serializer'>): [T, (value: T | ((prev: T) => T)) => void, () => void];

interface UseToggleReturn {
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
declare function useToggle(initialValue?: boolean): UseToggleReturn;
/**
 * 带有多个值的切换 hook
 *
 * @param values - 可切换的值数组
 * @param initialIndex - 初始索引，默认为 0
 * @returns 包含当前值、索引和切换方法的对象
 */
declare function useToggleValues<T>(values: readonly T[], initialIndex?: number): {
    value: T;
    index: number;
    next: () => void;
    prev: () => void;
    set: (index: number) => void;
    setValue: (value: T) => void;
};

interface UseCounterOptions {
    /** 最小值 */
    min?: number;
    /** 最大值 */
    max?: number;
    /** 步长，默认为 1 */
    step?: number;
}
interface UseCounterReturn {
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
declare function useCounter(initialValue?: number, options?: UseCounterOptions): UseCounterReturn;

type Setter<T> = (value: T | ((prev: T) => T)) => void;
/**
 * 创建全局状态，可在多个组件间共享
 *
 * @param key - 全局状态的唯一标识符
 * @param initialValue - 初始值
 * @returns 返回一个 hook 函数，用于在组件中使用该全局状态
 *
 * @example
 * ```tsx
 * // 创建全局状态
 * const useGlobalCounter = createGlobalState('counter', 0)
 *
 * // 在组件中使用
 * function ComponentA() {
 *   const [count, setCount] = useGlobalCounter()
 *   return (
 *     <div>
 *       <p>Count: {count}</p>
 *       <button onClick={() => setCount(count + 1)}>Increment</button>
 *     </div>
 *   )
 * }
 *
 * function ComponentB() {
 *   const [count, setCount] = useGlobalCounter()
 *   return (
 *     <div>
 *       <p>Count in B: {count}</p>
 *       <button onClick={() => setCount(count - 1)}>Decrement</button>
 *     </div>
 *   )
 * }
 * ```
 */
declare function createGlobalState<T>(key: string | symbol, initialValue: T): () => [T, Setter<T>];
/**
 * 获取全局状态的当前值（不订阅变化）
 *
 * @param key - 全局状态的唯一标识符
 * @returns 当前值，如果状态不存在则返回 undefined
 */
declare function getGlobalState<T>(key: string | symbol): T | undefined;
/**
 * 设置全局状态的值（不需要在组件中使用）
 *
 * @param key - 全局状态的唯一标识符
 * @param value - 新值或更新函数
 */
declare function setGlobalState<T>(key: string | symbol, value: T | ((prev: T) => T)): void;
/**
 * 重置全局状态到初始值
 *
 * @param key - 全局状态的唯一标识符
 * @param initialValue - 初始值
 */
declare function resetGlobalState<T>(key: string | symbol, initialValue: T): void;
/**
 * 销毁全局状态
 *
 * @param key - 全局状态的唯一标识符
 */
declare function destroyGlobalState(key: string | symbol): void;

interface UseMouseOptions {
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
interface UseMouseReturn {
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
declare function useMouse(options?: UseMouseOptions): UseMouseReturn;
/**
 * 响应式鼠标在元素内的位置
 *
 * @param target - 目标元素
 * @param options - 配置选项
 * @returns 鼠标在元素内的位置信息
 */
declare function useMouseInElement(target: Element | null, options?: Omit<UseMouseOptions, 'target'>): UseMouseReturn & {
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
};

interface UseWindowSizeOptions {
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
interface UseWindowSizeReturn {
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
declare function useWindowSize(options?: UseWindowSizeOptions): UseWindowSizeReturn;

interface UseEventListenerOptions {
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
declare function useEventListener<K extends keyof WindowEventMap>(event: K, listener: (this: Window, ev: WindowEventMap[K]) => any, target?: Window | null, options?: UseEventListenerOptions): void;
declare function useEventListener<K extends keyof DocumentEventMap>(event: K, listener: (this: Document, ev: DocumentEventMap[K]) => any, target: Document, options?: UseEventListenerOptions): void;
declare function useEventListener<K extends keyof HTMLElementEventMap>(event: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, target: HTMLElement | null, options?: UseEventListenerOptions): void;
declare function useEventListener(event: string, listener: EventListener, target: EventTarget | null | undefined, options?: UseEventListenerOptions): void;
/**
 * 监听多个事件
 *
 * @param events - 事件名称数组
 * @param listener - 事件监听器
 * @param target - 目标元素
 * @param options - 事件监听器选项
 */
declare function useEventListeners(events: string[], listener: EventListener, target?: EventTarget | null | undefined, options?: UseEventListenerOptions): void;

interface UseClickOutsideOptions {
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
declare function useClickOutside(target: ElementTarget, handler: (event: Event) => void, options?: UseClickOutsideOptions): void;
/**
 * 监听多个元素外部的点击
 *
 * @param targets - 目标元素数组
 * @param handler - 点击外部时的回调函数
 * @param options - 配置选项
 */
declare function useClickOutsideMultiple(targets: ElementTarget[], handler: (event: Event) => void, options?: UseClickOutsideOptions): void;

interface UseDarkOptions {
    /**
     * 存储键名
     * @default 'reactuse-color-scheme'
     */
    storageKey?: string;
    /**
     * 默认值
     * @default false
     */
    initialValue?: boolean;
    /**
     * 自定义存储对象
     * @default localStorage
     */
    storage?: Storage;
    /**
     * 监听系统主题变化
     * @default true
     */
    listenToSystemChanges?: boolean;
    /**
     * 目标元素选择器，用于添加 dark 类名
     * @default 'html'
     */
    selector?: string;
    /**
     * 深色模式的类名
     * @default 'dark'
     */
    darkClass?: string;
    /**
     * 浅色模式的类名
     * @default ''
     */
    lightClass?: string;
    /**
     * 自定义值到类名的映射
     */
    valueDark?: string;
    /**
     * 自定义值到类名的映射
     */
    valueLight?: string;
}
/**
 * 响应式深色模式管理
 *
 * @param options - 配置选项
 * @returns [isDark, setDark, toggle] - [是否深色模式, 设置深色模式, 切换模式]
 *
 * @example
 * ```tsx
 * function App() {
 *   const [isDark, setDark, toggle] = useDark()
 *
 *   return (
 *     <div>
 *       <p>当前模式: {isDark ? '深色' : '浅色'}</p>
 *       <button onClick={toggle}>切换主题</button>
 *       <button onClick={() => setDark(true)}>设为深色</button>
 *       <button onClick={() => setDark(false)}>设为浅色</button>
 *     </div>
 *   )
 * }
 * ```
 *
 * @example
 * ```tsx
 * // 自定义配置
 * function App() {
 *   const [isDark, setDark, toggle] = useDark({
 *     storageKey: 'my-theme',
 *     selector: 'body',
 *     darkClass: 'theme-dark',
 *     lightClass: 'theme-light'
 *   })
 *
 *   return (
 *     <div>
 *       <button onClick={toggle}>切换主题</button>
 *     </div>
 *   )
 * }
 * ```
 */
declare function useDark(options?: UseDarkOptions): readonly [boolean, (value: boolean) => void, () => void];
/**
 * 获取系统是否为深色模式
 *
 * @returns 系统是否为深色模式
 */
declare function getSystemDark(): boolean;

interface UseColorModeOptions {
    /**
     * 存储键名
     * @default 'reactuse-color-mode'
     */
    storageKey?: string;
    /**
     * 默认颜色模式
     * @default 'auto'
     */
    initialValue?: ColorMode;
    /**
     * 目标元素选择器，用于添加类名
     * @default 'html'
     */
    selector?: string;
    /**
     * 深色模式的类名
     * @default 'dark'
     */
    darkClass?: string;
    /**
     * 浅色模式的类名
     * @default 'light'
     */
    lightClass?: string;
    /**
     * 自动模式的类名
     * @default 'auto'
     */
    autoClass?: string;
    /**
     * 自定义模式映射
     */
    modes?: Record<string, string>;
    /**
     * 监听系统主题变化
     * @default true
     */
    listenToSystemChanges?: boolean;
    /**
     * 自定义属性名（用于 CSS 变量）
     * @default 'data-color-mode'
     */
    attribute?: string;
    /**
     * 是否使用属性而不是类名
     * @default false
     */
    useAttribute?: boolean;
}
/**
 * 响应式颜色模式管理（支持 light/dark/auto）
 *
 * @param options - 配置选项
 * @returns [mode, setMode, systemMode] - [当前模式, 设置模式, 系统模式]
 *
 * @example
 * ```tsx
 * function App() {
 *   const [mode, setMode, systemMode] = useColorMode()
 *
 *   return (
 *     <div>
 *       <p>当前模式: {mode}</p>
 *       <p>系统模式: {systemMode}</p>
 *       <button onClick={() => setMode('light')}>浅色</button>
 *       <button onClick={() => setMode('dark')}>深色</button>
 *       <button onClick={() => setMode('auto')}>自动</button>
 *     </div>
 *   )
 * }
 * ```
 *
 * @example
 * ```tsx
 * // 自定义配置
 * function App() {
 *   const [mode, setMode] = useColorMode({
 *     storageKey: 'my-color-mode',
 *     selector: 'body',
 *     darkClass: 'theme-dark',
 *     lightClass: 'theme-light',
 *     useAttribute: true,
 *     attribute: 'data-theme'
 *   })
 *
 *   return (
 *     <div>
 *       <select value={mode} onChange={(e) => setMode(e.target.value as ColorMode)}>
 *         <option value="light">浅色</option>
 *         <option value="dark">深色</option>
 *         <option value="auto">自动</option>
 *       </select>
 *     </div>
 *   )
 * }
 * ```
 */
declare function useColorMode(options?: UseColorModeOptions): readonly [ColorMode, (newMode: ColorMode) => void, "light" | "dark"];
/**
 * 获取系统颜色模式偏好
 *
 * @returns 系统颜色模式 ('light' | 'dark')
 */
declare function getSystemColorMode(): 'light' | 'dark';
/**
 * 切换颜色模式（在 light/dark 之间切换，忽略 auto）
 *
 * @param currentMode - 当前模式
 * @returns 切换后的模式
 */
declare function toggleColorMode(currentMode: ColorMode): ColorMode;

interface UseClipboardOptions {
    /**
     * 复制成功后的超时时间（毫秒）
     * @default 1500
     */
    copiedDuring?: number;
    /**
     * 是否使用传统的 document.execCommand 方法作为回退
     * @default true
     */
    legacy?: boolean;
    /**
     * 读取剪贴板内容的来源
     * @default 'clipboard'
     */
    source?: 'clipboard' | 'selection';
}
interface UseClipboardReturn {
    /**
     * 当前剪贴板内容
     */
    text: string;
    /**
     * 是否支持剪贴板 API
     */
    isSupported: boolean;
    /**
     * 是否刚刚复制过（在 copiedDuring 时间内）
     */
    copied: boolean;
    /**
     * 复制文本到剪贴板
     */
    copy: (text: string) => Promise<void>;
    /**
     * 读取剪贴板内容
     */
    read: () => Promise<void>;
}
/**
 * 响应式剪贴板 API
 *
 * @param options - 配置选项
 * @returns 剪贴板操作对象
 *
 * @example
 * ```tsx
 * function App() {
 *   const { text, copy, copied, isSupported } = useClipboard()
 *   const [input, setInput] = useState('')
 *
 *   if (!isSupported) {
 *     return <div>剪贴板 API 不支持</div>
 *   }
 *
 *   return (
 *     <div>
 *       <input
 *         value={input}
 *         onChange={(e) => setInput(e.target.value)}
 *         placeholder="输入要复制的文本"
 *       />
 *       <button onClick={() => copy(input)}>
 *         {copied ? '已复制!' : '复制'}
 *       </button>
 *       <p>剪贴板内容: {text}</p>
 *     </div>
 *   )
 * }
 * ```
 *
 * @example
 * ```tsx
 * // 自定义配置
 * function App() {
 *   const { copy, copied } = useClipboard({
 *     copiedDuring: 3000, // 3秒
 *     legacy: false // 禁用传统方法
 *   })
 *
 *   return (
 *     <button onClick={() => copy('Hello World')}>
 *       {copied ? '复制成功!' : '复制文本'}
 *     </button>
 *   )
 * }
 * ```
 */
declare function useClipboard(options?: UseClipboardOptions): UseClipboardReturn;
/**
 * 检查是否支持剪贴板 API
 *
 * @returns 是否支持剪贴板 API
 */
declare function isClipboardSupported(): boolean;
/**
 * 检查是否支持剪贴板读取
 *
 * @returns 是否支持剪贴板读取
 */
declare function isClipboardReadSupported(): boolean;
/**
 * 检查是否支持剪贴板写入
 *
 * @returns 是否支持剪贴板写入
 */
declare function isClipboardWriteSupported(): boolean;

interface UseFetchOptions {
    /**
     * 请求方法
     * @default 'GET'
     */
    method?: string;
    /**
     * 请求头
     */
    headers?: HeadersInit;
    /**
     * 请求体
     */
    body?: BodyInit | null;
    /**
     * 请求模式
     */
    mode?: RequestMode;
    /**
     * 凭据模式
     */
    credentials?: RequestCredentials;
    /**
     * 缓存模式
     */
    cache?: RequestCache;
    /**
     * 重定向模式
     */
    redirect?: RequestRedirect;
    /**
     * 引用策略
     */
    referrer?: string;
    /**
     * 引用策略
     */
    referrerPolicy?: ReferrerPolicy;
    /**
     * 完整性
     */
    integrity?: string;
    /**
     * 保持活动
     */
    keepalive?: boolean;
    /**
     * 信号
     */
    signal?: AbortSignal;
    /**
     * 超时时间（毫秒）
     */
    timeout?: number;
    /**
     * 是否立即执行
     * @default true
     */
    immediate?: boolean;
    /**
     * 重试次数
     * @default 0
     */
    retries?: number;
    /**
     * 重试延迟（毫秒）
     * @default 1000
     */
    retryDelay?: number;
    /**
     * 响应拦截器
     */
    beforeFetch?: (ctx: BeforeFetchContext) => Promise<Partial<BeforeFetchContext> | void> | Partial<BeforeFetchContext> | void;
    /**
     * 响应后处理
     */
    afterFetch?: (ctx: AfterFetchContext) => Promise<Partial<AfterFetchContext> | void> | Partial<AfterFetchContext> | void;
    /**
     * 错误处理
     */
    onFetchError?: (ctx: OnFetchErrorContext) => Promise<Partial<OnFetchErrorContext> | void> | Partial<OnFetchErrorContext> | void;
}
interface BeforeFetchContext {
    url: string;
    options: RequestInit;
    cancel: () => void;
}
interface AfterFetchContext {
    response: Response;
    data: any;
}
interface OnFetchErrorContext {
    error: any;
    data: any;
}
interface UseFetchReturn<T> {
    /**
     * 响应数据
     */
    data: T | null;
    /**
     * 错误信息
     */
    error: Error | null;
    /**
     * 是否正在加载
     */
    isLoading: boolean;
    /**
     * 是否已完成（成功或失败）
     */
    isFinished: boolean;
    /**
     * 是否可以中止
     */
    canAbort: boolean;
    /**
     * 是否已中止
     */
    aborted: boolean;
    /**
     * HTTP 状态码
     */
    statusCode: number | null;
    /**
     * 响应对象
     */
    response: Response | null;
    /**
     * 执行请求
     */
    execute: (throwOnFailed?: boolean) => Promise<any>;
    /**
     * 中止请求
     */
    abort: () => void;
    /**
     * 获取 JSON 数据
     */
    json: <JSON = any>() => Promise<JSON>;
    /**
     * 获取文本数据
     */
    text: () => Promise<string>;
    /**
     * 获取 Blob 数据
     */
    blob: () => Promise<Blob>;
    /**
     * 获取 ArrayBuffer 数据
     */
    arrayBuffer: () => Promise<ArrayBuffer>;
    /**
     * 获取 FormData 数据
     */
    formData: () => Promise<FormData>;
}
/**
 * 响应式 Fetch API
 *
 * @param url - 请求 URL
 * @param options - 配置选项
 * @returns Fetch 操作对象
 *
 * @example
 * ```tsx
 * function UserProfile({ userId }: { userId: string }) {
 *   const { data, error, isLoading, execute } = useFetch<User>(
 *     `https://api.example.com/users/${userId}`
 *   )
 *
 *   if (isLoading) return <div>加载中...</div>
 *   if (error) return <div>错误: {error.message}</div>
 *   if (!data) return <div>无数据</div>
 *
 *   return (
 *     <div>
 *       <h1>{data.name}</h1>
 *       <p>{data.email}</p>
 *       <button onClick={() => execute()}>刷新</button>
 *     </div>
 *   )
 * }
 * ```
 *
 * @example
 * ```tsx
 * // POST 请求
 * function CreateUser() {
 *   const { data, error, isLoading, execute } = useFetch<User>(
 *     'https://api.example.com/users',
 *     {
 *       method: 'POST',
 *       headers: { 'Content-Type': 'application/json' },
 *       immediate: false
 *     }
 *   )
 *
 *   const handleSubmit = async (userData: Partial<User>) => {
 *     await execute({
 *       body: JSON.stringify(userData)
 *     })
 *   }
 *
 *   return (
 *     <form onSubmit={(e) => {
 *       e.preventDefault()
 *       handleSubmit({ name: 'John', email: 'john@example.com' })
 *     }}>
 *       <button type="submit" disabled={isLoading}>
 *         {isLoading ? '创建中...' : '创建用户'}
 *       </button>
 *     </form>
 *   )
 * }
 * ```
 */
declare function useFetch<T = any>(url: string, options?: UseFetchOptions): UseFetchReturn<T>;
/**
 * 创建 useFetch 的实例，带有预设配置
 *
 * @param baseUrl - 基础 URL
 * @param options - 默认配置选项
 * @returns 配置好的 useFetch 函数
 */
declare function createFetch(baseUrl?: string, options?: UseFetchOptions): <T = any>(url: string, fetchOptions?: UseFetchOptions) => UseFetchReturn<T>;

interface UseIntervalOptions {
    /** 是否立即开始，默认为 true */
    immediate?: boolean;
    /** 是否在组件卸载时自动清理，默认为 true */
    immediateCallback?: boolean;
}
interface UseIntervalReturn {
    /** 是否正在运行 */
    isActive: boolean;
    /** 暂停定时器 */
    pause: () => void;
    /** 恢复定时器 */
    resume: () => void;
    /** 重新开始定时器 */
    restart: () => void;
}
/**
 * 响应式定时器 hook
 *
 * @param callback - 定时执行的回调函数
 * @param interval - 间隔时间（毫秒），null 表示暂停
 * @param options - 配置选项
 * @returns 定时器控制对象
 */
declare function useInterval(callback: () => void, interval?: number | null, options?: UseIntervalOptions): UseIntervalReturn;
/**
 * 简化版本的 useInterval，只接受回调和间隔时间
 *
 * @param callback - 定时执行的回调函数
 * @param interval - 间隔时间（毫秒），null 表示暂停
 */
declare function useIntervalFn(callback: () => void, interval?: number | null): UseIntervalReturn;

interface UseTimeoutOptions {
    /** 是否立即开始，默认为 true */
    immediate?: boolean;
    /** 是否在组件卸载时自动清理，默认为 true */
    immediateCallback?: boolean;
}
interface UseTimeoutReturn {
    /** 是否准备就绪（超时已触发） */
    ready: boolean;
    /** 是否正在运行 */
    isPending: boolean;
    /** 开始或重新开始定时器 */
    start: () => void;
    /** 停止定时器 */
    stop: () => void;
    /** 重新开始定时器 */
    restart: () => void;
}
/**
 * 响应式超时定时器 hook
 *
 * @param callback - 超时后执行的回调函数
 * @param delay - 延迟时间（毫秒），null 表示不启动
 * @param options - 配置选项
 * @returns 定时器控制对象
 */
declare function useTimeout(callback: () => void, delay?: number | null, options?: UseTimeoutOptions): UseTimeoutReturn;
/**
 * 简化版本的 useTimeout，只接受回调和延迟时间
 *
 * @param callback - 超时后执行的回调函数
 * @param delay - 延迟时间（毫秒），null 表示不启动
 */
declare function useTimeoutFn(callback: () => void, delay?: number | null): UseTimeoutReturn;

interface UseNowOptions {
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
declare function useNow(options?: UseNowOptions): Date;
/**
 * 响应式当前时间戳 hook
 *
 * @param options - 配置选项
 * @returns 当前时间戳（毫秒）
 */
declare function useTimestamp(options?: UseNowOptions): number;
/**
 * 高精度时间戳 hook（使用 performance.now()）
 *
 * @param options - 配置选项
 * @returns 高精度时间戳
 */
declare function usePerformanceNow(options?: Omit<UseNowOptions, 'now'>): number;

interface UseDebounceOptions {
    /** 延迟时间（毫秒），默认为 300 */
    delay?: number;
    /** 是否在首次调用时立即执行，默认为 false */
    leading?: boolean;
    /** 是否在延迟结束后执行，默认为 true */
    trailing?: boolean;
    /** 最大等待时间（毫秒），超过此时间强制执行 */
    maxWait?: number;
}
/**
 * 防抖 hook，延迟执行函数直到停止调用一段时间后
 *
 * @param value - 需要防抖的值
 * @param delay - 延迟时间（毫秒），默认为 300
 * @returns 防抖后的值
 */
declare function useDebounce<T>(value: T, delay?: number): T;
/**
 * 防抖函数 hook，返回一个防抖后的函数
 *
 * @param fn - 需要防抖的函数
 * @param options - 防抖选项
 * @returns 防抖后的函数和取消函数
 */
declare function useDebounceFn<T extends (...args: any[]) => any>(fn: T, options?: UseDebounceOptions): {
    /** 防抖后的函数 */
    run: T;
    /** 取消防抖 */
    cancel: () => void;
    /** 立即执行 */
    flush: () => void;
};

interface UseThrottleOptions {
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
declare function useThrottle<T>(value: T, delay?: number): T;
/**
 * 节流函数 hook，返回一个节流后的函数
 *
 * @param fn - 需要节流的函数
 * @param options - 节流选项
 * @returns 节流后的函数和取消函数
 */
declare function useThrottleFn<T extends (...args: any[]) => any>(fn: T, options?: UseThrottleOptions): {
    /** 节流后的函数 */
    run: T;
    /** 取消节流 */
    cancel: () => void;
    /** 立即执行 */
    flush: () => void;
};

export { type AfterFetchContext, type BeforeFetchContext, type OnFetchErrorContext, type UseClickOutsideOptions, type UseClipboardOptions, type UseClipboardReturn, type UseColorModeOptions, type UseCounterOptions, type UseCounterReturn, type UseDarkOptions, type UseDebounceOptions, type UseEventListenerOptions, type UseFetchOptions, type UseFetchReturn, type UseIntervalOptions, type UseIntervalReturn, type UseLocalStorageOptions, type UseMouseOptions, type UseMouseReturn, type UseNowOptions, type UseSessionStorageOptions, type UseThrottleOptions, type UseTimeoutOptions, type UseTimeoutReturn, type UseToggleReturn, type UseWindowSizeOptions, type UseWindowSizeReturn, createFetch, createGlobalState, destroyGlobalState, getGlobalState, getSystemColorMode, getSystemDark, isClipboardReadSupported, isClipboardSupported, isClipboardWriteSupported, resetGlobalState, setGlobalState, toggleColorMode, useClickOutside, useClickOutsideMultiple, useClipboard, useColorMode, useCounter, useDark, useDebounce, useDebounceFn, useEventListener, useEventListeners, useFetch, useInterval, useIntervalFn, useLocalStorage, useLocalStorageBoolean, useLocalStorageNumber, useLocalStorageObject, useLocalStorageString, useMouse, useMouseInElement, useNow, usePerformanceNow, useSessionStorage, useSessionStorageBoolean, useSessionStorageNumber, useSessionStorageObject, useSessionStorageString, useThrottle, useThrottleFn, useTimeout, useTimeoutFn, useTimestamp, useToggle, useToggleValues, useWindowSize };
