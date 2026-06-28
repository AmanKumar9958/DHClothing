import React from 'react';

const LoadingSpinner = ({ text = '', size = 'md' }) => {
  const dotSize = size === 'sm' ? 'w-2 h-2' : size === 'lg' ? 'w-4 h-4' : 'w-3 h-3';
  
  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[120px] gap-4">
      <div className="flex items-center gap-2">
        <div className={`${dotSize} rounded-full bg-brand-black animate-pulse-soft`} style={{ animationDelay: '0ms' }}></div>
        <div className={`${dotSize} rounded-full bg-brand-black animate-pulse-soft`} style={{ animationDelay: '200ms' }}></div>
        <div className={`${dotSize} rounded-full bg-brand-black animate-pulse-soft`} style={{ animationDelay: '400ms' }}></div>
      </div>
      {text && <p className="text-body-sm text-neutral-500 font-medium">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
