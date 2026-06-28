import React from 'react'

const Title = ({ text1, text2, centered = false, light = false }) => {
  return (
    <div className={`flex items-center gap-3 mb-4 ${centered ? 'justify-center' : ''}`}>
      <h2 className={`font-display tracking-wide ${light ? 'text-white' : ''}`}>
        <span className={`font-normal ${light ? 'text-neutral-300' : 'text-neutral-400'}`}>{text1}</span>{' '}
        <span className={`font-semibold ${light ? 'text-white' : 'text-brand-black'}`}>{text2}</span>
      </h2>
      <span className={`hidden sm:block w-10 h-[2px] ${light ? 'bg-white/30' : 'bg-brand-gold'}`}></span>
    </div>
  )
}

export default Title
