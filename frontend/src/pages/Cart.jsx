import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';

const Cart = () => {

  const { products, currency, cartItems, updateQuantity, navigate } = useContext(ShopContext);

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
                      {variant && (
                        <div className='flex items-center gap-2'>
                          <span className='w-4 h-4 rounded-full inline-block' style={{background: variant.colorHex || '#ddd'}}></span>
                          <span className='text-sm'>{variant.colorName}</span>
                        </div>
                      )}
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

      <div className='flex justify-end my-20'>
        <div className='w-full sm:w-[450px]'>
          <CartTotal />
          <div className=' w-full text-end'>
            <button onClick={() => navigate('/place-order')} className='bg-black text-white text-sm my-8 px-8 py-3'>PROCEED TO CHECKOUT</button>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Cart
