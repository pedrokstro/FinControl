import { describe, it, expect, beforeEach, vi } from 'vitest'
import axios, { AxiosError, AxiosHeaders } from 'axios'
import api, { registerApiAuthHandlers } from '@/config/api'

describe('API single-flight 401 refresh', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('dispara apenas um /auth/refresh para múltiplas requisições 401 simultâneas e atualiza o token', async () => {
    localStorage.setItem(
      'auth-storage',
      JSON.stringify({
        state: {
          accessToken: 'expired-token',
          refreshToken: 'valid-refresh',
        },
      })
    )

    const refreshedTokens: string[] = []
    registerApiAuthHandlers({
      onTokenRefreshed: (token) => refreshedTokens.push(token),
    })

    const refreshSpy = vi.spyOn(axios, 'post').mockResolvedValueOnce({
      data: { data: { accessToken: 'fresh-token' } },
    })

    const originalAdapter = api.defaults.adapter
    let attempt = 0
    api.defaults.adapter = async (config) => {
      attempt += 1
      if (config.headers?.Authorization === 'Bearer expired-token') {
        throw new AxiosError(
          'Unauthorized',
          'ERR_BAD_REQUEST',
          config,
          null,
          {
            status: 401,
            statusText: 'Unauthorized',
            headers: {},
            config,
            data: {},
          }
        )
      }
      return {
        data: { ok: true, attempt, auth: config.headers?.Authorization },
        status: 200,
        statusText: 'OK',
        headers: new AxiosHeaders(),
        config,
      }
    }

    try {
      const [resA, resB] = await Promise.all([api.get('/transactions'), api.get('/categories')])

      expect(refreshSpy).toHaveBeenCalledTimes(1)
      expect(refreshedTokens).toEqual(['fresh-token'])
      expect(resA.data.auth).toBe('Bearer fresh-token')
      expect(resB.data.auth).toBe('Bearer fresh-token')
    } finally {
      api.defaults.adapter = originalAdapter
    }
  })
})
