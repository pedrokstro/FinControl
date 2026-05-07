import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound, ArrowLeft, Mail } from 'lucide-react';
import authService from '@/services/auth.service';
import { toast } from 'react-hot-toast';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Informe o e-mail');
      return;
    }
    setIsLoading(true);
    try {
      await authService.forgotPassword(email);
      toast.success('Protocolo de segurança enviado ao seu e-mail.');
      navigate(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (error: any) {
      toast.success('Se o e-mail constar na base, você receberá instruções em instantes.');
      setTimeout(() => {
        navigate(`/reset-password?email=${encodeURIComponent(email)}`);
      }, 2000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-neutral-900 p-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white dark:bg-neutral-800 rounded-2xl shadow-sm mb-4 p-3 sm:p-4">
            <img src="/icons/logofincontrol.png" alt="FinControl" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900 dark:text-white">FinControl</h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-neutral-400 mt-2 font-medium">Recuperação de Acesso</p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-neutral-800 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-neutral-700 p-6 sm:p-10">
          <div className="mb-6 sm:mb-8 text-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary-50 dark:bg-primary-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 border border-primary-100 dark:border-primary-900/30">
              <KeyRound className="w-6 h-6 sm:w-7 sm:h-7 text-primary-600 drop-shadow-sm" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">Esqueceu a senha?</h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-neutral-400">Insira seu e-mail para receber as instruções.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-gray-700 dark:text-neutral-300 uppercase tracking-wider mb-2">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-2xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400 font-medium"
                  placeholder="seu@email.com"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg hover:shadow-primary-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? 'ENVIANDO...' : 'SOLICITAR REDEFINIÇÃO'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-100 dark:border-neutral-700">
            <button
              onClick={() => navigate('/login')}
              className="w-full flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
