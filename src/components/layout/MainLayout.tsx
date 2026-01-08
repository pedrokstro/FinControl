import { Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import MobileNavBar from './MobileNavBar'
import FloatingActionButton from './FloatingActionButton'
import { useFinancialStore } from '@/store/financialStore'

const MainLayout = () => {
  const syncWithBackend = useFinancialStore((state) => state.syncWithBackend)

  useEffect(() => {
    syncWithBackend()
  }, [syncWithBackend])

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-black transition-colors duration-300">
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 pb-28 sm:p-6 sm:pb-6 bg-gray-50 dark:bg-black transition-colors duration-300">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      <MobileNavBar />
      <FloatingActionButton />
    </div>
  )
}

export default MainLayout
