import { useState, useEffect, useCallback } from 'react'

interface CacheOptions {
  ttl?: number // Time to live em milissegundos (padrão: 5 minutos)
  key: string
}

interface CacheEntry<T> {
  data: T
  timestamp: number
}

/**
 * Hook para cache de dados com TTL
 * Armazena dados no sessionStorage com expiração automática
 */
export const useCache = <T,>(options: CacheOptions) => {
  const { ttl = 5 * 60 * 1000, key } = options // 5 minutos padrão
  const [cachedData, setCachedData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Carregar do cache ao montar
  useEffect(() => {
    const loadFromCache = () => {
      try {
        const cached = sessionStorage.getItem(key)
        if (!cached) return

        const entry: CacheEntry<T> = JSON.parse(cached)
        const now = Date.now()

        // Verificar se ainda é válido
        if (now - entry.timestamp < ttl) {
          setCachedData(entry.data)
          return true
        } else {
          // Expirado, remover
          sessionStorage.removeItem(key)
        }
      } catch (error) {
        console.error('Erro ao carregar cache:', error)
        sessionStorage.removeItem(key)
      }
      return false
    }

    loadFromCache()
  }, [key, ttl])

  // Salvar no cache
  const setCache = useCallback((data: T) => {
    try {
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now()
      }
      sessionStorage.setItem(key, JSON.stringify(entry))
      setCachedData(data)
    } catch (error) {
      console.error('Erro ao salvar cache:', error)
    }
  }, [key])

  // Limpar cache
  const clearCache = useCallback(() => {
    sessionStorage.removeItem(key)
    setCachedData(null)
  }, [key])

  // Buscar dados com cache
  const fetchWithCache = useCallback(async <R,>(
    fetcher: () => Promise<R>,
    forceRefresh = false
  ): Promise<R> => {
    // Se tem cache válido e não é refresh forçado, retornar cache
    if (cachedData && !forceRefresh) {
      return cachedData as unknown as R
    }

    setIsLoading(true)
    try {
      const data = await fetcher()
      setCache(data as unknown as T)
      return data
    } finally {
      setIsLoading(false)
    }
  }, [cachedData, setCache])

  return {
    cachedData,
    isLoading,
    setCache,
    clearCache,
    fetchWithCache
  }
}

/**
 * Hook simplificado para cache de queries
 */
export const useQueryCache = <T,>(
  key: string,
  fetcher: () => Promise<T>,
  options?: { ttl?: number; enabled?: boolean }
) => {
  const { ttl = 5 * 60 * 1000, enabled = true } = options || {}
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!enabled) return

    const loadData = async () => {
      // Tentar carregar do cache primeiro
      try {
        const cached = sessionStorage.getItem(key)
        if (cached) {
          const entry: CacheEntry<T> = JSON.parse(cached)
          const now = Date.now()

          if (now - entry.timestamp < ttl) {
            setData(entry.data)
            return
          }
        }
      } catch (err) {
        console.error('Erro ao carregar cache:', err)
      }

      // Se não tem cache válido, buscar dados
      setIsLoading(true)
      setError(null)
      
      try {
        const result = await fetcher()
        const entry: CacheEntry<T> = {
          data: result,
          timestamp: Date.now()
        }
        sessionStorage.setItem(key, JSON.stringify(entry))
        setData(result)
      } catch (err) {
        setError(err as Error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [key, ttl, enabled])

  const refetch = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const result = await fetcher()
      const entry: CacheEntry<T> = {
        data: result,
        timestamp: Date.now()
      }
      sessionStorage.setItem(key, JSON.stringify(entry))
      setData(result)
      return result
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [key, fetcher])

  const clearCache = useCallback(() => {
    sessionStorage.removeItem(key)
    setData(null)
  }, [key])

  return {
    data,
    isLoading,
    error,
    refetch,
    clearCache
  }
}

export default useCache
