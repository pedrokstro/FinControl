import { useState, FormEvent, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Lock, Mail, Eye, EyeOff, Wallet } from 'lucide-react'
import toast from 'react-hot-toast'
import AnimatedPage from '@/components/common/AnimatedPage'
import { motion } from 'framer-motion'

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
      navigate('/app/dashboard', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const floatingShapes = [
    { className: 'w-72 h-72 bg-primary-500/20 top-[-80px] right-[-40px]' },
    { className: 'w-60 h-60 bg-primary-400/10 bottom-[-60px] left-[-20px]' },
    { className: 'w-40 h-40 bg-white/10 top-1/2 right-10 hidden lg:block' },
  ]

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
        // Recarregar dados do usuário do banco de dados
        await refreshUserData()

        toast.success('Login realizado com sucesso!')
        navigate('/app/transactions')
      } else {
        toast.error('Email ou senha incorretos')
      }
    } catch (error: any) {
      console.error('Erro ao fazer login:', error)

      // ⚠️ VERIFICAÇÃO DE EMAIL OBRIGATÓRIA
      if (error.message === 'EMAIL_NOT_VERIFIED') {
        toast.error('Você precisa verificar seu email antes de fazer login', {
          duration: 5000,
          icon: '📧',
        })
        // Redirecionar para página de verificação de email
        navigate('/verify-email', {
          state: { email }
        })
        return
      }

      // Mensagens de erro mais específicas
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
    <AnimatedPage direction="left">
      <div className="relative min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-primary-500 to-primary-700 overflow-hidden">
        {floatingShapes.map((shape, index) => (
          <motion.span
            key={index}
            className={`absolute rounded-full blur-3xl ${shape.className}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1, y: [0, -30, 0] }}
            transition={{ duration: 10 + index * 3, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}

        {/* Left Side - Decorative */}
        <motion.div
          className="hidden lg:flex lg:w-1/2 p-12 flex-col justify-between relative z-10"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-lg">
              <Wallet className="w-7 h-7 text-primary-600" />
            </div>
            <span className="text-3xl font-bold text-white">FinControl</span>
          </div>

          <div className="text-white">
            <h1 className="text-4xl font-bold mb-4">
              Gerencie suas finanças com inteligência
            </h1>
            <p className="text-primary-100 text-lg">
              Controle completo de receitas, despesas e investimentos em um único lugar.
            </p>
          </div>

          <div className="flex gap-8 text-white">
            <div>
              <div className="text-3xl font-bold mb-1">10k+</div>
              <div className="text-primary-100">Usuários ativos</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">50k+</div>
              <div className="text-primary-100">Transações registradas</div>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div
          className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 relative z-10"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <div className="w-full max-w-md">
            {/* Logo for mobile */}
            <div className="lg:hidden flex flex-col items-center text-center gap-3 mb-8 text-white">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-lg">
                <Wallet className="w-7 h-7 text-primary-600" />
              </div>
              <div>
                <span className="text-3xl font-bold block">FinControl</span>
                <p className="text-primary-50 text-sm mt-1">Gerencie suas finanças em qualquer lugar</p>
              </div>
            </div>

            <motion.div
              className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.span
                className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent"
                animate={{ opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 6, repeat: Infinity }}
              />
              <div className="relative z-10">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Bem-vindo de volta!
                  </h2>
                  <p className="text-gray-600">
                    Entre com suas credenciais para continuar
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white text-gray-900 placeholder-gray-400"
                        placeholder="seu@email.com"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      Senha
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white text-gray-900 placeholder-gray-400"
                        placeholder="senha"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">
                        Lembrar-me
                      </span>
                    </label>
                    <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700 font-medium text-right">
                      Esqueceu a senha?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || isGoogleLoading}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isLoading ? 'Entrando...' : 'Entrar'}
                  </button>
                </form>

                <div className="my-6 flex items-center gap-4">
                  <span className="h-px flex-1 bg-gray-200" />
                  <span className="text-xs uppercase tracking-[0.2em] text-gray-400">
                    ou
                  </span>
                  <span className="h-px flex-1 bg-gray-200" />
                </div>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isGoogleLoading || isLoading}
                  className="w-full border border-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 hover:border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="w-5 h-5 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 488 512"
                      className="w-5 h-5"
                    >
                      <path
                        d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 8 401.2 8 264S110.8 24 248 24c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C316.6 100.2 285 88 248 88c-97.2 0-176 78.8-176 176s78.8 176 176 176c89.9 0 147.3-51.6 153-123.9H248v-99.3h240c2.2 11.6 3.9 22.3 3.9 38z"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                  {isGoogleLoading ? 'Conectando...' : 'Entrar com Google'}
                </button>

                <div className="mt-6 text-center space-y-3">
                  <p className="text-sm text-gray-600">
                    Não tem uma conta?{' '}
                    <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                      Criar conta
                    </Link>
                  </p>
                  <p className="text-sm text-gray-600">
                    <Link to="/about" className="text-primary-600 hover:text-primary-700 font-medium">
                      Saiba mais sobre o FinControl
                    </Link>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </AnimatedPage>
  )
}

export default Login
