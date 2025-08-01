import { useState, useEffect, useCallback, useRef } from 'react'

export interface UseFetchOptions {
  /**
   * 请求方法
   * @default 'GET'
   */
  method?: string
  
  /**
   * 请求头
   */
  headers?: HeadersInit
  
  /**
   * 请求体
   */
  body?: BodyInit | null
  
  /**
   * 请求模式
   */
  mode?: RequestMode
  
  /**
   * 凭据模式
   */
  credentials?: RequestCredentials
  
  /**
   * 缓存模式
   */
  cache?: RequestCache
  
  /**
   * 重定向模式
   */
  redirect?: RequestRedirect
  
  /**
   * 引用策略
   */
  referrer?: string
  
  /**
   * 引用策略
   */
  referrerPolicy?: ReferrerPolicy
  
  /**
   * 完整性
   */
  integrity?: string
  
  /**
   * 保持活动
   */
  keepalive?: boolean
  
  /**
   * 信号
   */
  signal?: AbortSignal
  
  /**
   * 超时时间（毫秒）
   */
  timeout?: number
  
  /**
   * 是否立即执行
   * @default true
   */
  immediate?: boolean
  
  /**
   * 重试次数
   * @default 0
   */
  retries?: number
  
  /**
   * 重试延迟（毫秒）
   * @default 1000
   */
  retryDelay?: number
  
  /**
   * 响应拦截器
   */
  beforeFetch?: (ctx: BeforeFetchContext) => Promise<Partial<BeforeFetchContext> | void> | Partial<BeforeFetchContext> | void
  
  /**
   * 响应后处理
   */
  afterFetch?: (ctx: AfterFetchContext) => Promise<Partial<AfterFetchContext> | void> | Partial<AfterFetchContext> | void
  
  /**
   * 错误处理
   */
  onFetchError?: (ctx: OnFetchErrorContext) => Promise<Partial<OnFetchErrorContext> | void> | Partial<OnFetchErrorContext> | void
}

export interface BeforeFetchContext {
  url: string
  options: RequestInit
  cancel: () => void
}

export interface AfterFetchContext {
  response: Response
  data: any
}

export interface OnFetchErrorContext {
  error: any
  data: any
}

export interface UseFetchReturn<T> {
  /**
   * 响应数据
   */
  data: T | null
  
  /**
   * 错误信息
   */
  error: Error | null
  
  /**
   * 是否正在加载
   */
  isLoading: boolean
  
  /**
   * 是否已完成（成功或失败）
   */
  isFinished: boolean
  
  /**
   * 是否可以中止
   */
  canAbort: boolean
  
  /**
   * 是否已中止
   */
  aborted: boolean
  
  /**
   * HTTP 状态码
   */
  statusCode: number | null
  
  /**
   * 响应对象
   */
  response: Response | null
  
  /**
   * 执行请求
   */
  execute: (throwOnFailed?: boolean) => Promise<any>
  
  /**
   * 中止请求
   */
  abort: () => void
  
  /**
   * 获取 JSON 数据
   */
  json: <JSON = any>() => Promise<JSON>
  
  /**
   * 获取文本数据
   */
  text: () => Promise<string>
  
  /**
   * 获取 Blob 数据
   */
  blob: () => Promise<Blob>
  
  /**
   * 获取 ArrayBuffer 数据
   */
  arrayBuffer: () => Promise<ArrayBuffer>
  
