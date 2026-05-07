import { useState, FormEvent, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Lock, Mail, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const navigate = useNavigate()
  const { login, refreshUserData, loginWithGoogle, isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/app/transactions', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast.error('Preencha todos os campos')
      return
    }

    setIsLoading(true)

    try {
      const success = await login(email, password)
      if (success) {
        await refreshUserData()
        toast.success('Login realizado com sucesso!')
        navigate('/app/transactions')
      } else {
        toast.error('Email ou senha incorretos')
      }
    } catch (error: any) {
      console.error('Erro ao fazer login:', error)

      if (error.message === 'EMAIL_NOT_VERIFIED') {
        toast.error('Você precisa verificar seu email antes de fazer login', {
          duration: 5000,
          icon: '📧',
        })
        navigate('/verify-email', {
          state: { email }
        })
        return
      }

      if (error.response?.status === 401) {
        toast.error('Email ou senha incorretos')
      } else if (error.response?.status === 404) {
        toast.error('Usuário não encontrado')
      } else {
        toast.error('Erro ao fazer login. Tente novamente.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    if (isGoogleLoading || isLoading) return

    setIsGoogleLoading(true)
    try {
      await loginWithGoogle()
    } catch (error: any) {
      console.error('Erro no login com Google:', error)
      toast.error(error?.message || 'Não foi possível iniciar o login com Google.')
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-neutral-900 p-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white dark:bg-neutral-800 rounded-2xl shadow-sm mb-4 p-3 sm:p-4">
            <img src="/icons/logofincontrol.png" alt="FinControl" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900 dark:text-white">FinControl</h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-neutral-400 mt-2 font-medium">Controle financeiro inteligente</p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-neutral-800 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-neutral-700 p-6 sm:p-10">
          <div className="mb-6 sm:mb-8 text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">Bem-vindo de volta</h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-neutral-400">Acesse sua conta para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-gray-700 dark:text-neutral-300 uppercase tracking-wider mb-2">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-2xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400 font-medium"
                  placeholder="seu@email.com"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold text-gray-700 dark:text-neutral-300 uppercase tracking-wider mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3.5 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-2xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400 font-medium"
                  placeholder="••••••••"
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-primary-600 border-gray-300 dark:border-neutral-600 rounded focus:ring-primary-500/20 transition-all"
                />
                <span className="ml-2 text-sm text-gray-500 dark:text-neutral-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                  Lembrar de mim
                </span>
              </label>
              <Link to="/forgot-password" weights="bold" className="text-sm text-primary-600 hover:text-primary-800 font-bold transition-colors">
                Esqueceu a senha?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading || isGoogleLoading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-primary-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'CARREGANDO...' : 'ENTRAR'}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100 dark:border-neutral-700"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-neutral-800 px-4 text-gray-400 font-bold tracking-widest">Ou continuar com</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading || isLoading}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-4 border-2 border-gray-100 dark:border-neutral-700 rounded-2xl hover:bg-gray-50 dark:hover:bg-neutral-700 transition-all text-gray-700 dark:text-neutral-200 font-bold disabled:opacity-50"
          >
            <img src="/icons/icons8-google-logo-240.png" alt="Google" className="w-5 h-5" />
            {isGoogleLoading ? 'CONECTANDO...' : 'GOOGLE'}
          </button>

          <div className="mt-10 text-center">
            <p className="text-sm text-gray-500 dark:text-neutral-400">
              Não tem uma conta?{' '}
              <Link to="/register" className="text-primary-600 hover:text-primary-800 font-bold">
                Criar agora
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
