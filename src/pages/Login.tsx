import { useState, useEffect, FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Mail, ArrowRight, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import PasswordStrengthInput from '@/components/ui/PasswordStrengthInput'
import AuthVisualSide from '@/components/auth/AuthVisualSide'
import { usePreloaderStore } from '@/store/preloaderStore'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)

  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const refreshUserData = useAuthStore((s) => s.refreshUserData)
  const loginWithGoogle = useAuthStore((s) => s.loginWithGoogle)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const openPreloader = usePreloaderStore((s) => s.openPreloader)
  const setPreloaderSuccess = usePreloaderStore((s) => s.setSuccess)
  const closePreloader = usePreloaderStore((s) => s.closePreloader)
  const isPreloaderOpen = usePreloaderStore((s) => s.isOpen)

  useEffect(() => {
    // Apenas redireciona se o usuário já chegou autenticado, sem interceptar o pré-loader ativo
    if (isAuthenticated && !isPreloaderOpen && !isLoading) {
      navigate('/app/transactions', { replace: true })
    }
  }, [isAuthenticated, isPreloaderOpen, isLoading, navigate])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast.error('Preencha todos os campos')
      return
    }

    setIsLoading(true)
    openPreloader()

    try {
      const success = await login(email, password)
      if (success) {
        setPreloaderSuccess()
        await refreshUserData()
        
        // 1. Navega para a página de destino por baixo da cortina opaca
        navigate('/app/transactions', { replace: true })

        // 2. Tempo breve para o Dashboard montar por baixo da cortina
        await new Promise((resolve) => setTimeout(resolve, 260))

        // 3. Desliza a cortina lateral revelando a página real do site
        closePreloader()

        toast.success('Login realizado com sucesso!')
      } else {
        closePreloader()
        toast.error('Email ou senha incorretos')
      }
    } catch (error: any) {
      closePreloader()
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
        toast.error(error.response?.data?.message || 'Erro ao fazer login. Tente novamente.')
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
    <>

      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white transition-colors duration-200">
        {/* Coluna Esquerda: Formulário de Autenticação */}
        <div className="col-span-1 lg:col-span-6 xl:col-span-5 flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 max-w-xl mx-auto w-full min-h-screen">
          {/* Topo: Logo FinControl */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-2.5 group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/70 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950"
            >
              <div className="w-9 h-9 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-1 flex items-center justify-center flex-shrink-0 transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-105 group-active:scale-95">
                <img src="/icons/logofincontrol.png" alt="FinControl" className="w-full h-full object-contain" />
              </div>
              <span className="font-display font-black text-2xl tracking-[-0.02em] text-neutral-900 dark:text-white">
                FinControl
              </span>
            </Link>
          </div>

          {/* Centro: Formulário de Login */}
          <div className="my-8">
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-extrabold font-display tracking-[-0.02em] leading-[1.1] text-balance text-neutral-900 dark:text-white mb-2">
                Login
              </h1>
              <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400 max-w-[65ch] text-pretty">
                Acesse sua conta para continuar no controle das suas finanças.
              </p>
            </div>

            {/* Botão Google em Destaque */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading || isLoading}
              className="w-full flex items-center justify-center gap-3 py-3.5 px-6 border border-neutral-200 dark:border-neutral-800 rounded-full hover:bg-neutral-50 dark:hover:bg-neutral-900 active:scale-[0.98] transition-[transform,background-color,border-color,box-shadow] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] font-semibold text-sm text-neutral-800 dark:text-neutral-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/70 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950"
            >
              {isGoogleLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-neutral-500 flex-shrink-0" />
              ) : (
                <img src="/icons/icons8-google-logo-240.png" alt="Google" className="w-5 h-5 object-contain flex-shrink-0" />
              )}
              <span>{isGoogleLoading ? 'Conectando...' : 'Entrar com Google'}</span>
            </button>

            {/* Divisor Elegante */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200 dark:border-neutral-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-neutral-950 px-4 text-neutral-400 font-mono tracking-wider">
                  ou entre com e-mail
                </span>
              </div>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Campo E-mail */}
              <div className="relative rounded-2xl border-2 border-neutral-200 dark:border-neutral-800 focus-within:border-primary-500 dark:focus-within:border-primary-400 focus-within:ring-4 focus-within:ring-primary-500/10 transition-[border-color,box-shadow] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)]">
                <label
                  htmlFor="email"
                  className="absolute -top-3 left-4 px-2 bg-white dark:bg-neutral-950 text-xs font-bold text-neutral-500 dark:text-neutral-400 tracking-wide select-none z-10"
                >
                  E-mail
                </label>
                <div className="relative flex items-center">
                  <input
                    id="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full bg-transparent px-5 py-3.5 pr-12 text-sm font-medium text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none rounded-2xl"
                    disabled={isLoading}
                    required
                  />
                  <Mail className="absolute right-4 w-5 h-5 text-neutral-400 pointer-events-none" />
                </div>
              </div>

              {/* Campo Senha */}
              <div className="pt-1">
                <PasswordStrengthInput
                  id="password"
                  label="Senha"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isLoading}
                  showStrengthMeter={false}
                  bgClass="bg-white dark:bg-neutral-950"
                  required
                />
              </div>

              {/* Lembrar de mim & Esqueci senha */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer select-none group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500 border-neutral-300 dark:border-neutral-700 bg-transparent cursor-pointer"
                  />
                  <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors duration-150">
                    Lembrar de mim
                  </span>
                </label>

                <Link
                  to="/forgot-password"
                  className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/70"
                >
                  Esqueceu a senha?
                </Link>
              </div>

              {/* Botão Entrar */}
              <button
                type="submit"
                disabled={isLoading || isGoogleLoading}
                className="w-full h-14 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-900 active:scale-[0.98] font-bold text-base transition-[transform,background-color,box-shadow] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-lg shadow-neutral-900/10 dark:shadow-none flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/70 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
                    <span>Entrando...</span>
                  </>
                ) : (
                  <>
                    <span>Entrar</span>
                    <ArrowRight className="w-4 h-4 flex-shrink-0" />
                  </>
                )}
              </button>
            </form>

            {/* Link para Cadastro */}
            <div className="mt-8 text-center">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Não tem uma conta?{' '}
                <Link
                  to="/register"
                  className="font-bold text-primary-600 dark:text-primary-400 hover:underline rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/70"
                >
                  Criar conta gratuita
                </Link>
              </p>
            </div>
          </div>

          {/* Rodapé da Coluna */}
          <div className="text-xs font-mono tabular-figures text-neutral-400 dark:text-neutral-600 text-center sm:text-left pt-6">
            © {new Date().getFullYear()} FinControl. Todos os direitos reservados.
          </div>
        </div>

        {/* Coluna Direita: Painel Visual Desktop */}
        <AuthVisualSide
          title="Transforme suas finanças em realidade."
          subtitle="Controle, precisão e tranquilidade em todas as suas plataformas."
        />
      </div>
    </>
  )
}

export default Login

