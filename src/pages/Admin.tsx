import { useState, useEffect } from 'react'
import { Send, Users, Bell, Shield, X, Crown, Mail, Calendar, Edit3, Trash2, Plus, Sparkles, Check } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import { toast } from 'react-hot-toast'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import api from '@/config/api'
import PageTransition from '@/components/common/PageTransition'
import CustomSelect from '@/components/common/CustomSelect'
import React from 'react'

interface Stats {
  totalUsers: number
  premiumUsers: number
  totalNotifications: number
}

interface User {
  id: string
  name: string
  email: string
  isPremium: boolean
  createdAt: string
}

const Admin = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    premiumUsers: 0,
    totalNotifications: 0,
  })
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info' as 'info' | 'success' | 'warning' | 'error',
    category: 'system' as 'system' | 'premium' | 'transaction' | 'goal' | 'budget',
    onlyPremium: false,
  })
  const [showUsersModal, setShowUsersModal] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [filterPremium, setFilterPremium] = useState<boolean | null>(null)
  const [isLoadingUsers, setIsLoadingUsers] = useState(false)

  const [dashboardCards, setDashboardCards] = useState<any[]>([])
  const [showCardModal, setShowCardModal] = useState(false)
  const [editingCardId, setEditingCardId] = useState<string | null>(null)
  const [cardForm, setCardForm] = useState({
    title: '',
    desc: '',
    icon: '',
    imageSrc: '',
    bg: 'bg-white dark:bg-neutral-900 border border-gray-200/60 dark:border-neutral-800/85 shadow-sm',
    textColor: 'text-gray-900 dark:text-white',
    descColor: 'text-gray-500 dark:text-neutral-400',
    iconColor: 'text-primary-600 dark:text-primary-400',
    iconBg: 'bg-primary-50 dark:bg-primary-950/20',
    actionPath: '/app/dashboard',
    isActive: true
  })

  // Carregar estatísticas e cards ao montar o componente
  useEffect(() => {
    loadStats()
    loadDashboardCards()
  }, [])

  const loadDashboardCards = async () => {
    try {
      const response = await api.get('/admin/dashboard-cards')
      setDashboardCards(response.data.data || [])
    } catch (error) {
      console.error('Erro ao carregar cards do dashboard:', error)
    }
  }

  const applyPreset = (type: string) => {
    switch (type) {
      case 'blue':
        setCardForm((prev) => ({
          ...prev,
          bg: 'bg-primary-600 dark:bg-primary-700 shadow-sm shadow-primary-500/10',
          textColor: 'text-white',
          descColor: 'text-white/80',
          iconColor: 'text-white',
          iconBg: 'bg-white/20'
        }))
        break
      case 'amber':
        setCardForm((prev) => ({
          ...prev,
          bg: 'bg-amber-500 dark:bg-amber-600 shadow-sm',
          textColor: 'text-white',
          descColor: 'text-white/95',
          iconColor: 'text-white',
          iconBg: 'bg-white/20'
        }))
        break
      case 'red':
        setCardForm((prev) => ({
          ...prev,
          bg: 'bg-red-650 dark:bg-red-750 shadow-sm',
          textColor: 'text-white',
          descColor: 'text-white/95',
          iconColor: 'text-white',
          iconBg: 'bg-white/20'
        }))
        break
      default:
        setCardForm((prev) => ({
          ...prev,
          bg: 'bg-white dark:bg-neutral-900 border border-gray-200/60 dark:border-neutral-800/85 shadow-sm',
          textColor: 'text-gray-900 dark:text-white',
          descColor: 'text-gray-500 dark:text-neutral-400',
          iconColor: 'text-primary-600 dark:text-primary-400',
          iconBg: 'bg-primary-50 dark:bg-primary-950/20'
        }))
    }
  }

  const handleOpenCardModal = (card: any = null) => {
    if (card) {
      setEditingCardId(card.id)
      setCardForm({
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
        isActive: card.isActive ?? true
      })
    } else {
      setEditingCardId(null)
      setCardForm({
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
        isActive: true
      })
    }
    setShowCardModal(true)
  }

  const handleSaveCard = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      if (editingCardId) {
        await api.put(`/admin/dashboard-cards/${editingCardId}`, cardForm)
        toast.success('Card atualizado com sucesso')
      } else {
        await api.post('/admin/dashboard-cards', cardForm)
        toast.success('Card criado com sucesso')
      }
      setShowCardModal(false)
      loadDashboardCards()
    } catch (error: any) {
      console.error('Erro ao salvar card:', error)
      toast.error(error.response?.data?.message || 'Erro ao salvar card')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteCard = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja remover este card?')) return
    try {
      setIsLoading(true)
      await api.delete(`/admin/dashboard-cards/${id}`)
      toast.success('Card removido com sucesso')
      loadDashboardCards()
    } catch (error: any) {
      console.error('Erro ao deletar card:', error)
      toast.error('Erro ao remover card')
    } finally {
      setIsLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const response = await api.get('/admin/stats')
      setStats(response.data.data)
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error)
    }
  }

  const loadUsers = async (premiumFilter: boolean | null = null) => {
    try {
      setIsLoadingUsers(true)
      const response = await api.get('/admin/users')
      let allUsers = response.data.data || []

      // Filtrar por premium se necessário
      if (premiumFilter !== null) {
        allUsers = allUsers.filter((u: User) => u.isPremium === premiumFilter)
      }

      setUsers(allUsers)
    } catch (error) {
      console.error('Erro ao carregar usuários:', error)
      toast.error('Erro ao carregar usuários')
    } finally {
      setIsLoadingUsers(false)
    }
  }

  const handleCardClick = async (type: 'all' | 'premium') => {
    const isPremium = type === 'premium' ? true : null
    setFilterPremium(isPremium)
    setShowUsersModal(true)
    await loadUsers(isPremium)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.message) {
      toast.error('Preencha título e mensagem')
      return
    }

    try {
      setIsLoading(true)
      const response = await api.post('/admin/broadcast-notification', formData)

      toast.success(response.data.message)

      // Atualizar estatísticas
      await loadStats()

      // Limpar formulário
      setFormData({
        title: '',
        message: '',
        type: 'info',
        category: 'system',
        onlyPremium: false,
      })
    } catch (error: any) {
      console.error('Erro ao enviar notificação:', error)
      toast.error(error.response?.data?.message || 'Erro ao enviar notificação')
    } finally {
      setIsLoading(false)
    }
  }

  const quickNotifications = [
    {
      title: '✨ Novos Recursos Premium',
      message: 'Confira os novos relatórios avançados disponíveis!',
      type: 'success' as const,
      category: 'premium' as const,
      onlyPremium: true,
    },
    {
      title: '⚠️ Manutenção Programada',
      message: 'O sistema ficará indisponível amanhã das 2h às 4h.',
      type: 'warning' as const,
      category: 'system' as const,
      onlyPremium: false,
    },
    {
      title: '🎉 Promoção Especial',
      message: '50% de desconto no plano Premium por tempo limitado!',
      type: 'info' as const,
      category: 'premium' as const,
      onlyPremium: false,
    },
  ]

  const sendQuickNotification = async (notification: typeof quickNotifications[0]) => {
    try {
      setIsLoading(true)
      const response = await api.post('/admin/broadcast-notification', notification)
      toast.success(response.data.message)
      // Atualizar estatísticas
      await loadStats()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao enviar')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <PageTransition>
      <div className="responsive-page space-y-6">
        {/* Header */}
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
                Central de monitoramento, notificações e controle de usuários
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => handleCardClick('all')}
            className="group relative card p-5 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer text-left overflow-hidden"
          >
            {/* Acento superior de cor */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-400 to-primary-600" />
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 dark:text-neutral-500 text-xs font-semibold uppercase tracking-widest">Total de Usuários</p>
                <h3 className="text-3xl font-bold mt-2 text-gray-900 dark:text-white font-display">
                  {stats.totalUsers}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 dark:text-primary-400 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                <Users className="w-6 h-6" />
              </div>
            </div>
          </button>

          <button
            onClick={() => handleCardClick('premium')}
            className="group relative card p-5 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer text-left overflow-hidden"
          >
            {/* Acento superior de cor */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-amber-500" />
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 dark:text-neutral-500 text-xs font-semibold uppercase tracking-widest">Usuários Premium</p>
                <h3 className="text-3xl font-bold mt-2 text-gray-900 dark:text-white font-display">
                  {stats.premiumUsers}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-500 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                <Crown className="w-6 h-6" />
              </div>
            </div>
          </button>

          <div className="relative card p-5 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-2xl shadow-sm overflow-hidden">
            {/* Acento superior de cor */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-success-400 to-success-600" />
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 dark:text-neutral-500 text-xs font-semibold uppercase tracking-widest">Notificações Enviadas</p>
                <h3 className="text-3xl font-bold mt-2 text-gray-900 dark:text-white font-display">
                  {stats.totalNotifications}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-success-50 dark:bg-success-900/20 flex items-center justify-center text-success-600 dark:text-success-400">
                <Bell className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch">
          {/* Formulário de Envio */}
          <div className="card p-5 sm:p-6 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-2xl shadow-sm">
            <div className="flex items-center gap-3.5 mb-6">
              <div className="w-10 h-10 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center border border-primary-100/30 dark:border-primary-900/10">
                <Send className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white font-display">
                  Enviar Notificação
                </h2>
                <p className="text-xs text-gray-500 dark:text-neutral-400 mt-0.5">
                  Dispare comunicados em massa para a base
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-neutral-400">Título</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: ✨ Novos Recursos Disponíveis"
                  className="input-field mt-1"
                  maxLength={100}
                />
              </div>

              <div>
                <label className="label text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-neutral-400">Mensagem</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Descreva a notificação detalhadamente..."
                  className="input-field mt-1 min-h-[100px]"
                  maxLength={500}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-neutral-400">Tipo</label>
                  <div className="mt-1">
                    <CustomSelect
                      value={formData.type}
                      onChange={(val) => setFormData({ ...formData, type: val as any })}
                      options={[
                        { value: 'info', label: 'ℹ Informação' },
                        { value: 'success', label: '✅ Sucesso' },
                        { value: 'warning', label: '⚠️ Alerta' },
                        { value: 'error', label: '❌ Erro' }
                      ]}
                    />
                  </div>
                </div>

                <div>
                  <label className="label text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-neutral-400">Categoria</label>
                  <div className="mt-1">
                    <CustomSelect
                      value={formData.category}
                      onChange={(val) => setFormData({ ...formData, category: val as any })}
                      options={[
                        { value: 'system', label: '💻 Sistema' },
                        { value: 'premium', label: '👑 Premium' },
                        { value: 'transaction', label: '💵 Transação' },
                        { value: 'goal', label: '🎯 Meta' },
                        { value: 'budget', label: '📊 Orçamento' }
                      ]}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 py-1">
                <input
                  type="checkbox"
                  id="onlyPremium"
                  checked={formData.onlyPremium}
                  onChange={(e) => setFormData({ ...formData, onlyPremium: e.target.checked })}
                  className="w-4 h-4 text-primary-600 dark:text-primary-500 rounded border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-primary-500/20 focus:ring-offset-0"
                />
                <label htmlFor="onlyPremium" className="text-sm font-semibold text-gray-700 dark:text-neutral-300 cursor-pointer">
                  Enviar apenas para usuários Premium 👑
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full h-11 flex items-center justify-center gap-2 rounded-xl text-sm font-bold shadow-md shadow-primary-500/10 active:scale-[0.99] transition-transform"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Enviar Notificação
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Notificações Rápidas */}
          <div className="card p-5 sm:p-6 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-2xl shadow-sm flex flex-col">
            <div className="flex items-center gap-3.5 mb-6">
              <div className="w-10 h-10 bg-success-50 dark:bg-success-900/20 rounded-xl flex items-center justify-center border border-success-100/30 dark:border-success-900/10">
                <Bell className="w-5 h-5 text-success-600 dark:text-success-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white font-display">
                  Notificações Rápidas
                </h2>
                <p className="text-xs text-gray-500 dark:text-neutral-400 mt-0.5">
                  Modelos de notificação pré-configurados
                </p>
              </div>
            </div>

            <div className="space-y-3.5 flex-1 overflow-y-auto pr-1">
              {quickNotifications.map((notification, index) => {
                const getColors = (type: string) => {
                  switch (type) {
                    case 'success': return 'bg-success-50 dark:bg-success-900/20 text-success-700 dark:text-success-400 border border-success-100/50 dark:border-success-900/10'
                    case 'warning': return 'bg-warning-50 dark:bg-warning-900/20 text-warning-700 dark:text-warning-400 border border-warning-100/50 dark:border-warning-900/10'
                    default: return 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 border border-primary-100/50 dark:border-primary-900/10'
                  }
                }
                return (
                  <div
                    key={index}
                    className="p-4 bg-gray-50/50 dark:bg-neutral-800/20 hover:bg-gray-100/50 dark:hover:bg-neutral-800/40 rounded-xl border border-gray-100 dark:border-neutral-800/60 transition-colors"
                  >
                    <h3 className="font-bold text-gray-800 dark:text-white text-sm mb-1">
                      {notification.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-neutral-400 leading-normal mb-3">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider ${getColors(notification.type)}`}>
                          {notification.type}
                        </span>
                        <span className="px-2 py-0.5 bg-gray-150 dark:bg-neutral-800 text-gray-650 dark:text-neutral-400 rounded-md text-[9px] font-extrabold uppercase tracking-wider border border-gray-200/40 dark:border-neutral-700/40">
                          {notification.onlyPremium ? '👑 Premium' : '👥 Todos'}
                        </span>
                      </div>
                      <button
                        onClick={() => sendQuickNotification(notification)}
                        disabled={isLoading}
                        className="btn-secondary h-8 px-3 text-xs font-bold hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all"
                      >
                        Enviar
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Seção: Gerenciamento de Cards do Dashboard */}
        <div className="card p-5 sm:p-6 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/20 rounded-xl flex items-center justify-center border border-amber-100/30 dark:border-amber-900/10">
                <Sparkles className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white font-display">
                  Cards do Dashboard
                </h2>
                <p className="text-xs text-gray-500 dark:text-neutral-400 mt-0.5">
                  Crie, edite ou remova os avisos e dicas do topo do Dashboard
                </p>
              </div>
            </div>
            <button
              onClick={() => handleOpenCardModal()}
              className="btn-primary flex items-center gap-1.5 px-4 h-9.5 text-xs font-bold rounded-xl active:scale-[0.98] transition-transform"
            >
              <Plus className="w-4 h-4" />
              Novo Card
            </button>
          </div>

          {/* Lista de Cards */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-neutral-800 text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500">
                  <th className="pb-3 pl-2">Card / Conteúdo</th>
                  <th className="pb-3">Visual / Cores</th>
                  <th className="pb-3">Atalho / Destino</th>
                  <th className="pb-3 text-center">Status</th>
                  <th className="pb-3 pr-2 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-neutral-800/40 text-xs">
                {dashboardCards.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500 dark:text-neutral-500 font-medium">
                      Nenhum card cadastrado no sistema.
                    </td>
                  </tr>
                ) : (
                  dashboardCards.map((c) => {
                    const IconComponent = c.icon ? (LucideIcons as any)[c.icon] : null
                    return (
                      <tr key={c.id} className="hover:bg-gray-50/20 dark:hover:bg-neutral-800/5 transition-colors">
                        <td className="py-4 pl-2">
                          <div className="flex gap-3 items-center">
                            <div className={`w-8 h-8 rounded-lg ${c.bg.includes('bg-primary-600') ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-neutral-300'} flex items-center justify-center overflow-hidden flex-shrink-0 border border-gray-200/20`}>
                              {c.imageSrc ? (
                                <img src={c.imageSrc} alt="" className="w-full h-full object-cover" />
                              ) : IconComponent ? (
                                <IconComponent className="w-4 h-4" />
                              ) : (
                                'ℹ'
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 dark:text-white line-clamp-1">{c.title}</p>
                              <p className="text-[10px] text-gray-500 dark:text-neutral-450 mt-0.5 line-clamp-1 max-w-[250px]">{c.desc}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className="text-[10px] font-mono px-2 py-0.5 bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-neutral-400 rounded-md">
                            {c.bg.includes('bg-primary-600') ? 'Azul' : 'Branco/Escuro'}
                          </span>
                        </td>
                        <td className="py-4 text-gray-600 dark:text-neutral-400 font-mono text-[10px] max-w-[150px] truncate">
                          {c.actionPath}
                        </td>
                        <td className="py-4 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${c.isActive ? 'bg-success-50 dark:bg-success-900/20 text-success-700 dark:text-success-400 border border-success-100/50 dark:border-success-900/10' : 'bg-gray-100 dark:bg-neutral-800 text-gray-500 dark:text-neutral-400'}`}>
                            {c.isActive ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                        <td className="py-4 pr-2 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleOpenCardModal(c)}
                              className="w-7 h-7 bg-gray-50 dark:bg-neutral-800 text-gray-500 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg flex items-center justify-center transition-colors"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteCard(c.id)}
                              className="w-7 h-7 bg-red-50 dark:bg-red-950/20 text-red-600 hover:text-red-700 rounded-lg flex items-center justify-center transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal de Criar/Editar Card do Dashboard */}
        {showCardModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-neutral-900 rounded-[2rem] shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden border border-gray-100 dark:border-neutral-800 animate-in zoom-in-95 duration-200 flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-neutral-800">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white font-display">
                    {editingCardId ? 'Editar Card' : 'Novo Card de Aviso'}
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1.5 font-medium">
                    Configure os textos, ícone e links de destino do card
                  </p>
                </div>
                <button
                  onClick={() => setShowCardModal(false)}
                  className="w-8 h-8 rounded-full bg-gray-50 dark:bg-neutral-800 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-neutral-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSaveCard} className="overflow-y-auto p-6 flex-1 pr-4 space-y-4">
                {/* Estilo Presets */}
                <div>
                  <label className="label text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500 mb-1.5 block">Preset de Estilo</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { name: 'Branco/Escuro (Padrão)', value: 'default' },
                      { name: 'Azul FinControl', value: 'blue' },
                      { name: 'Dourado Destaque', value: 'amber' },
                      { name: 'Vermelho Alerta', value: 'red' }
                    ].map((preset) => (
                      <button
                        key={preset.value}
                        type="button"
                        onClick={() => applyPreset(preset.value)}
                        className="px-3 py-2 bg-gray-50 dark:bg-neutral-800/40 border border-gray-200/50 dark:border-neutral-700/50 hover:border-primary-500 dark:hover:border-primary-500 rounded-xl text-left text-[11px] font-semibold text-gray-700 dark:text-neutral-300 transition-all active:scale-[0.98]"
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500">Título</label>
                    <input
                      type="text"
                      value={cardForm.title}
                      onChange={(e) => setCardForm({ ...cardForm, title: e.target.value })}
                      placeholder="Ex: Fatura do Cartão"
                      className="input-field mt-1"
                      required
                    />
                  </div>
                  <div>
                    <label className="label text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500">Link de Destino</label>
                    <input
                      type="text"
                      value={cardForm.actionPath}
                      onChange={(e) => setCardForm({ ...cardForm, actionPath: e.target.value })}
                      placeholder="Ex: /app/cards"
                      className="input-field mt-1"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="label text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500">Descrição</label>
                  <textarea
                    value={cardForm.desc}
                    onChange={(e) => setCardForm({ ...cardForm, desc: e.target.value })}
                    placeholder="Descreva a mensagem do card..."
                    className="input-field mt-1 min-h-[70px]"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500">Ícone Lucide (Nome)</label>
                    <input
                      type="text"
                      value={cardForm.icon}
                      onChange={(e) => setCardForm({ ...cardForm, icon: e.target.value, imageSrc: '' })}
                      placeholder="Ex: Shield, CreditCard, Gift"
                      className="input-field mt-1"
                    />
                  </div>
                  <div>
                    <label className="label text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500">Ou Caminho da Imagem</label>
                    <input
                      type="text"
                      value={cardForm.imageSrc}
                      onChange={(e) => setCardForm({ ...cardForm, imageSrc: e.target.value, icon: '' })}
                      placeholder="Ex: /assets/minha-imagem.png"
                      className="input-field mt-1"
                    />
                  </div>
                </div>

                {/* Avançado: Personalizar Cores e Classes CSS */}
                <div className="border-t border-gray-100 dark:border-neutral-800 pt-4 space-y-4">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500">Cores Avançadas (Tailwind)</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label text-[9px] font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500">Fundo Card (bg)</label>
                      <input
                        type="text"
                        value={cardForm.bg}
                        onChange={(e) => setCardForm({ ...cardForm, bg: e.target.value })}
                        className="input-field mt-1 font-mono text-[10px]"
                      />
                    </div>
                    <div>
                      <label className="label text-[9px] font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500">Cor do Título (text)</label>
                      <input
                        type="text"
                        value={cardForm.textColor}
                        onChange={(e) => setCardForm({ ...cardForm, textColor: e.target.value })}
                        className="input-field mt-1 font-mono text-[10px]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label text-[9px] font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500">Cor Descrição (text)</label>
                      <input
                        type="text"
                        value={cardForm.descColor}
                        onChange={(e) => setCardForm({ ...cardForm, descColor: e.target.value })}
                        className="input-field mt-1 font-mono text-[10px]"
                      />
                    </div>
                    <div>
                      <label className="label text-[9px] font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500">Cor do Ícone</label>
                      <input
                        type="text"
                        value={cardForm.iconColor}
                        onChange={(e) => setCardForm({ ...cardForm, iconColor: e.target.value })}
                        className="input-field mt-1 font-mono text-[10px]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label text-[9px] font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500">Fundo do Ícone (bg)</label>
                    <input
                      type="text"
                      value={cardForm.iconBg}
                      onChange={(e) => setCardForm({ ...cardForm, iconBg: e.target.value })}
                      className="input-field mt-1 font-mono text-[10px]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 py-1">
                  <input
                    type="checkbox"
                    id="cardIsActive"
                    checked={cardForm.isActive}
                    onChange={(e) => setCardForm({ ...cardForm, isActive: e.target.checked })}
                    className="w-4 h-4 text-primary-600 dark:text-primary-500 rounded border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-primary-500/20 focus:ring-offset-0"
                  />
                  <label htmlFor="cardIsActive" className="text-sm font-semibold text-gray-700 dark:text-neutral-300 cursor-pointer">
                    Card Ativo (Visível no Dashboard)
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full h-11 flex items-center justify-center gap-2 rounded-xl text-sm font-bold shadow-md active:scale-[0.99] transition-transform mt-6"
                >
                  {isLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Salvar Alterações
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Modal de Usuários */}
        {showUsersModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-neutral-900 rounded-[2rem] shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden border border-gray-100 dark:border-neutral-800 animate-in zoom-in-95 duration-200 flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-neutral-800">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white font-display">
                    {filterPremium === null ? 'Lista de Usuários' : 'Usuários Premium 👑'}
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1.5 font-medium">
                    {users.length} {users.length === 1 ? 'usuário encontrado' : 'usuários encontrados'}
                  </p>
                </div>
                <button
                  onClick={() => setShowUsersModal(false)}
                  className="w-8 h-8 rounded-full bg-gray-50 dark:bg-neutral-800 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-neutral-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Lista de Usuários */}
              <div className="overflow-y-auto p-6 flex-1 pr-4">
                {isLoadingUsers ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-3">
                    <div className="w-8 h-8 border-3 border-primary-600 border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs text-gray-450 dark:text-neutral-500 font-semibold">Carregando usuários...</span>
                  </div>
                ) : users.length === 0 ? (
                  <div className="text-center py-16">
                    <Users className="w-12 h-12 text-gray-300 dark:text-neutral-700 mx-auto mb-3 opacity-60" />
                    <p className="text-sm text-gray-500 dark:text-neutral-400 font-medium">
                      Nenhum usuário encontrado
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {users.map((user) => (
                      <div
                        key={user.id}
                        className="bg-gray-50/50 dark:bg-neutral-800/30 hover:bg-gray-100/50 dark:hover:bg-neutral-800/60 rounded-2xl p-4 border border-gray-100/60 dark:border-neutral-800/50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            {/* Avatar */}
                            <div className="w-10 h-10 bg-primary-50 dark:bg-primary-900/30 rounded-xl flex items-center justify-center flex-shrink-0 border border-primary-100/30 dark:border-primary-900/10">
                              <span className="text-primary-600 dark:text-primary-400 font-extrabold text-sm">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-bold text-gray-800 dark:text-white text-sm truncate max-w-[150px] sm:max-w-none">
                                  {user.name}
                                </h3>
                                {user.isPremium && (
                                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-full text-[9px] font-extrabold uppercase tracking-wide border border-amber-100/50 dark:border-amber-900/10">
                                    <Crown className="w-2.5 h-2.5" />
                                    Premium
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-3.5 mt-1.5 text-xs text-gray-500 dark:text-neutral-400 flex-wrap">
                                <div className="flex items-center gap-1 min-w-0">
                                  <Mail className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                                  <span className="truncate">{user.email}</span>
                                </div>
                                <div className="flex items-center gap-1 flex-shrink-0">
                                  <Calendar className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                                  <span>
                                    Desde {format(new Date(user.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  )
}

export default Admin
