import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster, toast } from 'react-hot-toast'
import { lazy, Suspense, useEffect, useState } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { useAuthStore } from './store/authStore'
import { ThemeProvider } from './contexts/ThemeContext'
import LoadingSkeleton from './components/common/LoadingSkeleton'
import PWAInstallPrompt from './components/common/PWAInstallPrompt'
import OfflineIndicator from './components/common/OfflineIndicator'
import PageTransition from './components/common/PageTransition'
import BiometricLock from './components/common/BiometricLock'
import { useSecurityStore } from './store/securityStore'
import SplashScreen from './components/common/SplashScreen'
import { useIsMobile } from './hooks'

// Auth & Landing Pages (lazy loading para aceleração extrema do carregamento inicial)
const Landing = lazy(() => import('./pages/Landing'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const ResetPassword = lazy(() => import('./pages/ResetPassword'))
const AuthCallback = lazy(() => import('./pages/AuthCallback'))
import LoginPreloader from './components/auth/LoginPreloader'
import { usePreloaderStore } from './store/preloaderStore'

// Main Pages (lazy loading para melhor performance)
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Transactions = lazy(() => import('./pages/Transactions'))
const Categories = lazy(() => import('./pages/Categories'))
const Subscriptions = lazy(() => import('./pages/Subscriptions'))
const Cards = lazy(() => import('./pages/Cards'))
const Reports = lazy(() => import('./pages/Reports'))
const Settings = lazy(() => import('./pages/Settings'))
const Plans = lazy(() => import('./pages/Plans'))
const Checkout = lazy(() => import('./pages/Checkout'))
const ManageSubscription = lazy(() => import('./pages/ManageSubscription'))
const Admin = lazy(() => import('./pages/Admin'))
const About = lazy(() => import('./pages/About'))
const Privacy = lazy(() => import('./pages/Privacy'))
const Terms = lazy(() => import('./pages/Terms'))
const Support = lazy(() => import('./pages/Support'))
const PercentageCalculator = lazy(() => import('./pages/PercentageCalculator'))
const CompoundInterestCalculator = lazy(() => import('./pages/CompoundInterestCalculator'))
const Goodbye = lazy(() => import('./pages/Goodbye'))
const NotFound = lazy(() => import('./pages/NotFound'))

// Layout
import MainLayout from './components/layout/MainLayout'

// Loading fallback component com estrutura completa de Dashboard Skeleton
const PageLoader = () => (
  <div className="w-full max-w-7xl mx-auto space-y-6">
    {/* Header Skeleton */}
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="space-y-2">
        <LoadingSkeleton variant="text" className="w-44 sm:w-56 h-7 sm:h-8 rounded-lg" />
        <LoadingSkeleton variant="text" className="w-64 sm:w-80 h-3.5 sm:h-4 rounded-md opacity-60" />
      </div>
      <div className="flex items-center gap-3">
        <LoadingSkeleton variant="button" className="w-28 sm:w-32" />
        <LoadingSkeleton variant="button" className="w-32 sm:w-36" />
      </div>
    </div>

    {/* 4 Cards de Métricas / KPI Skeleton */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <LoadingSkeleton variant="kpi" />
      <LoadingSkeleton variant="kpi" />
      <LoadingSkeleton variant="kpi" />
      <LoadingSkeleton variant="kpi" />
    </div>

    {/* Grid de Gráficos e Lançamentos Recentes */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <LoadingSkeleton variant="chart" />
      </div>
      <div className="space-y-4">
        <LoadingSkeleton variant="card" className="h-72" />
      </div>
    </div>
  </div>
)

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const accessToken = useAuthStore((state) => state.accessToken)

  // Verificar se está autenticado E tem token válido
  const isValid = isAuthenticated && accessToken

  return isValid ? <>{children}</> : <Navigate to="/login" replace />
}

// Admin Route Component - Protege rotas que só admins podem acessar
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useAuthStore((state) => state.user)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  // Verificar se está autenticado E é admin
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!user?.isAdmin) {
    // Redirecionar para dashboard com mensagem de erro
    toast.error('Acesso negado! Você não tem permissão de administrador.')
    return <Navigate to="/app/dashboard" replace />
  }

  return <>{children}</>
}

// Animated Routes Component
const AnimatedRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={
        <Suspense fallback={<PageLoader />}>
          <Landing />
        </Suspense>
      } />
      <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
      <Route path="/transactions" element={<Navigate to="/app/transactions" replace />} />
      <Route path="/categories" element={<Navigate to="/app/categories" replace />} />
      <Route path="/subscriptions" element={<Navigate to="/app/subscriptions" replace />} />
      <Route path="/reports" element={<Navigate to="/app/reports" replace />} />
      <Route path="/plans" element={<Navigate to="/app/plans" replace />} />
      <Route path="/settings" element={<Navigate to="/app/settings" replace />} />
      <Route path="/calculadora-porcentagem" element={<Navigate to="/app/calculadora-porcentagem" replace />} />
      <Route path="/calculadora-juros" element={<Navigate to="/app/calculadora-juros" replace />} />
      <Route path="/admin" element={<Navigate to="/app/admin" replace />} />
      <Route path="/login" element={
        <Suspense fallback={<PageLoader />}>
          <Login />
        </Suspense>
      } />
      <Route path="/register" element={
        <Suspense fallback={<PageLoader />}>
          <Register />
        </Suspense>
      } />
      <Route path="/verify-email" element={
        <Suspense fallback={<PageLoader />}>
          <VerifyEmail />
        </Suspense>
      } />
      <Route path="/forgot-password" element={
        <Suspense fallback={<PageLoader />}>
          <ForgotPassword />
        </Suspense>
      } />
      <Route path="/reset-password" element={
        <Suspense fallback={<PageLoader />}>
          <ResetPassword />
        </Suspense>
      } />
      <Route path="/auth/callback" element={
        <Suspense fallback={<PageLoader />}>
          <AuthCallback />
        </Suspense>
      } />
      <Route path="/goodbye" element={
        <Suspense fallback={<PageLoader />}>
          <Goodbye />
        </Suspense>
      } />
      <Route path="/about" element={
        <Suspense fallback={<PageLoader />}>
          <About />
        </Suspense>
      } />
      <Route path="/privacy" element={
        <Suspense fallback={<PageLoader />}>
          <Privacy />
        </Suspense>
      } />
      <Route path="/terms" element={
        <Suspense fallback={<PageLoader />}>
          <Terms />
        </Suspense>
      } />
      <Route path="/support" element={
        <Suspense fallback={<PageLoader />}>
          <Support />
        </Suspense>
      } />

      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/app/transactions" replace />} />
        <Route path="dashboard" element={
          <Suspense fallback={<PageLoader />}>
            <PageTransition>
              <Dashboard />
            </PageTransition>
          </Suspense>
        } />
        <Route path="transactions" element={
          <Suspense fallback={<PageLoader />}>
            <PageTransition>
              <Transactions />
            </PageTransition>
          </Suspense>
        } />
        <Route path="categories" element={
          <Suspense fallback={<PageLoader />}>
            <PageTransition>
              <Categories />
            </PageTransition>
          </Suspense>
        } />
        <Route path="subscriptions" element={
          <Suspense fallback={<PageLoader />}>
            <PageTransition>
              <Subscriptions />
            </PageTransition>
          </Suspense>
        } />
        <Route path="cards" element={
          <Suspense fallback={<PageLoader />}>
            <PageTransition>
              <Cards />
            </PageTransition>
          </Suspense>
        } />
        <Route path="reports" element={
          <Suspense fallback={<PageLoader />}>
            <PageTransition>
              <Reports />
            </PageTransition>
          </Suspense>
        } />
        <Route path="plans" element={
          <Suspense fallback={<PageLoader />}>
            <PageTransition>
              <Plans />
            </PageTransition>
          </Suspense>
        } />
        <Route path="upgrade" element={
          <Suspense fallback={<PageLoader />}>
            <PageTransition>
              <Plans />
            </PageTransition>
          </Suspense>
        } />
        <Route path="checkout" element={
          <Suspense fallback={<PageLoader />}>
            <PageTransition>
              <Checkout />
            </PageTransition>
          </Suspense>
        } />
        <Route path="settings" element={
          <Suspense fallback={<PageLoader />}>
            <PageTransition>
              <Settings />
            </PageTransition>
          </Suspense>
        } />
        <Route path="settings/subscription" element={
          <Suspense fallback={<PageLoader />}>
            <PageTransition>
              <ManageSubscription />
            </PageTransition>
          </Suspense>
        } />
        <Route path="profile" element={<Navigate to="/app/settings" replace />} />
        <Route path="calculadora-porcentagem" element={
          <Suspense fallback={<PageLoader />}>
            <PageTransition>
              <PercentageCalculator />
            </PageTransition>
          </Suspense>
        } />
        <Route path="calculadora-juros" element={
          <Suspense fallback={<PageLoader />}>
            <PageTransition>
              <CompoundInterestCalculator />
            </PageTransition>
          </Suspense>
        } />
        <Route path="admin" element={
          <AdminRoute>
            <Suspense fallback={<PageLoader />}>
              <PageTransition>
                <Admin />
              </PageTransition>
            </Suspense>
          </AdminRoute>
        } />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>

      <Route path="/404" element={
        <Suspense fallback={<PageLoader />}>
          <NotFound />
        </Suspense>
      } />
      <Route path="*" element={
        <Suspense fallback={<PageLoader />}>
          <NotFound />
        </Suspense>
      } />
    </Routes>
  )
}

