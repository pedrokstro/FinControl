import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Fingerprint, ShieldCheck } from 'lucide-react'
import { useSecurityStore } from '@/store/securityStore'
import { haptics } from '@/utils/haptics'
import toast from 'react-hot-toast'

const BiometricLock = () => {
  const { isBiometricEnabled, isLocked, setLocked } = useSecurityStore()
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  const handleAuthenticate = async () => {
    if (isAuthenticating) return
    
    setIsAuthenticating(true)
    haptics.medium()

    try {
      const challenge = new Uint8Array(32)
      window.crypto.getRandomValues(challenge)

      const options: CredentialCreationOptions = {
        publicKey: {
          challenge: challenge,
          rp: {
            name: "FinControl",
            id: window.location.hostname,
          },
          user: {
            id: new Uint8Array(16),
            name: "user",
            displayName: "User",
          },
          pubKeyCredParams: [{ alg: -7, type: "public-key" }],
          timeout: 60000,
          authenticatorSelection: {
            userVerification: "required",
            authenticatorAttachment: "platform",
          }
        }
      }

      const available = await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      
      if (available) {
        await navigator.credentials.create(options)
      }
      
      haptics.success()
      setLocked(false)
      toast.success('Acesso liberado')
    } catch (error: any) {
      console.error('Erro na autenticação biométrica:', error)
      haptics.error()
      
      if (error.name === 'NotAllowedError') {
        toast.error('Autenticação cancelada ou não permitida')
      } else {
        toast.error('Erro ao autenticar. Tente novamente.')
      }
    } finally {
      setIsAuthenticating(false)
    }
  }

  // Tentar autenticar automaticamente ao montar se estiver bloqueado
  useEffect(() => {
    if (isLocked && isBiometricEnabled) {
      handleAuthenticate()
    }
  }, [isLocked, isBiometricEnabled])

  if (!isLocked || !isBiometricEnabled) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] bg-white dark:bg-neutral-950 flex flex-col items-center justify-center p-6"
      >
        {/* Soft Glow Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-primary-500/10 rounded-full blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="relative z-10 flex flex-col items-center max-w-sm w-full text-center"
        >
          <div className="w-24 h-24 bg-primary-50 dark:bg-primary-900/20 rounded-[32px] flex items-center justify-center mb-8 relative">
            <div className="absolute inset-0 bg-primary-500/20 rounded-[32px] animate-pulse" />
            <Fingerprint className="w-12 h-12 text-primary-600 dark:text-primary-400 relative z-10" />
          </div>

          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-3">FinControl</h2>
          <p className="text-gray-500 dark:text-neutral-400 mb-12 font-medium">
            Toque no sensor para liberar seu acesso com segurança
          </p>

          <button
            onClick={handleAuthenticate}
            disabled={isAuthenticating}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-5 rounded-3xl transition-all shadow-xl shadow-primary-500/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {isAuthenticating ? (
              <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Fingerprint className="w-6 h-6" />
                ENTRAR COM DIGITAL
              </>
            )}
          </button>

          <div className="mt-12 flex items-center gap-2 text-gray-400 dark:text-neutral-600">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">Proteção Biométrica Ativa</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default BiometricLock
