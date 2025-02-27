import { useCallback, useEffect, useState } from 'react'
import { storageGet, storageRemove, storageSet } from './storage'

interface StoredValue<T> {
  value: T
  expiresAt?: number
}

export function useStoredState<T>(key: string, initialValue: T, ttl?: number, storage?: Storage) {
  const [value, setValue] = useState<T | undefined>(undefined)

  const refreshValue = useCallback(() => {
    storageGet<StoredValue<T>>(key, storage).then((stored) => {
      if (stored) {
        const now = Date.now()
        if (!stored.expiresAt || stored.expiresAt > now) {
          setValue(stored.value)
        } else {
          reset()
        }
      } else {
        setValue(initialValue)
      }
    })
  }, [key, initialValue, storage])

  useEffect(() => {
    refreshValue()
  }, [key, refreshValue])

  useEffect(() => {
    if (value !== undefined) {
      const storedValue: StoredValue<T> = {
        value,
        expiresAt: ttl ? Date.now() + ttl : undefined,
      }

      storageSet(key, storedValue, storage)
    }
  }, [key, value, ttl, storage])

  const reset = useCallback(() => {
    storageRemove(key, storage).then(() => setValue(initialValue))
  }, [key, initialValue, storage])

  return [value, setValue, reset] as const
}
