import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import LazyImage from '../components/LazyImage';
import FadeIn, { FadeInItem } from '../components/FadeIn';

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

  // Helper to format date nicely
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  }

  const getStatusColor = (status) => {
    const s = status.toLowerCase()
    if (s.includes('delivered')) return 'bg-green-100 text-green-700 border-green-200'
    if (s.includes('shipped')) return 'bg-blue-100 text-blue-700 border-blue-200'
    if (s.includes('processing') || s.includes('packing')) return 'bg-orange-100 text-orange-700 border-orange-200'
    return 'bg-brand-cream text-brand-black border-brand-gold/30'
  }

  return (
    <div className='min-h-[80vh] bg-brand-cream pb-24'>
        <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
            <FadeIn>
                <div className='text-3xl sm:text-4xl mb-8 font-medium'>
                    <Title text1={'MY'} text2={'ORDERS'}/>
                </div>

                {loading ? (
                    <div className='bg-white rounded-3xl p-16 shadow-soft border border-neutral-100 flex justify-center'>
                        <LoadingSpinner />
                    </div>
                ) : orderData.length === 0 ? (
                    <div className='bg-white rounded-3xl p-16 shadow-soft border border-neutral-100 flex flex-col items-center text-center'>
                        <div className='w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mb-6'>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-neutral-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16v-2"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                        </div>
                        <h2 className='font-display text-2xl font-semibold mb-2'>No orders yet</h2>
                        <p className='text-neutral-500 mb-8 max-w-sm'>You haven't placed any orders. Start browsing our collection to find something you love.</p>
                        <a href='/collection' className='btn-primary'>Browse Collection</a>
                    </div>
                ) : (
                    <div className='space-y-6'>
                        {orderData.map((item, index) => (
                            <FadeInItem key={index}>
                                <div className='bg-white rounded-2xl p-6 shadow-soft border border-neutral-100 hover:shadow-soft-lg transition-shadow duration-300'>
                                    
                                    <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-neutral-100'>
                                        <div>
                                            <p className='text-sm text-neutral-500 mb-1'>Order placed on</p>
                                            <p className='font-medium text-brand-black'>{formatDate(item.date)}</p>
                                        </div>
                                        <div className='flex items-center gap-3'>
                                            <div className={`px-3 py-1.5 rounded-full border text-xs font-semibold uppercase tracking-wider flex items-center gap-2 ${getStatusColor(item.status)}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${getStatusColor(item.status).split(' ')[1].replace('text-', 'bg-')}`}></span>
                                                {item.status}
                                            </div>
                                        </div>
                                    </div>

                                    <div className='flex flex-col md:flex-row gap-6'>
                                        <div className='flex-shrink-0 w-24 sm:w-32 aspect-[3/4] rounded-xl overflow-hidden bg-neutral-50'>
                                            <LazyImage 
                                                className='w-full h-full object-cover' 
                                                src={item.image[0]} 
                                                alt={item.name} 
                                                skeletonClass="w-full h-full"
                                            />
                                        </div>
                                        
                                        <div className='flex-1 flex flex-col justify-center'>
                                            <h3 className='text-lg font-medium text-brand-black mb-2'>{item.name}</h3>
                                            
                                            <div className='flex flex-wrap items-center gap-x-6 gap-y-2 mb-4'>
                                                <div className='flex flex-col'>
                                                    <span className='text-xs text-neutral-400'>Price</span>
                                                    <span className='font-medium'>{currency}{item.price}</span>
                                                </div>
                                                <div className='flex flex-col'>
                                                    <span className='text-xs text-neutral-400'>Quantity</span>
                                                    <span className='font-medium'>{item.quantity}</span>
                                                </div>
                                                <div className='flex flex-col'>
                                                    <span className='text-xs text-neutral-400'>Size</span>
                                                    <span className='font-medium bg-neutral-100 px-2 py-0.5 rounded text-sm mt-0.5'>{item.size}</span>
                                                </div>
                                                {(() => {
                                                    const v = item.variant || {}
                                                    const colorHex = (v && (v.colorHex || v.color || v.hex || v.colorCode)) || ''
                                                    const colorName = (v && (v.colorName || v.color || v.name)) || ''
                                                    if (!colorHex && !colorName) return null
                                                    return (
                                                        <div className='flex flex-col'>
                                                            <span className='text-xs text-neutral-400'>Color</span>
                                                            <div className='flex items-center gap-1.5 mt-0.5'>
                                                                <span className='w-4 h-4 rounded-full border border-black/10 shadow-inner' style={{background: colorHex || '#ddd'}}></span>
                                                                <span className='font-medium text-sm capitalize'>{colorName}</span>
                                                            </div>
                                                        </div>
                                                    )
                                                })()}
                                            </div>

                                            <div className='flex flex-wrap items-center gap-3'>
                                                <span className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-50 text-neutral-600 text-xs font-medium border border-neutral-200'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                                                    {item.paymentMethod.toUpperCase()}
                                                </span>
                                                
                                                {item.couponCode && (
                                                    <span className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-green-50 text-green-700 text-xs font-medium border border-green-200'>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                                                        {item.couponCode} applied (-{currency}{item.orderDiscount})
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className='md:w-1/4 flex flex-col justify-between items-end md:border-l md:border-neutral-100 md:pl-6 mt-4 md:mt-0'>
                                            <div className='text-right w-full flex md:flex-col justify-between items-center md:items-end mb-4 md:mb-0'>
                                                <span className='text-xs text-neutral-400'>Total Paid</span>
                                                <span className='font-display text-xl sm:text-2xl font-semibold text-brand-black'>{currency}{item.orderAmount}</span>
                                            </div>
                                            
                                            <button onClick={loadOrderData} className='btn-secondary w-full text-center py-2.5 !text-xs !px-4'>
                                                Track Order
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </FadeInItem>
                        ))}
                    </div>
                )}
            </FadeIn>
        </div>
    </div>
  )
}

export default Orders
