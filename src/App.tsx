import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster, toast } from 'react-hot-toast'
import { lazy, Suspense, useEffect } from 'react'
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

// Auth Pages (não lazy - carregam rápido)
import Login from './pages/Login'
import Register from './pages/Register'
import VerifyEmail from './pages/VerifyEmail'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Landing from './pages/Landing'
import AuthCallback from './pages/AuthCallback'

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

// Layout
import MainLayout from './components/layout/MainLayout'

// Loading fallback component
const PageLoader = () => (
  <div className="p-6 space-y-6">
    <LoadingSkeleton variant="card" className="h-20" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <LoadingSkeleton variant="card" />
      <LoadingSkeleton variant="card" />
      <LoadingSkeleton variant="card" />
    </div>
    <LoadingSkeleton variant="chart" />
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
      <Route path="/" element={<Landing />} />
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
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
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
      </Route>
    </Routes>
  )
}

function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth)
  const isInitialized = useAuthStore((state) => state.isInitialized)
  const { isBiometricEnabled, setLocked } = useSecurityStore()

  useEffect(() => {
    initializeAuth()
    
    // Bloquear app ao iniciar se biometria estiver ativa
    if (isBiometricEnabled) {
      setLocked(true)
    }
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

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-neutral-900">
        <PageLoader />
      </div>
    )
  }

  return (
    <ThemeProvider>
      <Router>
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
