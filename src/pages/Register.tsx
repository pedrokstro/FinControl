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

  const floatingShapes = [
    { className: 'w-80 h-80 bg-primary-500/15 top-[-60px] right-[-30px]' },
    { className: 'w-64 h-64 bg-primary-300/15 bottom-[-40px] left-[-10px]' },
    { className: 'w-40 h-40 bg-white/10 top-1/3 right-12 hidden lg:block' },
  ]

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
      <div className="relative min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-primary-500 to-primary-700 overflow-hidden">
        {floatingShapes.map((shape, index) => (
          <motion.span
            key={index}
            className={`absolute rounded-full blur-3xl ${shape.className}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1, y: [0, -30, 0] }}
            transition={{ duration: 11 + index * 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}

        {/* Left Side */}
        <motion.div
          className="hidden lg:flex lg:w-1/2 p-12 flex-col justify-between relative z-10"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-lg overflow-hidden p-2">
              <img src="/icons/logofincontrol.png" alt="FinControl" className="w-full h-full object-contain" />
            </div>
            <span className="text-3xl font-bold text-white">FinControl</span>
          </div>

          <div className="text-white">
            <h1 className="text-4xl font-bold mb-4">
              Comece a controlar suas finanças hoje
            </h1>
            <p className="text-primary-100 text-lg mb-8">
              Junte-se a milhares de usuários que já transformaram sua vida financeira.
            </p>

            <div className="space-y-4">
              {[
                { title: '100% Gratuito', text: 'Sem taxas ocultas ou cobranças surpresa' },
                { title: 'Seguro e Privado', text: 'Seus dados são criptografados e protegidos' },
                { title: 'Fácil de Usar', text: 'Interface intuitiva e moderna' },
              ].map((item, idx) => (
                <motion.div
                  key={item.title}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + idx * 0.1 }}
                >
                  <CheckCircle2 className="w-6 h-6 text-success-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">{item.title}</h3>
                    <p className="text-primary-100 text-sm">{item.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex gap-8 text-white">
            {[
              { value: '10k+', label: 'Usuários ativos' },
              { value: '50k+', label: 'Transações registradas' },
              { value: '4.9★', label: 'Avaliação média' },
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + idx * 0.1 }}
              >
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-primary-100">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Side */}
        <motion.div
          className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 relative z-10"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <div className="w-full max-w-md">
            <div className="lg:hidden flex flex-col items-center text-center gap-3 mb-8 text-white">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-lg overflow-hidden p-2">
                <img src="/icons/logofincontrol.png" alt="FinControl" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="text-3xl font-bold block">FinControl</span>
                <p className="text-primary-50 text-sm mt-1">Crie sua conta e organize suas finanças em minutos</p>
              </div>
            </div>

            <motion.div
              className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl p-6 sm:p-8 relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.span
                className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-transparent dark:from-primary-400/10"
                animate={{ opacity: [0.15, 0.3, 0.15] }}
                transition={{ duration: 7, repeat: Infinity }}
              />
              <div className="relative z-10">
                <div className="mb-6 sm:mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Criar sua conta
                  </h2>
                  <p className="text-gray-600 dark:text-neutral-400">
                    Preencha os dados abaixo para começar
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  {/* Nome Completo */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                      Nome Completo
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        id="name"
                        type="text"
                        {...register('name')}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white dark:bg-neutral-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-neutral-500 ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-neutral-700'
                          }`}
                        placeholder="João Silva"
                        disabled={isLoading}
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        id="email"
                        type="email"
                        {...register('email')}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white dark:bg-neutral-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-neutral-500 ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-neutral-700'
                          }`}
                        placeholder="seu@email.com"
                        disabled={isLoading}
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Senha */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                      Senha
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        {...register('password')}
                        className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white dark:bg-neutral-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-neutral-500 ${errors.password ? 'border-red-500' : 'border-gray-300 dark:border-neutral-700'
                          }`}
                        placeholder="Mínimo 6 caracteres"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-neutral-300 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>

                    {password && (
                      <div className="mt-2">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex-1 h-2 bg-gray-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duração-300 ${getStrengthLabel().color}`}
                              style={{ width: `${(passwordStrength / 6) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-gray-600 dark:text-neutral-400">
                            {getStrengthLabel().label}
                          </span>
                        </div>
                      </div>
                    )}

                    {errors.password && (
                      <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  {/* Confirmar Senha */}
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                      Confirmar Senha
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        {...register('confirmPassword')}
                        className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white dark:bg-neutral-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-neutral-500 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-neutral-700'
                          }`}
                        placeholder="Digite a senha novamente"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-neutral-300 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  {/* Termos de Serviço */}
                  <div>
                    <label className="flex items-start gap-3 cursor-pointer flex-col sm:flex-row sm:items-start">
                      <input
                        type="checkbox"
                        {...register('acceptTerms')}
                        className={`w-5 h-5 mt-0.5 text-primary-600 border-gray-300 dark:border-neutral-600 rounded focus:ring-primary-500 cursor-pointer ${errors.acceptTerms ? 'border-red-500' : ''
                          }`}
                        disabled={isLoading}
                      />
                      <span className="text-sm text-gray-600 dark:text-neutral-400">
                        Eu concordo com os{' '}
                        <Link to="/terms" target="_blank" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium">
                          Termos de Serviço
                        </Link>{' '}
                        e{' '}
                        <Link to="/privacy" target="_blank" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium">
                          Política de Privacidade
                        </Link>
                      </span>
                    </label>
                    {errors.acceptTerms && (
                      <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.acceptTerms.message}
                      </p>
                    )}
                  </div>

                  {/* Botão de Cadastro */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Criando conta...
                      </>
                    ) : (
                      'Criar Conta'
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center space-y-3">
                  <p className="text-sm text-gray-600 dark:text-neutral-400">
                    Já tem uma conta?{' '}
                    <Link
                      to="/login"
                      className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
                    >
                      Fazer login
                    </Link>
                  </p>
                  <p className="text-sm text-gray-600 dark:text-neutral-400">
                    <Link
                      to="/about"
                      className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
                    >
                      Saiba mais sobre o FinControl
                    </Link>
                  </p>
                </div>
              </div>
            </motion.div>

            <div className="mt-6 text-center text-white/80 flex items-center justify-center gap-2">
              <Lock className="w-4 h-4" />
              Seus dados são criptografados e protegidos
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatedPage>
  )
}

export default Register
