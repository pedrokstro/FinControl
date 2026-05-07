import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Mail, ArrowLeft, RefreshCw } from 'lucide-react';
import authService from '@/services/auth.service';
import { toast } from 'react-hot-toast';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const email = location.state?.email || searchParams.get('email') || '';
  
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    document.getElementById('code-0')?.focus();
  }, []);

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

  const handleVerify = async () => {
    const verificationCode = code.join('');
    
    if (verificationCode.length !== 6) {
      toast.error('Digite o código completo de 6 dígitos');
      return;
    }

    setIsLoading(true);

    try {
      await authService.verifyEmail(email, verificationCode);
      toast.success('Email verificado com sucesso!');
      
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error: any) {
      console.error('Erro ao verificar email:', error);
      toast.error(error.response?.data?.message || 'Código inválido ou expirado');
      setCode(['', '', '', '', '', '']);
      document.getElementById('code-0')?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);

    try {
      await authService.resendVerificationCode(email);
      toast.success('Código reenviado! Verifique seu email.');
      setCode(['', '', '', '', '', '']);
      document.getElementById('code-0')?.focus();
    } catch (error: any) {
      console.error('Erro ao reenviar código:', error);
      toast.error(error.response?.data?.message || 'Erro ao reenviar código');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-[440px]">
        {/* Card */}
        <div className="bg-white dark:bg-neutral-800 rounded-3xl shadow-sm border border-gray-100 dark:border-neutral-700 p-6 sm:p-10">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-10">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary-50 dark:bg-primary-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Mail className="w-7 h-7 sm:w-8 sm:h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight mb-2">
              Verifique seu Email
            </h1>
            
            {location.state?.email && (
              <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-800/30 rounded-xl">
                <p className="text-xs font-bold text-yellow-700 dark:text-yellow-400 uppercase tracking-wider">
                  Ação Necessária
                </p>
                <p className="text-sm text-yellow-800 dark:text-yellow-300 mt-1">
                  Verifique seu email para ativar sua conta.
                </p>
              </div>
            )}
            
            <p className="text-gray-500 dark:text-neutral-400 text-sm">
              Enviamos um código de 6 dígitos para
            </p>
            <p className="text-primary-600 dark:text-primary-400 font-bold mt-1">
              {email}
            </p>
          </div>

          {/* Code Inputs */}
          <div className="mb-8">
            <div className="flex gap-1.5 sm:gap-2 justify-center" onPaste={handlePaste}>
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
                  className="w-10 h-14 sm:w-12 sm:h-16 text-center text-xl sm:text-2xl font-black border-2 border-gray-100 dark:border-neutral-700 rounded-xl focus:border-primary-500 dark:focus:border-primary-400 focus:ring-4 focus:ring-primary-500/10 bg-gray-50/50 dark:bg-neutral-900 text-gray-900 dark:text-white transition-all outline-none"
                />
              ))}
            </div>
            <p className="text-xs text-gray-400 dark:text-neutral-500 text-center mt-4">
              O código expira em 15 minutos
            </p>
          </div>

          {/* Verify Button */}
          <button
            onClick={handleVerify}
            disabled={isLoading || code.join('').length !== 6}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary-600/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <RefreshCw className="w-5 h-5 animate-spin" />
                Verificando...
              </span>
            ) : (
              'Verificar Email'
            )}
          </button>

          {/* Resend Code */}
          <div className="text-center pb-6 border-b border-gray-50 dark:border-neutral-700 mb-6">
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

        {/* Footer Info */}
        <p className="mt-8 text-center text-sm text-gray-400 dark:text-neutral-500">
          💡 Você pode colar o código completo de 6 dígitos.
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;
