import React, { useState } from 'react';

const optimizeCloudinaryUrl = (url, width) => {
  if (typeof url !== 'string' || !url.includes('res.cloudinary.com')) return url;
  
  // We want to insert transformations after "upload/"
  const uploadIndex = url.indexOf('upload/');
  if (uploadIndex === -1) return url;
  
  const insertionPoint = uploadIndex + 7;
  
  // Check if transformations are already present (e.g. upload/q_auto...)
  const nextPart = url.slice(insertionPoint, insertionPoint + 2);
  if (nextPart === 'q_' || nextPart === 'w_' || nextPart === 'f_' || nextPart === 'c_') return url;
  
  const transformations = ['q_auto', 'f_auto'];
  if (width) transformations.push(`w_${width}`);
  
  return url.slice(0, insertionPoint) + transformations.join(',') + '/' + url.slice(insertionPoint);
};

const LazyImage = ({ src, alt, className, skeletonClass = "w-full h-full min-h-[200px]", wrapperClassName, onClick, width, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  const optimizedSrc = optimizeCloudinaryUrl(src, width);

  return (
    <div 
      className={`relative overflow-hidden ${!isLoaded ? 'bg-neutral-100' : ''} ${wrapperClassName || ''}`}
      onClick={onClick}
    >
      {/* Shimmer skeleton */}
      {!isLoaded && !hasError && (
        <div className={`absolute inset-0 skeleton-shimmer rounded ${skeletonClass}`}>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-8 h-8 text-neutral-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
              <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"/>
            </svg>
          </div>
        </div>
      )}
      <img
        src={optimizedSrc}
        alt={alt}
        className={`${className} transition-all duration-700 ease-out ${
          isLoaded ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-105 blur-sm'
        }`}
        onLoad={() => setIsLoaded(true)}
        onError={() => { setHasError(true); setIsLoaded(true); }}
        loading="lazy"
        {...props}
      />
    </div>
  );
};

export default LazyImage;
