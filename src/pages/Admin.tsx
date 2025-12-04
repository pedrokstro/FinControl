import { useState, useEffect } from 'react'
import { Send, Users, Bell, TrendingUp, Shield, X, Crown, Mail, Calendar } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import api from '@/config/api'
import PageTransition from '@/components/common/PageTransition'

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

  // Carregar estatísticas ao montar o componente
  useEffect(() => {
    loadStats()
  }, [])

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
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            Painel Administrativo
          </h1>
          <p className="text-gray-600 dark:text-neutral-400 mt-1">
            Gerenciar notificações e avisos do sistema
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={() => handleCardClick('all')}
          className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 transition-all duration-200 cursor-pointer transform hover:scale-105"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-100 text-sm font-medium">Total de Usuários</p>
              <h3 className="text-3xl font-bold mt-2">{stats.totalUsers}</h3>
            </div>
            <Users className="w-12 h-12 text-white/30" />
          </div>
        </button>

        <button
          onClick={() => handleCardClick('premium')}
          className="card bg-gradient-to-br from-success-500 to-success-600 text-white hover:from-success-600 hover:to-success-700 transition-all duration-200 cursor-pointer transform hover:scale-105"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-success-100 text-sm font-medium">Usuários Premium</p>
              <h3 className="text-3xl font-bold mt-2">{stats.premiumUsers}</h3>
            </div>
            <TrendingUp className="w-12 h-12 text-white/30" />
          </div>
        </button>

        <div className="card bg-gradient-to-br from-warning-500 to-warning-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-warning-100 text-sm font-medium">Notificações Enviadas</p>
              <h3 className="text-3xl font-bold mt-2">{stats.totalNotifications}</h3>
            </div>
            <Bell className="w-12 h-12 text-white/30" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulário de Envio */}
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
              <Send className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Enviar Notificação
              </h2>
              <p className="text-sm text-gray-600 dark:text-neutral-400">
                Envie avisos para os usuários
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Título</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: ✨ Novos Recursos Disponíveis"
                className="input-field"
                maxLength={100}
              />
            </div>

            <div>
              <label className="label">Mensagem</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Descreva a notificação..."
                className="input-field min-h-[100px]"
                maxLength={500}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Tipo</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="input-field"
                >
                  <option value="info">Informação</option>
                  <option value="success">Sucesso</option>
                  <option value="warning">Alerta</option>
                  <option value="error">Erro</option>
                </select>
              </div>

              <div>
                <label className="label">Categoria</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="input-field"
                >
                  <option value="system">Sistema</option>
                  <option value="premium">Premium</option>
                  <option value="transaction">Transação</option>
                  <option value="goal">Meta</option>
                  <option value="budget">Orçamento</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="onlyPremium"
                checked={formData.onlyPremium}
                onChange={(e) => setFormData({ ...formData, onlyPremium: e.target.checked })}
                className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
              />
              <label htmlFor="onlyPremium" className="text-sm text-gray-700 dark:text-neutral-300">
                Enviar apenas para usuários Premium
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full"
            >
              {isLoading ? 'Enviando...' : 'Enviar Notificação'}
            </button>
          </form>
        </div>

        {/* Notificações Rápidas */}
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-success-100 dark:bg-success-900/30 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-success-600 dark:text-success-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Notificações Rápidas
              </h2>
              <p className="text-sm text-gray-600 dark:text-neutral-400">
                Templates prontos para envio
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {quickNotifications.map((notification, index) => (
              <div
                key={index}
                className="p-4 bg-gray-50 dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-neutral-800"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {notification.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-neutral-400 mb-3">
                  {notification.message}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-neutral-500">
                    <span className="px-2 py-1 bg-white dark:bg-neutral-800 rounded">
                      {notification.type}
                    </span>
                    <span className="px-2 py-1 bg-white dark:bg-neutral-800 rounded">
                      {notification.onlyPremium ? 'Premium' : 'Todos'}
                    </span>
                  </div>
                  <button
                    onClick={() => sendQuickNotification(notification)}
                    disabled={isLoading}
                    className="btn-secondary text-sm"
                  >
                    Enviar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal de Usuários */}
      {showUsersModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-neutral-800">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {filterPremium === null ? 'Todos os Usuários' : 'Usuários Premium'}
                </h2>
                <p className="text-sm text-gray-600 dark:text-neutral-400 mt-1">
                  {users.length} {users.length === 1 ? 'usuário encontrado' : 'usuários encontrados'}
                </p>
              </div>
              <button
                onClick={() => setShowUsersModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-neutral-300 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Lista de Usuários */}
            <div className="overflow-y-auto max-h-[calc(80vh-120px)] p-6">
              {isLoadingUsers ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-300 dark:text-neutral-700 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-neutral-400">
                    Nenhum usuário encontrado
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="bg-gray-50 dark:bg-neutral-800 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-neutral-750 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          {/* Avatar */}
                          <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-primary-600 dark:text-primary-400 font-bold text-lg">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                                {user.name}
                              </h3>
                              {user.isPremium && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full text-xs font-medium">
                                  <Crown className="w-3 h-3" />
                                  Premium
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-600 dark:text-neutral-400">
                              <div className="flex items-center gap-1">
                                <Mail className="w-4 h-4" />
                                <span className="truncate">{user.email}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  {format(new Date(user.createdAt), "dd/MM/yyyy", { locale: ptBR })}
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
