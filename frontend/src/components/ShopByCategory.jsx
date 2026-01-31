import React, { useContext } from 'react'
import Title from './Title'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'

const ShopByCategory = () => {
  const { products } = useContext(ShopContext);

  if (!products || products.length === 0) {
    return null;
  }

  const definedCategories = [
    { name: 'Hoodie', value: 'Hoodie' }, 
    { name: 'Regular Fit', value: 'Regular fit' }, 
    { name: 'Winter Wear', value: 'Winterwear' }, 
    { name: 'Oversize', value: 'Oversize' }, 
  ];

  const categories = definedCategories.reduce((acc, cat) => {
    // Find a product that matches this category
    const matchingProduct = products.find(p => p.subCategory === cat.value);
    
    if (matchingProduct) {
      acc.push({
        ...cat,
        image: matchingProduct.image && matchingProduct.image.length > 0 ? matchingProduct.image[0] : ''
      });
    }
    return acc;
  }, []);

  if (categories.length === 0) {
      return null;
  }

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
