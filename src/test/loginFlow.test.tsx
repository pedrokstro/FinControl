import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Login from '@/pages/Login'
import { useAuthStore } from '@/store/authStore'
import { usePreloaderStore } from '@/store/preloaderStore'

vi.mock('@/components/auth/AuthVisualSide', () => ({
  default: () => <div data-testid="auth-visual-side" />,
}))

describe('Login page UI and submission flow', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useAuthStore.setState({
      isAuthenticated: false,
      user: null,
    } as any)
    usePreloaderStore.setState({
      isOpen: false,
      isSuccess: false,
    })
  })

  it('renderiza campos acessíveis com autocomplete e alterna visibilidade da senha', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    )

    const emailInput = screen.getByPlaceholderText('seu@email.com')
    const passwordInput = screen.getByPlaceholderText('••••••••')

    expect(emailInput).toHaveAttribute('autocomplete', 'email')
    expect(emailInput).toHaveAttribute('inputmode', 'email')
    expect(passwordInput).toHaveAttribute('autocomplete', 'current-password')
    expect(passwordInput).toHaveAttribute('type', 'password')

    fireEvent.click(screen.getByRole('button', { name: 'Exibir senha' }))
    expect(passwordInput).toHaveAttribute('type', 'text')
  })

  it('envia credenciais ao fazer login por e-mail', async () => {
    const login = vi.fn().mockResolvedValue(true)
    const refreshUserData = vi.fn().mockResolvedValue(undefined)
    useAuthStore.setState({ login, refreshUserData } as any)

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    )

    fireEvent.change(screen.getByPlaceholderText('seu@email.com'), {
      target: { value: 'pedro@fincontrol.dev' },
    })
    fireEvent.change(screen.getByPlaceholderText('••••••••'), {
      target: { value: 'SenhaForte!123' },
    })

    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }))

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith('pedro@fincontrol.dev', 'SenhaForte!123')
    })
    await waitFor(() => {
      expect(refreshUserData).toHaveBeenCalledTimes(1)
    })
  })
})
