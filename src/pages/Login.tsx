import { useState, FormEvent, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Lock, Mail, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import AnimatedPage from '@/components/common/AnimatedPage'
import { motion } from 'framer-motion'

const FallingMoney = () => {
  const [particles, setParticles] = useState<any[]>([])

  useEffect(() => {
    const symbols = ['R$', '$', '€', '£', '¥', '₿', '¢']
    const generated = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      x: Math.random() * 100, // vw
      delay: Math.random() * 15,
      duration: 15 + Math.random() * 25,
      size: 14 + Math.random() * 28, // px
      opacity: 0.15 + Math.random() * 0.45,
      rotateStart: Math.random() * 360,
      rotateEnd: Math.random() * 360 + 360,
    }))
    setParticles(generated)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-primary-900">
      {/* Dynamic gradient overlay to make things look deep */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-800/80 via-primary-900/90 to-primary-900 z-10" />
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute text-emerald-400 font-serif font-black select-none z-20 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]"
          style={{ left: `${p.x}vw`, fontSize: p.size, opacity: p.opacity }}
          initial={{ y: '-10vh', x: 0, rotate: p.rotateStart }}
          animate={{
            y: '110vh',
            x: [0, Math.random() * 50 - 25, 0], // sway left/right
            rotate: p.rotateEnd
          }}
          transition={{
            y: { duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'linear' },
            x: { duration: p.duration * 0.5, delay: p.delay, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror' },
            rotate: { duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'linear' }
          }}
        >
          {p.symbol}
        </motion.div>
      ))}
    </div>
  )
}

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
      <div className="relative min-h-[100dvh] flex flex-col lg:flex-row bg-primary-900 overflow-x-hidden">
        {/* Dynamic Background */}
        <FallingMoney />

        {/* Left Side - Decorative */}
        <motion.div
          className="hidden lg:flex lg:flex-1 p-12 xl:p-16 flex-col justify-between relative z-10"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-lg overflow-hidden p-2">
              <img src="/icons/logofincontrol.png" alt="FinControl" className="w-full h-full object-contain" />
            </div>
            <span className="text-3xl font-extrabold tracking-tight text-white">FinControl</span>
          </div>

          <div className="text-white max-w-2xl">
            <h1 className="text-5xl xl:text-7xl font-black tracking-tighter mb-6 leading-[1.1]">
              O controle <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-100">
                absoluto
              </span><br />
              do seu capital.
            </h1>
            <p className="text-primary-100 text-xl font-light leading-relaxed max-w-xl">
              Inteligência financeira real. Monitore receitas, despesas e investimentos com a precisão que o seu patrimônio exige.
            </p>
          </div>

          <div className="flex gap-12 text-white border-t border-white/10 pt-8 mt-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8, type: "spring", stiffness: 80 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="relative group cursor-default"
            >
              <motion.div
                animate={{ opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -inset-6 bg-primary-500/40 blur-2xl rounded-full -z-10 transition-transform duration-500 group-hover:scale-150"
              />
              <div className="text-4xl font-black tracking-tight mb-1 relative z-10 drop-shadow-lg group-hover:text-primary-100 transition-colors">
                10k+
              </div>
              <div className="text-primary-200 text-sm font-medium uppercase tracking-wider">Investidores</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8, type: "spring", stiffness: 80 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="relative group cursor-default"
            >
              <motion.div
                animate={{ opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                className="absolute -inset-6 bg-primary-500/40 blur-2xl rounded-full -z-10 transition-transform duration-500 group-hover:scale-150"
              />
              <div className="text-4xl font-black tracking-tight mb-1 relative z-10 drop-shadow-lg group-hover:text-primary-100 transition-colors">
                50k+
              </div>
              <div className="text-primary-200 text-sm font-medium uppercase tracking-wider">Transações</div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="w-full flex-1 lg:flex-none lg:w-[480px] xl:w-[560px] flex-shrink-0 flex flex-col items-center justify-center p-4 py-6 sm:p-8 lg:p-12 relative z-10"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <div className="w-full max-w-md">
            {/* Logo for mobile */}
            <div className="lg:hidden flex flex-col items-center text-center gap-2 mb-6 sm:mb-10 text-white">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl overflow-hidden p-2 sm:p-3">
                <img src="/icons/logofincontrol.png" alt="FinControl" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="text-2xl sm:text-4xl font-black tracking-tighter block">FinControl</span>
                <p className="text-primary-100 text-xs sm:text-sm mt-1 sm:mt-2 font-light">Ecossistema financeiro inteligente</p>
              </div>
            </div>

            <motion.div
              className="w-full bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-5 sm:p-10 relative overflow-hidden border border-gray-100"
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
                <div className="mb-6 sm:mb-10 text-center">
                  <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-gray-900 mb-1 sm:mb-2">
                    Acesso à plataforma
                  </h2>
                  <p className="text-gray-500 font-medium text-xs sm:text-sm">
                    Insira suas credenciais para gerenciar sua carteira
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-5">
                  <div>
                    <label htmlFor="email" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                      E-mail Corporativo / Pessoal
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 sm:py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all bg-gray-50/50 hover:bg-white text-gray-900 placeholder-gray-400 font-medium text-sm sm:text-base"
                        placeholder="nome@exemplo.com"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                      Senha de Acesso
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-2.5 sm:py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all bg-gray-50/50 hover:bg-white text-gray-900 placeholder-gray-400 font-medium text-sm sm:text-base"
                        placeholder="••••••••"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-900 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center group cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500/20 transition-all"
                      />
                      <span className="ml-2 text-xs sm:text-sm font-medium text-gray-500 group-hover:text-gray-900 transition-colors">
                        Manter conectado
                      </span>
                    </label>
                    <Link to="/forgot-password" className="text-xs sm:text-sm text-primary-600 hover:text-primary-800 font-bold transition-colors">
                      Recuperar senha
                    </Link>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || isGoogleLoading}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold tracking-wide py-3 sm:py-4 px-4 rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl hover:shadow-primary-600/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 mt-3 sm:mt-4 text-sm sm:text-base"
                  >
                    {isLoading ? 'AUTENTICANDO...' : 'ACESSAR PLATAFORMA'}
                  </button>
                </form>

                <div className="my-5 sm:my-8 flex items-center gap-4">
                  <span className="h-px flex-1 bg-gray-100" />
                  <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400">
                    Acesso Alternativo
                  </span>
                  <span className="h-px flex-1 bg-gray-100" />
                </div>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isGoogleLoading || isLoading}
                  className="w-full border-2 border-gray-100 text-gray-700 font-bold py-2.5 sm:py-3.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 hover:border-gray-100 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  <span className="w-5 h-5 flex items-center justify-center">
                    <img
                      src="/icons/icons8-google-logo-240.png"
                      alt="Google Logo"
                      className="w-full h-full object-contain"
                    />
                  </span>
                  {isGoogleLoading ? 'CONECTANDO...' : 'CONTINUAR COM GOOGLE'}
                </button>

                <div className="mt-5 sm:mt-8 text-center space-y-2 sm:space-y-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-500">
                    Ainda não possui conta?{' '}
                    <Link to="/register" className="text-primary-600 hover:text-primary-800 font-bold transition-colors">
                      Abra sua conta
                    </Link>
                  </p>
                  <p className="text-[11px] sm:text-xs font-medium text-gray-400">
                    <Link to="/about" className="hover:text-gray-600 transition-colors">
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
