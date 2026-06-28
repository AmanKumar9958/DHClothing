import React from 'react'
import { assets } from '../assets/assets'
import LazyImage from './LazyImage'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import FadeIn, { FadeInItem } from './FadeIn'

const Hero = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 400]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <div className='relative w-full h-[85vh] min-h-[600px] overflow-hidden bg-[#0a0a0a] bg-brand-black flex items-center justify-center'>
      {/* Parallax Background Image */}
      <motion.div 
        className='absolute inset-0 w-full h-full'
        style={{ y, opacity }}
      >
        <LazyImage 
            className='w-full h-full object-cover opacity-50' 
            wrapperClassName='w-full h-full'
            src={assets.hero_webp} 
            alt="New Collection Hero" 
            skeletonClass="w-full h-full bg-brand-black"
        />
        {/* Gradient overlay for better text readability */}
        <div className='absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-black/60'></div>
      </motion.div>

      {/* Hero Content */}
      <div className='relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
        <FadeIn stagger={0.15} direction="up" distance={40} duration={0.8}>
            
            <FadeInItem className="flex items-center justify-center gap-4 mb-6">
                <span className='w-12 h-px bg-brand-gold'></span>
                <span className='text-brand-gold font-medium tracking-[0.2em] text-xs uppercase'>Premium Collection</span>
                <span className='w-12 h-px bg-brand-gold'></span>
            </FadeInItem>

            <FadeInItem>
                <h1 className='font-display text-white text-5xl sm:text-6xl md:text-7xl lg:text-[5rem] leading-[1.1] mb-6'>
                    Elevate Your <br />
                    <span className='text-brand-gold italic'>Everyday Style</span>
                </h1>
            </FadeInItem>

            <FadeInItem>
                <p className='text-neutral-300 text-body-lg sm:text-lg max-w-2xl mx-auto mb-10 font-light'>
                    Discover the latest trends in fashion with our curated collections. 
                    Quality craftsmanship, timeless designs, and comfort for every occasion.
                </p>
            </FadeInItem>

            <FadeInItem>
                <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
                    <Link to='/collection' className='btn-gold w-full sm:w-auto'>
                        Explore Collection
                    </Link>
                    <Link to='/exclusive' className='btn-secondary !text-white !border-white hover:!bg-white hover:!text-brand-black w-full sm:w-auto'>
                        View Exclusives
                    </Link>
                </div>
            </FadeInItem>
            
        </FadeIn>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        className='absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <span className='text-[10px] uppercase tracking-widest'>Scroll</span>
        <div className='w-px h-12 bg-white/20 relative overflow-hidden'>
            <motion.div 
                className='absolute top-0 left-0 w-full h-1/3 bg-white'
                animate={{ y: [0, 48, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            />
        </div>
      </motion.div>
    </div>
  )
}

export default Hero
