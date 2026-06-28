import { useContext, useState, useRef, useEffect } from 'react'
import { assets } from '../assets/assets'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify'
import { AnimatePresence, motion } from 'framer-motion'

const Navbar = () => {
    const [visible, setVisible] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const dropdownRef = useRef(null);
    const location = useLocation();

    const { setShowSearch, getCartCount, navigate, token, setToken, setCartItems } = useContext(ShopContext);

    // Detect scroll for glassmorphism effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setVisible(false);
    }, [location.pathname]);

    const logout = () => {
        setDropdownOpen(false)
        navigate('/login')
        localStorage.removeItem('token')
        setToken('')
        setCartItems({})
    }



    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-soft py-3' : 'bg-transparent py-5'}`}>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between font-medium'>
                
                <Link to='/' className="flex-shrink-0 relative z-50 hover-lift">
                    <img src={assets.logo} className='h-8 w-auto' alt="DH Clothing" />
                </Link>

                <nav className='hidden sm:flex gap-8 text-sm text-brand-black'>
                    <NavLink to='/' className={({isActive}) => `relative underline-animate py-2 ${isActive ? 'text-brand-gold' : 'hover:text-brand-gold transition-colors'}`}>HOME</NavLink>
                    <NavLink to='/collection' className={({isActive}) => `relative underline-animate py-2 ${isActive ? 'text-brand-gold' : 'hover:text-brand-gold transition-colors'}`}>COLLECTION</NavLink>
                    <NavLink to='/about' className={({isActive}) => `relative underline-animate py-2 ${isActive ? 'text-brand-gold' : 'hover:text-brand-gold transition-colors'}`}>ABOUT</NavLink>
                    <NavLink to='/exclusive' className={({isActive}) => `relative underline-animate py-2 ${isActive ? 'text-brand-gold' : 'hover:text-brand-gold transition-colors'}`}>EXCLUSIVE</NavLink>
                    <NavLink to='/contact' className={({isActive}) => `relative underline-animate py-2 ${isActive ? 'text-brand-gold' : 'hover:text-brand-gold transition-colors'}`}>CONTACT</NavLink>
                </nav>

                <div className='flex items-center gap-5 sm:gap-6 relative z-50'>
                    <button onClick={() => { setShowSearch(true); navigate('/collection') }} className="hover-lift p-1 text-brand-black hover:text-brand-gold transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    </button>
                    
                    <div className='relative' ref={dropdownRef}>
                        <button 
                            onClick={() => token ? setDropdownOpen(!dropdownOpen) : navigate('/login')} 
                            className='hover-lift p-1 text-brand-black hover:text-brand-gold transition-colors'
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        </button>
                        
                        {/* Premium Dropdown Menu */}
                        <AnimatePresence>
                        {token && dropdownOpen && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-soft-xl border border-neutral-100 overflow-hidden z-50"
                        >
                            {/* Header section */}
                            <div className='px-4 pt-4 pb-3 bg-neutral-50 border-b border-neutral-100'>
                                <div className='flex items-center gap-3'>
                                    <div className='w-10 h-10 rounded-full bg-brand-charcoal flex items-center justify-center text-white'>
                                        <svg xmlns="http://www.w3.org/2000/svg" className='w-5 h-5' viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                    </div>
                                    <div>
                                        <p className='text-sm font-semibold text-brand-black'>My Account</p>
                                        <p className='text-xs text-neutral-500 mt-0.5'>Manage your profile</p>
                                    </div>
                                </div>
                            </div>

                            {/* Menu items */}
                            <div className='p-2'>
                                <button 
                                    onClick={() => { setDropdownOpen(false); navigate('/profile') }} 
                                    className='w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-neutral-600 hover:bg-neutral-50 hover:text-brand-black transition-all group'
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className='w-4 h-4 text-neutral-400 group-hover:text-brand-black transition-colors' viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                    <span className='text-sm font-medium'>Profile</span>
                                </button>
                                <button 
                                    onClick={() => { setDropdownOpen(false); navigate('/orders') }} 
                                    className='w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-neutral-600 hover:bg-neutral-50 hover:text-brand-black transition-all group'
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className='w-4 h-4 text-neutral-400 group-hover:text-brand-black transition-colors' viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16v-2"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                                    <span className='text-sm font-medium'>Orders</span>
                                </button>
                                
                                <div className='h-px bg-neutral-100 my-1 mx-2'></div>
                                
                                <button 
                                    onClick={logout} 
                                    className='w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-all group'
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className='w-4 h-4 text-red-400 group-hover:text-red-500 transition-colors' viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                                    <span className='text-sm font-medium'>Logout</span>
                                </button>
                            </div>
                        </motion.div>
                        )}
                        </AnimatePresence>
                    </div> 

                    <Link to='/cart' className='relative hover-lift p-1 text-brand-black hover:text-brand-gold transition-colors'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                        <span className='absolute top-0 right-0 translate-x-1/2 -translate-y-1/4 w-4 h-4 bg-brand-gold text-white flex items-center justify-center rounded-full text-[9px] font-bold shadow-sm'>
                            {getCartCount()}
                        </span>
                    </Link> 

                    <button onClick={() => setVisible(true)} className='sm:hidden p-1 text-brand-black'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
                    </button> 
                </div>
            </div>

            {/* Sidebar menu for small screens */}
            <AnimatePresence>
            {visible && (
                <>
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-brand-black/40 backdrop-blur-sm z-40 sm:hidden"
                        onClick={() => setVisible(false)}
                    />
                    <motion.div 
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white z-50 shadow-large overflow-y-auto sm:hidden"
                    >
                        <div className='p-6'>
                            <div className='flex items-center justify-between mb-8'>
                                <span className='font-display font-semibold text-xl'>Menu</span>
                                <button onClick={() => setVisible(false)} className='p-2 -mr-2 text-neutral-500 hover:text-brand-black bg-neutral-100 rounded-full'>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                </button>
                            </div>
                            
                            <nav className='flex flex-col gap-2'>
                                <NavLink to='/' className={({isActive}) => `px-4 py-3 rounded-xl text-base font-medium transition-colors ${isActive ? 'bg-brand-black text-white' : 'text-neutral-600 hover:bg-neutral-50'}`}>Home</NavLink>
                                <NavLink to='/collection' className={({isActive}) => `px-4 py-3 rounded-xl text-base font-medium transition-colors ${isActive ? 'bg-brand-black text-white' : 'text-neutral-600 hover:bg-neutral-50'}`}>Collection</NavLink>
                                <NavLink to='/about' className={({isActive}) => `px-4 py-3 rounded-xl text-base font-medium transition-colors ${isActive ? 'bg-brand-black text-white' : 'text-neutral-600 hover:bg-neutral-50'}`}>About Us</NavLink>
                                <NavLink to='/exclusive' className={({isActive}) => `px-4 py-3 rounded-xl text-base font-medium transition-colors ${isActive ? 'bg-brand-black text-white' : 'text-neutral-600 hover:bg-neutral-50'}`}>Exclusive</NavLink>
                                <NavLink to='/contact' className={({isActive}) => `px-4 py-3 rounded-xl text-base font-medium transition-colors ${isActive ? 'bg-brand-black text-white' : 'text-neutral-600 hover:bg-neutral-50'}`}>Contact</NavLink>
                            </nav>

                            {!token && (
                                <div className='mt-8 pt-8 border-t border-neutral-100'>
                                    <Link to='/login' className='btn-primary w-full'>Login / Register</Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
            </AnimatePresence>
        </header>
    )
}

export default Navbar
