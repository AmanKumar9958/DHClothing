import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import LazyImage from '../components/LazyImage'
import FadeIn, { FadeInItem } from '../components/FadeIn'

const About = () => {
  return (
    <div className='min-h-screen bg-brand-cream pb-24'>
        {/* Hero Section */}
        <div className='bg-brand-black text-white py-20 px-4 text-center'>
            <FadeIn>
                <div className='max-w-3xl mx-auto'>
                    <Title text1='OUR' text2='STORY' centered light />
                    <p className='text-neutral-400 text-lg sm:text-xl font-light leading-relaxed'>
                        Redefining modern luxury through accessible, timeless pieces that elevate your everyday wardrobe.
                    </p>
                </div>
            </FadeIn>
        </div>

        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20'>
            {/* Main Content */}
            <FadeIn stagger={0.2} direction="up" distance={30}>
                <div className='flex flex-col lg:flex-row gap-16 items-center mb-32'>
                    <FadeInItem className='lg:w-1/2'>
                        <div className='relative rounded-3xl overflow-hidden aspect-[4/5] shadow-soft-lg'>
                            <LazyImage 
                                className='w-full h-full object-cover transition-transform duration-1000 hover:scale-105' 
                                src={assets.about_img} 
                                alt="About DH Clothing" 
                                skeletonClass="w-full h-full"
                            />
                        </div>
                    </FadeInItem>
                    
                    <FadeInItem className='lg:w-1/2 flex flex-col gap-8 text-neutral-600 leading-relaxed text-lg font-light'>
                        <div>
                            <h2 className='font-display text-3xl font-medium text-brand-black mb-6'>The Genesis</h2>
                            <p className='mb-4'>
                                DH Clothing was born out of a passion for innovation and a desire to revolutionize the way people shop for modern fashion. Our journey began with a simple idea: to provide a platform where customers can easily discover, explore, and purchase premium apparel without the luxury markup.
                            </p>
                            <p>
                                Since our inception, we've worked tirelessly to curate a diverse selection of high-quality products that cater to every taste. From everyday essentials to statement pieces, we focus on craftsmanship and enduring style.
                            </p>
                        </div>
                        
                        <div>
                            <h2 className='font-display text-3xl font-medium text-brand-black mb-6'>Our Mission</h2>
                            <p className='pl-6 border-l-2 border-brand-gold italic text-brand-black/80 font-medium'>
                                "To empower our community with choice, convenience, and confidence through a seamless and inspiring shopping experience."
                            </p>
                        </div>
                    </FadeInItem>
                </div>
            </FadeIn>

            {/* Why Choose Us */}
            <div className='bg-white rounded-3xl p-10 sm:p-16 shadow-soft border border-neutral-100'>
                <FadeIn>
                    <div className='text-center mb-16'>
                        <Title text1={'WHY'} text2={'CHOOSE US'} centered />
                        <p className='text-neutral-500 mt-4 max-w-2xl mx-auto'>We are committed to delivering excellence in every aspect of your shopping journey.</p>
                    </div>
                </FadeIn>

                <FadeIn stagger={0.15}>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-16'>
                        <FadeInItem className='flex flex-col items-center text-center'>
                            <div className='w-16 h-16 rounded-2xl bg-brand-gold/10 text-brand-gold flex items-center justify-center mb-6'>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                            </div>
                            <h3 className='font-display text-xl font-semibold text-brand-black mb-4'>Quality Assurance</h3>
                            <p className='text-neutral-500'>We meticulously select and vet each product to ensure it meets our stringent quality and durability standards.</p>
                        </FadeInItem>
                        
                        <FadeInItem className='flex flex-col items-center text-center'>
                            <div className='w-16 h-16 rounded-2xl bg-brand-gold/10 text-brand-gold flex items-center justify-center mb-6'>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="8" width="18" height="12" rx="2"/><path d="M12 8v12"/><path d="M16 8V6a2 2 0 0 0-2-2H10a2 2 0 0 0-2 2v2"/></svg>
                            </div>
                            <h3 className='font-display text-xl font-semibold text-brand-black mb-4'>Convenience</h3>
                            <p className='text-neutral-500'>With our user-friendly interface and hassle-free ordering process, premium shopping has never been easier.</p>
                        </FadeInItem>
                        
                        <FadeInItem className='flex flex-col items-center text-center'>
                            <div className='w-16 h-16 rounded-2xl bg-brand-gold/10 text-brand-gold flex items-center justify-center mb-6'>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                            </div>
                            <h3 className='font-display text-xl font-semibold text-brand-black mb-4'>Exceptional Support</h3>
                            <p className='text-neutral-500'>Our team of dedicated professionals is here to assist you every step of the way, ensuring your complete satisfaction.</p>
                        </FadeInItem>
                    </div>
                </FadeIn>
            </div>
        </div>
    </div>
  )
}

export default About
