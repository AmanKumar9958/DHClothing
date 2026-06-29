import { useContext, useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';
import LazyImage from '../components/LazyImage';
import LoadingSpinner from '../components/LoadingSpinner';
import FadeIn from '../components/FadeIn';

const Product = () => {
    const { productId } = useParams();
    const { products, currency, addToCart } = useContext(ShopContext);
    const [productData, setProductData] = useState(false);
    const [image, setImage] = useState('');
    const [size, setSize] = useState('');
    const [selectedVariantIndex, setSelectedVariantIndex] = useState(null);

    useEffect(() => {
        const foundProduct = products.find((item) => item._id === productId);
        if (foundProduct) {
            setProductData(foundProduct);
            if (foundProduct.variants && foundProduct.variants.length > 0) {
                setSelectedVariantIndex(0);
                const firstVariant = foundProduct.variants[0];
                if (firstVariant.images && firstVariant.images.length > 0) {
                    setImage(firstVariant.images[0]);
                } else {
                    setImage(foundProduct.image && foundProduct.image.length > 0 ? foundProduct.image[0] : '');
                }
            } else {
                setSelectedVariantIndex(null);
                setImage(foundProduct.image && foundProduct.image.length > 0 ? foundProduct.image[0] : '');
            }
            setSize('');
        } else {
            setProductData(false);
        }
    }, [productId, products]);

    const getCurrentGallery = () => {
        if (selectedVariantIndex !== null && productData.variants && productData.variants[selectedVariantIndex]) {
            const variant = productData.variants[selectedVariantIndex];
            if (variant.images && variant.images.length > 0) {
                return variant.images;
            }
        }
        return productData.image || [];
    };

    const gallery = getCurrentGallery();

    const handleAddToCart = () => {
        if (!size) {
            // Replaced alert with custom styled error in UI or just a simple alert for now
            // since we don't have toast imported here. Oh wait, we can just use the button state.
            alert("Please select a size.");
            return;
        }

        let variantId = null;
        if (selectedVariantIndex !== null && productData.variants && productData.variants[selectedVariantIndex]) {
            const v = productData.variants[selectedVariantIndex];
            variantId = (v.id !== undefined && v.id !== null) ? v.id : selectedVariantIndex;
        }
        addToCart(productData._id, size, variantId);
    };

    if (!productData) {
        return <div className='min-h-[60vh] flex items-center justify-center bg-brand-cream'><LoadingSpinner /></div>;
    }

    return (
        <div className='bg-brand-cream min-h-screen pb-24'>
            {/* Breadcrumb */}
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
                <div className='flex items-center gap-2 text-xs font-medium text-neutral-500 uppercase tracking-wider'>
                    <Link to='/' className='hover:text-brand-black transition-colors'>Home</Link>
                    <span>/</span>
                    <Link to='/collection' className='hover:text-brand-black transition-colors'>Collection</Link>
                    <span>/</span>
                    <span className='text-brand-black'>{productData.category}</span>
                </div>
            </div>

            <FadeIn>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='bg-white rounded-3xl p-6 sm:p-10 shadow-soft border border-neutral-100 flex flex-col lg:flex-row gap-12 lg:gap-16'>
                        
                        {/* Image Gallery */}
                        <div className='lg:w-1/2 flex flex-col-reverse sm:flex-row gap-4'>
                            {/* Thumbnails */}
                            <div className='flex sm:flex-col gap-4 overflow-x-auto sm:overflow-y-auto sm:w-24 flex-shrink-0 no-scrollbar pb-2 sm:pb-0'>
                                {gallery.map((item, index) => (
                                    <button 
                                        key={index}
                                        onClick={() => setImage(item)}
                                        className={`relative w-20 sm:w-full aspect-[3/4] rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${image === item ? 'border-brand-black shadow-md' : 'border-transparent hover:border-neutral-200'}`}
                                    >
                                        <LazyImage
                                            src={item}
                                            className='w-full h-full object-cover'
                                            wrapperClassName='w-full h-full'
                                            skeletonClass="w-full h-full"
                                            alt={`Thumbnail ${index + 1}`}
                                            width="200"
                                        />
                                    </button>
                                ))}
                            </div>
                            
                            {/* Main Image */}
                            <div className='w-full rounded-2xl overflow-hidden bg-neutral-100 img-zoom relative aspect-[3/4] sm:aspect-auto'>
                                <LazyImage 
                                    className='w-full h-full object-cover absolute inset-0'
                                    wrapperClassName='w-full h-full'
                                    src={image || (gallery.length > 0 ? gallery[0] : assets.placeholder)} 
                                    alt={productData.name} 
                                    skeletonClass="w-full h-full"
                                    width="1000"
                                />
                            </div>
                        </div>

                        {/* Product Details */}
                        <div className='lg:w-1/2 flex flex-col'>
                            <div className='mb-2 text-brand-gold text-xs font-bold tracking-widest uppercase'>
                                {productData.subCategory}
                            </div>
                            <h1 className='font-display text-3xl sm:text-4xl lg:text-5xl font-medium leading-tight mb-4 text-brand-black'>
                                {productData.name}
                            </h1>
                            
                            <div className='flex items-center gap-4 mb-8'>
                                <p className='text-3xl font-semibold text-brand-black'>{currency}{productData.price.toFixed(2)}</p>
                                <span className='px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full uppercase tracking-wider'>In Stock</span>
                            </div>

                            <p className='text-neutral-500 text-body-md leading-relaxed mb-10'>
                                {productData.description}
                            </p>

                            <div className='h-px bg-neutral-100 w-full mb-8'></div>

                            {/* Color Swatches */}
                            {productData.variants && productData.variants.length > 0 && (
                                <div className='mb-8'>
                                    <div className='flex items-center justify-between mb-4'>
                                        <p className='text-sm font-semibold uppercase tracking-wider text-brand-black'>
                                            Color: <span className='text-neutral-500 ml-2 font-normal capitalize'>{productData.variants[selectedVariantIndex]?.color}</span>
                                        </p>
                                    </div>
                                    <div className='flex flex-wrap gap-3'>
                                        {productData.variants.map((v, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => {
                                                    setSelectedVariantIndex(idx);
                                                    const newGallery = (v.images && v.images.length) ? v.images : productData.image || [];
                                                    setImage(newGallery[0] || '');
                                                }}
                                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${selectedVariantIndex === idx ? 'ring-2 ring-brand-black ring-offset-2' : 'ring-1 ring-neutral-200 hover:ring-neutral-400'}`}
                                                title={v.color}
                                            >
                                                <span
                                                    className="w-8 h-8 rounded-full shadow-inner border border-black/5"
                                                    style={{ backgroundColor: v.colorHex || '#eee' }}
                                                ></span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Size Selection */}
                            <div className='mb-10'>
                                <div className='flex items-center justify-between mb-4'>
                                    <p className='text-sm font-semibold uppercase tracking-wider text-brand-black'>Select Size</p>
                                    <button className='text-xs text-neutral-500 underline hover:text-brand-black'>Size Guide</button>
                                </div>
                                <div className='grid grid-cols-4 sm:grid-cols-5 gap-3'>
                                    {productData.sizes && productData.sizes.map((item, index) => (
                                        <button 
                                            onClick={() => setSize(item)} 
                                            className={`py-3 rounded-xl border font-medium transition-all ${item === size ? 'bg-brand-black text-white border-brand-black shadow-md' : 'bg-white text-neutral-700 border-neutral-200 hover:border-brand-black'}`} 
                                            key={index}
                                        >
                                            {item}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Add to Cart */}
                            <button 
                                onClick={handleAddToCart} 
                                className='btn-primary w-full py-4 text-base rounded-xl shadow-soft group relative overflow-hidden'
                            >
                                <span className='relative z-10 flex items-center justify-center gap-2'>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                                    Add to Cart
                                </span>
                            </button>
                            
                            <div className='mt-8 pt-8 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm text-neutral-500'>
                                <div className='flex items-center gap-2'>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-brand-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                                    <span>Premium Quality</span>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-brand-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                                    <span>Fast Delivery</span>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-brand-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                                    <span>7-Day Returns</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </FadeIn>

            {/* Related Products */}
            <div className='mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
            </div>
        </div>
    );
};

export default Product;