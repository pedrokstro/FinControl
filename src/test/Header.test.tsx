import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, useLocation } from 'react-router-dom'
import Header from '@/components/layout/Header'
import { useAuthStore } from '@/store/authStore'

const LocationDisplay = () => {
  const location = useLocation()
  return <div data-testid="location">{location.pathname + location.search}</div>
}

describe('Desktop Header quick add', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: { id: '1', name: 'Pedro Castro', email: 'pedro@test.com' },
      isAuthenticated: true,
    })
  })

  it('navega para /app/transactions?add=true ao clicar em Nova Transação fora do dashboard', () => {
    render(
      <MemoryRouter initialEntries={['/app/reports']}>
        <Header />
        <LocationDisplay />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByRole('button', { name: /Nova Transação/i }))
    expect(screen.getByTestId('location').textContent).toBe('/app/transactions?add=true')
  })

  it('abre quickAdd no dashboard ao pressionar Alt+N', () => {
    render(
      <MemoryRouter initialEntries={['/app/dashboard']}>
        <Header />
        <LocationDisplay />
      </MemoryRouter>
    )

    fireEvent.keyDown(window, { key: 'n', altKey: true })
    expect(screen.getByTestId('location').textContent).toBe('/app/dashboard?quickAdd=expense')
  })
})
