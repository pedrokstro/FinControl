import { useState, useEffect } from 'react'

/**
 * Hook para gerenciar transições suaves entre páginas
 * Adiciona um delay mínimo para evitar flashes de conteúdo
 */
export const usePageTransition = (minLoadingTime = 300) => {
  const [isLoading, setIsLoading] = useState(true)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Simular tempo mínimo de carregamento para transição suave
    const timer = setTimeout(() => {
      setIsLoading(false)
      // Pequeno delay adicional para animação de fade-in
      setTimeout(() => setIsReady(true), 50)
    }, minLoadingTime)

    return () => clearTimeout(timer)
  }, [minLoadingTime])

  return { isLoading, isReady }
}
