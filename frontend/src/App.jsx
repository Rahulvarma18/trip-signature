import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AuthModal from './components/AuthModal'
import HomePage from './pages/HomePage'
import CategoryPage from './pages/CategoryPage'
import DestinationPage from './pages/DestinationPage'
import { useLenis, scrollToId } from './lib/LenisProvider'

// Import animation presets
import { subtleFade } from './animations/animationPresets'

const pageVariants = subtleFade

export default function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === '/'
  const lenis = useLenis()
  const [activeCategory, setActiveCategory] = useState('pilgrimage')
  const [presetDestination, setPresetDestination] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [authMode, setAuthMode] = useState(null)
  const [user, setUser] = useState(null)

  const handleSelectCategory = (categoryKey) => {
    setSearchTerm('')
    setActiveCategory(categoryKey)
  }

  const handleEnquire = (destinationName) => {
    setPresetDestination(destinationName)
    navigate('/')
    setTimeout(() => {
      lenis?.current?.scrollTo(0, { immediate: true })
      setTimeout(() => {
        scrollToId(lenis, 'inquire')
      }, 100)
    }, 700)
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

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <HomePage
                  onSearch={handleSearch}
                  activeCategory={activeCategory}
                  onSelectCategory={handleSelectCategory}
                  searchTerm={searchTerm}
                  onClearSearch={() => setSearchTerm('')}
                  presetDestination={presetDestination}
                />
              </motion.div>
            }
          />
          <Route
            path="/category/:categoryKey"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <CategoryPage />
              </motion.div>
            }
          />
          <Route
            path="/category/:categoryKey/:slug"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <DestinationPage onEnquire={handleEnquire} />
              </motion.div>
            }
          />
        </Routes>
      </AnimatePresence>

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