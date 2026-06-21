import { useContext, useMemo } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import ProductItem from '../components/ProductItem'
import LoadingSpinner from '../components/LoadingSpinner'
import FadeIn, { FadeInItem } from '../components/FadeIn'
import { Link } from 'react-router-dom'

const ExclusivePage = () => {
  const { products, loading, token } = useContext(ShopContext)
  const exclusive = useMemo(() => (products || []).filter(p => p.exclusive), [products])

  if (!token) {
    return (
      <div className='min-h-screen bg-brand-black text-white flex flex-col items-center justify-center text-center p-4 relative overflow-hidden'>
        <div className="absolute top-0 right-0 w-[50%] h-[50%] rounded-full bg-brand-gold/10 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[50%] h-[50%] rounded-full bg-brand-gold/10 blur-[120px] pointer-events-none"></div>
        
        <FadeIn className="relative z-10 max-w-lg">
          <div className='w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10 shadow-lg shadow-black/50'>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-brand-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>
          <Title text1='MEMBERS' text2='ONLY' centered light />
          <p className='text-neutral-400 text-lg mb-8'>
            Our exclusive drops are reserved for registered members. Please log in or create an account to view and purchase these rare finds.
          </p>
          <Link to="/login" className="btn-gold inline-block">
            Log In / Register
          </Link>
        </FadeIn>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-brand-black text-white relative overflow-hidden pb-24'>
        {/* Background ambient light */}
        <div className="absolute top-0 right-0 w-[50%] h-[50%] rounded-full bg-brand-gold/10 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[50%] h-[50%] rounded-full bg-brand-gold/10 blur-[120px] pointer-events-none"></div>

        {/* Hero Section */}
        <div className='relative z-10 pt-24 pb-16 px-4 text-center border-b border-white/10'>
            <FadeIn>
                <div className='max-w-3xl mx-auto'>
                    <Title text1='EXCLUSIVE' text2='DROPS' centered light />
                    <p className='text-neutral-400 text-lg sm:text-xl font-light leading-relaxed'>
                        Handpicked premium items available in limited quantities. Elevate your collection with these rare finds.
                    </p>
                </div>
            </FadeIn>
        </div>

        <div className='max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10'>
            {loading ? (
                <div className='h-64 flex items-center justify-center'>
                    <LoadingSpinner />
                </div>
            ) : exclusive.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className='w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-brand-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                    </div>
                    <h3 className='font-display text-2xl font-semibold mb-2'>No exclusives right now</h3>
                    <p className='text-neutral-400 max-w-sm'>We are working on bringing more premium drops. Please check back later.</p>
                </div>
            ) : (
                <FadeIn stagger={0.1} direction="up" distance={30}>
                    <div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8'>
                        {exclusive.map((item, index) => (
                        <FadeInItem key={index}>
                            <ProductItem name={item.name} id={item._id} price={item.price} image={item.image} />
                        </FadeInItem>
                        ))}
                    </div>
                </FadeIn>
            )}
        </div>
    </div>
  )
}

export default ExclusivePage
