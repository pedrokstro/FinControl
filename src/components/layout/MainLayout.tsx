import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import { useEffect } from 'react'
import { useFinancialStore } from '@/store/financialStore'

const MainLayout = () => {
  const syncWithBackend = useFinancialStore((state) => state.syncWithBackend)

  useEffect(() => {
    syncWithBackend()
  }, [syncWithBackend])

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-black transition-colors duration-300 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-black transition-colors duration-300">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default MainLayout
