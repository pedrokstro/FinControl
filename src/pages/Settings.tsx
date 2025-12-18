import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useFinancialStore } from '@/store/financialStore'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { User, Bell, Palette, Database, Shield, Camera, Upload, X, Eye, EyeOff, Crown, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { imageStorage } from '@/utils/imageStorage'
import { useTheme } from '@/contexts/ThemeContext'
import PageTransition from '@/components/common/PageTransition'
import VerifyEmailChangeModal from '@/components/modals/VerifyEmailChangeModal'
import VerifyPasswordChangeModal from '@/components/modals/VerifyPasswordChangeModal'
import ExportDataModal from '@/components/modals/ExportDataModal'
import DeleteAccountModal from '@/components/modals/DeleteAccountModal'
import userService from '@/services/user.service'

const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  newPassword: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  confirmPassword: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
})

type PasswordFormData = z.infer<typeof passwordSchema>

// Tipos para preferências
interface NotificationPreferences {
  emailTransactions: boolean
  weeklyReport: boolean
  budgetAlerts: boolean
  newsUpdates: boolean
}

interface UserPreferences {
  language: string
  currency: string
}

const Settings = () => {
  const navigate = useNavigate()
  const { user, updateAvatar, loadAvatar, logout } = useAuthStore()
  const { theme, setTheme } = useTheme()
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'preferences'>('profile')
  
  const isPremium = user?.isPremium || false
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [isSavingAvatar, setIsSavingAvatar] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Estados para alteração de email
  const [newEmail, setNewEmail] = useState('')
  const [isEditingEmail, setIsEditingEmail] = useState(false)
  const [isSendingCode, setIsSendingCode] = useState(false)
  const [showVerifyModal, setShowVerifyModal] = useState(false)
  
  // Estados para alteração de senha
  const [showPasswordVerifyModal, setShowPasswordVerifyModal] = useState(false)
  const [pendingPasswordData, setPendingPasswordData] = useState<{
    currentPassword: string
    newPassword: string
  } | null>(null)
  
  // Estado para modal de exportação
  const [showExportModal, setShowExportModal] = useState(false)
  
  // Estado para modal de exclusão de conta
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  // Estados para notificações
  const [notifications, setNotifications] = useState<NotificationPreferences>(() => {
    const saved = localStorage.getItem('notification-preferences')
    return saved ? JSON.parse(saved) : {
      emailTransactions: true,
      weeklyReport: true,
      budgetAlerts: false,
      newsUpdates: true,
    }
  })

  // Estados para preferências
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const saved = localStorage.getItem('user-preferences')
    return saved ? JSON.parse(saved) : {
      language: 'pt-BR',
      currency: 'BRL',
    }
  })

  // Carregar avatar ao montar componente
  useEffect(() => {
    loadAvatar()
  }, [loadAvatar])

  // Salvar notificações quando mudarem
  useEffect(() => {
    localStorage.setItem('notification-preferences', JSON.stringify(notifications))
  }, [notifications])

  // Salvar preferências quando mudarem
  useEffect(() => {
    localStorage.setItem('user-preferences', JSON.stringify(preferences))
  }, [preferences])

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  })

  const onSubmitPassword = async (data: PasswordFormData) => {
    try {
      console.log('Solicitando código de alteração de senha...')
      
      // Salvar dados ANTES de solicitar o código
      setPendingPasswordData({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      })
      
      // Solicitar código de verificação
      await userService.requestPasswordChange()
      
      console.log('Código solicitado com sucesso')
      
      // Usar setTimeout para garantir que o estado foi atualizado
      setTimeout(() => {
        console.log('Abrindo modal...')
        setShowPasswordVerifyModal(true)
        console.log('Modal aberto!')
      }, 100)
      
      toast.success('Código enviado para seu email!')
    } catch (error: any) {
      console.error('Erro ao solicitar alteração:', error)
      toast.error(error.response?.data?.message || 'Erro ao enviar código')
    }
  }
  
  // Função chamada após verificação bem-sucedida
  const handlePasswordChangeSuccess = () => {
    passwordForm.reset()
    setPendingPasswordData(null)
  }

  // Funções para notificações
  const toggleNotification = (key: keyof NotificationPreferences) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key],
    }))
    toast.success('Preferência de notificação atualizada!')
  }

  // Funções para preferências
  const handleThemeChange = (newTheme: string) => {
    if (newTheme === 'light' || newTheme === 'dark') {
      setTheme(newTheme)
      toast.success(`Tema alterado para ${newTheme === 'light' ? 'Claro' : 'Escuro'}!`)
    }
  }

  const handleLanguageChange = (language: string) => {
    setPreferences(prev => ({ ...prev, language }))
    toast.success('Idioma atualizado!')
  }

  const handleCurrencyChange = (currency: string) => {
    setPreferences(prev => ({ ...prev, currency }))
    toast.success('Moeda atualizada!')
  }

  const handleExportData = () => {
    console.log('🔍 [DEBUG] Abrindo modal de exportação')
    setShowExportModal(true)
  }
  
  const confirmExportData = () => {
    try {
      // Buscar dados do store
      const { transactions, categories } = useFinancialStore.getState()
      
      // Criar objeto com todos os dados do usuário
      const exportData = {
        user: {
          name: user?.name,
          email: user?.email,
          isPremium: user?.isPremium,
          createdAt: user?.createdAt,
        },
        transactions: transactions,
        categories: categories,
        preferences: preferences,
        notifications: notifications,
        exportDate: new Date().toISOString(),
        version: '1.0.0'
      }
      
      // Converter para JSON formatado
      const jsonString = JSON.stringify(exportData, null, 2)
      
      // Criar blob e fazer download
      const blob = new Blob([jsonString], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `fincontrol-dados-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      toast.success('Dados exportados com sucesso!')
    } catch (error) {
      console.error('Erro ao exportar dados:', error)
      toast.error('Erro ao exportar dados. Tente novamente.')
    }
  }

  const handleDeleteAccount = () => {
    setShowDeleteModal(true)
  }
  
  const confirmDeleteAccount = async (code: string) => {
    try {
      // TODO: Implementar exclusão real no backend com validação do código
      // O código será enviado para o backend: DELETE /api/users/me { code }
      console.log('Código de verificação:', code)
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Limpar dados locais
      const { clearUserData } = useFinancialStore.getState()
      clearUserData()
      logout()
      
      // Redirecionar para página de despedida
      navigate('/goodbye')
    } catch (error) {
      console.error('Erro ao excluir conta:', error)
      throw error
    }
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    
    if (!file) return

    // Validar tipo de arquivo
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/gif']
    if (!validTypes.includes(file.type)) {
      toast.error('Formato inválido! Use JPG, PNG, WEBP ou GIF.')
      return
    }

    // Validar tamanho (máximo 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      toast.error('Imagem muito grande! Tamanho máximo: 5MB.')
      return
    }

    // Criar preview
    const reader = new FileReader()
    reader.onloadstart = () => setIsUploadingAvatar(true)
    reader.onloadend = () => {
      const result = reader.result as string
      setAvatarPreview(result)
      setIsUploadingAvatar(false)
    }
    reader.onerror = () => {
      toast.error('Erro ao carregar imagem!')
      setIsUploadingAvatar(false)
    }
    reader.readAsDataURL(file)
  }

  const handleSaveAvatar = async () => {
    if (!avatarPreview) return

    setIsSavingAvatar(true)
    
    try {
      await updateAvatar(avatarPreview)
      toast.success('Foto de perfil atualizada com sucesso!')
      setAvatarPreview(null)
      
      // Limpar input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      console.error('Erro ao salvar avatar:', error)
      toast.error('Erro ao salvar foto. Tente novamente.')
    } finally {
      setIsSavingAvatar(false)
    }
  }

  const handleCancelAvatar = () => {
    setAvatarPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRemoveAvatar = async () => {
    if (!user) return

    setIsSavingAvatar(true)
    
    try {
      // Deletar do IndexedDB
      await imageStorage.deleteImage(user.id)
      
      // Voltar para avatar padrão
      const defaultAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`
      await updateAvatar(defaultAvatar)
      
      toast.success('Foto de perfil removida!')
    } catch (error) {
      console.error('Erro ao remover avatar:', error)
      toast.error('Erro ao remover foto. Tente novamente.')
    } finally {
      setIsSavingAvatar(false)
    }
  }

  // Função para solicitar alteração de email
  const handleRequestEmailChange = async () => {
    if (!newEmail || newEmail === user?.email) {
      toast.error('Digite um novo email válido')
      return
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newEmail)) {
      toast.error('Email inválido')
      return
    }

    setIsSendingCode(true)

    try {
      await userService.requestEmailChange(newEmail)
      toast.success('Código enviado para o novo email!')
      console.log('Abrindo modal de verificação...')
      setShowVerifyModal(true)
      console.log('showVerifyModal definido como true')
    } catch (error: any) {
      console.error('Erro ao solicitar alteração:', error)
      toast.error(error.response?.data?.message || 'Erro ao enviar código')
    } finally {
      setIsSendingCode(false)
    }
  }

  // Função para cancelar edição
  const handleCancelEmailEdit = () => {
    setIsEditingEmail(false)
    setNewEmail('')
  }

  // Função ao fechar modal de verificação
  const handleCloseVerifyModal = () => {
    setShowVerifyModal(false)
    setIsEditingEmail(false)
    setNewEmail('')
  }

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'security', label: 'Segurança', icon: Shield },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'preferences', label: 'Preferências', icon: Palette },
  ]

  // Função para obter saudação
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Bom dia'
    if (hour < 18) return 'Boa tarde'
    return 'Boa noite'
  }

  // Verificar se é avatar personalizado
  const isCustomAvatar = user?.avatar && !user.avatar.includes('dicebear')

  return (
    <>
    <PageTransition>
      <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Configurações</h1>
        <p className="text-gray-600 dark:text-neutral-400 mt-1">
          {getGreeting()}, <span className="font-medium">{user?.name?.split(' ')[0]}</span>! Gerencie suas preferências
        </p>
      </div>

      {/* Subscription Card */}
      <button
        onClick={() => navigate('/app/settings/subscription')}
        className={`w-full text-left rounded-2xl p-6 transition-all duration-300 hover:shadow-lg ${
          isPremium
            ? 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-2 border-amber-400 dark:border-amber-600 hover:border-amber-500 dark:hover:border-amber-500'
            : 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-300 dark:border-blue-700 hover:border-blue-400 dark:hover:border-blue-600'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                isPremium
                  ? 'bg-gradient-to-br from-amber-400 to-orange-500'
                  : 'bg-gradient-to-br from-blue-500 to-indigo-600'
              }`}
            >
              <Crown className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {isPremium ? 'Plano Premium Ativo' : 'Upgrade para Premium'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-neutral-400">
                {isPremium
                  ? 'Gerencie sua assinatura e benefícios'
                  : 'Desbloqueie recursos exclusivos e avançados'}
              </p>
            </div>
          </div>
          <ArrowRight className={`w-6 h-6 ${isPremium ? 'text-amber-600 dark:text-amber-400' : 'text-blue-600 dark:text-blue-400'}`} />
        </div>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar de Tabs */}
        <div className="lg:col-span-1">
          <div className="card p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 font-medium'
                        : 'text-gray-600 dark:text-neutral-400 hover:bg-gray-50 dark:hover:bg-neutral-900 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="lg:col-span-3">
          {/* Tab: Perfil */}
          {activeTab === 'profile' && (
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Informações do Perfil
              </h2>

              {/* Avatar com Upload */}
              <div className="flex items-start gap-6 mb-8 pb-8 border-b border-gray-200 dark:border-neutral-800">
                <div className="relative group">
                  <img
                    src={avatarPreview || user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                    alt={user?.name}
                    className={`w-24 h-24 rounded-full border-4 border-gray-200 dark:border-neutral-700 object-cover transition-all ${
                      isUploadingAvatar || isSavingAvatar ? 'opacity-50' : ''
                    }`}
                  />
                  
                  {/* Overlay de upload */}
                  <button
                    onClick={handleAvatarClick}
                    disabled={isUploadingAvatar || isSavingAvatar}
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:cursor-not-allowed"
                  >
                    {isUploadingAvatar || isSavingAvatar ? (
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Camera className="w-6 h-6 text-white" />
                    )}
                  </button>

                  {/* Badge de edição */}
                  <div 
                    className="absolute bottom-0 right-0 w-8 h-8 bg-primary-600 dark:bg-primary-500 rounded-full flex items-center justify-center border-2 border-white dark:border-neutral-950 cursor-pointer hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors"
                    onClick={handleAvatarClick}
                  >
                    <Upload className="w-4 h-4 text-white" />
                  </div>

                  {/* Input oculto */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,image/webp,image/gif"
                    onChange={handleAvatarChange}
                    className="hidden"
                    disabled={isUploadingAvatar || isSavingAvatar}
                  />
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {user?.name}
                  </h3>
                  <p className="text-gray-600 dark:text-neutral-400 text-sm mt-1">
                    {user?.email}
                  </p>
                  
                  <div className="flex gap-2 mt-4">
                    {avatarPreview ? (
                      <>
                        <button 
                          onClick={handleSaveAvatar}
                          disabled={isSavingAvatar}
                          className="text-sm text-white bg-success-600 dark:bg-success-500 hover:bg-success-700 dark:hover:bg-success-600 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {isSavingAvatar ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Salvando...
                            </>
                          ) : (
                            'Salvar foto'
                          )}
                        </button>
                        <button 
                          onClick={handleCancelAvatar}
                          disabled={isSavingAvatar}
                          className="text-sm text-gray-700 dark:text-neutral-300 bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                        >
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={handleAvatarClick}
                          disabled={isUploadingAvatar || isSavingAvatar}
                          className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium flex items-center gap-1 disabled:opacity-50"
                        >
                          <Upload className="w-4 h-4" />
                          Alterar foto
                        </button>
                        {isCustomAvatar && (
                          <button 
                            onClick={handleRemoveAvatar}
                            disabled={isSavingAvatar}
                            className="text-sm text-danger-600 dark:text-danger-400 hover:text-danger-700 dark:hover:text-danger-300 font-medium flex items-center gap-1 disabled:opacity-50"
                          >
                            {isSavingAvatar ? (
                              <>
                                <div className="w-4 h-4 border-2 border-danger-600 dark:border-danger-400 border-t-transparent rounded-full animate-spin"></div>
                                Removendo...
                              </>
                            ) : (
                              <>
                                <X className="w-4 h-4" />
                                Remover
                              </>
                            )}
                          </button>
                        )}
                      </>
                    )}
                  </div>

                  {/* Dicas */}
                  <div className="mt-3 text-xs text-gray-500 dark:text-neutral-400 space-y-1">
                    <p>• Formatos aceitos: JPG, PNG, WEBP, GIF</p>
                    <p>• Tamanho máximo: 5MB</p>
                    <p>• Recomendado: 400x400 pixels</p>
                    <p className="text-success-600 dark:text-success-400">• Armazenamento: IndexedDB (sem limite)</p>
                  </div>
                </div>
              </div>

              {/* Informações Somente Leitura */}
              <div className="space-y-5">
                <div>
                  <label className="label">Nome completo</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={user?.name || ''}
                      disabled
                      className="input-field bg-gray-50 dark:bg-neutral-800 text-gray-500 dark:text-neutral-400 cursor-not-allowed"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <span className="text-xs text-gray-400 dark:text-neutral-500 bg-gray-100 dark:bg-neutral-700 px-2 py-1 rounded">
                        Somente leitura
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1">
                    
                  </p>
                </div>

                <div>
                  <label className="label">Email</label>
                  {!isEditingEmail ? (
                    <div className="relative">
                      <input
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="input-field bg-gray-50 dark:bg-neutral-800"
                      />
                      <button
                        onClick={() => setIsEditingEmail(true)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium transition-colors"
                      >
                        Alterar
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <input
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder="Digite o novo email"
                        className="input-field"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleRequestEmailChange}
                          disabled={isSendingCode}
                          className="flex-1 btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSendingCode ? 'Enviando...' : 'Enviar Código'}
                        </button>
                        <button
                          onClick={handleCancelEmailEdit}
                          className="flex-1 btn btn-secondary"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}
                  <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1">
                    {isEditingEmail 
                      ? 'Um código será enviado para o novo email'
                      : 'Clique em "Alterar" para mudar seu email'
                    }
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Segurança */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="card">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Alterar Senha
                </h2>

                <form
                  onSubmit={passwordForm.handleSubmit(onSubmitPassword)}
                  className="space-y-5"
                >
                  <div>
                    <label className="label">Senha atual</label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        {...passwordForm.register('currentPassword')}
                        className={`input-field pr-12 ${
                          passwordForm.formState.errors.currentPassword
                            ? 'input-error'
                            : ''
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-neutral-300 transition-colors"
                      >
                        {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {passwordForm.formState.errors.currentPassword && (
                      <p className="error-message">
                        {passwordForm.formState.errors.currentPassword.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="label">Nova senha</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        {...passwordForm.register('newPassword')}
                        className={`input-field pr-12 ${
                          passwordForm.formState.errors.newPassword
                            ? 'input-error'
                            : ''
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-neutral-300 transition-colors"
                      >
                        {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {passwordForm.formState.errors.newPassword && (
                      <p className="error-message">
                        {passwordForm.formState.errors.newPassword.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="label">Confirmar nova senha</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        {...passwordForm.register('confirmPassword')}
                        className={`input-field pr-12 ${
                          passwordForm.formState.errors.confirmPassword
                            ? 'input-error'
                            : ''
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-neutral-300 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {passwordForm.formState.errors.confirmPassword && (
                      <p className="error-message">
                        {passwordForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end pt-4">
                    <button type="submit" className="btn-primary">
                      Alterar senha
                    </button>
                  </div>
                </form>
              </div>

              <div className="card">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Autenticação de Dois Fatores
                </h2>
                <p className="text-gray-600 dark:text-neutral-400 mb-6">
                  Adicione uma camada extra de segurança à sua conta
                </p>
                <button className="btn-secondary">
                  Ativar autenticação em duas etapas
                </button>
              </div>

              {/* Card de Dados e Privacidade */}
              <div className="card">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Dados e Privacidade
                </h2>

                <div className="space-y-4">
                  <button 
                    onClick={handleExportData}
                    className="w-full btn-secondary flex items-center justify-center gap-2"
                  >
                    <Database className="w-5 h-5" />
                    Exportar meus dados
                  </button>

                  <button 
                    onClick={handleDeleteAccount}
                    className="w-full btn-danger flex items-center justify-center gap-2"
                  >
                    <Shield className="w-5 h-5" />
                    Excluir minha conta
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Notificações */}
          {activeTab === 'notifications' && (
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Preferências de Notificação
              </h2>

              <div className="space-y-6">
                <div className="flex items-center justify-between pb-6 border-b border-gray-200 dark:border-neutral-800">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Email de transações
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-neutral-400 mt-1">
                      Receba emails quando novas transações forem adicionadas
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={notifications.emailTransactions}
                      onChange={() => toggleNotification('emailTransactions')}
                    />
                    <div className="w-11 h-6 bg-gray-200 dark:bg-neutral-700 peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-900/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600 dark:peer-checked:bg-primary-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between pb-6 border-b border-gray-200 dark:border-neutral-800">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Resumo semanal
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-neutral-400 mt-1">
                      Receba um resumo semanal das suas finanças
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={notifications.weeklyReport}
                      onChange={() => toggleNotification('weeklyReport')}
                    />
                    <div className="w-11 h-6 bg-gray-200 dark:bg-neutral-700 peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-900/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600 dark:peer-checked:bg-primary-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between pb-6 border-b border-gray-200 dark:border-neutral-800">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Alertas de orçamento
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-neutral-400 mt-1">
                      Seja notificado quando atingir limites de orçamento
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={notifications.budgetAlerts}
                      onChange={() => toggleNotification('budgetAlerts')}
                    />
                    <div className="w-11 h-6 bg-gray-200 dark:bg-neutral-700 peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-900/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600 dark:peer-checked:bg-primary-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Novidades e atualizações
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-neutral-400 mt-1">
                      Receba emails sobre novos recursos e atualizações
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={notifications.newsUpdates}
                      onChange={() => toggleNotification('newsUpdates')}
                    />
                    <div className="w-11 h-6 bg-gray-200 dark:bg-neutral-700 peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-900/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600 dark:peer-checked:bg-primary-500"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Preferências */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <div className="card">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Aparência
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="label">Tema</label>
                    <select 
                      className="input-field"
                      value={theme}
                      onChange={(e) => handleThemeChange(e.target.value)}
                    >
                      <option value="light">Claro</option>
                      <option value="dark">Escuro</option>
                    </select>
                  </div>

                  <div>
                    <label className="label">Idioma</label>
                    <select 
                      className="input-field"
                      value={preferences.language}
                      onChange={(e) => handleLanguageChange(e.target.value)}
                    >
                      <option value="pt-BR">Português (Brasil)</option>
                      <option value="en">English</option>
                      <option value="es">Español</option>
                    </select>
                  </div>

                  <div>
                    <label className="label">Moeda</label>
                    <select 
                      className="input-field"
                      value={preferences.currency}
                      onChange={(e) => handleCurrencyChange(e.target.value)}
                    >
                      <option value="BRL">Real (R$)</option>
                      <option value="USD">Dólar (USD)</option>
                      <option value="EUR">Euro (EUR)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </PageTransition>

    {/* Modal de Verificação de Email */}
    <VerifyEmailChangeModal
      isOpen={showVerifyModal}
      onClose={handleCloseVerifyModal}
      newEmail={newEmail}
    />

    {/* Modal de Verificação de Senha */}
    <VerifyPasswordChangeModal
      isOpen={showPasswordVerifyModal}
      onClose={() => {
        setShowPasswordVerifyModal(false)
        setPendingPasswordData(null)
      }}
      currentPassword={pendingPasswordData?.currentPassword || ''}
      newPassword={pendingPasswordData?.newPassword || ''}
      onSuccess={handlePasswordChangeSuccess}
    />
    
    {/* Modal de Exportação de Dados */}
    <ExportDataModal
      isOpen={showExportModal}
      onClose={() => setShowExportModal(false)}
      onConfirm={confirmExportData}
    />
    
    {/* Modal de Exclusão de Conta */}
    <DeleteAccountModal
      isOpen={showDeleteModal}
      onClose={() => setShowDeleteModal(false)}
      onConfirm={confirmDeleteAccount}
      userEmail={user?.email || ''}
    />
    </>
  )
}

export default Settings
