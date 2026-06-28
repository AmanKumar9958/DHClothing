import { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';
import LazyImage from '../components/LazyImage';
import FadeIn, { FadeInItem } from '../components/FadeIn';

const Cart = () => {

  const { products, currency, cartItems, updateQuantity, navigate, getCartAmount, getCartSinglesAmount, applyCoupon, coupon, discountAmount, removeCoupon } = useContext(ShopContext);

  const [cartData, setCartData] = useState([]);
  const [couponCodeInput, setCouponCodeInput] = useState('');

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const [productId, variantId] = items.split('::')
            const productExists = products.some((product) => product._id === productId);
            if (!productExists) {
              updateQuantity(items, item, 0);
              continue;
            }
            tempData.push({
              _id: items,
              productId,
              variantId,
              size: item,
              quantity: cartItems[items][item]
            })
          }
        }
      }
      setCartData(tempData);
    }
  }, [cartItems, products, updateQuantity])

  const computeDealHints = () => {
    let oversize = 0
    let regular = 0
    let hoodie = 0
    for (const items in cartItems) {
      const [productId] = items.split('::')
      const pd = products.find(p => p._id === productId)
      if (!pd) continue
      const sc = (pd.subCategory || '').toLowerCase()
      for (const size in cartItems[items]) {
        const qty = cartItems[items][size]
        if (!qty || qty <= 0) continue
        if (sc === 'oversize') oversize += qty
        if (sc === 'regular fit') regular += qty
        if (sc === 'hoodie') hoodie += qty
      }
    }

    const oversizeMsg = () => {
      if (oversize === 0) return null
      const rem = oversize % 3
      if (rem === 0) return `Deal applied: ${Math.floor(oversize/3)}× (3 for ₹999)`
      if (rem === 1) return 'Add 1 more Oversize to get 2 for ₹799 (save ₹199)'
      return 'Add 1 more Oversize to get 3 for ₹999 (save ₹299)'
    }

    const regularMsg = () => {
      if (regular === 0) return null
      const rem = regular % 4
      if (rem === 0) return `Deal applied: ${Math.floor(regular/4)}× (4 for ₹999)`
      if (rem === 3) return 'Add 1 more Regular fit to get 4 for ₹999 (save ₹99)'
      if (rem === 2) return 'Add 1 more Regular fit to get 3 for ₹799 (save ₹98)'
      return 'Add 2 more Regular fit to get 3 for ₹799 (save ₹98)'
    }

    const hoodieMsg = () => {
      if (hoodie === 0) return null
      const rem = hoodie % 2
      if (rem === 0) return `Deal applied: ${Math.floor(hoodie/2)}× (2 for ₹999)`
      if (rem === 1) return 'Add 1 more Hoodie to get 2 for ₹999 (save ₹199)'
    }

    return { oversize, regular, hoodie, oversizeMsg: oversizeMsg(), regularMsg: regularMsg(), hoodieMsg: hoodieMsg() }
  }

  const dealHints = computeDealHints()

  return (
    <div className='min-h-[80vh] bg-brand-cream pb-24'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
            <FadeIn>
                <div className='text-3xl sm:text-4xl mb-8 font-medium'>
                    <Title text1={'YOUR'} text2={'CART'} />
                </div>

                {cartData.length === 0 ? (
                    <div className='bg-white rounded-3xl p-16 shadow-soft border border-neutral-100 flex flex-col items-center text-center'>
                        <div className='w-24 h-24 bg-neutral-50 rounded-full flex items-center justify-center mb-6'>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-neutral-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                        </div>
                        <h2 className='font-display text-2xl font-semibold mb-2'>Your cart is empty</h2>
                        <p className='text-neutral-500 mb-8 max-w-sm'>Looks like you haven't added anything to your cart yet. Let's find you something great!</p>
                        <button onClick={() => navigate('/collection')} className='btn-primary'>Start Shopping</button>
                    </div>
                ) : (
                    <div className='flex flex-col lg:flex-row gap-10'>
                        
                        {/* Cart Items */}
                        <div className='lg:w-2/3'>
                            <div className='bg-white rounded-3xl p-6 shadow-soft border border-neutral-100 flex flex-col gap-6'>
                                {cartData.map((item, index) => {
                                    const productData = products.find((product) => product._id === item.productId || product._id === item._id);
                                    if (!productData) return null;
                                    
                                    const variantId = item.variantId
                                    let variant = null
                                    if (variantId && productData.variants) {
                                        variant = productData.variants.find(v => (v.id && v.id.toString() === variantId.toString()) || productData.variants.indexOf(v) === Number(variantId))
                                    }

                                    const displayImage = (variant && variant.images && variant.images.length) ? variant.images[0] : (productData.image && productData.image[0])
                                    const displayPrice = (variant && variant.price) ? variant.price : productData.price
                                    const colorHex = (variant && (variant.colorHex || variant.color || variant.hex || variant.colorCode)) || (productData.colorHex || productData.color || '#ddd')
                                    const colorName = (variant && (variant.colorName || variant.color || variant.name)) || ''

                                    return (
                                        <FadeInItem key={index} className='flex items-center gap-6 py-4 border-b border-neutral-100 last:border-0 last:pb-0'>
                                            <Link to={`/product/${productData._id}`} className='w-24 sm:w-32 aspect-[3/4] flex-shrink-0 rounded-xl overflow-hidden bg-neutral-50 group block'>
                                                <LazyImage 
                                                    className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-105' 
                                                    src={displayImage} 
                                                    alt={productData.name} 
                                                    skeletonClass="w-full h-full"
                                                />
                                            </Link>
                                            
                                            <div className='flex-1 flex flex-col'>
                                                <div className='flex justify-between items-start gap-4'>
                                                    <div>
                                                        <h3 className='font-medium text-lg text-brand-black line-clamp-1'>
                                                            <Link to={`/product/${productData._id}`} className='hover:text-brand-gold transition-colors'>{productData.name}</Link>
                                                        </h3>
                                                        <p className='text-brand-black font-semibold mt-1'>{currency}{displayPrice.toFixed(2)}</p>
                                                    </div>
                                                    <button 
                                                        onClick={() => updateQuantity(item._id, item.size, 0)} 
                                                        className='p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors flex-shrink-0'
                                                        aria-label="Remove item"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                                    </button>
                                                </div>

                                                <div className='flex flex-wrap items-center gap-x-6 gap-y-3 mt-4'>
                                                    <div className='flex items-center gap-2 text-sm'>
                                                        <span className='text-neutral-500'>Size:</span>
                                                        <span className='font-medium bg-neutral-100 px-2 py-0.5 rounded'>{item.size}</span>
                                                    </div>
                                                    
                                                    {(colorHex || colorName) && (
                                                        <div className='flex items-center gap-2 text-sm'>
                                                            <span className='text-neutral-500'>Color:</span>
                                                            <div className='flex items-center gap-1.5'>
                                                                <span className='w-4 h-4 rounded-full border border-black/10 shadow-inner' style={{background: colorHex}}></span>
                                                                <span className='font-medium capitalize'>{colorName}</span>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className='flex items-center gap-3 sm:ml-auto mt-2 sm:mt-0'>
                                                        <span className='text-sm text-neutral-500'>Qty:</span>
                                                        <div className='flex items-center border border-neutral-200 rounded-lg overflow-hidden h-9'>
                                                            <button 
                                                                className='px-3 bg-neutral-50 hover:bg-neutral-100 text-neutral-600 transition-colors h-full flex items-center justify-center'
                                                                onClick={() => updateQuantity(item._id, item.size, item.quantity - 1)}
                                                            >-</button>
                                                            <input 
                                                                className='w-10 text-center font-medium bg-white h-full outline-none' 
                                                                type="number" 
                                                                min={1} 
                                                                value={item.quantity} 
                                                                onChange={(e) => e.target.value === '' || e.target.value === '0' ? null : updateQuantity(item._id, item.size, Number(e.target.value))}
                                                            />
                                                            <button 
                                                                className='px-3 bg-neutral-50 hover:bg-neutral-100 text-neutral-600 transition-colors h-full flex items-center justify-center'
                                                                onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)}
                                                            >+</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </FadeInItem>
                                    )
                                })}
                            </div>

                            {/* Bundle Deals Hint */}
                            {(dealHints.oversizeMsg || dealHints.regularMsg || dealHints.hoodieMsg) && (
                                <FadeInItem className='mt-6 bg-brand-gold/10 border border-brand-gold/20 rounded-2xl p-6'>
                                    <div className='flex items-center gap-3 mb-3 text-brand-gold-dark'>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                                        <h4 className='font-semibold tracking-wide uppercase text-sm'>Bundle Deals Available</h4>
                                    </div>
                                    <ul className='space-y-2 text-sm text-brand-black mb-4'>
                                        {dealHints.oversizeMsg && <li className='flex items-start gap-2'><span className='text-brand-gold mt-1'>•</span> <span><strong className='font-medium'>Oversize:</strong> {dealHints.oversizeMsg}</span></li>}
                                        {dealHints.regularMsg && <li className='flex items-start gap-2'><span className='text-brand-gold mt-1'>•</span> <span><strong className='font-medium'>Regular fit:</strong> {dealHints.regularMsg}</span></li>}
                                        {dealHints.hoodieMsg && <li className='flex items-start gap-2'><span className='text-brand-gold mt-1'>•</span> <span><strong className='font-medium'>Hoodie:</strong> {dealHints.hoodieMsg}</span></li>}
                                    </ul>
                                    <div className='text-xs text-neutral-500 bg-white/50 p-3 rounded-xl border border-brand-gold/10'>
                                        <p className='font-medium mb-1'>Bundle Pricing Guide:</p>
                                        <p>Oversize: 1 for ₹499 | 2 for ₹799 | 3 for ₹999</p>
                                        <p>Hoodie: 1 for ₹599 | 2 for ₹999</p>
                                    </div>
                                </FadeInItem>
                            )}
                        </div>

                        {/* Order Summary */}
                        <div className='lg:w-1/3'>
                            <div className='sticky top-28 flex flex-col gap-6'>
                                
                                {/* Coupon */}
                                <div className='bg-white rounded-3xl p-6 shadow-soft border border-neutral-100'>
                                    <h3 className='font-semibold text-brand-black mb-4'>Promo Code</h3>
                                    <div className='flex items-center gap-2'>
                                        <input 
                                            type="text" 
                                            placeholder="Enter code" 
                                            value={couponCodeInput}
                                            onChange={e=>setCouponCodeInput(e.target.value)}
                                            className='flex-1 border border-neutral-200 rounded-lg px-4 py-3 outline-none focus:border-brand-black transition-colors text-sm uppercase'
                                        />
                                        <button 
                                            onClick={() => couponCodeInput && applyCoupon(couponCodeInput)}
                                            className='bg-brand-black text-white px-5 py-3 rounded-lg text-sm font-medium hover:bg-brand-charcoal transition-colors'
                                        >
                                            Apply
                                        </button>
                                    </div>
                                    {coupon && (
                                        <div className='mt-3 flex items-center justify-between px-4 py-2 bg-green-50 border border-green-100 rounded-lg'>
                                            <span className='text-sm text-green-700 font-medium'>
                                                <span className='uppercase'>{coupon.code}</span> applied
                                            </span>
                                            <button onClick={removeCoupon} className='text-red-500 hover:text-red-600 transition-colors' aria-label="Remove coupon">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Totals */}
                                <div>
                                    {(() => {
                                        let shippingFee = 0;
                                        let shippingNote = "Shipping applies only for Cash on Delivery at checkout.";
                                        if (dealHints.hoodie === 1) {
                                            shippingFee = 79;
                                            shippingNote = "Standard shipping fee applies for single hoodie orders.";
                                        } else if (dealHints.hoodie >= 2) {
                                            shippingFee = 0;
                                            shippingNote = "Free shipping applied for hoodie bundle.";
                                        }
                                        return (
                                            <>
                                                <CartTotal deliveryFee={shippingFee} />
                                                <p className='text-xs text-neutral-500 mt-3 text-center'>{shippingNote}</p>
                                            </>
                                        )
                                    })()}
                                    
                                    {(() => {
                                        const bundle = getCartAmount()
                                        const singles = getCartSinglesAmount()
                                        const save = Math.max(0, singles - bundle)
                                        if (save <= 0) return null
                                        return (
                                            <div className='mt-4 flex items-center justify-center gap-2 text-green-600 bg-green-50 border border-green-100 rounded-xl p-3 shadow-sm'>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                                                <span className='font-medium'>Bundle savings: {currency}{save.toFixed(2)}</span>
                                            </div>
                                        )
                                    })()}

                                    <button 
                                        onClick={() => navigate('/place-order')} 
                                        className='btn-primary w-full py-4 mt-6 text-base rounded-xl'
                                    >
                                        Proceed to Checkout
                                    </button>
                                </div>

                            </div>
                        </div>

                    </div>
                )}
            </FadeIn>
        </div>
    </div>
  )
}

export default Cart
