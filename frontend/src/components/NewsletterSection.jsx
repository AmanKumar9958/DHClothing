import React, { useState } from 'react'
import { toast } from 'react-toastify'
import Title from './Title'
import FadeIn from './FadeIn'

const NewsletterSection = () => {
    const [email, setEmail] = useState('')

    const onSubmitHandler = (event) => {
        event.preventDefault();
        if(email) {
            toast.success("Thank you for subscribing!");
            setEmail('');
        }
    }

    return (
        <section className='py-24 bg-brand-cream relative overflow-hidden'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
                <FadeIn direction="up" distance={30} className='max-w-2xl mx-auto text-center'>
                    <Title text1='SUBSCRIBE &' text2='SAVE 20%' centered />
                    <p className='text-neutral-500 mt-4 mb-8 text-lg'>
                        Join our exclusive mailing list and get 20% off your first order. 
                        Be the first to know about new arrivals and sales.
                    </p>
                    <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row gap-3 max-w-xl mx-auto'>
                        <div className="relative flex-1">
                            <input 
                                className='w-full px-6 py-4 bg-white border border-neutral-200 rounded-full focus-ring text-brand-black placeholder:text-neutral-400' 
                                type="email" 
                                placeholder='Enter your email address' 
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <button type='submit' className='btn-primary rounded-full !px-8 py-4 shrink-0 shadow-soft-lg'>
                            Subscribe
                        </button>
                    </form>
                    <p className="text-xs text-neutral-400 mt-4">By subscribing you agree to our Terms & Conditions and Privacy Policy.</p>
                </FadeIn>
            </div>
            
            {/* Decorative circles */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-64 h-64 border border-brand-gold/20 rounded-full"></div>
            <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 border border-brand-gold/20 rounded-full"></div>
        </section>
    )
}

export default NewsletterSection
