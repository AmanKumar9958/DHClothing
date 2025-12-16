import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import LazyImage from '../components/LazyImage';

const Orders = () => {

  const { backendUrl, token , currency} = useContext(ShopContext);

  const [orderData,setorderData] = useState([])
  const [loading, setLoading] = useState(false);

  const loadOrderData = async () => {
    try {
      if (!token) {
        return null
      }
      setLoading(true);

      const response = await axios.post(backendUrl + '/api/order/userorders',{},{headers:{token}})
      if (response.data.success) {
        let allOrdersItem = []
        response.data.orders.map((order)=>{
          order.items.map((item)=>{
            item['status'] = order.status
            item['payment'] = order.payment
            item['paymentMethod'] = order.paymentMethod
            item['date'] = order.date
            item['couponCode'] = order.couponCode || null
            item['orderAmount'] = order.amount
            item['orderDiscount'] = order.discount || 0
            allOrdersItem.push(item)
          })
        })
        setorderData(allOrdersItem.reverse())
      }
      
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false);
    }
  }

  useEffect(()=>{
    loadOrderData()
  },[token])

  return (
    <div className='border-t pt-16'>

        <div className='text-2xl'>
            <Title text1={'MY'} text2={'ORDERS'}/>
        </div>

        {loading ? (
          <div className='py-10'>
            <LoadingSpinner />
          </div>
        ) : (
          <div>
            {
              orderData.map((item,index) => (
                <div key={index} className='py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                    <div className='flex items-start gap-6 text-sm'>
                        <LazyImage 
                            className='w-full h-full object-cover' 
                            wrapperClassName='w-16 sm:w-20'
                            src={item.image[0]} 
                            alt={item.name} 
                            skeletonClass="w-full h-20"
                        />
                        <div>
                          <p className='sm:text-base font-medium'>{item.name}</p>
                          {item.couponCode && (
                            <div className='mt-1 inline-flex items-center gap-2 px-2 py-1 rounded bg-green-50 text-green-700 border border-green-200 text-xs'>
                              Coupon {item.couponCode} applied • -{currency}{item.orderDiscount}
                            </div>
                          )}
                          <div className='flex items-center gap-3 mt-1 text-base text-gray-700'>
                            <p>{currency}{item.price}</p>
                            <p>Quantity: {item.quantity}</p>
                            <p>Size: {item.size}</p>
                            {(() => {
                              const v = item.variant || {}
                              const colorHex = (v && (v.colorHex || v.color || v.hex || v.colorCode)) || ''
                              const colorName = (v && (v.colorName || v.color || v.name)) || ''
                              if (!colorHex && !colorName) return null
                              return (
                                <p className='flex items-center gap-2'>
                                  <span className='w-4 h-4 rounded-full inline-block' style={{background: colorHex || '#ddd'}}></span>
                                  <span>{colorName}</span>
                                </p>
                              )
                            })()}
                          </div>
                          <p className='mt-1'>Date: <span className=' text-gray-400'>{new Date(item.date).toDateString()}</span></p>
                          <p className='mt-1'>Time: <span className=' text-gray-400'>{new Date(item.date).toLocaleTimeString()}</span></p>
                          <p className='mt-1'>Coupon: <span className=' text-gray-400'>{item.couponCode || 'N/A'}</span></p>
                          <p className='mt-1'><span className='text-gray-400'>Payable Amount:</span> <span className='text-gray-800 font-medium'>{currency}{item.orderAmount}</span></p>
                          <p className='mt-1'>Method: <span className='inline-block px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-medium'>{item.paymentMethod}</span></p>
                        </div>
                    </div>
                    <div className='md:w-1/2 flex justify-between'>
                        <div className='flex items-center gap-2'>
                            <p className='min-w-2 h-2 rounded-full bg-green-500'></p>
                            <p className='text-sm md:text-base'>{item.status}</p>
                        </div>
                        <button onClick={loadOrderData} className='border px-4 py-2 text-sm font-medium rounded-sm'>Track Order</button>
                    </div>
                </div>
              ))
            }
        </div>
        )}
    </div>
  )
}

export default Orders
