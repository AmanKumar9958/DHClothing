import { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';

const Cart = () => {

  const { products, currency, cartItems, updateQuantity, navigate, getCartAmount, getCartSinglesAmount } = useContext(ShopContext);

  const [cartData, setCartData] = useState([]);

  useEffect(() => {

    if (products.length > 0) {
      const tempData = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            // items may be composite key productId::variantId
            const [productId, variantId] = items.split('::')
            const productExists = products.some((product) => product._id === productId);
            if (!productExists) {
              updateQuantity(items, item, 0);
              continue;
            }
            tempData.push({
              _id: items, // keep composite key so updateQuantity works
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

  // Compute deal hints for Oversize and Regular fit based on items in cart
  const computeDealHints = () => {
    let oversize = 0
    let regular = 0
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
      }
    }

    const oversizeMsg = () => {
      if (oversize === 0) return null
      const rem = oversize % 3
      if (rem === 0) return `Deal applied: ${Math.floor(oversize/3)}× (3 for ₹999)`
      if (rem === 1) return 'Add 1 more Oversize to get 2 for ₹799 (save ₹199)'
      // rem === 2
      return 'Add 1 more Oversize to get 3 for ₹999 (save ₹299)'
    }

    const regularMsg = () => {
      if (regular === 0) return null
      const rem = regular % 4
      if (rem === 0) return `Deal applied: ${Math.floor(regular/4)}× (4 for ₹999)`
      if (rem === 3) return 'Add 1 more Regular fit to get 4 for ₹999 (save ₹99)'
      if (rem === 2) return 'Add 1 more Regular fit to get 3 for ₹799 (save ₹98)'
      // rem === 1
      return 'Add 2 more Regular fit to get 3 for ₹799 (save ₹98)'
    }

    return { oversize, regular, oversizeMsg: oversizeMsg(), regularMsg: regularMsg() }
  }

  const dealHints = computeDealHints()

  return (
    <div className='border-t pt-14'>

      <div className=' text-2xl mb-3'>
        <Title text1={'YOUR'} text2={'CART'} />
      </div>

      <div>
        {
          cartData.map((item, index) => {

            const productData = products.find((product) => product._id === item.productId || product._id === item._id);
            if (!productData) {
              return null;
            }
            // determine variant if composite key
            const variantId = item.variantId
            let variant = null
            if (variantId && productData.variants) {
              variant = productData.variants.find(v => (v.id && v.id.toString() === variantId.toString()) || productData.variants.indexOf(v) === Number(variantId))
            }

            const displayImage = (variant && variant.images && variant.images.length) ? variant.images[0] : (productData.image && productData.image[0])
            const displayPrice = (variant && variant.price) ? variant.price : productData.price

            return (
              <div key={index} className='py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'>
                <div className=' flex items-start gap-6'>
                  <img className='w-16 sm:w-20' src={displayImage} alt="" />
                    <div>
                      <p className='text-xs sm:text-lg font-medium'>{productData.name}</p>
                      <div className='flex items-center gap-5 mt-2'>
                        <p>{currency}{displayPrice}</p>
                        <p className='px-2 sm:px-3 sm:py-1 border bg-slate-50'>{item.size}</p>
                        {
                          // compute color values with fallbacks for different property names
                        }
                        {(() => {
                          const v = variant
                          const colorHex = (v && (v.colorHex || v.color || v.hex || v.colorCode)) || (productData.colorHex || productData.color || '#ddd')
                          const colorName = (v && (v.colorName || v.color || v.name)) || ''
                          return (
                            <div className='flex items-center gap-2'>
                              <span className='w-4 h-4 rounded-full inline-block' style={{background: colorHex}}></span>
                              <span className='text-sm'>{colorName}</span>
                            </div>
                          )
                        })()}
                      </div>
                    </div>
                </div>
                <input onChange={(e) => e.target.value === '' || e.target.value === '0' ? null : updateQuantity(item._id, item.size, Number(e.target.value))} className='border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1' type="number" min={1} defaultValue={item.quantity} />
                <img onClick={() => updateQuantity(item._id, item.size, 0)} className='w-4 mr-4 sm:w-5 cursor-pointer' src={assets.bin_icon} alt="" />
              </div>
            )

          })
        }
      </div>

      {/* Deals hint */}
      {(dealHints.oversizeMsg || dealHints.regularMsg) && (
        <div className='my-8 p-4 bg-orange-50 border border-orange-200 rounded'>
          <p className='font-medium mb-1'>Bundle deals</p>
          <ul className='list-disc pl-5 text-sm text-orange-800'>
            {dealHints.oversizeMsg && <li>Oversize: {dealHints.oversizeMsg}</li>}
            {dealHints.regularMsg && <li>Regular fit: {dealHints.regularMsg}</li>}
          </ul>
          <div className='text-xs text-orange-700 mt-2'>
            • Oversize: 1 for ₹499, 2 for ₹799, 3 for ₹999. • Regular fit: 1 for ₹299, 3 for ₹799, 4 for ₹999.
          </div>
        </div>
      )}

      {/* Savings banner below totals */}
      {(() => {
        const bundle = getCartAmount()
        const singles = getCartSinglesAmount()
        const save = Math.max(0, singles - bundle)
        if (save <= 0) return null
        return (
          <div className='w-full sm:w-[450px] ml-auto my-2 text-right text-green-700'>
            <span className='inline-block bg-green-50 border border-green-200 rounded px-3 py-2 text-sm'>
              You save {currency}{save}
            </span>
          </div>
        )
      })()}

      <div className='flex justify-end my-20'>
        <div className='w-full sm:w-[450px]'>
          <CartTotal deliveryFee={0} />
          <p className='text-xs text-gray-500 mt-2 text-right'>Shipping applies only for Cash on Delivery at checkout.</p>
          <div className=' w-full text-end'>
            <button onClick={() => navigate('/place-order')} className='bg-black text-white text-sm my-8 px-8 py-3'>PROCEED TO CHECKOUT</button>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Cart
