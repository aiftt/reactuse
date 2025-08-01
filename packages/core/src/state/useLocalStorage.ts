import { useState, useEffect, useCallback, useRef } from 'react';
import { isClient, DEFAULT_SERIALIZERS } from '@reactuse/shared';
import type { Serializer, StorageOptions } from '@reactuse/shared';

export interface UseLocalStorageOptions<T> extends Omit<StorageOptions<T>, 'listenToStorageChanges'> {
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
export function useLocalStorage<T = string>(
  key: string,
  defaultValue: T,
  options: UseLocalStorageOptions<T> = {}
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const {
    serializer = DEFAULT_SERIALIZERS.any as Serializer<T>,
    syncAcrossTabs = true,
    onError = console.error,
  } = options;

  // 获取初始值
  const getStoredValue = useCallback((): T => {
    if (!isClient) return defaultValue;
    
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;
      return serializer.read(item);
    } catch (error) {
      onError(error);
      return defaultValue;
    }
  }, [key, defaultValue, serializer, onError]);

  const [storedValue, setStoredValue] = useState<T>(getStoredValue);
  const isUpdatingRef = useRef(false);

  // 设置值到 localStorage
  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    if (!isClient) return;
    
    try {
      isUpdatingRef.current = true;
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      if (valueToStore === undefined) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, serializer.write(valueToStore));
      }
    } catch (error) {
      onError(error);
    } finally {
      isUpdatingRef.current = false;
    }
  }, [key, storedValue, serializer, onError]);

  // 移除值
  const removeValue = useCallback(() => {
    if (!isClient) return;
    
    try {
      isUpdatingRef.current = true;
      localStorage.removeItem(key);
      setStoredValue(defaultValue);
    } catch (error) {
      onError(error);
    } finally {
      isUpdatingRef.current = false;
    }
  }, [key, defaultValue, onError]);

  // 监听存储变化
  useEffect(() => {
    if (!isClient || !syncAcrossTabs) return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.storageArea === localStorage && !isUpdatingRef.current) {
        try {
          if (e.newValue === null) {
            setStoredValue(defaultValue);
          } else {
            setStoredValue(serializer.read(e.newValue));
          }
        } catch (error) {
          onError(error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, defaultValue, serializer, syncAcrossTabs, onError]);

  // 初始化时同步值
  useEffect(() => {
    const currentValue = getStoredValue();
    if (currentValue !== storedValue) {
      setStoredValue(currentValue);
    }
  }, [getStoredValue, storedValue]);

  return [storedValue, setValue, removeValue];
}

// 类型化的便捷函数
export function useLocalStorageString(
  key: string,
  defaultValue: string = '',
  options?: Omit<UseLocalStorageOptions<string>, 'serializer'>
) {
  return useLocalStorage(key, defaultValue, {
    ...options,
    serializer: DEFAULT_SERIALIZERS.string,
  });
}

export function useLocalStorageNumber(
  key: string,
  defaultValue: number = 0,
  options?: Omit<UseLocalStorageOptions<number>, 'serializer'>
) {
  return useLocalStorage(key, defaultValue, {
    ...options,
    serializer: {
      read: (v: string) => {
        const num = Number(v);
        return Number.isNaN(num) ? defaultValue : num;
      },
      write: (v: number) => String(v),
    },
  });
}

export function useLocalStorageBoolean(
  key: string,
  defaultValue: boolean = false,
  options?: Omit<UseLocalStorageOptions<boolean>, 'serializer'>
) {
  return useLocalStorage(key, defaultValue, {
    ...options,
    serializer: DEFAULT_SERIALIZERS.boolean,
  });
}

export function useLocalStorageObject<T extends Record<string, any>>(
  key: string,
  defaultValue: T,
  options?: Omit<UseLocalStorageOptions<T>, 'serializer'>
) {
  return useLocalStorage(key, defaultValue, {
    ...options,
    serializer: DEFAULT_SERIALIZERS.object,
  });
}