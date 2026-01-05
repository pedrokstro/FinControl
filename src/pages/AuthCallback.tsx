import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabaseClient'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'
import AnimatedPage from '@/components/common/AnimatedPage'
import { Loader2 } from 'lucide-react'

const AuthCallback = () => {
  const navigate = useNavigate()
  const completeSocialLogin = useAuthStore((state) => state.completeSocialLogin)
  const [status, setStatus] = useState<'loading' | 'error'>('loading')

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const currentUrl = window.location.href
        const { data, error } = await supabase.auth.exchangeCodeForSession(currentUrl)

        if (error || !data.session?.access_token) {
          console.error('Erro ao trocar código por sessão Supabase:', error)
          throw new Error('Não foi possível finalizar o login com o Google.')
        }

        await completeSocialLogin(data.session.access_token)

        toast.success('Login com Google concluído!')
        navigate('/app/transactions', { replace: true })
      } catch (err: any) {
        console.error('Erro no callback de OAuth:', err)
        setStatus('error')
        toast.error(err?.message || 'Não foi possível completar o login. Tente novamente.')
      }
    }

    handleCallback()
  }, [completeSocialLogin, navigate])

  if (status === 'error') {
    return (
      <AnimatedPage direction="left">
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-red-50 text-red-500 flex items-center justify-center text-3xl">
              !
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">Erro ao conectar com o Google</h1>
            <p className="text-gray-600">
              Não foi possível concluir o processo de autenticação. Tente novamente ou utilize outro método de login.
            </p>
            <button
              type="button"
              onClick={() => navigate('/login', { replace: true })}
              className="w-full mt-4 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition"
            >
              Voltar para o login
            </button>
          </div>
        </div>
      </AnimatedPage>
    )
  }

  return (
    <AnimatedPage direction="left">
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-primary-50 text-primary-500 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">Conectando ao Google</h1>
          <p className="text-gray-600">
            Estamos sincronizando seus dados. Isso leva apenas alguns segundos.
          </p>
        </div>
      </div>
    </AnimatedPage>
  )
}

export default AuthCallback
