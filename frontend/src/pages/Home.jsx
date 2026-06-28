import React from 'react'
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import ShopByCategory from '../components/ShopByCategory'
import Exclusive from '../components/Exclusive'
import NewsletterSection from '../components/NewsletterSection'
import TestimonialsSection from '../components/TestimonialsSection'

const Home = () => {
  return (
    <div className='flex flex-col'>
      {/* We removed FadeIn wrappers around sections here because 
          the sections themselves now handle their own scroll-triggered 
          FadeIn and staggering for a much more premium effect. */}
      <Hero />
      <ShopByCategory />
      <LatestCollection />
      <Exclusive />
      <BestSeller />
      <TestimonialsSection />
      <OurPolicy />
      <NewsletterSection />
    </div>
  )
}

export default Home
