import { useState, useEffect } from 'react'
import { Send, Users, Bell, TrendingUp, Shield, X, Crown, Mail, Calendar } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import api from '@/config/api'
import PageTransition from '@/components/common/PageTransition'
import CustomSelect from '@/components/common/CustomSelect'

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
