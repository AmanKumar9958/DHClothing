import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const SearchBar = () => {

    const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);
    const [visible, setVisible] = useState(false);
    const [localSearch, setLocalSearch] = useState(search);
    const location = useLocation();

    // Debounce logic
    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== localSearch) {
                setSearch(localSearch);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [localSearch]);

    // Sync external search changes (e.g., clearing search)
    useEffect(() => {
        if (search !== localSearch) {
            setLocalSearch(search);
        }
    }, [search]);

    useEffect(() => {
        if (location.pathname.includes('collection')) {
            setVisible(true);
        }
        else {
            setVisible(false)
        }
    }, [location])

    return (
      <AnimatePresence>
        {showSearch && visible && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className='fixed top-[70px] left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-100 py-4 shadow-sm'
          >
            <div className='max-w-xl mx-auto px-4'>
              <div className='flex items-center gap-3 bg-neutral-50 border border-neutral-200 rounded-full px-5 py-3 focus-within:border-brand-black focus-within:bg-white transition-all duration-300'>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-neutral-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input 
                  value={localSearch} 
                  onChange={(e) => setLocalSearch(e.target.value)} 
                  className='flex-1 outline-none border-none focus:ring-0 bg-transparent text-body-sm text-brand-black placeholder:text-neutral-400' 
                  type="text" 
                  placeholder='Search products...'
                  autoFocus
                />
                <button 
                  onClick={() => setShowSearch(false)} 
                  className='p-1 hover:bg-neutral-200 rounded-full transition-colors'
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-neutral-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    )
}

export default SearchBar
