import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, ArrowLeft, RefreshCw } from 'lucide-react';
import authService from '@/services/auth.service';
import { toast } from 'react-hot-toast';
import PageTransition from '@/components/common/PageTransition';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get('email') || '';
  
  const [step, setStep] = useState(1); // 1: Código, 2: Nova Senha
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (!email) {
      toast.error('Email não fornecido');
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  useEffect(() => {
    if (step === 1) {
      document.getElementById('code-0')?.focus();
    }
  }, [step]);

  const handleCodeChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      document.getElementById(`code-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      document.getElementById(`code-${index - 1}`)?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newCode = pastedData.split('').concat(Array(6).fill('')).slice(0, 6);
    setCode(newCode);
    
    const lastFilledIndex = pastedData.length - 1;
    if (lastFilledIndex >= 0 && lastFilledIndex < 6) {
      document.getElementById(`code-${lastFilledIndex}`)?.focus();
    }
  };

  const handleNextStep = async (e: React.FormEvent) => {
    e.preventDefault();

    const verificationCode = code.join('');
    
    if (verificationCode.length !== 6) {
      toast.error('Digite o código completo de 6 dígitos');
      return;
    }

    setIsLoading(true);

    try {
      await authService.verifyResetCode(email, verificationCode);
      toast.success('Código validado com sucesso!');
      setStep(2);
    } catch (error: any) {
      console.error('Erro ao validar código:', error);
      toast.error(error.response?.data?.message || 'Código inválido ou expirado');
      setCode(['', '', '', '', '', '']);
      document.getElementById('code-0')?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    setIsLoading(true);

    try {
      await authService.resetPassword(email, code.join(''), newPassword);
      toast.success('Senha redefinida com sucesso!');
      
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error: any) {
      console.error('Erro ao redefinir senha:', error);
      toast.error(error.response?.data?.message || 'Erro ao redefinir senha');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);

    try {
      await authService.forgotPassword(email);
      toast.success('Código reenviado! Verifique seu email.');
      setCode(['', '', '', '', '', '']);
      document.getElementById('code-0')?.focus();
    } catch (error: any) {
      console.error('Erro ao reenviar código:', error);
      toast.success('Se o email existir, você receberá um novo código');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <PageTransition className="min-h-screen bg-gray-50 dark:bg-neutral-900 flex flex-col items-center justify-center sm:p-6">
      <div className="w-full sm:max-w-[440px]">
        {/* Main Content Area */}
        <div className="bg-white dark:bg-neutral-800 sm:rounded-3xl shadow-sm border-x-0 sm:border border-gray-100 dark:border-neutral-700 p-6 sm:p-10 min-h-screen sm:min-h-0 flex flex-col justify-center">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-10">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary-50 dark:bg-primary-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Lock className="w-7 h-7 sm:w-8 sm:h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-2">
              Redefinir Senha
            </h1>
            <p className="text-gray-500 dark:text-neutral-400 text-sm">
              Digite o código enviado para
            </p>
            <p className="text-primary-600 dark:text-primary-400 font-bold mt-1">
              {email}
            </p>
          </div>

          {/* Form */}
          {step === 1 ? (
            <form onSubmit={handleNextStep} className="space-y-6">
              {/* Code Inputs */}
              <div>
                <label className="block text-xs font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-widest mb-3 ml-1">
                  Código de Verificação
                </label>
                <div className="flex gap-2 justify-center" onPaste={handlePaste}>
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
                      className="w-10 h-14 text-center text-xl font-black border-2 border-gray-100 dark:border-neutral-700 rounded-full focus:border-primary-500 dark:focus:border-primary-400 focus:ring-4 focus:ring-primary-500/10 bg-gray-50/50 dark:bg-neutral-900 text-gray-900 dark:text-white transition-all outline-none"
                    />
                  ))}
                </div>
                <p className="text-[10px] text-gray-400 dark:text-neutral-500 text-center mt-3">
                  O código expira em 15 minutos
                </p>
              </div>

              {/* Next Step Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-full font-bold text-lg shadow-lg shadow-primary-600/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Validando...
                  </span>
                ) : (
                  'Validar Código'
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* New Password */}
              <div>
                <label htmlFor="newPassword" className="block text-xs font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-widest mb-3 ml-1">
                  Nova Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full bg-gray-50 dark:bg-neutral-900 border-2 border-gray-100 dark:border-neutral-700 rounded-full py-4 pl-12 pr-12 text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-primary-500 dark:focus:border-primary-400 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none"
                    required
                    minLength={6}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-primary-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-xs font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-widest mb-3 ml-1">
                  Confirmar Nova Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita a nova senha"
                    className="w-full bg-gray-50 dark:bg-neutral-900 border-2 border-gray-100 dark:border-neutral-700 rounded-full py-4 pl-12 pr-12 text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-primary-500 dark:focus:border-primary-400 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-primary-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-full font-bold text-lg shadow-lg shadow-primary-600/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Redefinindo...
                  </span>
                ) : (
                  'Redefinir Senha'
                )}
              </button>
            </form>
          )}

          {/* Resend Code */}
          <div className="mt-8 text-center pb-6 border-b border-gray-50 dark:border-neutral-700 mb-6">
            <p className="text-sm text-gray-500 dark:text-neutral-400 mb-2 font-medium">
              Não recebeu o código?
            </p>
            <button
              onClick={handleResendCode}
              disabled={isResending}
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-bold text-sm disabled:opacity-50 transition-colors"
            >
              {isResending ? 'Reenviando...' : 'Reenviar novo código'}
            </button>
          </div>

          {/* Back to Login */}
          <button
            onClick={() => navigate('/login')}
            className="w-full flex items-center justify-center gap-2 text-gray-400 dark:text-neutral-500 hover:text-gray-600 dark:hover:text-neutral-300 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para o login
          </button>
        </div>
      </div>
    </PageTransition>
  );
};

export default ResetPassword;
