import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const Orders = ({ token }) => {

  const [orders, setOrders] = useState([])

  const fetchAllOrders = async () => {

    if (!token) {
      return null;
    }

    try {

      const response = await axios.post(backendUrl + '/api/order/list', {}, { headers: { token } })
      if (response.data.success) {
        setOrders(response.data.orders.reverse())
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }


  }

  const statusHandler = async ( event, orderId ) => {
    try {
      const response = await axios.post(backendUrl + '/api/order/status' , {orderId, status:event.target.value}, { headers: {token}})
      if (response.data.success) {
        await fetchAllOrders()
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchAllOrders();
  }, [token])

  return (
    <div>
      <h3>Order Page</h3>
      <div>
        {
          orders.map((order, index) => (
            <div className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700' key={index}>
              <img className='w-12' src={assets.parcel_icon} alt="" />
              <div>
                <div>
                  {order.items.map((item, index) => {
                    const v = item.variant || {}
                    const colorHex = (v && (v.colorHex || v.color || v.hex || v.colorCode)) || ''
                    const colorName = (v && (v.colorName || v.color || v.name)) || ''
                    const colorDisplay = (colorHex || colorName) ? (
                      <span className='ml-2 inline-flex items-center gap-2'>
                        <span className='w-4 h-4 rounded-full' style={{background: colorHex || '#ddd'}}></span>
                        <span className='text-xs'>{colorName}</span>
                      </span>
                    ) : null
                    if (index === order.items.length - 1) {
                      return <p className='py-0.5' key={index}> {item.name} x {item.quantity} <span> {item.size} </span> {colorDisplay}</p>
                    }
                    else {
                      return <p className='py-0.5' key={index}> {item.name} x {item.quantity} <span> {item.size} </span> , {colorDisplay}</p>
                    }
                  })}
                </div>
                {order.couponCode && (
                  <div className='inline-flex items-center gap-2 mt-2 px-2 py-1 rounded bg-green-50 text-green-700 border border-green-200 text-xs'>
                    Coupon {order.couponCode} • -{currency}{order.discount || 0}
                  </div>
                )}
                <p className='mt-3 mb-2 font-medium'>{order.address.firstName + " " + order.address.lastName}</p>
                <div>
                  <p>{order.address.street + ","}</p>
                  <p>{order.address.city + ", " + order.address.state + ", " + order.address.country + ", " + order.address.zipcode}</p>
                </div>
                <p>{order.address.phone}</p>
              </div>
              <div>
                <p className='text-sm sm:text-[15px]'>Items : {order.items.length}</p>
                <p className='mt-3'>Method : <span className='inline-block px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-medium'>{order.paymentMethod}</span></p>
                <p className='mt-1'>Coupon: <span className=' text-gray-400'>{order.couponCode || 'N/A'}</span></p>
                {order.couponCode && (
                  <p className=''>Discount: <span className='text-gray-800 font-medium'>{currency}{order.discount || 0}</span></p>
                )}
                <p>Payment : <span className={`${order.payment ? 'text-green-600' : 'text-orange-600'} font-medium`}>{ order.payment ? 'Done' : 'Pending' }</span></p>
                <p>Date : {new Date(order.date).toLocaleDateString()}</p>
                <p>Time: {new Date(order.date).toLocaleTimeString()}</p>
              </div>
              <div className='text-right mr-3'>
                <p className='text-[11px] uppercase tracking-wider text-gray-400'>Payable Amount</p>
                <p className='text-sm sm:text-[15px] font-semibold'>{currency}{order.amount}</p>
              </div>
              <select onChange={(event)=>statusHandler(event,order._id)} value={order.status} className='p-2 font-semibold'>
                <option value="Order Placed">Order Placed</option>
                <option value="Packing">Packing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for delivery">Out for delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Orders