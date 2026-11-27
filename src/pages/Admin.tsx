import React, { useState, useEffect, useCallback } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import {
  Shield,
  LayoutDashboard,
  Users,
  Sparkles,
  History,
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import api from '@/config/api'
import PageTransition from '@/components/common/PageTransition'
import { haptics } from '@/utils/haptics'

// Componentes modulares do Painel Admin
import AdminOverviewTab, { Stats } from '@/components/admin/AdminOverviewTab'
import AdminUsersTab, { AdminUser } from '@/components/admin/AdminUsersTab'
import AdminCardsTab, { DashboardCardItem } from '@/components/admin/AdminCardsTab'
import AdminHistoryTab from '@/components/admin/AdminHistoryTab'
import DirectNotificationModal, { TargetUser } from '@/components/admin/DirectNotificationModal'
import CardEditModal, { CardFormData } from '@/components/admin/CardEditModal'

type AdminTab = 'overview' | 'users' | 'cards' | 'history'

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview')
  const shouldReduceMotion = useReducedMotion()

  // Estados Globais
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    premiumUsers: 0,
    totalNotifications: 0,
  })

  // Usuários
  const [users, setUsers] = useState<AdminUser[]>([])
  const [isLoadingUsers, setIsLoadingUsers] = useState(false)
  const [selectedUserForNotification, setSelectedUserForNotification] = useState<TargetUser | null>(null)

  // Cards do Dashboard Mobile
  const [cards, setCards] = useState<DashboardCardItem[]>([])
  const [isLoadingCards, setIsLoadingCards] = useState(false)
  const [showCardModal, setShowCardModal] = useState(false)
  const [editingCardId, setEditingCardId] = useState<string | null>(null)
  const [isSavingCard, setIsSavingCard] = useState(false)
  const [cardFormData, setCardFormData] = useState<CardFormData>({
    title: '',
    desc: '',
    icon: 'Shield',
    imageSrc: '',
    bg: 'bg-white dark:bg-neutral-900 border border-gray-200/60 dark:border-neutral-800/85 shadow-sm',
    textColor: 'text-gray-900 dark:text-white',
    descColor: 'text-gray-500 dark:text-neutral-400',
    iconColor: 'text-primary-600 dark:text-primary-400',
    iconBg: 'bg-primary-50 dark:bg-primary-950/20',
    actionPath: '/app/dashboard',
    isActive: true,
  })

  // Envio de Transmissão
  const [isSendingBroadcast, setIsSendingBroadcast] = useState(false)

  // Carregar dados iniciais
  const loadStats = useCallback(async () => {
    try {
      const res = await api.get('/admin/stats')
      setStats(res.data.data)
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error)
    }
  }, [])

  const loadUsers = useCallback(async () => {
    try {
      setIsLoadingUsers(true)
      const res = await api.get('/admin/users')
      setUsers(res.data.data || [])
    } catch (error) {
      console.error('Erro ao carregar usuários:', error)
      toast.error('Erro ao carregar lista de usuários')
    } finally {
      setIsLoadingUsers(false)
    }
  }, [])

  const loadCards = useCallback(async () => {
    try {
      setIsLoadingCards(true)
      const res = await api.get('/admin/dashboard-cards')
      setCards(res.data.data || [])
    } catch (error) {
      console.error('Erro ao carregar cards:', error)
    } finally {
      setIsLoadingCards(false)
    }
  }, [])

  useEffect(() => {
    loadStats()
    loadUsers()
    loadCards()
  }, [loadStats, loadUsers, loadCards])

  // Ações de Usuário
  const handleTogglePremium = async (userId: string) => {
    try {
      const res = await api.patch(`/admin/users/${userId}/toggle-premium`)
      toast.success(res.data.message || 'Status Premium atualizado')
      // Atualizar localmente
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? { ...u, isPremium: res.data.data.isPremium, planType: res.data.data.planType }
            : u
        )
      )
      loadStats()
    } catch (error: any) {
      console.error('Erro ao alternar status premium:', error)
      toast.error(error.response?.data?.message || 'Erro ao alterar status premium')
    }
  }

  const handleToggleStatus = async (userId: string) => {
    try {
      const res = await api.patch(`/admin/users/${userId}/toggle-status`)
      toast.success(res.data.message || 'Status do usuário atualizado')
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, isActive: res.data.data.isActive } : u
        )
      )
    } catch (error: any) {
      console.error('Erro ao alternar status do usuário:', error)
      toast.error(error.response?.data?.message || 'Erro ao alterar status do usuário')
    }
  }

  // Ações de Transmissão de Notificação
  const handleSendBroadcast = async (formData: {
    title: string
    message: string
    type: 'info' | 'success' | 'warning' | 'error'
    category: 'system' | 'premium' | 'transaction' | 'goal' | 'budget'
    onlyPremium: boolean
  }) => {
    try {
      setIsSendingBroadcast(true)
      const res = await api.post('/admin/broadcast-notification', formData)
      toast.success(res.data.message || 'Notificação disparada com sucesso')
      loadStats()
    } catch (error: any) {
      console.error('Erro ao enviar transmissão:', error)
      toast.error(error.response?.data?.message || 'Erro ao enviar notificação')
    } finally {
      setIsSendingBroadcast(false)
    }
  }

  const handleSendQuick = async (notification: {
    title: string
    message: string
    type: 'info' | 'success' | 'warning' | 'error'
    category: 'system' | 'premium' | 'transaction' | 'goal' | 'budget'
    onlyPremium: boolean
  }) => {
    try {
      setIsSendingBroadcast(true)
      const res = await api.post('/admin/broadcast-notification', notification)
      toast.success(res.data.message || 'Notificação rápida disparada')
      loadStats()
    } catch (error: any) {
      console.error('Erro ao enviar notificação rápida:', error)
      toast.error(error.response?.data?.message || 'Erro ao enviar notificação rápida')
    } finally {
      setIsSendingBroadcast(false)
    }
  }

  // Ações dos Cards
  const handleOpenCardModal = (card?: DashboardCardItem) => {
    if (card) {
      setEditingCardId(card.id)
      setCardFormData({
        title: card.title,
        desc: card.desc,
        icon: card.icon || '',
        imageSrc: card.imageSrc || '',
        bg: card.bg,
        textColor: card.textColor,
        descColor: card.descColor,
        iconColor: card.iconColor || '',
        iconBg: card.iconBg || '',
        actionPath: card.actionPath,
        isActive: card.isActive ?? true,
      })
    } else {
      setEditingCardId(null)
      setCardFormData({
        title: '',
        desc: '',
        icon: 'Shield',
        imageSrc: '',
        bg: 'bg-white dark:bg-neutral-900 border border-gray-200/60 dark:border-neutral-800/85 shadow-sm',
        textColor: 'text-gray-900 dark:text-white',
        descColor: 'text-gray-500 dark:text-neutral-400',
        iconColor: 'text-primary-600 dark:text-primary-400',
        iconBg: 'bg-primary-50 dark:bg-primary-950/20',
        actionPath: '/app/dashboard',
        isActive: true,
      })
    }
    setShowCardModal(true)
  }

  const handleSaveCard = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsSavingCard(true)
      haptics.medium()
      if (editingCardId) {
        await api.put(`/admin/dashboard-cards/${editingCardId}`, cardFormData)
        toast.success('Card atualizado com sucesso')
      } else {
        await api.post('/admin/dashboard-cards', cardFormData)
        toast.success('Card criado com sucesso')
      }
      setShowCardModal(false)
      loadCards()
    } catch (error: any) {
      console.error('Erro ao salvar card:', error)
      toast.error(error.response?.data?.message || 'Erro ao salvar card')
    } finally {
      setIsSavingCard(false)
    }
  }

  const handleDeleteCard = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja remover este card?')) return
    try {
      await api.delete(`/admin/dashboard-cards/${id}`)
      toast.success('Card removido com sucesso')
      loadCards()
    } catch (error: any) {
      console.error('Erro ao remover card:', error)
      toast.error('Erro ao remover card')
    }
  }

  const handleToggleCardActive = async (card: DashboardCardItem) => {
    try {
      const updatedStatus = !card.isActive
      await api.put(`/admin/dashboard-cards/${card.id}`, {
        ...card,
        isActive: updatedStatus,
      })
      toast.success(updatedStatus ? 'Card ativado no mobile' : 'Card ocultado no mobile')
      setCards((prev) =>
        prev.map((c) => (c.id === card.id ? { ...c, isActive: updatedStatus } : c))
      )
    } catch (error: any) {
      console.error('Erro ao alternar visibilidade do card:', error)
      toast.error('Erro ao alternar visibilidade do card')
    }
  }

  const tabs = [
    { id: 'overview' as const, label: 'Visão Geral', icon: LayoutDashboard },
    { id: 'users' as const, label: 'Usuários', icon: Users, badge: users.length > 0 ? String(users.length) : undefined },
    { id: 'cards' as const, label: 'Cards Mobile', icon: Sparkles, badge: cards.length > 0 ? String(cards.length) : undefined },
    { id: 'history' as const, label: 'Histórico', icon: History },
  ]

  return (
    <PageTransition>
      <div className="responsive-page space-y-6">
        {/* Header Superior */}
        <div className="responsive-header">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-2xl flex items-center justify-center border border-primary-100/55 dark:border-primary-900/10 shadow-sm flex-shrink-0 animate-pulse">
              <Shield className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight font-display">
                Painel Administrativo
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-neutral-400 mt-0.5">
                Central de governança, comunicados em massa e controle de usuários
              </p>
            </div>
          </div>
        </div>

        {/* Abas de Navegação Estilo Apple */}
        <div className="flex items-center gap-2 border-b border-gray-200/70 dark:border-neutral-800/80 pb-3 overflow-x-auto scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  haptics.light()
                  setActiveTab(tab.id)
                }}
                className={`relative px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 active:scale-[0.985] transition-[color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] cursor-pointer flex-shrink-0 ${
                  isActive
                    ? 'text-primary-600 dark:text-white'
                    : 'text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/50 dark:hover:bg-neutral-800/40'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId={shouldReduceMotion ? undefined : 'adminActiveTab'}
                    className="absolute inset-0 bg-primary-50/80 dark:bg-primary-950/40 border border-primary-200/50 dark:border-primary-800/30 rounded-xl"
                    transition={shouldReduceMotion ? { duration: 0.1 } : { duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
                  />
                )}
                <Icon className={`w-4 h-4 relative z-10 ${isActive ? 'text-primary-600 dark:text-primary-400' : ''}`} />
                <span className="relative z-10">{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`relative z-10 px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                      isActive
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200/70 dark:bg-neutral-800 text-gray-600 dark:text-neutral-400'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Conteúdo da Aba Ativa */}
        <div>
          {activeTab === 'overview' && (
            <AdminOverviewTab
              stats={stats}
              onSelectTab={setActiveTab}
              onSendBroadcast={handleSendBroadcast}
              onSendQuick={handleSendQuick}
              isLoading={isSendingBroadcast}
            />
          )}

          {activeTab === 'users' && (
            <AdminUsersTab
              users={users}
              isLoading={isLoadingUsers}
              onRefresh={loadUsers}
              onTogglePremium={handleTogglePremium}
              onToggleStatus={handleToggleStatus}
              onOpenDirectNotification={(u) => setSelectedUserForNotification(u)}
            />
          )}

          {activeTab === 'cards' && (
            <AdminCardsTab
              cards={cards}
              isLoading={isLoadingCards}
              onOpenCardModal={handleOpenCardModal}
              onDeleteCard={handleDeleteCard}
              onToggleActive={handleToggleCardActive}
            />
          )}

          {activeTab === 'history' && <AdminHistoryTab />}
        </div>

        {/* Modal de Envio Direto de Notificação */}
        {selectedUserForNotification && (
          <DirectNotificationModal
            user={selectedUserForNotification}
            onClose={() => setSelectedUserForNotification(null)}
            onSuccess={() => loadStats()}
          />
        )}

        {/* Modal de Criação / Edição de Card */}
        <CardEditModal
          isOpen={showCardModal}
          cardId={editingCardId}
          formData={cardFormData}
          setFormData={setCardFormData}
          onClose={() => setShowCardModal(false)}
          onSave={handleSaveCard}
          isLoading={isSavingCard}
        />
      </div>
    </PageTransition>
  )
}

export default Admin
