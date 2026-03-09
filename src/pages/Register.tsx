import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '@/store/authStore'
import { Lock, Mail, Eye, EyeOff, User, CheckCircle2, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { authService } from '@/services/api'
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
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 bg-primary-900">
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

// Schema de validação
const registerSchema = z.object({
  name: z.string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras'),
  email: z.string()
    .email('Email inválido')
    .toLowerCase(),
  password: z.string()
    .min(6, 'Senha deve ter no mínimo 6 caracteres')
    .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
    .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
    .regex(/[0-9]/, 'Senha deve conter pelo menos um número'),
  confirmPassword: z.string(),
  acceptTerms: z.boolean()
    .refine(val => val === true, 'Você deve aceitar os termos de serviço'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
})

type RegisterFormData = z.infer<typeof registerSchema>

const Register = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/app/transactions', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  })

  const password = watch('password', '')



  // Validação de força da senha
  const getPasswordStrength = (pwd: string) => {
    let strength = 0
    if (pwd.length >= 6) strength++
    if (pwd.length >= 8) strength++
    if (/[A-Z]/.test(pwd)) strength++
    if (/[a-z]/.test(pwd)) strength++
    if (/[0-9]/.test(pwd)) strength++
    if (/[^A-Za-z0-9]/.test(pwd)) strength++
    return strength
  }

  const passwordStrength = getPasswordStrength(password)

  const getStrengthLabel = () => {
    if (passwordStrength <= 2) return { label: 'Fraca', color: 'bg-red-500' }
    if (passwordStrength <= 4) return { label: 'Média', color: 'bg-yellow-500' }
    return { label: 'Forte', color: 'bg-green-500' }
  }

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)

    try {
      console.log('📤 Enviando cadastro:', { name: data.name, email: data.email })

      // Chamar API de registro
      await authService.register({
        name: data.name,
        email: data.email,
        password: data.password,
      })

      toast.success('Conta criada! Verifique seu email para ativar sua conta.')

      // Redirecionar para verificação de email
      setTimeout(() => {
        navigate(`/verify-email?email=${encodeURIComponent(data.email)}`)
      }, 1500)
    } catch (error: any) {
      console.error('❌ Erro no cadastro:', error)

      if (error.response?.status === 409) {
        toast.error('Este email já está cadastrado')
      } else {
        toast.error(error.response?.data?.message || 'Erro ao criar conta. Tente novamente.')
      }
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <AnimatedPage direction="right">
      <div className="relative min-h-screen flex flex-col lg:flex-row bg-primary-900 overflow-hidden">
        {/* Dynamic Background */}
        <FallingMoney />

        {/* Left Side */}
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
              Eleve o seu <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-100">
                patamar
              </span><br />
              financeiro.
            </h1>
            <p className="text-primary-100 text-xl font-light leading-relaxed max-w-xl mb-10">
              Junte-se a uma rede de inteligência financeira de elite e transforme a gestão do seu patrimônio.
            </p>

            <div className="space-y-6 max-w-md">
              {[
                { title: 'Custos Ocultos Zero', text: 'Estrutura totalmente livre, sem surpresas.' },
                { title: 'Privacidade Nível Bancário', text: 'Criptografia avançada e servidores blindados.' },
                { title: 'Engenharia de Usabilidade', text: 'Interface projetada para velocidade e precisão.' },
              ].map((item, idx) => (
                <motion.div
                  key={item.title}
                  className="flex items-start gap-4"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + idx * 0.1 }}
                >
                  <div className="mt-1 w-6 h-6 flex items-center justify-center rounded-full bg-primary-800/50 border border-primary-500/30 text-primary-400 flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1 tracking-tight text-white">{item.title}</h3>
                    <p className="text-primary-200 text-sm font-light leading-relaxed">{item.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex gap-12 text-white border-t border-white/10 pt-8 mt-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8, type: "spring", stiffness: 80 }}
              className="relative group cursor-default"
            >
              <div className="text-4xl font-black tracking-tight mb-1 relative z-10 drop-shadow-lg transition-colors">
                10k+
              </div>
              <div className="text-primary-200 text-sm font-medium uppercase tracking-wider">Investidores</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8, type: "spring", stiffness: 80 }}
              className="relative group cursor-default"
            >
              <div className="text-4xl font-black tracking-tight mb-1 relative z-10 drop-shadow-lg transition-colors">
                50k+
              </div>
              <div className="text-primary-200 text-sm font-medium uppercase tracking-wider">Transações</div>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Side */}
        <motion.div
          className="w-full lg:w-[480px] xl:w-[560px] flex-shrink-0 flex items-center justify-center p-4 sm:p-8 lg:p-12 relative z-10"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <div className="w-full max-w-md">
            <div className="lg:hidden flex flex-col items-center text-center gap-3 mb-8 sm:mb-10 text-white">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl overflow-hidden p-3">
                <img src="/icons/logofincontrol.png" alt="FinControl" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="text-3xl sm:text-4xl font-black tracking-tighter block">FinControl</span>
                <p className="text-primary-100 text-sm mt-2 font-light">Ecossistema financeiro inteligente</p>
              </div>
            </div>

            <motion.div
              className="w-full bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-6 sm:p-10 relative overflow-hidden border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.span
                className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent pointer-events-none"
                animate={{ opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 6, repeat: Infinity }}
              />
              <div className="relative z-10">
                <div className="mb-10 text-center">
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 mb-2">
                    Abertura de Conta
                  </h2>
                  <p className="text-gray-500 font-medium text-sm">
                    Preencha os dados oficiais para iniciar
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  {/* Nome Completo */}
                  <div>
                    <label htmlFor="name" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                      Nome Completo
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        id="name"
                        type="text"
                        {...register('name')}
                        className={`w-full pl-12 pr-4 py-3.5 border rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all bg-gray-50/50 hover:bg-white text-gray-900 placeholder-gray-400 font-medium ${errors.name ? 'border-red-500' : 'border-gray-200'}`}
                        placeholder="João Silva"
                        disabled={isLoading}
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1 font-semibold">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                      E-mail Corporativo / Pessoal
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        id="email"
                        type="email"
                        {...register('email')}
                        className={`w-full pl-12 pr-4 py-3.5 border rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all bg-gray-50/50 hover:bg-white text-gray-900 placeholder-gray-400 font-medium ${errors.email ? 'border-red-500' : 'border-gray-200'}`}
                        placeholder="nome@exemplo.com"
                        disabled={isLoading}
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1 font-semibold">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Senha */}
                  <div>
                    <label htmlFor="password" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                      Senha de Acesso
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        {...register('password')}
                        className={`w-full pl-12 pr-12 py-3.5 border rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all bg-gray-50/50 hover:bg-white text-gray-900 placeholder-gray-400 font-medium ${errors.password ? 'border-red-500' : 'border-gray-200'}`}
                        placeholder="••••••••"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-900 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>

                    {password && (
                      <div className="mt-3">
                        <div className="flex items-center gap-2.5 mb-1.5">
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-300 ${getStrengthLabel().color}`}
                              style={{ width: `${(passwordStrength / 6) * 100}%` }}
                            />
                          </div>
                          <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500">
                            Força: {getStrengthLabel().label}
                          </span>
                        </div>
                      </div>
                    )}

                    {errors.password && (
                      <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1 font-semibold">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  {/* Confirmar Senha */}
                  <div>
                    <label htmlFor="confirmPassword" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                      Confirme a Senha
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        {...register('confirmPassword')}
                        className={`w-full pl-12 pr-12 py-3.5 border rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all bg-gray-50/50 hover:bg-white text-gray-900 placeholder-gray-400 font-medium ${errors.confirmPassword ? 'border-red-500' : 'border-gray-200'}`}
                        placeholder="••••••••"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-900 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1 font-semibold">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  {/* Termos de Serviço */}
                  <div className="pt-2">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        {...register('acceptTerms')}
                        className={`w-4 h-4 mt-0.5 text-primary-600 border-gray-300 rounded focus:ring-primary-500/20 cursor-pointer ${errors.acceptTerms ? 'border-red-500' : ''}`}
                        disabled={isLoading}
                      />
                      <span className="text-xs font-medium text-gray-500 leading-relaxed">
                        Declaro que li e concordo com os{' '}
                        <Link to="/terms" target="_blank" className="text-primary-600 hover:text-primary-800 font-bold transition-colors">
                          Termos de Serviço
                        </Link>{' '}
                        e a{' '}
                        <Link to="/privacy" target="_blank" className="text-primary-600 hover:text-primary-800 font-bold transition-colors">
                          Política de Privacidade
                        </Link>
                      </span>
                    </label>
                    {errors.acceptTerms && (
                      <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1 font-semibold">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.acceptTerms.message}
                      </p>
                    )}
                  </div>

                  {/* Botão de Cadastro */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold tracking-wide py-4 px-4 rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl hover:shadow-primary-600/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2 mt-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                        PROCESSANDO...
                      </>
                    ) : (
                      'FINALIZAR ABERTURA'
                    )}
                  </button>
                </form>

                <div className="mt-8 text-center space-y-4">
                  <p className="text-sm font-medium text-gray-500">
                    Já é um membro?{' '}
                    <Link
                      to="/login"
                      className="text-primary-600 hover:text-primary-800 font-bold transition-colors"
                    >
                      Acessar Plataforma
                    </Link>
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-6 flex flex-col items-center gap-2 text-primary-200/60 font-medium text-[10px] uppercase tracking-widest"
            >
              <span className="flex items-center gap-1.5"><Lock className="w-3 h-3" /> Ambiente Seguro Institucional</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </AnimatedPage>
  )
}

export default Register
