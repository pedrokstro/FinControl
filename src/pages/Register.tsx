import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '@/store/authStore'
import { Mail, User, CreditCard, ArrowRight, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { authService } from '@/services/api'
import PasswordStrengthInput from '@/components/ui/PasswordStrengthInput'
import AuthVisualSide from '@/components/auth/AuthVisualSide'

const registerSchema = z
  .object({
    name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres'),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
    confirmPassword: z.string(),
    cpf: z.string().min(11, 'CPF deve ter 11 dígitos'),
    acceptTerms: z.literal(true, {
      errorMap: () => ({ message: 'Você deve aceitar os termos de uso' }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

type RegisterFormData = z.infer<typeof registerSchema>

const Register = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const navigate = useNavigate()
  const { isAuthenticated, loginWithGoogle } = useAuthStore()

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

  const handleGoogleRegister = async () => {
    if (isGoogleLoading || isLoading) return
    setIsGoogleLoading(true)
    try {
      await loginWithGoogle()
    } catch (error: any) {
      console.error('Erro no registro com Google:', error)
      toast.error(error?.message || 'Não foi possível iniciar cadastro com Google.')
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white transition-colors duration-300">
      {/* Coluna Esquerda: Formulário de Cadastro */}
      <div className="col-span-1 lg:col-span-6 xl:col-span-5 flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 max-w-xl mx-auto w-full min-h-screen overflow-y-auto">
        {/* Topo: Logo */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-1 flex items-center justify-center transition-transform group-hover:scale-105">
              <img src="/icons/logofincontrol.png" alt="FinControl" className="w-full h-full object-contain" />
            </div>
            <span className="font-display font-black text-2xl tracking-tight text-neutral-900 dark:text-white">
              FinControl
            </span>
          </Link>
        </div>

        {/* Centro: Formulário de Criação de Conta */}
        <div className="my-8">
          <div className="mb-6">
            <h1 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-neutral-900 dark:text-white mb-2">
              Criar Conta
            </h1>
            <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400">
              Comece agora a gerenciar suas finanças com simplicidade e precisão.
            </p>
          </div>

          {/* Botão Google em Destaque */}
          <button
            type="button"
            onClick={handleGoogleRegister}
            disabled={isGoogleLoading || isLoading}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-6 border border-neutral-200 dark:border-neutral-800 rounded-full hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-all font-semibold text-sm text-neutral-800 dark:text-neutral-200 shadow-sm disabled:opacity-50"
          >
            <img src="/icons/icons8-google-logo-240.png" alt="Google" className="w-5 h-5 object-contain" />
            <span>{isGoogleLoading ? 'Conectando...' : 'Cadastrar com Google'}</span>
          </button>

          {/* Divisor */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200 dark:border-neutral-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-neutral-950 px-4 text-neutral-400 font-mono tracking-wider">
                ou preencha os dados
              </span>
            </div>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Campo Nome */}
            <div className="relative rounded-2xl border-2 border-neutral-200 dark:border-neutral-800 focus-within:border-primary-500 dark:focus-within:border-primary-400 transition-colors">
              <label
                htmlFor="name"
                className="absolute -top-3 left-4 px-2 bg-white dark:bg-neutral-950 text-xs font-bold text-neutral-500 dark:text-neutral-400 tracking-wide select-none"
              >
                Nome Completo
              </label>
              <div className="relative flex items-center">
                <input
                  id="name"
                  type="text"
                  {...register('name')}
                  placeholder="Seu nome completo"
                  className="w-full bg-transparent px-5 py-3.5 text-sm font-medium text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none"
                  disabled={isLoading}
                />
                <User className="absolute right-4 w-5 h-5 text-neutral-400 pointer-events-none" />
              </div>
            </div>
            {errors.name && (
              <p className="text-xs text-red-500 flex items-center gap-1 font-semibold">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.name.message}
              </p>
            )}

            {/* Campo E-mail */}
            <div className="relative rounded-2xl border-2 border-neutral-200 dark:border-neutral-800 focus-within:border-primary-500 dark:focus-within:border-primary-400 transition-colors">
              <label
                htmlFor="email"
                className="absolute -top-3 left-4 px-2 bg-white dark:bg-neutral-950 text-xs font-bold text-neutral-500 dark:text-neutral-400 tracking-wide select-none"
              >
                E-mail
              </label>
              <div className="relative flex items-center">
                <input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="seu@email.com"
                  className="w-full bg-transparent px-5 py-3.5 text-sm font-medium text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none"
                  disabled={isLoading}
                />
                <Mail className="absolute right-4 w-5 h-5 text-neutral-400 pointer-events-none" />
              </div>
            </div>
            {errors.email && (
              <p className="text-xs text-red-500 flex items-center gap-1 font-semibold">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.email.message}
              </p>
            )}

            {/* Campo CPF */}
            <div className="relative rounded-2xl border-2 border-neutral-200 dark:border-neutral-800 focus-within:border-primary-500 dark:focus-within:border-primary-400 transition-colors">
              <label
                htmlFor="cpf"
                className="absolute -top-3 left-4 px-2 bg-white dark:bg-neutral-950 text-xs font-bold text-neutral-500 dark:text-neutral-400 tracking-wide select-none"
              >
                CPF
              </label>
              <div className="relative flex items-center">
                <input
                  id="cpf"
                  type="text"
                  {...register('cpf')}
                  placeholder="000.000.000-00"
                  className="w-full bg-transparent px-5 py-3.5 text-sm font-medium text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none"
                  disabled={isLoading}
                />
                <CreditCard className="absolute right-4 w-5 h-5 text-neutral-400 pointer-events-none" />
              </div>
            </div>
            {errors.cpf && (
              <p className="text-xs text-red-500 flex items-center gap-1 font-semibold">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.cpf.message}
              </p>
            )}

            {/* Campo Senha com Medidor de Força e Critérios */}
            <div className="pt-2">
              <PasswordStrengthInput
                id="password"
                label="Senha"
                value={password}
                {...register('password')}
                error={errors.password?.message}
                disabled={isLoading}
                showStrengthMeter={true}
                bgClass="bg-white dark:bg-neutral-950"
              />
            </div>

            {/* Confirmar Senha */}
            <div className="pt-2">
              <PasswordStrengthInput
                id="confirmPassword"
                label="Confirmar Senha"
                {...register('confirmPassword')}
                error={errors.confirmPassword?.message}
                disabled={isLoading}
                showStrengthMeter={false}
                bgClass="bg-white dark:bg-neutral-950"
              />
            </div>

            {/* Termos de Uso */}
            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer group select-none">
                <input
                  type="checkbox"
                  {...register('acceptTerms')}
                  className="mt-1 w-4 h-4 rounded text-primary-600 focus:ring-primary-500 border-neutral-300 dark:border-neutral-700 bg-transparent"
                />
                <span className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Li e concordo com os{' '}
                  <Link to="/terms" target="_blank" className="font-bold text-primary-600 dark:text-primary-400 hover:underline">
                    Termos de Uso
                  </Link>{' '}
                  e a{' '}
                  <Link to="/privacy" target="_blank" className="font-bold text-primary-600 dark:text-primary-400 hover:underline">
                    Política de Privacidade
                  </Link>
                  .
                </span>
              </label>
              {errors.acceptTerms && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1 font-semibold">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.acceptTerms.message}
                </p>
              )}
            </div>

            {/* Botão de Envio */}
            <button
              type="submit"
              disabled={isLoading || isGoogleLoading}
              className="w-full h-14 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-900 font-bold text-base transition-all duration-200 shadow-lg shadow-neutral-900/10 dark:shadow-none flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                'Criando conta...'
              ) : (
                <>
                  <span>Criar Conta</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Link para Login */}
          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Já possui uma conta?{' '}
              <Link
                to="/login"
                className="font-bold text-primary-600 dark:text-primary-400 hover:underline"
              >
                Fazer login
              </Link>
            </p>
          </div>
        </div>

        {/* Rodapé */}
        <div className="text-xs font-mono text-neutral-400 dark:text-neutral-600 text-center sm:text-left pt-6">
          © {new Date().getFullYear()} FinControl. Todos os direitos reservados.
        </div>
      </div>

      {/* Coluna Direita: Painel Visual Desktop */}
      <AuthVisualSide
        title="Comece sua jornada financeira hoje."
        subtitle="Controle suas contas, automatize despesas e conquiste metas com facilidade."
        badgeText="FinControl Onboarding"
      />
    </div>
  )
}

export default Register
