import { lazy, Suspense, useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useFinancialStore } from '@/store/financialStore'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Database, Shield, Camera, Upload, X, ShieldCheck, Smartphone, Fingerprint, Lock, User, Bell, Palette, History } from 'lucide-react'
import { haptics } from '@/utils/haptics'
import toast from 'react-hot-toast'
import { imageStorage } from '@/utils/imageStorage'
import { useTheme } from '@/contexts/ThemeContext'
import PageTransition from '@/components/common/PageTransition'
import PageHeader from '@/components/common/PageHeader'
import { useIsMobile } from '@/hooks'
import VerifyEmailChangeModal from '@/components/modals/VerifyEmailChangeModal'
import VerifyPasswordChangeModal from '@/components/modals/VerifyPasswordChangeModal'
import ExportDataModal from '@/components/modals/ExportDataModal'
import DeleteAccountModal from '@/components/modals/DeleteAccountModal'
import userService from '@/services/user.service'
import CustomSelect from '@/components/common/CustomSelect'
import { useSecurityStore } from '@/store/securityStore'
import { motion } from 'framer-motion'
import PasswordStrengthInput from '@/components/ui/PasswordStrengthInput'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/Accordion'
const DesktopChangelogTab = lazy(() => import('@/components/settings/DesktopChangelogTab'))
const MobileSettingsMenu = lazy(() => import('@/components/settings/mobile/MobileSettingsMenu').then((m) => ({ default: m.MobileSettingsMenu })))
const MobileProfileView = lazy(() => import('@/components/settings/mobile/MobileProfileView').then((m) => ({ default: m.MobileProfileView })))
const MobileSecurityView = lazy(() => import('@/components/settings/mobile/MobileSecurityView').then((m) => ({ default: m.MobileSecurityView })))
const MobileNotificationsView = lazy(() => import('@/components/settings/mobile/MobileNotificationsView').then((m) => ({ default: m.MobileNotificationsView })))
const MobilePreferencesView = lazy(() => import('@/components/settings/mobile/MobilePreferencesView').then((m) => ({ default: m.MobilePreferencesView })))
const MobileChangelogView = lazy(() => import('@/components/settings/mobile/MobileChangelogView').then((m) => ({ default: m.MobileChangelogView })))

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
  const isMobile = useIsMobile()
  const user = useAuthStore((s) => s.user)
  const updateAvatar = useAuthStore((s) => s.updateAvatar)
  const loadAvatar = useAuthStore((s) => s.loadAvatar)
  const logout = useAuthStore((s) => s.logout)
  const { theme, setTheme } = useTheme()
  const [activeTab, setActiveTab] = useState<'menu' | 'profile' | 'security' | 'notifications' | 'preferences' | 'changelog'>('menu')

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [isSavingAvatar, setIsSavingAvatar] = useState(false)
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

  const isBiometricEnabled = useSecurityStore((s) => s.isBiometricEnabled)
  const setBiometricEnabled = useSecurityStore((s) => s.setBiometricEnabled)
  const isSupported = useSecurityStore((s) => s.isSupported)
  const setLocked = useSecurityStore((s) => s.setLocked)
  const [biometricSupported, setBiometricSupported] = useState(false)

  useEffect(() => {
    isSupported().then(setBiometricSupported)
  }, [isSupported])

  const handleToggleBiometric = async () => {
    if (!biometricSupported) {
      toast.error('Seu dispositivo não suporta biometria neste navegador.')
      return
    }

    if (!isBiometricEnabled) {
      try {
        const challenge = new Uint8Array(32)
        window.crypto.getRandomValues(challenge)
        
        await navigator.credentials.get({
          publicKey: {
            challenge,
            rpId: window.location.hostname,
            userVerification: 'required'
          }
        })
        
        setBiometricEnabled(true)
        haptics.success()
        toast.success('Login por digital ativado!')
      } catch (e) {
        console.error(e)
        toast.error('Falha ao validar biometria.')
      }
    } else {
      setBiometricEnabled(false)
      haptics.medium()
      toast.success('Login por digital desativado.')
    }
  }
  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  })
  const watchedNewPassword = passwordForm.watch('newPassword', '')

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
    // Verificar se é premium antes de exportar
    if (!user?.isPremium) {
      toast.error('Exportação de dados é exclusiva do plano Premium')
      setShowExportModal(false)
      return
    }

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
        version: '2.0.1'
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
    { id: 'changelog', label: 'Atualizações', icon: History },
  ]


  // Verificar se é avatar personalizado
  const isCustomAvatar = user?.avatar && !user.avatar.includes('dicebear')

  return (
    <>
      <PageTransition>
        <div className="responsive-page">
          <PageHeader
            title="Configurações"
            subtitle="Gerencie suas preferências e dados da conta"
            hideSubtitleOnMobile
            className="hidden sm:flex mb-6"
          />

          {/* NO DESKTOP: ABAS HORIZONTAIS NO TOPO ESTILO SAAS REFINADO */}
          <div className="hidden lg:flex items-center gap-1.5 p-1.5 bg-gray-100/70 dark:bg-neutral-900/40 border border-gray-200/50 dark:border-neutral-800/60 rounded-2xl mb-8 w-full max-w-3xl">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id || (activeTab === 'menu' && tab.id === 'profile')

              return (
                <button
                  key={tab.id}
                  onClick={() => { haptics.light(); setActiveTab(tab.id as any) }}
                  className={`relative flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap active:scale-[0.98] ${isActive
                      ? 'text-white'
                      : 'text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeSettingsTab"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      className="absolute inset-0 bg-primary-600 dark:bg-primary-500 rounded-xl shadow-sm z-0"
                    />
                  )}
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-white' : 'text-gray-400 dark:text-neutral-500'}`} />
                    {tab.label}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="max-w-4xl mx-auto lg:mx-0">
            {/* VERSÃO MOBILE NATIVA DEDICADA */}
            {isMobile && (
              <div className="lg:hidden">
                <Suspense fallback={null}>
                  {activeTab === 'menu' && (
                    <MobileSettingsMenu
                      user={user}
                      onSelectTab={(tab) => setActiveTab(tab)}
                      onAvatarClick={handleAvatarClick}
                      onLogout={logout}
                      version={__APP_VERSION__}
                      theme={theme}
                      onToggleTheme={() => handleThemeChange(theme === 'dark' ? 'light' : 'dark')}
                    />
                  )}

                  {activeTab === 'profile' && (
                    <MobileProfileView
                      user={user}
                      onBack={() => setActiveTab('menu')}
                      avatarPreview={avatarPreview}
                      isUploadingAvatar={isUploadingAvatar}
                      isSavingAvatar={isSavingAvatar}
                      onAvatarClick={handleAvatarClick}
                      onSaveAvatar={handleSaveAvatar}
                      onCancelAvatar={handleCancelAvatar}
                      fileInputRef={fileInputRef}
                      onAvatarChange={handleAvatarChange}
                      newEmail={newEmail}
                      setNewEmail={setNewEmail}
                      isEditingEmail={isEditingEmail}
                      setIsEditingEmail={setIsEditingEmail}
                      isSendingCode={isSendingCode}
                      onRequestEmailChange={handleRequestEmailChange}
                      onCancelEmailEdit={handleCancelEmailEdit}
                    />
                  )}

                  {activeTab === 'security' && (
                    <MobileSecurityView
                      onBack={() => setActiveTab('menu')}
                      passwordForm={passwordForm}
                      onSubmitPassword={onSubmitPassword}
                      watchedNewPassword={watchedNewPassword}
                      isBiometricEnabled={isBiometricEnabled}
                      handleToggleBiometric={handleToggleBiometric}
                      biometricSupported={biometricSupported}
                      setLocked={setLocked}
                      onExportData={handleExportData}
                      onDeleteAccount={handleDeleteAccount}
                    />
                  )}

                  {activeTab === 'notifications' && (
                    <MobileNotificationsView
                      onBack={() => setActiveTab('menu')}
                      notifications={notifications}
                      toggleNotification={toggleNotification}
                    />
                  )}

                  {activeTab === 'preferences' && (
                    <MobilePreferencesView
                      onBack={() => setActiveTab('menu')}
                      theme={theme}
                      onThemeChange={handleThemeChange}
                      preferences={preferences}
                      onLanguageChange={handleLanguageChange}
                      onCurrencyChange={handleCurrencyChange}
                    />
                  )}

                  {activeTab === 'changelog' && (
                    <MobileChangelogView
                      onBack={() => setActiveTab('menu')}
                      version={__APP_VERSION__}
                    />
                  )}
                </Suspense>
              </div>
            )}

            {/* CONTEÚDO PRINCIPAL DESKTOP (FORMULÁRIOS) */}
            <div className="hidden lg:block">
              {/* Formulários e Sub-páginas */}
              <div className="w-full">
                {/* Tab: Perfil */}
                {(activeTab === 'profile' || (activeTab === 'menu')) && (
                  <div className="relative card p-5 sm:p-6 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-2xl shadow-sm overflow-hidden">
                    {/* Acento superior de cor */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-blue-600" />

                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 font-display">
                      Informações do Perfil
                    </h2>

                    {/* Avatar com Upload */}
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center mb-8 pb-8 border-b border-gray-100 dark:border-neutral-800/60">
                      <div className="relative group self-center sm:self-start">
                        <img
                          src={avatarPreview || user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                          alt={user?.name}
                          className={`w-24 h-24 rounded-3xl border-4 border-gray-50 dark:border-neutral-800 object-cover shadow-md transition-all duration-300 ${isUploadingAvatar || isSavingAvatar ? 'opacity-50 scale-95' : ''
                            }`}
                        />

                        {/* Overlay de upload */}
                        <button
                          onClick={handleAvatarClick}
                          disabled={isUploadingAvatar || isSavingAvatar}
                          className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity disabled:cursor-not-allowed cursor-pointer"
                        >
                          {isUploadingAvatar || isSavingAvatar ? (
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Camera className="w-5 h-5 text-white" />
                          )}
                        </button>

                        {/* Badge de edição */}
                        <div
                          className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary-600 dark:bg-primary-500 rounded-xl flex items-center justify-center border-2 border-white dark:border-neutral-900 cursor-pointer hover:bg-primary-700 dark:hover:bg-primary-600 transition-all hover:scale-105 active:scale-95 shadow"
                          onClick={handleAvatarClick}
                        >
                          <Upload className="w-3.5 h-3.5 text-white" />
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

                      <div className="flex-1 text-center lg:text-left">
                        <h3 className="text-base font-bold text-gray-800 dark:text-white font-display">
                          {user?.name}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-neutral-450 mt-1 font-medium">
                          {user?.email}
                        </p>

                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 mt-4">
                          {avatarPreview ? (
                            <>
                              <button
                                onClick={handleSaveAvatar}
                                disabled={isSavingAvatar}
                                className="text-xs text-white bg-success-600 hover:bg-success-700 h-9 px-4 rounded-full font-bold active:scale-[0.97] transition-[transform,background-color] duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 shadow shadow-success-500/10"
                              >
                                {isSavingAvatar ? (
                                  <>
                                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Salvando...
                                  </>
                                ) : (
                                  'Salvar foto'
                                )}
                              </button>
                              <button
                                onClick={handleCancelAvatar}
                                disabled={isSavingAvatar}
                                className="text-xs text-gray-750 dark:text-neutral-300 bg-gray-100 hover:bg-gray-200 dark:bg-neutral-850 dark:hover:bg-neutral-800 h-9 px-4 rounded-full font-bold active:scale-[0.97] transition-[transform,background-color] duration-150 disabled:opacity-50"
                              >
                                Cancelar
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={handleAvatarClick}
                                disabled={isUploadingAvatar || isSavingAvatar}
                                className="text-xs text-primary-650 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                              >
                                <Upload className="w-3.5 h-3.5" />
                                Alterar foto
                              </button>
                              {isCustomAvatar && (
                                <button
                                  onClick={handleRemoveAvatar}
                                  disabled={isSavingAvatar}
                                  className="text-xs text-danger-655 dark:text-danger-400 hover:text-danger-700 dark:hover:text-danger-300 font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50 ml-2"
                                >
                                  {isSavingAvatar ? (
                                    <>
                                      <div className="w-3.5 h-3.5 border-2 border-danger-600 dark:border-danger-400 border-t-transparent rounded-full animate-spin"></div>
                                      Removendo...
                                    </>
                                  ) : (
                                    <>
                                      <X className="w-3.5 h-3.5" />
                                      Remover foto
                                    </>
                                  )}
                                </button>
                              )}
                            </>
                          )}
                        </div>

                        {/* Dicas */}
                        <div className="mt-4 text-[10px] text-gray-400 dark:text-neutral-500 space-y-1 text-center lg:text-left font-medium">
                          <p>• Formatos: JPG, PNG, WEBP, GIF (máximo 5MB)</p>
                          <p className="text-success-600 dark:text-success-500/80">• Armazenamento em IndexedDB local</p>
                        </div>
                      </div>
                    </div>

                    {/* Informações Somente Leitura */}
                    <div className="space-y-4">
                      <div>
                        <label className="label text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-neutral-400">Nome completo</label>
                        <div className="relative mt-1">
                          <input
                            type="text"
                            value={user?.name || ''}
                            disabled
                            className="input-field bg-gray-50/50 dark:bg-neutral-850/30 text-gray-400 dark:text-neutral-500 border-gray-150 dark:border-neutral-800/80 cursor-not-allowed select-none"
                          />
                          <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                            <span className="text-[10px] font-bold text-gray-400 dark:text-neutral-500 bg-gray-100 dark:bg-neutral-800 border border-gray-200/40 dark:border-neutral-700/50 px-2 py-0.5 rounded-md">
                              Leitura
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="label text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-neutral-400">Email</label>
                        <div className="mt-1">
                          {!isEditingEmail ? (
                            <div className="relative">
                              <input
                                type="email"
                                value={user?.email || ''}
                                disabled
                                className="input-field bg-gray-50/50 dark:bg-neutral-850/30 text-gray-450 dark:text-neutral-500 border-gray-150 dark:border-neutral-800/80"
                              />
                              <button
                                onClick={() => setIsEditingEmail(true)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-xs font-bold transition-colors cursor-pointer"
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
                                placeholder="Digite seu novo email"
                                className="input-field"
                                autoFocus
                              />
                              <div className="flex flex-col sm:flex-row gap-2">
                                <button
                                  onClick={handleRequestEmailChange}
                                  disabled={isSendingCode}
                                  className="flex-1 btn-primary h-10 rounded-full text-xs font-bold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                >
                                  {isSendingCode ? 'Enviando...' : 'Enviar Código'}
                                </button>
                                <button
                                  onClick={handleCancelEmailEdit}
                                  className="flex-1 btn-secondary h-10 rounded-full text-xs font-bold cursor-pointer"
                                >
                                  Cancelar
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                        <p className="text-[10px] font-semibold text-gray-450 dark:text-neutral-500 mt-1">
                          {isEditingEmail
                            ? 'Enviaremos um código de verificação para o novo e-mail informado'
                            : 'Para modificar o e-mail de acesso, clique em "Alterar"'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                  {/* Tab: Segurança */}
                  {activeTab === 'security' && (
                    <Accordion
                      type="multiple"
                      defaultValue={['password', 'biometrics']}
                      variant="card"
                      className="space-y-4"
                    >
                      {/* Accordion Item: Alterar Senha */}
                      <AccordionItem value="password">
                        <AccordionTrigger
                          icon={<Lock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
                          subtitle="Atualize suas credenciais de acesso com requisitos fortes"
                        >
                          Alterar Senha
                        </AccordionTrigger>
                        <AccordionContent className="pt-4 border-t border-neutral-100 dark:border-neutral-800 mt-2">
                          <form
                            onSubmit={passwordForm.handleSubmit(onSubmitPassword)}
                            className="space-y-5 max-w-xl"
                          >
                            <div className="pt-2">
                              <PasswordStrengthInput
                                id="currentPassword"
                                label="Senha atual"
                                {...passwordForm.register('currentPassword')}
                                error={passwordForm.formState.errors.currentPassword?.message}
                                showStrengthMeter={false}
                                bgClass="bg-white dark:bg-neutral-800"
                              />
                            </div>

                            <div className="pt-2">
                              <PasswordStrengthInput
                                id="newPassword"
                                label="Nova senha"
                                value={watchedNewPassword}
                                {...passwordForm.register('newPassword')}
                                error={passwordForm.formState.errors.newPassword?.message}
                                showStrengthMeter={true}
                                bgClass="bg-white dark:bg-neutral-800"
                              />
                            </div>

                            <div className="pt-2">
                              <PasswordStrengthInput
                                id="confirmPassword"
                                label="Confirmar nova senha"
                                {...passwordForm.register('confirmPassword')}
                                error={passwordForm.formState.errors.confirmPassword?.message}
                                showStrengthMeter={false}
                                bgClass="bg-white dark:bg-neutral-800"
                              />
                            </div>

                            <div className="flex justify-end pt-2">
                              <button type="submit" className="btn-primary w-full sm:w-auto h-11 px-6 rounded-full text-xs font-bold shadow-md shadow-primary-500/10 cursor-pointer">
                                Alterar senha
                              </button>
                            </div>
                          </form>
                        </AccordionContent>
                      </AccordionItem>

                      {/* Accordion Item: Biometria */}
                      <AccordionItem value="biometrics">
                        <AccordionTrigger
                          icon={<Fingerprint className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
                          subtitle="Digital ou reconhecimento facial para acesso rápido"
                        >
                          Acesso por Biometria
                        </AccordionTrigger>
                        <AccordionContent className="pt-4 border-t border-neutral-100 dark:border-neutral-800 mt-2">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                                Ativar login biométrico neste dispositivo
                              </p>
                              <p className="text-xs text-gray-500 dark:text-neutral-400 mt-0.5">
                                Impede acesso não autorizado ao alternar janelas
                              </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={isBiometricEnabled}
                                onChange={handleToggleBiometric}
                                disabled={!biometricSupported}
                              />
                              <div className="w-11 h-6 bg-gray-200 dark:bg-neutral-800 peer-focus:ring-0 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600 dark:peer-checked:bg-emerald-500"></div>
                            </label>
                          </div>

                          {!biometricSupported ? (
                            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl flex gap-3 border border-amber-100/50 dark:border-amber-900/10">
                              <Smartphone className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                              <p className="text-xs text-amber-700 dark:text-amber-300 font-medium leading-relaxed">
                                Seu dispositivo ou navegador atual não possui suporte nativo para autenticação biométrica (WebAuthn).
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <p className="text-xs text-gray-500 dark:text-neutral-400 leading-relaxed font-medium">
                                Ao ativar, o aplicativo solicitará sua biometria sempre que for aberto ou retornar do segundo plano, garantindo máxima segurança para suas informações.
                              </p>
                              {isBiometricEnabled && (
                                <button 
                                  type="button"
                                  onClick={() => setLocked(true)}
                                  className="w-full sm:w-auto h-10 px-4 btn-secondary flex items-center justify-center gap-2 rounded-full text-xs font-bold border-dashed border-2 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                                >
                                  <Lock className="w-3.5 h-3.5 text-gray-500" />
                                  Testar bloqueio biométrico agora
                                </button>
                              )}
                            </div>
                          )}
                        </AccordionContent>
                      </AccordionItem>

                      {/* Accordion Item: 2FA */}
                      <AccordionItem value="2fa">
                        <AccordionTrigger
                          icon={<ShieldCheck className="w-5 h-5 text-orange-500" />}
                          subtitle="Código temporário de 6 dígitos gerado por app autenticador"
                        >
                          Autenticação de Dois Fatores (2FA)
                        </AccordionTrigger>
                        <AccordionContent className="pt-4 border-t border-neutral-100 dark:border-neutral-800 mt-2">
                          <p className="text-xs text-gray-500 dark:text-neutral-400 mb-5 font-medium leading-relaxed max-w-xl">
                            Adicione uma camada extra de proteção blindando seu login com o Google Authenticator, Authy ou 1Password.
                          </p>
                          <button className="btn-secondary h-10 px-4 rounded-full text-xs font-bold cursor-pointer">
                            Configurar autenticação em duas etapas
                          </button>
                        </AccordionContent>
                      </AccordionItem>

                      {/* Accordion Item: Dados e Privacidade */}
                      <AccordionItem value="data">
                        <AccordionTrigger
                          icon={<Database className="w-5 h-5 text-rose-500" />}
                          subtitle="Backup estruturado e exclusão permanente de conta"
                        >
                          Dados e Privacidade
                        </AccordionTrigger>
                        <AccordionContent className="pt-4 border-t border-neutral-100 dark:border-neutral-800 mt-2">
                          <div className="space-y-3 max-w-md">
                            <button
                              onClick={handleExportData}
                              className="w-full h-11 btn-secondary flex items-center justify-center gap-2 rounded-full text-xs font-bold shadow-sm cursor-pointer"
                            >
                              <Database className="w-4 h-4 text-gray-500" />
                              Exportar todos os meus dados (JSON)
                            </button>

                            <button
                              onClick={handleDeleteAccount}
                              className="w-full h-11 btn-danger flex items-center justify-center gap-2 rounded-full text-xs font-bold shadow-sm cursor-pointer"
                            >
                              <Shield className="w-4 h-4 text-white" />
                              Excluir minha conta permanentemente
                            </button>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  )}

                {/* Tab: Notificações */}
                {activeTab === 'notifications' && (
                  <div className="relative card p-5 sm:p-6 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-2xl shadow-sm overflow-hidden">
                    {/* Acento superior de cor */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-400 to-red-655" />

                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 font-display">
                      Preferências de Notificação
                    </h2>

                    <div className="space-y-5">
                      <div className="flex items-center justify-between pb-5 border-b border-gray-100 dark:border-neutral-800/60">
                        <div>
                          <h3 className="text-sm font-bold text-gray-800 dark:text-white">
                            Email de transações
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1 font-medium leading-relaxed">
                            Receba alertas por e-mail imediatamente quando novas movimentações forem registradas
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={notifications.emailTransactions}
                            onChange={() => toggleNotification('emailTransactions')}
                          />
                          <div className="w-11 h-6 bg-gray-200 dark:bg-neutral-800 peer-focus:ring-0 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500 dark:peer-checked:bg-red-550"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between pb-5 border-b border-gray-100 dark:border-neutral-800/60">
                        <div>
                          <h3 className="text-sm font-bold text-gray-800 dark:text-white">
                            Resumo semanal
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1 font-medium leading-relaxed">
                            Receba um relatório detalhado semanal consolidando o desempenho de suas finanças
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={notifications.weeklyReport}
                            onChange={() => toggleNotification('weeklyReport')}
                          />
                          <div className="w-11 h-6 bg-gray-200 dark:bg-neutral-800 peer-focus:ring-0 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500 dark:peer-checked:bg-red-550"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between pb-5 border-b border-gray-100 dark:border-neutral-800/60">
                        <div>
                          <h3 className="text-sm font-bold text-gray-800 dark:text-white">
                            Alertas de orçamento
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1 font-medium leading-relaxed">
                            Seja avisado quando os gastos em alguma categoria atingirem os limites de orçamento planejados
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={notifications.budgetAlerts}
                            onChange={() => toggleNotification('budgetAlerts')}
                          />
                          <div className="w-11 h-6 bg-gray-200 dark:bg-neutral-800 peer-focus:ring-0 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500 dark:peer-checked:bg-red-550"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-bold text-gray-800 dark:text-white">
                            Novidades e atualizações
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1 font-medium leading-relaxed">
                            Acompanhe novidades, novos recursos e dicas de uso do FinControl
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={notifications.newsUpdates}
                            onChange={() => toggleNotification('newsUpdates')}
                          />
                          <div className="w-11 h-6 bg-gray-200 dark:bg-neutral-800 peer-focus:ring-0 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500 dark:peer-checked:bg-red-550"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab: Preferências */}
                {activeTab === 'preferences' && (
                  <div className="relative card p-5 sm:p-6 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-2xl shadow-sm overflow-hidden">
                    {/* Acento superior de cor */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 to-orange-600" />

                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 font-display">
                      Preferências Gerais
                    </h2>

                    <div className="space-y-4">
                      <div>
                        <label className="label text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-neutral-400">Tema do Sistema</label>
                        <div className="mt-1">
                          <CustomSelect
                            value={theme}
                            onChange={(val) => handleThemeChange(val)}
                            options={[
                              { value: 'light', label: '☀️ Modo Claro' },
                              { value: 'dark', label: '🌙 Modo Escuro' }
                            ]}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="label text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-neutral-400">Idioma</label>
                        <div className="mt-1">
                          <CustomSelect
                            value={preferences.language}
                            onChange={(val) => handleLanguageChange(val)}
                            options={[
                              { value: 'pt-BR', label: '🇧🇷 Português (Brasil)' },
                              { value: 'en', label: '🇺🇸 English' },
                              { value: 'es', label: '🇪🇸 Español' }
                            ]}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="label text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-neutral-400">Moeda Padrão</label>
                        <div className="mt-1">
                          <CustomSelect
                            value={preferences.currency}
                            onChange={(val) => handleCurrencyChange(val)}
                            options={[
                              { value: 'BRL', label: 'Real Brasileiro (R$)' },
                              { value: 'USD', label: 'Dólar Americano (USD)' },
                              { value: 'EUR', label: 'Euro (EUR)' }
                            ]}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab: Changelog */}
                {activeTab === 'changelog' && (
                  <Suspense fallback={<div className="p-8 text-center text-sm text-gray-500 dark:text-neutral-400">Carregando histórico...</div>}>
                    <DesktopChangelogTab />
                  </Suspense>
                )}
              </div>
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
