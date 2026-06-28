import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import PropTypes from 'prop-types'

const CartTotal = ({ deliveryFee }) => {

    const { currency, delivery_fee, getCartAmount, discountAmount } = useContext(ShopContext);
    const fee = typeof deliveryFee === 'number' ? deliveryFee : delivery_fee
    const subtotal = getCartAmount()
    const total = subtotal === 0 ? 0 : subtotal + fee - (discountAmount || 0)

  return (
    <div className='w-full bg-neutral-50 rounded-2xl p-6 border border-neutral-100'>
      <div className='text-heading-sm mb-4'>
        <Title text1={'CART'} text2={'TOTALS'} />
      </div>

      <div className='flex flex-col gap-3 text-body-sm'>
        <div className='flex justify-between items-center'>
          <p className='text-neutral-500'>Subtotal</p>
          <p className='font-medium text-brand-black'>{currency}{subtotal}.00</p>
        </div>
        <div className='h-px bg-neutral-200'></div>
        <div className='flex justify-between items-center'>
          <p className='text-neutral-500'>Shipping</p>
          <p className='font-medium text-brand-black'>
            {fee === 0 ? (
              <span className='text-green-600'>Free</span>
            ) : (
              <>{currency}{fee}.00</>
            )}
          </p>
        </div>
        <div className='h-px bg-neutral-200'></div>
        {discountAmount > 0 && (
          <>
            <div className='flex justify-between items-center'>
              <p className='text-green-600 flex items-center gap-1.5'>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                  <line x1="7" y1="7" x2="7.01" y2="7"/>
                </svg>
                Discount
              </p>
              <p className='font-medium text-green-600'>-{currency}{discountAmount}.00</p>
            </div>
            <div className='h-px bg-neutral-200'></div>
          </>
        )}
        <div className='flex justify-between items-center pt-1'>
          <p className='text-brand-black font-semibold text-base'>Total</p>
          <p className='text-brand-black font-bold text-lg'>{currency}{total}.00</p>
        </div>
      </div>
    </div>
  )
}

export default CartTotal

CartTotal.propTypes = {
  deliveryFee: PropTypes.number,
}
