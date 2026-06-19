import React from 'react'

const Title = ({ text1, text2, centered = false, light = false }) => {
  return (
    <div className={`flex items-center gap-4 mb-4 ${centered ? 'justify-center' : ''}`}>
      <span className={`hidden sm:block w-8 md:w-12 h-[1px] ${light ? 'bg-white/40' : 'bg-brand-black/20'}`}></span>
      <h2 className={`font-display text-2xl md:text-3xl lg:text-4xl tracking-wide ${light ? 'text-white' : 'text-brand-black'}`}>
        <span className={`font-sans text-sm md:text-base uppercase tracking-[0.2em] font-medium mr-2 ${light ? 'text-neutral-300' : 'text-neutral-500'}`}>
          {text1}
        </span>
        <span className="italic font-medium">
          {text2}
        </span>
      </h2>
      <span className={`hidden sm:block w-8 md:w-12 h-[1px] ${light ? 'bg-white/40' : 'bg-brand-black/20'}`}></span>
    </div>
  )
}

export default Title
