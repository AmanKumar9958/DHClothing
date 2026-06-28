import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Home from './pages/Home'
import Collection from './pages/Collection'
import About from './pages/About'
import Contact from './pages/Contact'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import PlaceOrder from './pages/PlaceOrder'
import Orders from './pages/Orders'
import Profile from './pages/Profile'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Verify from './pages/Verify'
import ExclusivePage from './pages/ExclusivePage'
import ScrollToTop from './components/ScrollToTop';

const PageWrapper = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
      className="min-h-screen"
    >
      {children}
    </motion.div>
  )
}

const App = () => {
  const location = useLocation();

  return (
    <div className='flex flex-col min-h-screen'>
      <ToastContainer position="bottom-right" theme="light" />
      
      {/* Navigation Layer */}
      <Navbar />
      <SearchBar />
      <ScrollToTop />
      
      {/* Main Content Layer */}
      <main className='flex-grow pt-[80px]'>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path='/' element={<PageWrapper><Home /></PageWrapper>} />
            <Route path='/collection' element={<PageWrapper><Collection /></PageWrapper>} />
            <Route path='/about' element={<PageWrapper><About /></PageWrapper>} />
            <Route path='/contact' element={<PageWrapper><Contact /></PageWrapper>} />
            <Route path='/product/:productId' element={<PageWrapper><Product /></PageWrapper>} />
            <Route path='/cart' element={<PageWrapper><Cart /></PageWrapper>} />
            <Route path='/login' element={<PageWrapper><Login /></PageWrapper>} />
            <Route path='/forgot-password' element={<PageWrapper><ForgotPassword /></PageWrapper>} />
            <Route path='/profile' element={<PageWrapper><Profile /></PageWrapper>} />
            <Route path='/place-order' element={<PageWrapper><PlaceOrder /></PageWrapper>} />
            <Route path='/orders' element={<PageWrapper><Orders /></PageWrapper>} />
            <Route path='/verify' element={<PageWrapper><Verify /></PageWrapper>} />
            <Route path='/exclusive' element={<PageWrapper><ExclusivePage /></PageWrapper>} />
          </Routes>
        </AnimatePresence>
      </main>

      {/* Footer Layer */}
      <Footer />
    </div>
  )
}

export default App
