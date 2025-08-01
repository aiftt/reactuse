import { useCallback, useEffect } from 'react'
import { useLocalStorage } from '../state/useLocalStorage'
import type { ColorMode } from '@reactuse/shared'

export interface UseColorModeOptions {
  /**
   * 存储键名
   * @default 'reactuse-color-mode'
   */
  storageKey?: string
  
  /**
   * 默认颜色模式
   * @default 'auto'
   */
  initialValue?: ColorMode
  
  /**
   * 目标元素选择器，用于添加类名
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
   * @default 'light'
   */
  lightClass?: string
  
  /**
   * 自动模式的类名
   * @default 'auto'
   */
  autoClass?: string
  
  /**
   * 自定义模式映射
   */
  modes?: Record<string, string>
  
  /**
   * 监听系统主题变化
   * @default true
   */
  listenToSystemChanges?: boolean
  
  /**
   * 自定义属性名（用于 CSS 变量）
   * @default 'data-color-mode'
   */
  attribute?: string
  
  /**
   * 是否使用属性而不是类名
   * @default false
   */
  useAttribute?: boolean
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
export function useColorMode(options: UseColorModeOptions = {}) {
  const {
    storageKey = 'reactuse-color-mode',
    initialValue = 'auto',
    selector = 'html',
    darkClass = 'dark',
    lightClass = 'light',
    autoClass = 'auto',
    modes = {},
    listenToSystemChanges = true,
    attribute = 'data-color-mode',
    useAttribute = false
  } = options

  // 获取系统主题偏好
  const getSystemMode = useCallback((): 'light' | 'dark' => {
    if (typeof window === 'undefined') return 'light'
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }, [])

  const [mode, setStoredMode] = useLocalStorage<ColorMode>(
    storageKey,
    initialValue
  )

  const systemMode = getSystemMode()

  // 计算实际应用的模式
  const resolvedMode = mode === 'auto' ? systemMode : mode

  // 更新 DOM
  const updateDOM = useCallback((targetMode: 'light' | 'dark') => {
    if (typeof window === 'undefined') return
    
    const element = document.querySelector(selector)
    if (!element) return

    if (useAttribute) {
      // 使用属性
      element.setAttribute(attribute, targetMode)
    } else {
      // 使用类名
      const allClasses = [lightClass, darkClass, autoClass, ...Object.values(modes)]
      element.classList.remove(...allClasses.filter(Boolean))
      
      const targetClass = targetMode === 'dark' ? darkClass : lightClass
      if (targetClass) {
        element.classList.add(targetClass)
      }
    }
  }, [selector, useAttribute, attribute, lightClass, darkClass, autoClass, modes])

  // 设置颜色模式
  const setMode = useCallback((newMode: ColorMode) => {
    setStoredMode(newMode)
    const resolvedNewMode = newMode === 'auto' ? getSystemMode() : newMode
    updateDOM(resolvedNewMode)
  }, [setStoredMode, getSystemMode, updateDOM])

  // 监听系统主题变化
  useEffect(() => {
    if (!listenToSystemChanges || typeof window === 'undefined') {
      return
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      if (mode === 'auto') {
        const newSystemMode = getSystemMode()
        updateDOM(newSystemMode)
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [mode, listenToSystemChanges, getSystemMode, updateDOM])

  // 初始化 DOM
  useEffect(() => {
    updateDOM(resolvedMode)
  }, [resolvedMode, updateDOM])

  return [mode, setMode, systemMode] as const
}

/**
 * 获取系统颜色模式偏好
 * 
 * @returns 系统颜色模式 ('light' | 'dark')
 */
export function getSystemColorMode(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/**
 * 切换颜色模式（在 light/dark 之间切换，忽略 auto）
 * 
 * @param currentMode - 当前模式
 * @returns 切换后的模式
 */
export function toggleColorMode(currentMode: ColorMode): ColorMode {
  if (currentMode === 'auto') {
    return getSystemColorMode() === 'dark' ? 'light' : 'dark'
  }
  return currentMode === 'dark' ? 'light' : 'dark'
}