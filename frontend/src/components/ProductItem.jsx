import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import {Link} from 'react-router-dom'
import LazyImage from './LazyImage'

const ProductItem = ({id,image,name,price}) => {
    
    const {currency} = useContext(ShopContext);

  return (
    <Link onClick={()=>scrollTo(0,0)} className='text-gray-700 cursor-pointer' to={`/product/${id}`}>
      <div className=' overflow-hidden relative'>
        <LazyImage 
          className=''
          wrapperClassName='hover:scale-110 transition-all ease-in-out duration-300'
          src={image[0]} 
          alt={name} 
          skeletonClass="w-full h-64"
        />
        <div className='absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow-md z-10'>
          70% OFF
        </div>
      </div>
      <p className='pt-3 pb-1 text-sm'>{name}</p>
      <p className=' text-sm font-medium'>{currency}{price}</p>
    </Link>
  )
}

export default ProductItem
