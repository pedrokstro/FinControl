import { useState, useRef, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  Camera, 
  Upload, 
  X,
  Save,
  ArrowLeft,
  Edit2
} from 'lucide-react'
import toast from 'react-hot-toast'
import { imageStorage } from '@/utils/imageStorage'
import { useNavigate } from 'react-router-dom'

const profileSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no minimo 3 caracteres'),
  email: z.string().email('Email invalido'),
})

type ProfileFormData = z.infer<typeof profileSchema>

const Profile = () => {
  const { user, updateUser, updateAvatar, loadAvatar } = useAuthStore()
  const navigate = useNavigate()
  
  const [isEditing, setIsEditing] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [isSavingAvatar, setIsSavingAvatar] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Carregar avatar ao montar componente
  useEffect(() => {
    loadAvatar()
  }, [loadAvatar])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  })

  const onSubmit = (data: ProfileFormData) => {
    updateUser(data)
    reset(data)
    setIsEditing(false)
    toast.success('Perfil atualizado com sucesso!')
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
      toast.error('Formato invalido! Use JPG, PNG, WEBP ou GIF.')
      return
    }

    // Validar tamanho (máximo 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      toast.error('Imagem muito grande! Tamanho maximo: 5MB.')
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

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Bom dia'
    if (hour < 18) return 'Boa tarde'
    return 'Boa noite'
  }

  const isCustomAvatar = user?.avatar && !user.avatar.includes('dicebear')

  // Data de criação da conta do usuário
  const accountCreatedDate = user?.createdAt ? new Date(user.createdAt) : new Date()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-900 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-neutral-400" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Meu Perfil</h1>
            <p className="text-gray-600 dark:text-neutral-400 mt-1">
              {getGreeting()}, <span className="font-medium">{user?.name?.split(' ')[0]}</span>!
            </p>
          </div>
        </div>
        
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Edit2 className="w-5 h-5" />
            Editar Perfil
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Esquerda - Avatar e Info Básica */}
        <div className="lg:col-span-1">
          <div className="card">
            {/* Avatar */}
            <div className="flex flex-col items-center text-center">
              <div className="relative group mb-4">
                <img
                  src={avatarPreview || user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                  alt={user?.name}
                  className={`w-32 h-32 rounded-full border-4 border-gray-200 dark:border-neutral-700 object-cover transition-all ${
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
                    <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Camera className="w-8 h-8 text-white" />
                  )}
                </button>

                {/* Badge de edição */}
                <div 
                  className="absolute bottom-2 right-2 w-10 h-10 bg-primary-600 dark:bg-primary-500 rounded-full flex items-center justify-center border-2 border-white dark:border-neutral-950 cursor-pointer hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors shadow-lg"
                  onClick={handleAvatarClick}
                >
                  <Upload className="w-5 h-5 text-white" />
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

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {user?.name}
              </h2>
              <p className="text-gray-600 dark:text-neutral-400 text-sm mb-4">
                {user?.email}
              </p>

              {/* Ações do Avatar */}
              {avatarPreview ? (
                <div className="flex flex-col gap-2 w-full">
                  <button 
                    onClick={handleSaveAvatar}
                    disabled={isSavingAvatar}
                    className="w-full text-sm text-white bg-success-600 dark:bg-success-500 hover:bg-success-700 dark:hover:bg-success-600 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSavingAvatar ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Salvar foto
                      </>
                    )}
                  </button>
                  <button 
                    onClick={handleCancelAvatar}
                    disabled={isSavingAvatar}
                    className="w-full text-sm text-gray-700 dark:text-neutral-300 bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 w-full">
                  <button 
                    onClick={handleAvatarClick}
                    disabled={isUploadingAvatar || isSavingAvatar}
                    className="w-full text-sm text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Alterar foto
                  </button>
                  {isCustomAvatar && (
                    <button 
                      onClick={handleRemoveAvatar}
                      disabled={isSavingAvatar}
                      className="w-full text-sm text-danger-600 dark:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-900/20 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isSavingAvatar ? (
                        <>
                          <div className="w-4 h-4 border-2 border-danger-600 dark:border-danger-400 border-t-transparent rounded-full animate-spin"></div>
                          Removendo...
                        </>
                      ) : (
                        <>
                          <X className="w-4 h-4" />
                          Remover foto
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}

              {/* Dicas */}
              <div className="mt-4 text-xs text-gray-500 dark:text-neutral-400 text-left w-full space-y-1">
                <p>• Formatos: JPG, PNG, WEBP, GIF</p>
                <p>• Tamanho maximo: 5MB</p>
                <p>• Recomendado: 400x400px</p>
              </div>
            </div>

            {/* Estatísticas */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-neutral-800 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-5 h-5 text-gray-400 dark:text-neutral-500" />
                <div>
                  <p className="text-gray-600 dark:text-neutral-400">Membro desde</p>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {accountCreatedDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <Shield className="w-5 h-5 text-gray-400 dark:text-neutral-500" />
                <div>
                  <p className="text-gray-600 dark:text-neutral-400">Status da conta</p>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300">
                    Ativa
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna Direita - Formulário */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Informacoes Pessoais
              </h3>
              {isEditing && (
                <span className="text-xs text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-3 py-1 rounded-full font-medium">
                  Modo de edicao
                </span>
              )}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="label">
                  <User className="w-4 h-4 mr-2" />
                  Nome completo
                </label>
                <input
                  type="text"
                  {...register('name')}
                  disabled={!isEditing}
                  className={`input-field ${errors.name ? 'input-error' : ''} ${!isEditing ? 'opacity-60 cursor-not-allowed' : ''}`}
                />
                {errors.name && (
                  <p className="error-message">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="label">
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </label>
                <input
                  type="email"
                  {...register('email')}
                  disabled={!isEditing}
                  className={`input-field ${errors.email ? 'input-error' : ''} ${!isEditing ? 'opacity-60 cursor-not-allowed' : ''}`}
                />
                {errors.email && (
                  <p className="error-message">{errors.email.message}</p>
                )}
              </div>

              {isEditing && (
                <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-neutral-800">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false)
                      reset()
                    }}
                    className="flex-1 btn-secondary"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={!isDirty}
                    className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    Salvar alteracoes
                  </button>
                </div>
              )}
            </form>

            {!isEditing && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-neutral-800">
                <p className="text-sm text-gray-600 dark:text-neutral-400">
                  Clique em "Editar Perfil" para modificar suas informacoes pessoais.
                </p>
              </div>
            )}
          </div>

          {/* Card de Ações Rápidas */}
          <div className="card mt-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Acoes Rapidas
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => navigate('/settings')}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 dark:bg-neutral-900 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition-colors text-gray-900 dark:text-white font-medium"
              >
                <Shield className="w-5 h-5" />
                Configuracoes
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 dark:bg-neutral-900 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition-colors text-gray-900 dark:text-white font-medium"
              >
                <ArrowLeft className="w-5 h-5" />
                Voltar ao Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
