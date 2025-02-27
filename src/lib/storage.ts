import superjson from 'superjson'

const STORAGE_KEY_PREFIX = 'similar_'

const isBrowser = typeof window !== 'undefined' && !!window.localStorage

export async function storageSet<T>(key: string, value: T, storage: Storage = localStorage) {
  if (isBrowser) {
    return storage.setItem(STORAGE_KEY_PREFIX + key, superjson.stringify(value))
  }
  // On server, this is a no-op
  return undefined
}

export async function storageGet<T>(key: string, storage: Storage = localStorage) {
  if (isBrowser) {
    const val = storage.getItem(STORAGE_KEY_PREFIX + key)
    return val ? superjson.parse<T>(val) : undefined
  }

  // On server, always return undefined
  return undefined
}

export async function storageRemove(key: string, storage: Storage = localStorage) {
  if (isBrowser) {
    return storage.removeItem(STORAGE_KEY_PREFIX + key)
  }
  // On server, this is a no-op
  return undefined
}