function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth)
  const isInitialized = useAuthStore((state) => state.isInitialized)
  const { isBiometricEnabled, setLocked } = useSecurityStore()
  const { isOpen: isPreloaderOpen, isSuccess: isPreloadSuccess } = usePreloaderStore()
  const [showSplash, setShowSplash] = useState(true)
  const isMobile = useIsMobile()

  useEffect(() => {
    initializeAuth()
    
    // Bloquear app ao iniciar se biometria estiver ativa
    if (isBiometricEnabled) {
      setLocked(true)
    }

    // Timer mínimo para garantir exibição premium da Splash Screen no mobile
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [initializeAuth, isBiometricEnabled, setLocked])

  // Lógica para bloquear quando o app volta do background
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isBiometricEnabled) {
        setLocked(true)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [isBiometricEnabled, setLocked])

  const showMobileSplash = isMobile && (showSplash || !isInitialized)

  if (showMobileSplash) {
    return <SplashScreen />
  }

  if (!isInitialized) {
    return (
      <div className="min-h-screen w-full bg-gray-50 dark:bg-black p-4 sm:p-6 lg:p-8 flex flex-col justify-start">
        <PageLoader />
      </div>
    )
  }

  return (
    <ThemeProvider>
      <Router>
        <LoginPreloader isOpen={isPreloaderOpen} isSuccess={isPreloadSuccess} />
        <BiometricLock />
        <AnimatedRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              iconTheme: {
                primary: '#22c55e',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <PWAInstallPrompt />
        <OfflineIndicator />
        <Analytics />
        <SpeedInsights />
      </Router>
    </ThemeProvider>
  )
}

export default App
