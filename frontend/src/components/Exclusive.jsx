import { useContext, useMemo } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import ProductItem from './ProductItem'
import { Link } from 'react-router-dom'
import LoadingSpinner from './LoadingSpinner'

const Exclusive = () => {
  const { products, loading } = useContext(ShopContext)
  const exclusive = useMemo(() => (products || []).filter(p => p.exclusive), [products])
  const top = exclusive.slice(0, 4)

  if (loading) return <LoadingSpinner />
  if (top.length === 0) return null

  return (
    <div className='my-10'>
      <div className='text-center py-8 text-3xl'>
        <Title text1={'EXCLUSIVE'} text2={'PICKS'} />
        <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
          Handpicked exclusive items available only here.
        </p>
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 gap-y-6'>
        {top.map((item, idx) => (
          <ProductItem key={idx} id={item._id} image={item.image} name={item.name} price={item.price} />
        ))}
      </div>

      {exclusive.length > 4 && (
        <div className='text-center mt-6'>
          <Link to='/exclusive' className='inline-block px-6 py-2 border border-black hover:bg-black hover:text-white transition'>
            See all exclusive items
          </Link>
        </div>
      )}
    </div>
  )
}

export default Exclusive
