import { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import ProductItem from './ProductItem';
import LoadingSpinner from './LoadingSpinner';
import { Link } from 'react-router-dom';
import FadeIn, { FadeInItem } from './FadeIn';

const LatestCollection = () => {

  const { products, loading } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    setLatestProducts(products.slice(0, 10));
  }, [products])

  return (
    <section className='py-24 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='flex flex-col items-center mb-16'>
                <Title text1='LATEST' text2='COLLECTIONS' centered />
                <p className='text-neutral-600 text-lg sm:text-xl text-center max-w-2xl mt-4 font-medium'>
                Explore all the latest trends in our newest collection, featuring fresh styles and designs to elevate your wardrobe.
                </p>
            </div>

            {loading ? (
                <LoadingSpinner />
            ) : (
                <>
                <FadeIn stagger={0.05} direction="up" distance={30}>
                    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-10 sm:gap-x-6'>
                        {latestProducts.map((item, index) => (
                            <FadeInItem key={index}>
                                <ProductItem id={item._id} image={item.image} name={item.name} price={item.price} />
                            </FadeInItem>
                        ))}
                    </div>
                </FadeIn>
                
                <div className='mt-16 flex justify-center'>
                    <Link to='/collection' className='btn-secondary'>
                        View All Products
                    </Link>
                </div>
                </>
            )}
        </div>
    </section>
  )
}

export default LatestCollection
