import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import LazyImage from '../components/LazyImage'
import FadeIn, { FadeInItem } from '../components/FadeIn'

const Contact = () => {
  return (
    <div className='min-h-screen bg-brand-cream pb-24'>
      {/* Hero Section */}
      <div className='bg-brand-black text-white py-20 px-4 text-center'>
          <FadeIn>
              <div className='max-w-3xl mx-auto'>
                  <Title text1='CONTACT' text2='US' centered light />
                  <p className='text-neutral-400 text-lg sm:text-xl font-light leading-relaxed'>
                      We're here to help. Reach out to us for any inquiries, support, or feedback.
                  </p>
              </div>
          </FadeIn>
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20'>
          <FadeIn stagger={0.2} direction="up" distance={30}>
            <div className='flex flex-col lg:flex-row gap-16 items-center'>
              
              {/* Image Side */}
              <FadeInItem className='lg:w-1/2 w-full'>
                <div className='relative rounded-3xl overflow-hidden aspect-[4/3] shadow-soft-lg'>
                  <LazyImage 
                      className='w-full h-full object-cover transition-transform duration-1000 hover:scale-105' 
                      src={assets.contact_img} 
                      alt="Contact DH Clothing" 
                      skeletonClass="w-full h-full"
                  />
                </div>
              </FadeInItem>

              {/* Info Side */}
              <FadeInItem className='lg:w-1/2 w-full'>
                <div className='bg-white rounded-3xl p-10 sm:p-14 shadow-soft border border-neutral-100 h-full flex flex-col justify-center'>
                  
                  <div className='mb-12'>
                    <div className='flex items-center gap-4 mb-4 text-brand-gold'>
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      <h2 className='font-display text-2xl font-semibold text-brand-black'>Our Store</h2>
                    </div>
                    <p className='text-neutral-600 text-lg font-light leading-relaxed pl-12'>
                      WZ-16 E, Gali No-1, Santgarh,<br />
                      New Delhi-110018
                    </p>
                  </div>

                  <div className='mb-12'>
                    <div className='flex items-center gap-4 mb-4 text-brand-gold'>
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                      <h2 className='font-display text-2xl font-semibold text-brand-black'>Get in Touch</h2>
                    </div>
                    <p className='text-neutral-600 text-lg font-light leading-relaxed pl-12'>
                      <span className='block mb-2'>+91 9315631808</span>
                      <a href="mailto:dhclothing2025@gmail.com" className='text-brand-black font-medium hover:text-brand-gold transition-colors'>dhclothing2025@gmail.com</a>
                    </p>
                  </div>

                  <div className='pt-8 border-t border-neutral-100'>
                    <p className='text-neutral-500 font-light text-sm'>
                      Customer service hours: Mon-Fri, 9am - 6pm IST. <br/>
                      We aim to respond to all inquiries within 24 hours.
                    </p>
                  </div>

                </div>
              </FadeInItem>

            </div>
          </FadeIn>
      </div>
    </div>
  )
}

export default Contact
