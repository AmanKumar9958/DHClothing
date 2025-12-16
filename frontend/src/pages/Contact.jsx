import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import LazyImage from '../components/LazyImage'

const Contact = () => {
  return (
    <div>
      
      <div className='text-center text-2xl pt-10 border-t'>
          <Title text1={'CONTACT'} text2={'US'} />
      </div>

      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>
        <LazyImage 
            className='w-full h-full object-cover' 
            wrapperClassName='w-full md:max-w-[480px]'
            src={assets.contact_img} 
            alt="Contact Us" 
            skeletonClass="w-full h-96"
        />
        <div className='flex flex-col justify-center items-start gap-6'>
          <p className='font-semibold text-xl text-gray-600'>Our Store</p>
          <p className=' text-gray-500'>WZ-16 E, Gali No-1, Santgarh,<br />New Delhi-110018</p>
          <p className='font-semibold text-xl text-gray-600'>Contact Us at</p>
          <p className=' text-gray-500'>+91 9717944746 <br /> Email: dhclothing2025@gmail.com</p>
        </div>
      </div>
    </div>
  )
}

export default Contact
