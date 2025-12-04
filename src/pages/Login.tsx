import { useState, FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Lock, Mail, Eye, EyeOff, Wallet } from 'lucide-react'
import toast from 'react-hot-toast'
import AnimatedPage from '@/components/common/AnimatedPage'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { login, refreshUserData } = useAuthStore()

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
        navigate('/dashboard')
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

  return (
    <AnimatedPage direction="left">
      <div className="min-h-screen flex bg-gradient-to-br from-primary-500 to-primary-700">
      {/* Left Side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 p-12 flex-col justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-lg">
            <Wallet className="w-7 h-7 text-primary-600" />
          </div>
          <span className="text-3xl font-bold text-white">FinControl</span>
        </div>
        
        <div className="text-white">
          <h1 className="text-4xl font-bold mb-4">
            Gerencie suas financas com inteligencia
          </h1>
          <p className="text-primary-100 text-lg">
            Controle completo de receitas, despesas e investimentos em um unico lugar.
          </p>
        </div>

        <div className="flex gap-8 text-white">
          <div>
            <div className="text-3xl font-bold mb-1">10k+</div>
            <div className="text-primary-100">Usuarios ativos</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-1">50k+</div>
            <div className="text-primary-100">Transacoes registradas</div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo for mobile */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-lg">
              <Wallet className="w-7 h-7 text-primary-600" />
            </div>
            <span className="text-3xl font-bold text-white">FinControl</span>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Bem-vindo de volta!
              </h2>
              <p className="text-gray-600">
                Entre com suas credenciais para continuar
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
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

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    Lembrar-me
                  </span>
                </label>
                <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                  Esqueceu a senha?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>

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
        </div>
      </div>
    </div>
    </AnimatedPage>
  )
}

export default Login
