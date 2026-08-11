import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { Lock, ArrowLeft, RefreshCw, ArrowRight, KeyRound } from 'lucide-react'
import authService from '@/services/auth.service'
import { toast } from 'react-hot-toast'
import PasswordStrengthInput from '@/components/ui/PasswordStrengthInput'
import AuthVisualSide from '@/components/auth/AuthVisualSide'

const ResetPassword = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const email = searchParams.get('email') || ''

  const [step, setStep] = useState(1) // 1: Código, 2: Nova Senha
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)

  useEffect(() => {
    if (!email) {
      toast.error('Email não fornecido')
      navigate('/forgot-password')
    }
  }, [email, navigate])

  useEffect(() => {
    if (step === 1) {
      document.getElementById('code-0')?.focus()
    }
  }, [step])

  const handleCodeChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    if (value && index < 5) {
      document.getElementById(`code-${index + 1}`)?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      document.getElementById(`code-${index - 1}`)?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const newCode = pastedData.split('').concat(Array(6).fill('')).slice(0, 6)
    setCode(newCode)

    const lastFilledIndex = pastedData.length - 1
    if (lastFilledIndex >= 0 && lastFilledIndex < 6) {
      document.getElementById(`code-${lastFilledIndex}`)?.focus()
    }
  }

  const handleNextStep = async (e: React.FormEvent) => {
    e.preventDefault()
    const verificationCode = code.join('')

    if (verificationCode.length !== 6) {
      toast.error('Digite o código completo de 6 dígitos')
      return
    }

    setIsLoading(true)
    try {
      await authService.verifyResetCode(email, verificationCode)
      toast.success('Código validado com sucesso!')
      setStep(2)
    } catch (error: any) {
      console.error('Erro ao validar código:', error)
      toast.error(error.response?.data?.message || 'Código inválido ou expirado')
      setCode(['', '', '', '', '', ''])
      document.getElementById('code-0')?.focus()
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword.length < 6) {
      toast.error('A senha deve ter no mínimo 6 caracteres')
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error('As senhas não coincidem')
      return
    }

    setIsLoading(true)
    try {
      await authService.resetPassword(email, code.join(''), newPassword)
      toast.success('Senha redefinida com sucesso!')
      setTimeout(() => {
        navigate('/login')
      }, 1500)
    } catch (error: any) {
      console.error('Erro ao redefinir senha:', error)
      toast.error(error.response?.data?.message || 'Erro ao redefinir senha')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    setIsResending(true)
    try {
      await authService.forgotPassword(email)
      toast.success('Código reenviado! Verifique seu email.')
      setCode(['', '', '', '', '', ''])
      document.getElementById('code-0')?.focus()
    } catch (error: any) {
      console.error('Erro ao reenviar código:', error)
      toast.success('Se o email existir, você receberá um novo código')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white transition-colors duration-300">
      {/* Coluna Esquerda: Formulário de Redefinição */}
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

        {/* Centro: Passo 1 ou Passo 2 */}
        <div className="my-8">
          <div className="mb-8">
            <div className="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-950/60 border border-primary-100 dark:border-primary-900/40 flex items-center justify-center mb-6 text-primary-600 dark:text-primary-400">
              {step === 1 ? <KeyRound className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-neutral-900 dark:text-white mb-2">
              {step === 1 ? 'Código de Verificação' : 'Criar Nova Senha'}
            </h1>
            <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400 leading-relaxed">
              {step === 1 ? (
                <>
                  Digite o código de 6 dígitos enviado para{' '}
                  <span className="font-bold text-neutral-900 dark:text-white">{email}</span>.
                </>
              ) : (
                'Defina sua nova senha de acesso segura.'
              )}
            </p>
          </div>

          {step === 1 ? (
            /* Formulário Passo 1: Código de 6 dígitos */
            <form onSubmit={handleNextStep} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3">
                  Código de 6 dígitos
                </label>
                <div className="flex gap-2 sm:gap-3 justify-between" onPaste={handlePaste}>
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      id={`code-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-11 sm:w-12 h-14 text-center text-2xl font-black rounded-2xl border-2 border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white focus:border-primary-500 dark:focus:border-primary-400 outline-none transition-all"
                    />
                  ))}
                </div>
                <p className="text-xs text-neutral-400 dark:text-neutral-500 text-center mt-3">
                  O código expira em 15 minutos
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-900 font-bold text-base transition-all duration-200 shadow-lg shadow-neutral-900/10 dark:shadow-none flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Validando código...
                  </span>
                ) : (
                  <>
                    <span>Validar Código</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={isResending}
                  className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline disabled:opacity-50"
                >
                  {isResending ? 'Reenviando...' : 'Não recebeu? Reenviar código'}
                </button>
              </div>
            </form>
          ) : (
            /* Formulário Passo 2: Nova Senha */
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nova Senha com Medidor */}
              <div className="pt-2">
                <PasswordStrengthInput
                  id="newPassword"
                  label="Nova Senha"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  autoFocus
                  showStrengthMeter={true}
                  bgClass="bg-white dark:bg-neutral-950"
                />
              </div>

              {/* Confirmar Nova Senha */}
              <div className="pt-2">
                <PasswordStrengthInput
                  id="confirmPassword"
                  label="Confirmar Nova Senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  showStrengthMeter={false}
                  bgClass="bg-white dark:bg-neutral-950"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-900 font-bold text-base transition-all duration-200 shadow-lg shadow-neutral-900/10 dark:shadow-none flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Salvando senha...
                  </span>
                ) : (
                  <>
                    <span>Redefinir Senha</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

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
        title="Recupere o acesso à sua conta."
        subtitle="Mantenha o controle da sua saúde financeira com segurança e tranquilidade."
        badgeText="FinControl Recuperação"
      />
    </div>
  )
}

export default ResetPassword
