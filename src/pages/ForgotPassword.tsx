import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, ArrowLeft, ArrowRight, KeyRound } from 'lucide-react'
import authService from '@/services/auth.service'
import { toast } from 'react-hot-toast'
import AuthVisualSide from '@/components/auth/AuthVisualSide'

const ForgotPassword = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      toast.error('Informe o e-mail cadastrado')
      return
    }
    setIsLoading(true)
    try {
      await authService.forgotPassword(email)
      toast.success('Código de segurança enviado para seu e-mail.')
      navigate(`/reset-password?email=${encodeURIComponent(email)}`)
    } catch (error: any) {
      toast.success('Se o e-mail constar na base, você receberá o código em instantes.')
      setTimeout(() => {
        navigate(`/reset-password?email=${encodeURIComponent(email)}`)
      }, 1500)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white transition-colors duration-300">
      {/* Coluna Esquerda: Formulário */}
      <div className="col-span-1 lg:col-span-6 xl:col-span-5 flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 max-w-xl mx-auto w-full min-h-screen">
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

        {/* Centro: Formulário */}
        <div className="my-8">
          <div className="mb-8">
            <div className="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-950/60 border border-primary-100 dark:border-primary-900/40 flex items-center justify-center mb-6 text-primary-600 dark:text-primary-400">
              <KeyRound className="w-6 h-6" />
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-neutral-900 dark:text-white mb-2">
              Esqueceu a senha?
            </h1>
            <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Sem problemas. Digite seu e-mail cadastrado e enviaremos um código de verificação para redefinição.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo E-mail */}
            <div className="relative rounded-2xl border-2 border-neutral-200 dark:border-neutral-800 focus-within:border-primary-500 dark:focus-within:border-primary-400 transition-colors">
              <label
                htmlFor="email"
                className="absolute -top-3 left-4 px-2 bg-white dark:bg-neutral-950 text-xs font-bold text-neutral-500 dark:text-neutral-400 tracking-wide select-none"
              >
                E-mail Cadastrado
              </label>
              <div className="relative flex items-center">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full bg-transparent px-5 py-3.5 text-sm font-medium text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none"
                  disabled={isLoading}
                  required
                />
                <Mail className="absolute right-4 w-5 h-5 text-neutral-400 pointer-events-none" />
              </div>
            </div>

            {/* Botão Enviar Código */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-900 font-bold text-base transition-all duration-200 shadow-lg shadow-neutral-900/10 dark:shadow-none flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                'Enviando código...'
              ) : (
                <>
                  <span>Enviar Código de Redefinição</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Voltar para Login */}
          <div className="mt-8 pt-8 border-t border-neutral-200 dark:border-neutral-800">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-bold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar para o login</span>
            </Link>
          </div>
        </div>

        {/* Rodapé */}
        <div className="text-xs font-mono text-neutral-400 dark:text-neutral-600 text-center sm:text-left pt-6">
          © {new Date().getFullYear()} FinControl. Todos os direitos reservados.
        </div>
      </div>

      {/* Coluna Direita: Painel Visual Desktop */}
      <AuthVisualSide
        title="Sua segurança em primeiro lugar."
        subtitle="Protocolos rigorosos de verificação para proteger sua conta e suas informações financeiras."
        badgeText="FinControl Proteção"
      />
    </div>
  )
}

export default ForgotPassword
