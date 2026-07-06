import { Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import MobileNavBar from './MobileNavBar'
import { useFinancialStore } from '@/store/financialStore'

const MainLayout = () => {
  const syncWithBackend = useFinancialStore((state) => state.syncWithBackend)

  useEffect(() => {
    syncWithBackend()
  }, [syncWithBackend])

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-black transition-colors duration-300 safe-area-bottom">
      <div className="hidden lg:flex relative z-40">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="hidden lg:block">
          <Header />
        </div>
        <main className="flex-1 overflow-y-auto p-4 pt-[calc(1rem+env(safe-area-inset-top))] pb-28 sm:p-6 sm:pb-6 lg:pt-6 bg-gray-50 dark:bg-black transition-colors duration-300">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      <MobileNavBar />
    </div>
  )
}

export default MainLayout
