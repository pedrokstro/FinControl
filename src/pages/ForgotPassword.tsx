import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound, ArrowLeft, Mail } from 'lucide-react';
import authService from '@/services/auth.service';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

const FallingMoney = () => {
  const [particles, setParticles] = useState<any[]>([])

  useEffect(() => {
    const symbols = ['R$', '$', '€', '£', '¥', '₿', '¢']
    const generated = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      x: Math.random() * 100, // vw
      delay: Math.random() * 15,
      duration: 15 + Math.random() * 25,
      size: 14 + Math.random() * 28, // px
      opacity: 0.15 + Math.random() * 0.45,
      rotateStart: Math.random() * 360,
      rotateEnd: Math.random() * 360 + 360,
    }))
    setParticles(generated)
  }, [])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 bg-primary-900">
      {/* Dynamic gradient overlay to make things look deep */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-800/80 via-primary-900/90 to-primary-900 z-10" />
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute text-emerald-400 font-serif font-black select-none z-20 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]"
          style={{ left: `${p.x}vw`, fontSize: p.size, opacity: p.opacity }}
          initial={{ y: '-10vh', x: 0, rotate: p.rotateStart }}
          animate={{
            y: '110vh',
            x: [0, Math.random() * 50 - 25, 0], // sway left/right
            rotate: p.rotateEnd
          }}
          transition={{
            y: { duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'linear' },
            x: { duration: p.duration * 0.5, delay: p.delay, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror' },
            rotate: { duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'linear' }
          }}
        >
          {p.symbol}
        </motion.div>
      ))}
    </div>
  )
}

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error('Informe o e-mail corporativo / pessoal');
      return;
    }

    setIsLoading(true);

    try {
      await authService.forgotPassword(email);
      toast.success('Protocolo de segurança enviado ao seu e-mail.');

      // Redirecionar para página de reset com email
      navigate(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (error: any) {
      console.error('Erro ao solicitar recuperação:', error);
      // Não revelar se o email existe ou não (segurança)
      toast.success('Se o e-mail constar na base, você receberá instruções em instantes.');
      setTimeout(() => {
        navigate(`/reset-password?email=${encodeURIComponent(email)}`);
      }, 2000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-primary-900 overflow-hidden p-4 sm:p-6 lg:p-12">
      {/* Dynamic Background */}
      <FallingMoney />

      <div className="w-full max-w-lg relative z-10 flex flex-col items-center">
        {/* Isolated Logo Symbol on Top */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-2xl overflow-hidden p-3 mb-8"
        >
          <img src="/icons/logofincontrol.png" alt="FinControl" className="w-full h-full object-contain" />
        </motion.div>

        <motion.div
          className="w-full bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-6 sm:p-12 relative overflow-hidden border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.span
            className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent pointer-events-none"
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 6, repeat: Infinity }}
          />

          <div className="relative z-10">
            <div className="mb-10 text-center">
              <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-primary-100 relative group">
                <motion.div
                  animate={{ opacity: [0.2, 0.6, 0.2] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 bg-primary-400 blur-xl rounded-full -z-10"
                />
                <KeyRound className="w-7 h-7 text-primary-600 drop-shadow-sm" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 mb-3">
                Recuperação de Acesso
              </h1>
              <p className="text-gray-500 font-medium text-sm">
                Insira o e-mail associado à sua conta para receber instruções de redefinição de segurança.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  E-mail Corporativo / Pessoal
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all bg-gray-50/50 hover:bg-white text-gray-900 placeholder-gray-400 font-medium"
                    placeholder="nome@exemplo.com"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold tracking-wide py-4 px-4 rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl hover:shadow-primary-600/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {isLoading ? 'ENVIANDO PROTOCOLO...' : 'SOLICITAR REDEFINIÇÃO'}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-gray-100">
              <button
                onClick={() => navigate('/login')}
                className="w-full flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-gray-900 transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
                Voltar para Login
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-8 pt-4 pb-4"
        >
          <div className="flex flex-col items-center gap-2 text-primary-200/60 font-medium text-xs uppercase tracking-widest">
            <span> • Ambiente Seguro •</span>
            <span className="opacity-50 tracking-[0.3em]">FINCONTROL</span>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default ForgotPassword;
