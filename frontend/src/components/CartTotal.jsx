import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import PropTypes from 'prop-types'

const CartTotal = ({ deliveryFee }) => {

    const {currency,delivery_fee,getCartAmount, discountAmount} = useContext(ShopContext);
    const fee = typeof deliveryFee === 'number' ? deliveryFee : delivery_fee
    const subtotal = getCartAmount()
    const total = subtotal === 0 ? 0 : subtotal + fee - (discountAmount || 0)

  return (
    <div className='w-full'>
      <div className='text-2xl'>
        <Title text1={'CART'} text2={'TOTALS'} />
      </div>

      <div className='flex flex-col gap-2 mt-2 text-sm'>
            <div className='flex justify-between'>
                <p>Subtotal</p>
                <p>{currency} {subtotal}.00</p>
            </div>
            <hr />
            <div className='flex justify-between'>
                <p>Shipping Fee</p>
                <p>{currency} {fee}.00</p>
            </div>
            <hr />
            {discountAmount > 0 && (
                <>
                    <div className='flex justify-between text-green-600'>
                        <p>Discount</p>
                        <p>- {currency} {discountAmount}.00</p>
                    </div>
                    <hr />
                </>
            )}
            <div className='flex justify-between'>
                <b>Total</b>
                <b>{currency} {total}.00</b>
            </div>
      </div>
    </div>
  )
}

export default CartTotal

CartTotal.propTypes = {
  deliveryFee: PropTypes.number,
}
