import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'
import LazyImage from './LazyImage'

const ProductItem = ({ id, image, name, price }) => {
  const { currency } = useContext(ShopContext);

  return (
    <Link 
      onClick={() => scrollTo(0, 0)} 
      className='group block bg-white rounded-2xl p-2 sm:p-3 shadow-sm hover:shadow-md transition-all duration-300 border border-neutral-100' 
      to={`/product/${id}`}
    >
      {/* Image Container */}
      <div className='relative overflow-hidden rounded-xl bg-neutral-100 aspect-[3/4]'>
        <LazyImage
          className='w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105'
          wrapperClassName='w-full h-full'
          src={image[0]}
          alt={name}
          skeletonClass="w-full h-full"
        />
        {/* Hover overlay */}
        <div className='absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500'></div>
        
        {/* Quick view */}
        <div className='absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out-expo'>
          <div className='bg-white/95 backdrop-blur-sm text-brand-black text-center py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider'>
            Quick View
          </div>
        </div>

        {/* Badge */}
        <div className='absolute top-3 left-3 bg-brand-black text-white text-[10px] font-semibold px-2.5 py-1 rounded-full tracking-wider uppercase'>
          Sale
        </div>
      </div>

      {/* Product Info */}
      <div className='pt-3.5 pb-1'>
        <p className='text-body-sm text-neutral-600 group-hover:text-brand-black transition-colors duration-300 line-clamp-1'>
          {name}
        </p>
        <p className='text-body-sm font-semibold text-brand-black mt-0.5'>
          {currency}{price}
        </p>
      </div>
    </Link>
  )
}

export default ProductItem
