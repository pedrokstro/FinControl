import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import CreditCardModal from '@/components/modals/CreditCardModal'
import ConfirmDeleteModal from '@/components/modals/ConfirmDeleteModal'

describe('Modal action buttons pill standard', () => {
  it('renderiza botão Adicionar Cartão no CreditCardModal com estilo pill (rounded-full)', () => {
    render(<CreditCardModal isOpen={true} onClose={vi.fn()} />)

    const submitButton = screen.getByRole('button', { name: /Adicionar Cartão/i })
    expect(submitButton.className).toContain('rounded-full')
  })

  it('renderiza botões Cancelar e Excluir no ConfirmDeleteModal com estilo pill (rounded-full)', () => {
    render(
      <ConfirmDeleteModal
        isOpen={true}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        itemName="Assinatura Teste"
      />
    )

    const cancelButton = screen.getByRole('button', { name: /Cancelar/i })
    const deleteButton = screen.getByRole('button', { name: /Excluir/i })

    expect(cancelButton.className).toContain('rounded-full')
    expect(deleteButton.className).toContain('rounded-full')
  })
})
