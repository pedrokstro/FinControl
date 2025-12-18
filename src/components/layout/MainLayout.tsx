import { Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import MobileNavBar from './MobileNavBar'
import { useFinancialStore } from '@/store/financialStore'
import { useIsMobile } from '@/hooks'

const MainLayout = () => {
  const syncWithBackend = useFinancialStore((state) => state.syncWithBackend)
  const isMobile = useIsMobile()
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  useEffect(() => {
    syncWithBackend()
  }, [syncWithBackend])

  useEffect(() => {
    if (!isMobile) {
      setIsMobileSidebarOpen(false)
    }
  }, [isMobile])

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-black transition-colors duration-300">
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <Header onToggleMobileSidebar={() => setIsMobileSidebarOpen((prev) => !prev)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50 dark:bg-black transition-colors duration-300">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {isMobile && (
        <>
          <div
            className={`fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 z-40 ${
              isMobileSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <div
            className={`fixed inset-y-0 left-0 z-50 max-w-[85vw] w-72 transform transition-transform duration-300 ${
              isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <Sidebar onNavigate={() => setIsMobileSidebarOpen(false)} />
          </div>
        </>
      )}

      <MobileNavBar isSidebarOpen={isMobileSidebarOpen} />
    </div>
  )
}

export default MainLayout
