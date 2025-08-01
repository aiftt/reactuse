import { useState, useEffect, useCallback } from 'react'

type Listener<T> = (value: T) => void
type Setter<T> = (value: T | ((prev: T) => T)) => void

interface GlobalState<T> {
  listeners: Set<Listener<T>>
  value: T
}

const globalStates = new Map<string | symbol, GlobalState<any>>()

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
export function createGlobalState<T>(
  key: string | symbol,
  initialValue: T
): () => [T, Setter<T>] {
  // 初始化全局状态
  if (!globalStates.has(key)) {
    globalStates.set(key, {
      listeners: new Set(),
      value: initialValue,
    })
  }

  return function useGlobalState(): [T, Setter<T>] {
    const globalState = globalStates.get(key)!
    const [localValue, setLocalValue] = useState<T>(globalState.value)

    // 监听全局状态变化
    useEffect(() => {
      const listener: Listener<T> = (newValue: T) => {
        setLocalValue(newValue)
      }

      globalState.listeners.add(listener)

      // 确保本地状态与全局状态同步
      if (localValue !== globalState.value) {
        setLocalValue(globalState.value)
      }

      return () => {
        globalState.listeners.delete(listener)
      }
    }, [])

    // 设置全局状态
    const setGlobalValue = useCallback<Setter<T>>((newValue) => {
      const globalState = globalStates.get(key)!
      const nextValue = typeof newValue === 'function' 
        ? (newValue as (prev: T) => T)(globalState.value)
        : newValue

      globalState.value = nextValue

      // 通知所有监听器
      globalState.listeners.forEach(listener => {
        listener(nextValue)
      })
    }, [])

    return [localValue, setGlobalValue]
  }
}

/**
 * 获取全局状态的当前值（不订阅变化）
 * 
 * @param key - 全局状态的唯一标识符
 * @returns 当前值，如果状态不存在则返回 undefined
 */
export function getGlobalState<T>(key: string | symbol): T | undefined {
  const globalState = globalStates.get(key)
  return globalState?.value
}

/**
 * 设置全局状态的值（不需要在组件中使用）
 * 
 * @param key - 全局状态的唯一标识符
 * @param value - 新值或更新函数
 */
export function setGlobalState<T>(
  key: string | symbol,
  value: T | ((prev: T) => T)
): void {
  const globalState = globalStates.get(key)
  if (!globalState) {
    console.warn(`Global state with key "${String(key)}" does not exist`)
    return
  }

  const nextValue = typeof value === 'function'
    ? (value as (prev: T) => T)(globalState.value)
    : value

  globalState.value = nextValue

  // 通知所有监听器
  globalState.listeners.forEach(listener => {
    listener(nextValue)
  })
}

/**
 * 重置全局状态到初始值
 * 
 * @param key - 全局状态的唯一标识符
 * @param initialValue - 初始值
 */
export function resetGlobalState<T>(
  key: string | symbol,
  initialValue: T
): void {
  const globalState = globalStates.get(key)
  if (!globalState) {
    console.warn(`Global state with key "${String(key)}" does not exist`)
    return
  }

  globalState.value = initialValue

  // 通知所有监听器
  globalState.listeners.forEach(listener => {
    listener(initialValue)
  })
}

/**
 * 销毁全局状态
 * 
 * @param key - 全局状态的唯一标识符
 */
export function destroyGlobalState(key: string | symbol): void {
  globalStates.delete(key)
}