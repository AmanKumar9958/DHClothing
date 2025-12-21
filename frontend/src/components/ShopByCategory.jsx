import React, { useContext } from 'react'
import Title from './Title'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'

const ShopByCategory = () => {
  const { products } = useContext(ShopContext);

  const categories = [
    { name: 'Hoodie', value: 'Hoodie', image: products.length > 0 ? products[0].image[0] : '' }, 
    { name: 'Regular Fit', value: 'Regular fit', image: products.length > 1 ? products[1].image[0] : '' }, 
    { name: 'Winter Wear', value: 'Winterwear', image: products.length > 2 ? products[2].image[0] : '' }, 
    { name: 'Oversize', value: 'Oversize', image: products.length > 3 ? products[3].image[0] : '' }, 
  ]

  return (
    <div className='my-10'>
      <div className='text-center py-8 text-3xl'>
        <Title text1={'SHOP BY'} text2={'CATEGORY'} />
        <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
          Browse through our diverse categories to find the perfect fit for your style.
        </p>
      </div>
      <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 gap-y-6'>
        {categories.map((item, index) => (
          <Link key={index} to='/collection' state={{ subCategory: item.value }} className='cursor-pointer flex flex-col items-center gap-2'>
             <div className='overflow-hidden w-3/4 aspect-square bg-gray-100 rounded-lg'>
                {item.image && <img src={item.image} alt={item.name} className='hover:scale-110 transition ease-in-out w-full h-full object-cover duration-300' />}
             </div>
             <p className='text-sm md:text-base font-medium mt-2'>{item.name}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default ShopByCategory
