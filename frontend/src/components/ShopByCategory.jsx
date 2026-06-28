import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'
import Title from './Title'
import FadeIn, { FadeInItem } from './FadeIn'

const ShopByCategory = () => {
  const { products } = useContext(ShopContext);

  if (!products || products.length === 0) {
    return null;
  }

  const definedCategories = [
    { name: 'Menswear', value: 'Men', filterKey: 'category' }, 
    { name: 'Womenswear', value: 'Women', filterKey: 'category' }, 
    { name: 'Kids', value: 'Kids', filterKey: 'category' }, 
    { name: 'Winterwear', value: 'Winterwear', filterKey: 'subCategory' }, 
  ];

  const categories = definedCategories.reduce((acc, cat) => {
    const matchingProduct = products.find(p => p[cat.filterKey] === cat.value);
    if (matchingProduct) {
      acc.push({
        ...cat,
        image: matchingProduct.image && matchingProduct.image.length > 0 ? matchingProduct.image[0] : ''
      });
    }
    return acc;
  }, []);

  if (categories.length === 0) return null;

  return (
    <section className='py-24 bg-brand-cream'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex flex-col items-center mb-16'>
            <Title text1='SHOP BY' text2='CATEGORY' centered />
            <p className='text-neutral-500 text-center max-w-2xl mt-4'>
              Browse through our diverse categories to find the perfect fit for your style.
            </p>
        </div>

        <FadeIn stagger={0.1}>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
                {categories.map((item, index) => (
                    <FadeInItem key={index}>
                        <Link 
                            to='/collection' 
                            state={{ [item.filterKey]: item.value }} 
                            className='group block relative overflow-hidden rounded-2xl aspect-[4/5]'
                        >
                            <img 
                                src={item.image} 
                                alt={item.name} 
                                className='w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110' 
                            />
                            
                            {/* Gradient Overlay */}
                            <div className='absolute inset-0 bg-gradient-to-t from-brand-black/80 via-brand-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500'></div>
                            
                            {/* Content */}
                            <div className='absolute inset-0 p-8 flex flex-col justify-end'>
                                <h3 className='font-display text-white text-2xl font-medium mb-2'>{item.name}</h3>
                                <div className='flex items-center text-brand-gold text-sm font-semibold tracking-wider group-hover:translate-x-2 transition-transform duration-300'>
                                    <span>EXPLORE</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                                </div>
                            </div>
                        </Link>
                    </FadeInItem>
                ))}
            </div>
        </FadeIn>
      </div>
    </section>
  )
}

export default ShopByCategory
