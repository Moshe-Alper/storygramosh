import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useAuthStore } from './store/auth.store'
import { MainLayout } from './components/layout/MainLayout'
import { Home } from './pages/Home'
import { Profile } from './pages/Profile'
import { Explore } from './pages/Explore'
import { Search } from './pages/Search'

function App() {
  const init = useAuthStore(s => s.init)

  useEffect(() => {
    init()
  }, [init])

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="search" element={<Search />} />
          <Route path="explore" element={<Explore />} />
          <Route path=":username" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
