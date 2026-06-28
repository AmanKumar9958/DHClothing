import { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import ProductItem from './ProductItem';
import LoadingSpinner from './LoadingSpinner';
import FadeIn, { FadeInItem } from './FadeIn';

const RelatedProducts = ({category,subCategory}) => {

    const { products, loading } = useContext(ShopContext);
    const [related,setRelated] = useState([]);

  useEffect(()=>{

    if (products.length > 0) {
      let productsCopy = products.slice();
      productsCopy = productsCopy.filter((item) => category === item.category);
      productsCopy = productsCopy.filter((item) => subCategory === item.subCategory);
      productsCopy = productsCopy.filter((item) => !item.exclusive);

      setRelated(productsCopy.slice(0,4));
    }
        
  },[products, category, subCategory])

  if (loading) return null;
  if (related.length === 0) return null;

  return (
    <div className='w-full'>
      <div className='flex flex-col items-center mb-12'>
        <Title text1='RELATED' text2='PRODUCTS' centered />
        <p className='text-neutral-500 text-sm mt-2'>Explore similar styles you might like.</p>
      </div>

      <FadeIn stagger={0.1}>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6'>
          {related.map((item,index)=>(
            <FadeInItem key={index}>
                <ProductItem id={item._id} name={item.name} price={item.price} image={item.image}/>
            </FadeInItem>
          ))}
        </div>
      </FadeIn>
    </div>
  )
}
export default RelatedProducts

RelatedProducts.propTypes = {
  category: PropTypes.string,
  subCategory: PropTypes.string,
}
