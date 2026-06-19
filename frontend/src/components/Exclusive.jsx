import { useContext, useMemo } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import ProductItem from './ProductItem'
import { Link } from 'react-router-dom'
import LoadingSpinner from './LoadingSpinner'
import FadeIn, { FadeInItem } from './FadeIn'

const Exclusive = () => {
  const { products, loading } = useContext(ShopContext)
  const exclusive = useMemo(() => (products || []).filter(p => p.exclusive), [products])
  const top = exclusive.slice(0, 4)

  if (loading) return <LoadingSpinner />
  if (top.length === 0) return null

  return (
    <section className='py-24 bg-brand-cream relative overflow-hidden'>
      {/* Background decoration */}
      <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-brand-gold/10 blur-[100px]"></div>
      <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-brand-gold/10 blur-[100px]"></div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
        <div className='flex flex-col items-center mb-16'>
          <Title text1='EXCLUSIVE' text2='PICKS' centered />
          <p className='text-neutral-600 text-lg sm:text-xl text-center max-w-2xl mt-4 font-medium'>
            Handpicked premium items available only to our exclusive members.
          </p>
        </div>

        <FadeIn stagger={0.1}>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
            {top.map((item, idx) => (
              <FadeInItem key={idx}>
                <ProductItem id={item._id} image={item.image} name={item.name} price={item.price} />
              </FadeInItem>
            ))}
          </div>
        </FadeIn>

        {exclusive.length > 4 && (
          <div className='mt-16 flex justify-center'>
            <Link to='/exclusive' className='btn-gold'>
              Discover More
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

export default Exclusive
