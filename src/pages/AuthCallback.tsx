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
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (processingRef.current) return
    processingRef.current = true

    console.log('🔄 AuthCallback montado. Aguardando processamento da sessão pelo SDK...')

    // Função para finalizar o login
    const finalizeLogin = async (session: any) => {
      try {
        if (!session?.access_token) {
          throw new Error('Sessão sem token de acesso.')
        }

        console.log('✅ Sessão detectada! Finalizando login...')
        await completeSocialLogin(session.access_token)
        toast.success('Login com Google concluído!')
        navigate('/app/transactions', { replace: true })
      } catch (err: any) {
        console.error('❌ Erro ao finalizar login:', err)
        setStatus('error')
        setErrorMessage(err.message || 'Erro ao processar dados do login.')
        toast.error('Falha ao concluir o login.')
      }
    }

    // 1. Verificar se já temos uma sessão ativa (caso o SDK já tenha processado antes do componente montar)
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        console.warn('⚠️ Erro ao verificar sessão inicial:', error)
      }
      if (data?.session) {
        console.log('⚡ Sessão já existente encontrada.')
        finalizeLogin(data.session)
        return
      }

      // 2. Se não tem sessão, ouvir mudança de estado (o SDK vai processar a URL)
      console.log('👂 Aguardando evento onAuthStateChange...')
      const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log(`🔔 Evento de Auth: ${event}`)

        if (event === 'SIGNED_IN' && session) {
          await finalizeLogin(session)
        } else if (event === 'SIGNED_OUT') {
          // Opcional: tratar sign out se necessário
        }
      })

      // 3. Timeout de segurança caso nada aconteça
      const timeoutBot = setTimeout(() => {
        // Verificar uma última vez
        supabase.auth.getSession().then(({ data }) => {
          if (data?.session) {
            finalizeLogin(data.session)
          } else {
            console.error('⏰ Timeout: Nenhuma sessão detectada após 10 segundos.')
            setStatus('error')
            setErrorMessage('O login demorou muito para responder. Tente novamente.')
          }
        })
      }, 10000)

      return () => {
        authListener.subscription.unsubscribe()
        clearTimeout(timeoutBot)
      }
    })
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
              {errorMessage || 'Não foi possível concluir o processo de autenticação. Tente novamente ou utilize outro método de login.'}
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
