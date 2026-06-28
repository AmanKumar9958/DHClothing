import { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import ProductItem from './ProductItem';
import LoadingSpinner from './LoadingSpinner';
import FadeIn, { FadeInItem } from './FadeIn';

const BestSeller = () => {
    const { products, loading } = useContext(ShopContext);
    const [bestSeller, setBestSeller] = useState([]);

    useEffect(() => {
        const bestProduct = (products || []).filter((item) => (item.bestseller));
        setBestSeller(bestProduct.slice(0, 5))
    }, [products])

    return (
        <section className='py-24 bg-brand-cream'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex flex-col items-center mb-16'>
                    <Title text1='BEST' text2='SELLING' centered />
                    <p className='text-neutral-500 text-center max-w-2xl mt-4'>
                        Explore our top-selling products that customers love. Handpicked for quality and value.
                    </p>
                </div>

                {loading ? (
                    <LoadingSpinner />
                ) : (
                    <FadeIn stagger={0.05} direction="up" distance={30}>
                        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-10 sm:gap-x-6'>
                            {bestSeller.map((item, index) => (
                                <FadeInItem key={index}>
                                    <ProductItem id={item._id} name={item.name} image={item.image} price={item.price} />
                                </FadeInItem>
                            ))}
                        </div>
                    </FadeIn>
                )}
            </div>
        </section>
    )
}

export default BestSeller
