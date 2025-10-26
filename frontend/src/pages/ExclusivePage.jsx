import { useContext, useMemo } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import ProductItem from '../components/ProductItem'

const ExclusivePage = () => {
  const { products } = useContext(ShopContext)
  const exclusive = useMemo(() => (products || []).filter(p => p.exclusive), [products])

  return (
    <div className='pt-10 border-t'>
      <div className='flex justify-between text-base sm:text-2xl mb-6'>
        <Title text1={'ALL'} text2={'EXCLUSIVES'} />
      </div>

      {exclusive.length === 0 ? (
        <p className='text-gray-600'>No exclusive items available right now. Please check back later.</p>
      ) : (
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
          {exclusive.map((item, index) => (
            <ProductItem key={index} name={item.name} id={item._id} price={item.price} image={item.image} />
          ))}
        </div>
      )}
    </div>
  )
}

export default ExclusivePage
