import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '@/store/authStore'
import { Lock, Mail, Eye, EyeOff, User, AlertCircle, CreditCard } from 'lucide-react'
import toast from 'react-hot-toast'
import { authService } from '@/services/api'
import { motion } from 'framer-motion'
import logoPng from '@/assets/icons/logofincontrol.png'

const registerSchema = z.object({
  name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
  confirmPassword: z.string(),
  cpf: z.string().min(11, 'CPF deve ter 11 dígitos'),
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: 'Você deve aceitar os termos' }),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
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
      await authService.register({
        name: data.name,
        email: data.email,
        password: data.password,
        cpf: data.cpf,
      })
      toast.success('Conta criada! Verifique seu email para ativar sua conta.')
      setTimeout(() => {
        navigate(`/verify-email?email=${encodeURIComponent(data.email)}`)
      }, 1500)
    } catch (error: any) {
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-neutral-900 sm:p-4"
    >
      <div className="w-full sm:max-w-md py-0 sm:py-8">
        {/* Main Content Area */}
        <div className="bg-white dark:bg-neutral-800 sm:rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none border-x-0 sm:border border-gray-100 dark:border-neutral-700 p-6 sm:p-10 min-h-screen sm:min-h-0 flex flex-col justify-center">
          {/* Logo Section */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 dark:bg-neutral-900 sm:bg-white sm:dark:bg-neutral-800 rounded-2xl shadow-sm mb-4 p-3 sm:p-4">
              <img src={logoPng} alt="FinControl" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900 dark:text-white">FinControl</h1>
            <p className="text-sm sm:text-base text-gray-500 dark:text-neutral-400 mt-2 font-medium">Crie sua conta agora</p>
          </div>

          <div className="mb-6 sm:mb-8 text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">Abertura de Conta</h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-neutral-400">Preencha os dados abaixo para iniciar</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Nome Completo */}
            <div>
              <label htmlFor="name" className="block text-xs font-bold text-gray-700 dark:text-neutral-300 uppercase tracking-wider mb-2">
                Nome Completo
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="name"
                  type="text"
                  {...register('name')}
                  className={`w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-neutral-900 border rounded-full focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400 font-medium ${errors.name ? 'border-red-500' : 'border-gray-200 dark:border-neutral-700'}`}
                  placeholder="Seu nome"
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

            {/* CPF */}
            <div>
              <label htmlFor="cpf" className="block text-xs font-bold text-gray-700 dark:text-neutral-300 uppercase tracking-wider mb-2">
                CPF
              </label>
              <div className="relative">
                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="cpf"
                  type="text"
                  {...register('cpf')}
                  className={`w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-neutral-900 border rounded-full focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400 font-medium ${errors.cpf ? 'border-red-500' : 'border-gray-200 dark:border-neutral-700'}`}
                  placeholder="000.000.000-00"
                  disabled={isLoading}
                  onChange={(e) => {
                    let val = e.target.value.replace(/\D/g, '');
                    if (val.length > 11) val = val.substring(0, 11);
                    if (val.length > 9) {
                      val = val.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
                    } else if (val.length > 6) {
                      val = val.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
                    } else if (val.length > 3) {
                      val = val.replace(/(\d{3})(\d{1,3})/, '$1.$2');
                    }
                    e.target.value = val;
                    register('cpf').onChange(e);
                  }}
                />
              </div>
              {errors.cpf && (
                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1 font-semibold">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.cpf.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-gray-700 dark:text-neutral-300 uppercase tracking-wider mb-2">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  {...register('email')}
                  className={`w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-neutral-900 border rounded-full focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400 font-medium ${errors.email ? 'border-red-500' : 'border-gray-200 dark:border-neutral-700'}`}
                  placeholder="seu@email.com"
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
              <label htmlFor="password" className="block text-xs font-bold text-gray-700 dark:text-neutral-300 uppercase tracking-wider mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className={`w-full pl-12 pr-12 py-3.5 bg-gray-50 dark:bg-neutral-900 border rounded-full focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400 font-medium ${errors.password ? 'border-red-500' : 'border-gray-200 dark:border-neutral-700'}`}
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {password && (
                <div className="mt-3">
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <div className="flex-1 h-1.5 bg-gray-100 dark:bg-neutral-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${getStrengthLabel().color}`}
                        style={{ width: `${(passwordStrength / 6) * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500">
                      {getStrengthLabel().label}
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
              <label htmlFor="confirmPassword" className="block text-xs font-bold text-gray-700 dark:text-neutral-300 uppercase tracking-wider mb-2">
                Confirmar Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('confirmPassword')}
                  className={`w-full pl-12 pr-12 py-3.5 bg-gray-50 dark:bg-neutral-900 border rounded-full focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400 font-medium ${errors.confirmPassword ? 'border-red-500' : 'border-gray-200 dark:border-neutral-700'}`}
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 transition-colors"
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

            {/* Termos */}
            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  {...register('acceptTerms')}
                  className={`w-4 h-4 mt-0.5 text-primary-600 border-gray-300 rounded focus:ring-primary-500/20 cursor-pointer ${errors.acceptTerms ? 'border-red-500' : ''}`}
                  disabled={isLoading}
                />
                <span className="text-xs font-medium text-gray-500 dark:text-neutral-400 leading-relaxed">
                  Concordo com os{' '}
                  <Link to="/terms" className="text-primary-600 hover:text-primary-800 font-bold transition-colors">
                    Termos
                  </Link>{' '}
                  e{' '}
                  <Link to="/privacy" className="text-primary-600 hover:text-primary-800 font-bold transition-colors">
                    Privacidade
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-full transition-all shadow-lg hover:shadow-primary-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? 'PROCESSANDO...' : 'CRIAR CONTA'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 dark:text-neutral-400">
              Já tem uma conta?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-800 font-bold">
                Entrar agora
              </Link>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}


export default Register
