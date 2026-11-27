import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import AdminOverviewTab from '@/components/admin/AdminOverviewTab'
import AdminUsersTab from '@/components/admin/AdminUsersTab'
import AdminCardsTab from '@/components/admin/AdminCardsTab'
import MobileCardLivePreview from '@/components/admin/MobileCardLivePreview'

import CardEditModal, { CardFormData } from '@/components/admin/CardEditModal'

describe('Admin Module Polish & Features', () => {
  it('AdminOverviewTab renders metrics and conversion rate', () => {
    const stats = {
      totalUsers: 100,
      premiumUsers: 25,
      totalNotifications: 15,
    }
    const onSelectTab = vi.fn()
    const onSendBroadcast = vi.fn()
    const onSendQuick = vi.fn()

    render(
      <AdminOverviewTab
        stats={stats}
        onSelectTab={onSelectTab}
        onSendBroadcast={onSendBroadcast}
        onSendQuick={onSendQuick}
        isLoading={false}
      />
    )

    expect(screen.getByText('100')).toBeDefined()
    expect(screen.getByText('25')).toBeDefined()
    expect(screen.getByText('25.0% de conversão')).toBeDefined()
    expect(screen.getByText('15')).toBeDefined()
  })

  it('AdminUsersTab filters users by search term and plan chips', () => {
    const mockUsers = [
      { id: '1', name: 'Ana Silva', email: 'ana@teste.com', isPremium: true, createdAt: '2026-01-01' },
      { id: '2', name: 'Bruno Santos', email: 'bruno@teste.com', isPremium: false, createdAt: '2026-01-02' },
    ]

    render(
      <AdminUsersTab
        users={mockUsers}
        isLoading={false}
        onRefresh={vi.fn()}
        onTogglePremium={vi.fn()}
        onToggleStatus={vi.fn()}
        onOpenDirectNotification={vi.fn()}
      />
    )

    // Initial render shows both users
    expect(screen.getByText('Ana Silva')).toBeDefined()
    expect(screen.getByText('Bruno Santos')).toBeDefined()

    // Filter by search term
    const searchInput = screen.getByPlaceholderText('Buscar por nome ou e-mail...')
    fireEvent.change(searchInput, { target: { value: 'Ana' } })
    expect(screen.getByText('Ana Silva')).toBeDefined()
    expect(screen.queryByText('Bruno Santos')).toBeNull()

    // Clear search
    fireEvent.change(searchInput, { target: { value: '' } })
    expect(screen.getByText('Bruno Santos')).toBeDefined()

    // Filter by Premium chip
    const premiumChip = screen.getByText(/Premium \(1\)/)
    fireEvent.click(premiumChip)
    expect(screen.getByText('Ana Silva')).toBeDefined()
    expect(screen.queryByText('Bruno Santos')).toBeNull()
  })

  it('AdminCardsTab displays cards and allows inline active toggle', () => {
    const mockCards = [
      {
        id: 'card-1',
        title: 'Fatura do Cartão',
        desc: 'Pague sua fatura',
        bg: 'bg-primary-600 text-white',
        textColor: 'text-white',
        descColor: 'text-white/80',
        actionPath: '/app/cards',
        isActive: true,
      },
    ]

    const onToggleActive = vi.fn()

    render(
      <AdminCardsTab
        cards={mockCards}
        isLoading={false}
        onOpenCardModal={vi.fn()}
        onDeleteCard={vi.fn()}
        onToggleActive={onToggleActive}
      />
    )

    expect(screen.getByText('Fatura do Cartão')).toBeDefined()
    const toggleButton = screen.getByText('Ativo no Mobile')
    fireEvent.click(toggleButton)
    expect(onToggleActive).toHaveBeenCalledWith(mockCards[0])
  })

  it('MobileCardLivePreview displays proper content', () => {
    render(
      <MobileCardLivePreview
        title="Dica de Investimento"
        desc="Comece com uma reserva de emergência"
        bg="bg-amber-500 text-white"
        textColor="text-white"
        descColor="text-white/95"
        actionPath="/app/investimentos"
      />
    )

    expect(screen.getByText('Dica de Investimento')).toBeDefined()
    expect(screen.getByText('Comece com uma reserva de emergência')).toBeDefined()
    expect(screen.getByText(/Atalho: \/app\/investimentos/)).toBeDefined()
  })

  it('CardEditModal renders color presets and allows selecting curated icons without blur', () => {
    let testFormData: CardFormData = {
      title: 'Cartão de Benefício',
      desc: 'Desconto de 20% exclusivo',
      icon: 'Tag',
      imageSrc: '',
      bg: 'bg-primary-600 dark:bg-primary-700 shadow-sm shadow-primary-500/10',
      textColor: 'text-white',
      descColor: 'text-white/80',
      iconColor: 'text-white',
      iconBg: 'bg-white/20',
      actionPath: '/app/cards',
      isActive: true,
    }

    const setFormData = vi.fn((updater) => {
      if (typeof updater === 'function') {
        testFormData = updater(testFormData)
      } else {
        testFormData = updater
      }
    })

    const { container } = render(
      <CardEditModal
        isOpen={true}
        cardId="card-1"
        formData={testFormData}
        setFormData={setFormData}
        onClose={vi.fn()}
        onSave={vi.fn()}
        isLoading={false}
      />
    )

    // Check modal title
    expect(screen.getByText('Editar Card de Aviso')).toBeDefined()

    // Verify zero backdrop-blur classes in the modal container for performance
    const hasBackdropBlur = container.innerHTML.includes('backdrop-blur')
    expect(hasBackdropBlur).toBe(false)

    // Check color presets rendered without truncation
    expect(screen.getByText('Branco Neutro')).toBeDefined()
    expect(screen.getByText('Azul FinControl')).toBeDefined()
    expect(screen.getByText('Âmbar Destaque')).toBeDefined()
    expect(screen.getByText('Verde Esmeralda')).toBeDefined()
    expect(screen.getByText('Carmim Alerta')).toBeDefined()
    expect(screen.getByText('Dark Grafite')).toBeDefined()

    // Click on Amber preset
    const amberButton = screen.getByText('Âmbar Destaque')
    fireEvent.click(amberButton)
    expect(setFormData).toHaveBeenCalled()

    // Test icon filter input
    const iconSearchInput = screen.getByPlaceholderText('Buscar ícone por nome...')
    fireEvent.change(iconSearchInput, { target: { value: 'Segurança' } })
    expect(screen.getByTitle(/Segurança \(Shield\)/)).toBeDefined()

    // Select curated icon
    const shieldIconBtn = screen.getByTitle(/Segurança \(Shield\)/)
    fireEvent.click(shieldIconBtn)
    expect(setFormData).toHaveBeenCalled()
  })
})
