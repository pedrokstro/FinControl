import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabaseClient'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'
import AnimatedPage from '@/components/common/AnimatedPage'
import { Loader2 } from 'lucide-react'

const AuthCallback = () => {
  const navigate = useNavigate()
  const completeSocialLogin = useAuthStore((state) => state.completeSocialLogin)
  const processingRef = useRef(false)
  const [status, setStatus] = useState<'loading' | 'error'>('loading')

  useEffect(() => {
    // Evitar execução duplicada em React Strict Mode
    if (processingRef.current) return

    // Verificar se tem code ou error na URL
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    const errorParam = params.get('error')

    // Se não tem código nem erro, não deve fazer nada nesta rota
    if (!code && !errorParam && !window.location.hash) {
      console.warn('AuthCallback acessado sem código ou hash')
      // Se já tiver sessão, redirecionar
      supabase.auth.getSession().then(({ data }) => {
        if (data.session) {
          completeSocialLogin(data.session.access_token).then(() => {
            navigate('/app/transactions', { replace: true })
          })
        } else {
          setStatus('error')
        }
      })
      return
    }

    processingRef.current = true

    const handleCallback = async () => {
      try {
        console.log('🔄 Iniciando troca de código por sessão...')
        // Usar getSession() que lida com a URL automaticamente na V2 se configurado corretamente
        // Mas como estamos com code explícito na URL e detectSessionInUrl=false, usamos exchangeCodeForSession
        const currentUrl = window.location.href

        const { data, error } = await supabase.auth.exchangeCodeForSession(currentUrl)

        if (error) {
          console.error('❌ Erro Supabase exchangeCodeForSession:', error)
          throw error
        }

        if (!data.session?.access_token) {
          console.error('❌ Sessão não criada após troca de código')
          throw new Error('Não foi possível obter a sessão de login.')
        }

        console.log('✅ Sessão obtida, finalizando login social...')
        await completeSocialLogin(data.session.access_token)

        toast.success('Login com Google concluído!')
        navigate('/app/transactions', { replace: true })
      } catch (err: any) {
        console.error('Erro no callback de OAuth:', err)
        setStatus('error')

        let msg = 'Não foi possível completar o login.'
        if (err?.message?.includes('code verifier')) {
          msg = 'Erro de verificação de segurança (PKCE). Tente fazer login novamente.'
        } else if (err?.message) {
          msg = err.message
        }

        toast.error(msg)
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
