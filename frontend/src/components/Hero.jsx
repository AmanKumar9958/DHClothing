import React from 'react'
import { assets } from '../assets/assets'
import LazyImage from './LazyImage'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <div className='relative w-full h-[60vh] sm:h-[80vh] overflow-hidden'>
      {/* Background Image */}
      <div className='absolute inset-0 w-full h-full'>
        <LazyImage 
            className='w-full h-full object-cover' 
            wrapperClassName='w-full h-full'
            src={assets.hero_webp} 
            alt="Hero Image" 
            skeletonClass="w-full h-full"
        />
      </div>

      {/* Overlay Content */}
      <div className='absolute inset-0 flex items-center justify-center bg-black/30'>
            <div className='text-white text-center px-4 max-w-3xl'>
                <div className='flex items-center justify-center gap-2 mb-2'>
                    <p className='w-8 md:w-11 h-[2px] bg-white'></p>
                    <p className='font-medium text-sm md:text-base uppercase'>Our Bestselling</p>
                    <p className='w-8 md:w-11 h-[2px] bg-white'></p>
                </div>
                <h1 className='prata-regular text-4xl sm:text-5xl lg:text-6xl leading-relaxed mb-4'>Latest Arrivals</h1>
                <p className='text-base md:text-lg text-gray-100 mb-8'>
                    Discover the latest trends in fashion with our new collection. Quality comfort and style for every occasion.
                </p>
                <div>
                    <Link to='/collection' className='bg-white text-black px-8 py-3 text-sm font-semibold hover:bg-gray-200 transition-colors rounded-xl'>SHOP NOW</Link>
                </div>
            </div>
      </div>
    </div>
  )
}

export default Hero
