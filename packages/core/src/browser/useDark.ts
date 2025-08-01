import { useEffect, useCallback } from 'react'
import { useLocalStorage } from '../state/useLocalStorage'

export interface UseDarkOptions {
  /**
   * 存储键名
   * @default 'reactuse-color-scheme'
   */
  storageKey?: string
  
  /**
   * 默认值
   * @default false
   */
  initialValue?: boolean
  
  /**
   * 自定义存储对象
   * @default localStorage
   */
  storage?: Storage
  
  /**
   * 监听系统主题变化
   * @default true
   */
  listenToSystemChanges?: boolean
  
  /**
   * 目标元素选择器，用于添加 dark 类名
   * @default 'html'
   */
  selector?: string
  
  /**
   * 深色模式的类名
   * @default 'dark'
   */
  darkClass?: string
  
  /**
   * 浅色模式的类名
   * @default ''
   */
  lightClass?: string
  
  /**
   * 自定义值到类名的映射
   */
  valueDark?: string
  
  /**
   * 自定义值到类名的映射
   */
  valueLight?: string
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
export function useDark(options: UseDarkOptions = {}) {
  const {
    storageKey = 'reactuse-color-scheme',
    initialValue,
    listenToSystemChanges = true,
    selector = 'html',
    darkClass = 'dark',
    lightClass = '',
    valueDark = 'dark',
    valueLight = 'light'
  } = options

  // 获取系统主题偏好
  const getSystemDark = useCallback(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }, [])

  // 确定初始值
  const getInitialValue = useCallback(() => {
    if (initialValue !== undefined) return initialValue
    return getSystemDark()
  }, [initialValue, getSystemDark])

  const [store, setStore] = useLocalStorage(
    storageKey,
    getInitialValue()
  )

  // 解析存储的值
  const isDark = store === true || (typeof store === 'string' && store === valueDark)

  // 更新 DOM 类名
  const updateDOM = useCallback((dark: boolean) => {
    if (typeof window === 'undefined') return
    
    const element = document.querySelector(selector)
    if (!element) return

    if (dark) {
      if (lightClass) element.classList.remove(lightClass)
      if (darkClass) element.classList.add(darkClass)
    } else {
      if (darkClass) element.classList.remove(darkClass)
      if (lightClass) element.classList.add(lightClass)
    }
  }, [selector, darkClass, lightClass])

  // 设置深色模式
  const setDark = useCallback((value: boolean) => {
    const newValue = value ? valueDark : valueLight
    setStore(newValue as any)
    updateDOM(value)
  }, [setStore, updateDOM, valueDark, valueLight])

  // 切换模式
  const toggle = useCallback(() => {
    setDark(!isDark)
  }, [isDark, setDark])

  // 监听系统主题变化
  useEffect(() => {
    if (!listenToSystemChanges || initialValue !== undefined || typeof window === 'undefined') {
      return
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (event: MediaQueryListEvent) => {
      setDark(event.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [listenToSystemChanges, initialValue, setDark])

  // 初始化 DOM
  useEffect(() => {
    updateDOM(isDark)
  }, [isDark, updateDOM])

  return [isDark, setDark, toggle] as const
}

/**
 * 获取系统是否为深色模式
 * 
 * @returns 系统是否为深色模式
 */
export function getSystemDark(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}