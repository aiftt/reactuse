import { useState, useCallback, useRef } from 'react'

export interface UseClipboardOptions {
  /**
   * 复制成功后的超时时间（毫秒）
   * @default 1500
   */
  copiedDuring?: number
  
  /**
   * 是否使用传统的 document.execCommand 方法作为回退
   * @default true
   */
  legacy?: boolean
  
  /**
   * 读取剪贴板内容的来源
   * @default 'clipboard'
   */
  source?: 'clipboard' | 'selection'
}

export interface UseClipboardReturn {
  /**
   * 当前剪贴板内容
   */
  text: string
  
  /**
   * 是否支持剪贴板 API
   */
  isSupported: boolean
  
  /**
   * 是否刚刚复制过（在 copiedDuring 时间内）
   */
  copied: boolean
  
  /**
   * 复制文本到剪贴板
   */
  copy: (text: string) => Promise<void>
  
  /**
   * 读取剪贴板内容
   */
  read: () => Promise<void>
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
export function useClipboard(options: UseClipboardOptions = {}): UseClipboardReturn {
  const {
    copiedDuring = 1500,
    legacy = true,
    source = 'clipboard'
  } = options

  const [text, setText] = useState('')
  const [copied, setCopied] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>()

  // 检查是否支持剪贴板 API
  const isSupported = typeof navigator !== 'undefined' && 'clipboard' in navigator

  // 复制文本到剪贴板
  const copy = useCallback(async (value: string) => {
    if (!value) return

    try {
      // 优先使用现代剪贴板 API
      if (isSupported) {
        await navigator.clipboard.writeText(value)
      } else if (legacy) {
        // 回退到传统方法
        await copyTextLegacy(value)
      } else {
        throw new Error('Clipboard API not supported and legacy method disabled')
      }

      setText(value)
      setCopied(true)

      // 清除之前的定时器
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // 设置新的定时器
      timeoutRef.current = setTimeout(() => {
        setCopied(false)
      }, copiedDuring)
    } catch (error) {
      console.error('Failed to copy text to clipboard:', error)
      throw error
    }
  }, [isSupported, legacy, copiedDuring])

  // 读取剪贴板内容
  const read = useCallback(async () => {
    if (!isSupported) {
      console.warn('Clipboard API not supported')
      return
    }

    try {
      let clipboardText = ''
      
      if (source === 'clipboard') {
        clipboardText = await navigator.clipboard.readText()
      } else if (source === 'selection') {
        // 读取选中的文本
        const selection = window.getSelection()
        clipboardText = selection ? selection.toString() : ''
      }
      
      setText(clipboardText)
    } catch (error) {
      console.error('Failed to read clipboard:', error)
      throw error
    }
  }, [isSupported, source])

  return {
    text,
    isSupported,
    copied,
    copy,
    read
  }
}

/**
 * 传统的复制方法（使用 document.execCommand）
 */
function copyTextLegacy(text: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.left = '-999999px'
    textarea.style.top = '-999999px'
    document.body.appendChild(textarea)
    
    try {
      textarea.focus()
      textarea.select()
      
      const successful = document.execCommand('copy')
      if (successful) {
        resolve()
      } else {
        reject(new Error('execCommand copy failed'))
      }
    } catch (error) {
      reject(error)
    } finally {
      document.body.removeChild(textarea)
    }
  })
}

/**
 * 检查是否支持剪贴板 API
 * 
 * @returns 是否支持剪贴板 API
 */
export function isClipboardSupported(): boolean {
  return typeof navigator !== 'undefined' && 'clipboard' in navigator
}

/**
 * 检查是否支持剪贴板读取
 * 
 * @returns 是否支持剪贴板读取
 */
export function isClipboardReadSupported(): boolean {
  return isClipboardSupported() && 'readText' in navigator.clipboard
}

/**
 * 检查是否支持剪贴板写入
 * 
 * @returns 是否支持剪贴板写入
 */
export function isClipboardWriteSupported(): boolean {
  return isClipboardSupported() && 'writeText' in navigator.clipboard
}