  /**
   * 获取 FormData 数据
   */
  formData: () => Promise<FormData>
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
export function useFetch<T = any>(
  url: string,
  options: UseFetchOptions = {}
): UseFetchReturn<T> {
  const {
    method = 'GET',
    headers,
    body,
    mode,
    credentials,
    cache,
    redirect,
    referrer,
    referrerPolicy,
    integrity,
    keepalive,
    signal,
    timeout,
    immediate = true,
    retries = 0,
    retryDelay = 1000,
    beforeFetch,
    afterFetch,
    onFetchError
  } = options

  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [aborted, setAborted] = useState(false)
  const [statusCode, setStatusCode] = useState<number | null>(null)
  const [response, setResponse] = useState<Response | null>(null)

  const abortControllerRef = useRef<AbortController | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const canAbort = abortControllerRef.current !== null

  // 中止请求
  const abort = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
      setAborted(true)
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  // 执行请求
  const execute = useCallback(async (throwOnFailed = false, overrideOptions: Partial<UseFetchOptions> = {}) => {
    const mergedOptions = { ...options, ...overrideOptions }
    let currentUrl = url
    let requestOptions: RequestInit = {
      method: mergedOptions.method || method
    }
    
    // 只添加非 undefined 的属性
    const finalHeaders = mergedOptions.headers || headers
    if (finalHeaders) {
      requestOptions.headers = finalHeaders
    }
    
    const finalBody = mergedOptions.body !== undefined ? mergedOptions.body : body
    if (finalBody !== undefined) {
      requestOptions.body = finalBody
    }
    
    const finalMode = mergedOptions.mode || mode
    if (finalMode) {
      requestOptions.mode = finalMode
    }
    
    const finalCredentials = mergedOptions.credentials || credentials
    if (finalCredentials) {
      requestOptions.credentials = finalCredentials
    }
    
    const finalCache = mergedOptions.cache || cache
    if (finalCache) {
      requestOptions.cache = finalCache
    }
    
    const finalRedirect = mergedOptions.redirect || redirect
    if (finalRedirect) {
      requestOptions.redirect = finalRedirect
    }
    
    const finalReferrer = mergedOptions.referrer || referrer
    if (finalReferrer) {
      requestOptions.referrer = finalReferrer
    }
    
    const finalReferrerPolicy = mergedOptions.referrerPolicy || referrerPolicy
    if (finalReferrerPolicy) {
      requestOptions.referrerPolicy = finalReferrerPolicy
    }
    
    const finalIntegrity = mergedOptions.integrity || integrity
    if (finalIntegrity) {
      requestOptions.integrity = finalIntegrity
    }
    
    const finalKeepalive = mergedOptions.keepalive !== undefined ? mergedOptions.keepalive : keepalive
    if (finalKeepalive !== undefined) {
      requestOptions.keepalive = finalKeepalive
    }

    // 创建 AbortController
    abortControllerRef.current = new AbortController()
    requestOptions.signal = signal || abortControllerRef.current.signal

    setIsLoading(true)
    setIsFinished(false)
    setError(null)
    setAborted(false)

    // 设置超时
    if (timeout) {
      timeoutRef.current = setTimeout(() => {
        abort()
      }, timeout)
    }

    try {
      // beforeFetch 拦截器
      if (beforeFetch) {
        const ctx: BeforeFetchContext = {
          url: currentUrl,
          options: requestOptions,
          cancel: abort
        }
        const result = await beforeFetch(ctx)
        if (result) {
          currentUrl = result.url || currentUrl
          requestOptions = { ...requestOptions, ...result.options }
        }
      }

      let currentRetries = 0
      let lastError: Error

      while (currentRetries <= retries) {
        try {
          const fetchResponse = await fetch(currentUrl, requestOptions)
          setResponse(fetchResponse)
          setStatusCode(fetchResponse.status)

          if (!fetchResponse.ok) {
            throw new Error(`HTTP Error: ${fetchResponse.status} ${fetchResponse.statusText}`)
          }

          let responseData: any
          const contentType = fetchResponse.headers.get('content-type')
          
          if (contentType?.includes('application/json')) {
            responseData = await fetchResponse.json()
          } else if (contentType?.includes('text/')) {
            responseData = await fetchResponse.text()
          } else {
            responseData = await fetchResponse.blob()
          }

          // afterFetch 拦截器
          if (afterFetch) {
            const ctx: AfterFetchContext = {
              response: fetchResponse,
              data: responseData
            }
            const result = await afterFetch(ctx)
            if (result?.data !== undefined) {
              responseData = result.data
            }
          }

          setData(responseData)
          setIsLoading(false)
          setIsFinished(true)

          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
            timeoutRef.current = null
          }

          return responseData
        } catch (err) {
          lastError = err as Error
          currentRetries++
          
          if (currentRetries <= retries) {
            await new Promise(resolve => setTimeout(resolve, retryDelay))
          }
        }
      }

      throw lastError!
    } catch (err) {
      const fetchError = err as Error
      
      // onFetchError 拦截器
      if (onFetchError) {
        const ctx: OnFetchErrorContext = {
          error: fetchError,
          data: null
        }
        await onFetchError(ctx)
      }

      setError(fetchError)
      setIsLoading(false)
      setIsFinished(true)

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }

      if (throwOnFailed) {
        throw fetchError
      }
    }
  }, [url, options, method, headers, body, mode, credentials, cache, redirect, referrer, referrerPolicy, integrity, keepalive, signal, timeout, retries, retryDelay, beforeFetch, afterFetch, onFetchError, abort])

  // 数据解析方法
  const json = useCallback(async <JSON = any>(): Promise<JSON> => {
    if (!response) throw new Error('No response available')
    return response.json()
  }, [response])

  const text = useCallback(async (): Promise<string> => {
    if (!response) throw new Error('No response available')
    return response.text()
  }, [response])

  const blob = useCallback(async (): Promise<Blob> => {
    if (!response) throw new Error('No response available')
    return response.blob()
  }, [response])

  const arrayBuffer = useCallback(async (): Promise<ArrayBuffer> => {
    if (!response) throw new Error('No response available')
    return response.arrayBuffer()
  }, [response])

  const formData = useCallback(async (): Promise<FormData> => {
    if (!response) throw new Error('No response available')
    return response.formData()
  }, [response])

  // 立即执行
  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [immediate, execute])

  // 清理
  useEffect(() => {
    return () => {
      abort()
    }
  }, [])

  return {
    data,
    error,
    isLoading,
    isFinished,
    canAbort,
    aborted,
    statusCode,
    response,
    execute,
    abort,
    json,
    text,
    blob,
    arrayBuffer,
    formData
  }
}

/**
 * 创建 useFetch 的实例，带有预设配置
 * 
 * @param baseUrl - 基础 URL
 * @param options - 默认配置选项
 * @returns 配置好的 useFetch 函数
 */
export function createFetch(
  baseUrl: string = '',
  options: UseFetchOptions = {}
) {
  return function <T = any>(url: string, fetchOptions: UseFetchOptions = {}) {
    const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`
    const mergedOptions = { ...options, ...fetchOptions }
    return useFetch<T>(fullUrl, mergedOptions)
  }
}