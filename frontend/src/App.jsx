import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AuthModal from './components/AuthModal'
import HomePage from './pages/HomePage'
import CategoryPage from './pages/CategoryPage'
import DestinationPage from './pages/DestinationPage'
import { useLenis, scrollToId } from './lib/LenisProvider'

export default function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === '/'
  const lenis = useLenis()
  const [activeCategory, setActiveCategory] = useState('pilgrimage')
  const [presetDestination, setPresetDestination] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [authMode, setAuthMode] = useState(null) // null | 'login' | 'signup'
  const [user, setUser] = useState(null)

  const handleSelectCategory = (categoryKey) => {
    setSearchTerm('')
    setActiveCategory(categoryKey)
  }

  const handleEnquire = (destinationName) => {
    setPresetDestination(destinationName)
    navigate('/')
    setTimeout(() => {
      scrollToId(lenis, 'inquire')
    }, 150)
  }

  const handleSearch = (term) => {
    setSearchTerm(term)
    navigate('/')
    setTimeout(() => {
      scrollToId(lenis, 'packages')
    }, 150)
  }

  const handleGoToPackages = () => {
    navigate('/')
    setTimeout(() => {
      scrollToId(lenis, 'popular-destinations')
    }, 150)
  }

  const handleSearchIconClick = () => {
    navigate('/')
    scrollToId(lenis, 'top')
  }

  useEffect(() => {
    lenis?.current?.scrollTo(0, { immediate: true })
  }, [location.pathname])

  return (
    <>
      <Navbar
        onSelectCategory={handleSelectCategory}
        onSearchClick={handleSearchIconClick}
        onGoToPackages={handleGoToPackages}
        user={user}
        onOpenAuth={setAuthMode}
        onLogout={() => setUser(null)}
        overlayHero={isHome}
      />

      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              onSearch={handleSearch}
              activeCategory={activeCategory}
              onSelectCategory={handleSelectCategory}
              searchTerm={searchTerm}
              onClearSearch={() => setSearchTerm('')}
              presetDestination={presetDestination}
            />
          }
        />
        <Route path="/category/:categoryKey" element={<CategoryPage />} />
        <Route
          path="/category/:categoryKey/:slug"
          element={<DestinationPage onEnquire={handleEnquire} />}
        />
      </Routes>

      <Footer />

      {authMode && (
        <AuthModal
          mode={authMode}
          onClose={() => setAuthMode(null)}
          onSwitchMode={setAuthMode}
          onAuthenticated={(u) => {
            setUser(u)
            setAuthMode(null)
          }}
        />
      )}
    </>
  )
}