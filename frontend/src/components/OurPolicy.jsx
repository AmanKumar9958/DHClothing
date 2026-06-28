import React from 'react'
import FadeIn, { FadeInItem } from './FadeIn'

const OurPolicy = () => {
  const policies = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
      ),
      title: "Easy Exchange Policy",
      description: "We offer a hassle-free exchange policy."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M2.13 15.57a9 9 0 0 0 10.59 6.25M21.5 8a9 9 0 0 0-14.86-5.83L2.5 6"></path><path d="M2.5 22v-6h6M21.87 8.43a9 9 0 0 0-10.59-6.25M2.5 16a9 9 0 0 0 14.86 5.83L21.5 18"></path></svg>
      ),
      title: "7 Days Return Policy",
      description: "We provide 7 days free return policy."
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
      ),
      title: "Best Customer Support",
      description: "We provide 24/7 customer support."
    }
  ]

  return (
    <section className='py-20 border-y border-neutral-100 bg-white'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <FadeIn stagger={0.2} direction="up" distance={20}>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8'>
            {policies.map((policy, index) => (
              <FadeInItem key={index} className='flex flex-col items-center text-center group'>
                <div className='w-16 h-16 mb-6 rounded-2xl bg-neutral-50 flex items-center justify-center text-brand-black group-hover:bg-brand-black group-hover:text-brand-gold transition-colors duration-300 shadow-sm group-hover:shadow-soft-lg'>
                  {policy.icon}
                </div>
                <h3 className='font-display text-xl font-medium mb-3 text-brand-black'>{policy.title}</h3>
                <p className='text-neutral-500 text-sm max-w-xs'>{policy.description}</p>
              </FadeInItem>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

export default OurPolicy
