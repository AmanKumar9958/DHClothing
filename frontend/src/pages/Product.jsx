import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';

const Product = () => {

    const { productId } = useParams();
    const { products, currency, addToCart } = useContext(ShopContext);
    const [productData, setProductData] = useState(false);
    const [image, setImage] = useState(''); // State for the large image URL
    const [size, setSize] = useState('');
    const [selectedVariantIndex, setSelectedVariantIndex] = useState(null);

    // Effect to find the product and set initial state when productId or products change
    useEffect(() => {
        const foundProduct = products.find((item) => item._id === productId);
        if (foundProduct) {
            setProductData(foundProduct);
            // Check for variants and set initial variant/image
            if (foundProduct.variants && foundProduct.variants.length > 0) {
                setSelectedVariantIndex(0); // Select the first variant by default
                const firstVariant = foundProduct.variants[0];
                if (firstVariant.images && firstVariant.images.length > 0) {
                    setImage(firstVariant.images[0]); // Set the first image of the first variant
                } else {
                    setImage(''); // Handle case where variant has no images
                }
            } else {
                // Fallback if no variants (using your old logic)
                setSelectedVariantIndex(null);
                setImage(foundProduct.image && foundProduct.image.length > 0 ? foundProduct.image[0] : ''); // Use old image field if exists
            }
            setSize(''); // Reset size selection when product changes
        } else {
            setProductData(false); // Product not found
        }
    }, [productId, products]);

    // Function to get the gallery images for the currently selected variant
    const getCurrentGallery = () => {
        if (selectedVariantIndex !== null && productData.variants && productData.variants[selectedVariantIndex]) {
            const variant = productData.variants[selectedVariantIndex];
            if (variant.images && variant.images.length > 0) {
                return variant.images;
            }
        }
        // Fallback to old image field or empty array if no variants/images
        return productData.image || [];
    };

    const gallery = getCurrentGallery();

    const handleAddToCart = () => {
        if (!size) {
            // Consider using toast notifications here instead of alert
            alert("Please select a size.");
            return;
        }

        // Determine the variant identifier to pass to addToCart.
        // The backend/frontend variant lookup supports either an explicit variant `id` field
        // or a numeric index into the `variants` array. Prefer explicit id when present,
        // otherwise pass the numeric index.
        let variantId = null;
        if (selectedVariantIndex !== null && productData.variants && productData.variants[selectedVariantIndex]) {
            const v = productData.variants[selectedVariantIndex];
            variantId = (v.id !== undefined && v.id !== null) ? v.id : selectedVariantIndex;
        }

        addToCart(productData._id, size, variantId);
    };


    // Render loading or not found state if productData isn't ready
    if (!productData) {
        return <div className='border-t-2 pt-10 text-center'>Loading product...</div>;
    }

    return (
        <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
            {/*----------- Product Data-------------- */}
            <div className='flex gap-6 sm:gap-12 flex-col sm:flex-row max-w-6xl mx-auto px-4'>

                {/*---------- Product Images------------- */}
                <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
                    {/* --- Corrected Thumbnail Container --- */}
                    <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-auto sm:max-h-[75vh] sm:w-[18.7%] w-full gap-3'>
                        {gallery.map((item, index) => (
                            <div key={index} className={`flex-shrink-0 sm:flex-shrink w-24 h-24 sm:w-full sm:h-20 rounded-sm border overflow-hidden ${image === item ? 'ring-2 ring-orange-400' : 'ring-0'}`}>
                                {/* --- Corrected Thumbnail Image --- */}
                                <img
                                    onClick={() => setImage(item)}
                                    src={item}
                                    className={`block w-full h-full cursor-pointer object-cover`}
                                    alt={`Thumbnail ${index + 1}`}
                                />
                            </div>
                        ))}
                    </div>
                     {/* --- Main Image --- */}
                    <div className='w-full sm:w-[80%] flex items-center justify-center bg-gray-100 rounded'>
                        <img className='max-w-full max-h-[75vh] object-contain rounded' src={image || assets.placeholder} alt={productData.name} />
                    </div>
                </div>

                {/* -------- Product Info ---------- */}
                <div className='flex-1'>
                    <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
                    {/* Star Rating Placeholder */}
                    <div className=' flex items-center gap-1 mt-2 text-gray-400'>
                        {/* Replace with actual rating logic if available */}
                        {/* {[...Array(5)].map((_, i) => <img key={i} src={i < 4 ? assets.star_icon : assets.star_dull_icon} alt="" className="w-3.5" />)} */}
                        {/* <p className='pl-2 text-sm'>(122)</p> Placeholder count */}
                    </div>
                    <p className='mt-5 text-3xl font-semibold'>{currency}{productData.price.toFixed(2)}</p>
                    <p className='mt-5 text-gray-600 text-sm md:w-4/5'>{productData.description}</p>

                    {/* --- Color Swatches --- */}
                     {productData.variants && productData.variants.length > 0 && (
                        <div className='my-8'>
                            <p className='font-medium mb-2'>Color: <span className='font-normal'>{productData.variants[selectedVariantIndex]?.color}</span></p>
                            <div className='flex flex-wrap gap-2'>
                                {productData.variants.map((v, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            setSelectedVariantIndex(idx);
                                            const newGallery = (v.images && v.images.length) ? v.images : productData.image || [];
                                            setImage(newGallery[0] || ''); // Set first image of new variant
                                        }}
                                        className={`w-8 h-8 rounded-full border-2 p-0.5 ${selectedVariantIndex === idx ? 'border-black ring-2 ring-offset-1 ring-black' : 'border-gray-300'}`}
                                        title={v.color}
                                    >
                                        <div
                                          className="w-full h-full rounded-full border border-gray-200"
                                          style={{ backgroundColor: v.colorHex || '#eee' }}
                                        ></div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}


                    {/* --- Size Selection --- */}
                    <div className='flex flex-col gap-3 my-8'>
                        <p className='font-medium'>Select Size</p>
                        <div className='flex flex-wrap gap-2'>
                            {productData.sizes && productData.sizes.map((item, index) => (
                                <button onClick={() => setSize(item)} className={`border py-2 px-4 rounded ${item === size ? 'bg-black text-white border-black' : 'bg-gray-100 hover:bg-gray-200'}`} key={index}>{item}</button>
                            ))}
                        </div>
                    </div>

                    <button onClick={handleAddToCart} className='w-full sm:w-auto bg-black text-white px-8 py-3 text-sm font-medium rounded active:bg-gray-700 hover:bg-gray-800 transition-colors'>ADD TO CART</button>
                    
                    <hr className='mt-8 sm:w-4/5 border-gray-200' />
                    <div className='text-xs text-gray-500 mt-5 flex flex-col gap-1'>
                        <p>✓ 100% Original product.</p>
                        <p>✓ Cash on delivery is available.</p>
                        <p>✓ Easy 7-day return and exchange policy.</p>
                    </div>
                </div>
            </div>

            {/* ---------- Description & Review Section Placeholder ------------- */}
            {/* <div className='mt-20 max-w-6xl mx-auto px-4'> */}
                {/* Add Description/Review tabs here if needed */}
            {/* </div> */}

            {/* --------- Display related products ---------- */}
            <div className='mt-20 max-w-6xl mx-auto px-4'>
                <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
            </div>

        </div>
    );
};

export default Product;