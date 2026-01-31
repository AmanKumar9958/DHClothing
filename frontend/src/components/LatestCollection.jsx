import { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import ProductItem from './ProductItem';
import LoadingSpinner from './LoadingSpinner';
import { Link } from 'react-router-dom';

const LatestCollection = () => {

  const { products, loading } = useContext(ShopContext);
    const [latestProducts,setLatestProducts] = useState([]);

  useEffect(()=>{
    setLatestProducts(products.slice(0,5));
  },[products])

  return (
    <div className='my-10'>
      <div className='text-center py-8 text-3xl'>
          <Title text1={'LATEST'} text2={'COLLECTIONS'} />
          <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
          Explore all the latest trends in our newest collection, featuring fresh styles and designs to elevate your wardrobe.
          </p>
      </div>

      {/* Rendering Products */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
            {
              latestProducts.map((item,index)=>(
                <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price} />
              ))
            }
          </div>
          <div className='w-full text-center mt-10'>
            <Link to='/collection' className='bg-black text-white px-8 py-3 text-sm active:bg-gray-700 rounded-xl hover:scale-115 transition-all duration-300 '>
              SHOP NOW
            </Link>
          </div>
        </>
      )}
    </div>
  )
}

export default LatestCollection
