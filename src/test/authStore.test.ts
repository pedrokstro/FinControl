import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from '@/store/authStore'

describe('Auth Store', () => {
  beforeEach(() => {
    // Reset store before each test
    useAuthStore.setState({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    })
  })

  it('should have initial state', () => {
    const state = useAuthStore.getState()
    
    expect(state.user).toBeNull()
    expect(state.accessToken).toBeNull()
    expect(state.isAuthenticated).toBe(false)
  })

  it('should login successfully with correct credentials', async () => {
    const { login } = useAuthStore.getState()
    
    await login('demo@financeiro.com', 'demo123')
    
    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(true)
    expect(state.user).toBeDefined()
    expect(state.user?.email).toBe('demo@financeiro.com')
    expect(state.accessToken).toBeDefined()
  })

  it('should fail login with incorrect credentials', async () => {
    const { login } = useAuthStore.getState()
    
    await expect(login('wrong@email.com', 'wrongpassword')).rejects.toThrow()
    
    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(false)
    expect(state.user).toBeNull()
  })

  it('should logout user', async () => {
    const { login, logout } = useAuthStore.getState()
    
    // First login
    await login('demo@financeiro.com', 'demo123')
    expect(useAuthStore.getState().isAuthenticated).toBe(true)
    
    // Then logout
    logout()
    
    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(false)
    expect(state.user).toBeNull()
    expect(state.accessToken).toBeNull()
  })

  it('should update user profile', async () => {
    const { login, updateUser } = useAuthStore.getState()
    
    await login('demo@financeiro.com', 'demo123')
    
    updateUser({ name: 'Updated Name' })
    
    const state = useAuthStore.getState()
    expect(state.user?.name).toBe('Updated Name')
  })
})
