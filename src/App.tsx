import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Toaster, toast } from 'react-hot-toast'
import { AnimatePresence } from 'framer-motion'
import { lazy, Suspense } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { useAuthStore } from './store/authStore'
import { ThemeProvider } from './contexts/ThemeContext'
import LoadingSkeleton from './components/common/LoadingSkeleton'
import PWAInstallPrompt from './components/common/PWAInstallPrompt'
import OfflineIndicator from './components/common/OfflineIndicator'

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
  const location = useLocation()
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
        <Route path="/transactions" element={<Navigate to="/app/transactions" replace />} />
        <Route path="/categories" element={<Navigate to="/app/categories" replace />} />
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
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route path="dashboard" element={
            <Suspense fallback={<PageLoader />}>
              <Dashboard />
            </Suspense>
          } />
          <Route path="transactions" element={
            <Suspense fallback={<PageLoader />}>
              <Transactions />
            </Suspense>
          } />
          <Route path="categories" element={
            <Suspense fallback={<PageLoader />}>
              <Categories />
            </Suspense>
          } />
          <Route path="reports" element={
            <Suspense fallback={<PageLoader />}>
              <Reports />
            </Suspense>
          } />
          <Route path="plans" element={
            <Suspense fallback={<PageLoader />}>
              <Plans />
            </Suspense>
          } />
          <Route path="upgrade" element={
            <Suspense fallback={<PageLoader />}>
              <Plans />
            </Suspense>
          } />
          <Route path="checkout" element={
            <Suspense fallback={<PageLoader />}>
              <Checkout />
            </Suspense>
          } />
          <Route path="settings" element={
            <Suspense fallback={<PageLoader />}>
              <Settings />
            </Suspense>
          } />
          <Route path="settings/subscription" element={
            <Suspense fallback={<PageLoader />}>
              <ManageSubscription />
            </Suspense>
          } />
          <Route path="profile" element={<Navigate to="/app/settings" replace />} />
          <Route path="calculadora-porcentagem" element={
            <Suspense fallback={<PageLoader />}>
              <PercentageCalculator />
            </Suspense>
          } />
          <Route path="calculadora-juros" element={
            <Suspense fallback={<PageLoader />}>
              <CompoundInterestCalculator />
            </Suspense>
          } />
          <Route path="admin" element={
            <AdminRoute>
              <Suspense fallback={<PageLoader />}>
                <Admin />
              </Suspense>
            </AdminRoute>
          } />
        </Route>
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <ThemeProvider>
      <Router>
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
