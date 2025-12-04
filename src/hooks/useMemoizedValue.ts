import { useMemo, useRef, useEffect, useState } from 'react'

/**
 * Hook para memoização profunda de valores
 * Útil para objetos e arrays que mudam referência mas têm o mesmo conteúdo
 */
export const useDeepMemo = <T,>(value: T): T => {
  const ref = useRef<T>(value)
  const signalRef = useRef<number>(0)

  const isEqual = (a: any, b: any): boolean => {
    if (a === b) return true
    if (a == null || b == null) return false
    if (typeof a !== 'object' || typeof b !== 'object') return false

    const keysA = Object.keys(a)
    const keysB = Object.keys(b)

    if (keysA.length !== keysB.length) return false

    for (const key of keysA) {
      if (!keysB.includes(key)) return false
      if (!isEqual(a[key], b[key])) return false
    }

    return true
  }

  if (!isEqual(value, ref.current)) {
    ref.current = value
    signalRef.current += 1
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => ref.current, [signalRef.current])
}

/**
 * Hook para memoizar cálculos pesados com dependências
 */
export const useHeavyComputation = <T,>(
  compute: () => T,
  deps: any[]
): T => {
  return useMemo(() => {
    const start = performance.now()
    const result = compute()
    const end = performance.now()
    
    if (end - start > 16) { // Mais de 1 frame (16ms)
      console.warn(`Computação pesada detectada: ${(end - start).toFixed(2)}ms`)
    }
    
    return result
  }, deps)
}

/**
 * Hook para memoizar funções de callback com dependências profundas
 */
export const useDeepCallback = <T extends (...args: any[]) => any>(
  callback: T,
  deps: any[]
): T => {
  const memoizedDeps = useDeepMemo(deps)
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => callback, [memoizedDeps])
}

/**
 * Hook para debounce de valores
 * Útil para evitar re-renders excessivos
 */
export const useDebouncedValue = <T,>(value: T, delay: number = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * Hook para throttle de valores
 * Limita a frequência de atualizações
 */
export const useThrottledValue = <T,>(value: T, interval: number = 500): T => {
  const [throttledValue, setThrottledValue] = useState<T>(value)
  const lastUpdated = useRef<number>(Date.now())

  useEffect(() => {
    const now = Date.now()
    const timeSinceLastUpdate = now - lastUpdated.current

    if (timeSinceLastUpdate >= interval) {
      setThrottledValue(value)
      lastUpdated.current = now
    } else {
      const timeoutId = setTimeout(() => {
        setThrottledValue(value)
        lastUpdated.current = Date.now()
      }, interval - timeSinceLastUpdate)

      return () => clearTimeout(timeoutId)
    }
  }, [value, interval])

  return throttledValue
}

/**
 * Hook para memoizar seletores de estado
 * Evita re-renders quando o valor selecionado não muda
 */
export const useMemoizedSelector = <TState, TSelected>(
  selector: (state: TState) => TSelected,
  state: TState
): TSelected => {
  const selectedValue = selector(state)
  return useDeepMemo(selectedValue)
}
