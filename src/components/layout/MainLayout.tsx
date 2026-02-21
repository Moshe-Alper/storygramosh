import { Outlet } from 'react-router-dom'
import { LeftSidebar } from './LeftSidebar'

export function MainLayout() {
  return (
    <div className="app-layout">
      <LeftSidebar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}
