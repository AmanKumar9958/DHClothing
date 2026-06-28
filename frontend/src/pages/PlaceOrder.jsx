import { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import FadeIn from '../components/FadeIn'
import { assets } from '../assets/assets'

const PlaceOrder = () => {

    const [method, setMethod] = useState('razorpay');
    const { navigate, backendUrl, token, cartItems, setCartItems, products, currency, applyCoupon, coupon, discountAmount, removeCoupon } = useContext(ShopContext);
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', street: '', city: '', state: '', zipcode: '', country: '', phone: ''
    })
    const [couponCodeInput, setCouponCodeInput] = useState('')
    const [couponLoading, setCouponLoading] = useState(false)

    const onChangeHandler = (event) => {
        const name = event.target.name
        const value = event.target.value
        setFormData(data => ({ ...data, [name]: value }))
    }

    let hoodieCount = 0;
    for (const items in cartItems) {
        const [productId] = items.split('::');
        const product = products.find(p => p._id === productId);
        if (product && (product.subCategory || '').toLowerCase() === 'hoodie') {
             for (const size in cartItems[items]) {
                 hoodieCount += cartItems[items][size];
             }
        }
    }

    let shippingFee = 0;
    if (hoodieCount >= 2) {
        shippingFee = 0;
    } else if (hoodieCount === 1) {
        shippingFee = 79;
    } else {
        shippingFee = method === 'cod' ? 79 : 0;
    }

    const buildOrderItemsAndSubtotal = () => {
        let orderItems = []
        let subtotal = 0
        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                if (cartItems[items][item] > 0) {
                    const [productId, variantId] = items.split('::')
                    const product = structuredClone(products.find(p => p._id === productId))
                    if (!product) continue
                    if (variantId) {
                        const variant = product.variants && (product.variants.find(v => (v.id && v.id.toString() === variantId.toString())) || (product.variants[Number(variantId)]))
                        if (variant) {
                            product.variant = {
                                id: variant.id || Number(variantId),
                                colorName: variant.colorName || variant.color || variant.name || '',
                                colorHex: variant.colorHex || variant.color || variant.hex || '',
                                sku: variant.sku || ''
                            }
                            if (variant.images && variant.images.length) product.image = variant.images
                            if (variant.price) product.price = variant.price
                        }
                    }
                    const qty = cartItems[items][item]
                    product.size = item
                    product.quantity = qty
                    orderItems.push(product)
                    const price = Number(product.price) || 0
                    subtotal += price * qty
                }
            }
        }
        return { items: orderItems, subtotal }
    }

    const initPay = (order) => {
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            name:'Order Payment',
            description:'Order Payment',
            order_id: order.id,
            receipt: order.receipt,
            handler: async (response) => {
                try {
                    const { data } = await axios.post(backendUrl + '/api/order/verifyRazorpay',response,{headers:{token}})
                    if (data.success) {
                        navigate('/orders')
                        setCartItems({})
                    }
                } catch (error) {
                    console.log(error)
                    toast.error(error)
                }
            }
        }
        const rzp = new window.Razorpay(options)
        rzp.open()
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault()
        try {
            const { items: orderItems, subtotal } = buildOrderItemsAndSubtotal()
            let baseAmount = subtotal + shippingFee
            let finalAmount = baseAmount - discountAmount
            if (finalAmount < 0) finalAmount = 0

            let orderData = {
                address: formData,
                items: orderItems,
                amount: finalAmount,
                couponCode: coupon ? coupon.code : null
            }
            
            switch (method) {
                case 'cod': {
                    const response = await axios.post(backendUrl + '/api/order/place',orderData,{headers:{token}})
                    if (response.data.success) {
                        setCartItems({})
                        navigate('/orders')
                    } else {
                        toast.error(response.data.message)
                    }
                    break;
                }
                case 'stripe': {
                    const responseStripe = await axios.post(backendUrl + '/api/order/stripe',orderData,{headers:{token}})
                    if (responseStripe.data.success) {
                        const {session_url} = responseStripe.data
                        window.location.replace(session_url)
                    } else {
                        toast.error(responseStripe.data.message)
                    }
                    break;
                }
                case 'razorpay': {
                    const responseRazorpay = await axios.post(backendUrl + '/api/order/razorpay', orderData, {headers:{token}})
                    if (responseRazorpay.data.success) {
                        initPay(responseRazorpay.data.order)
                    }
                    break;
                }
                default:
                    break;
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }


    return (
        <div className='min-h-screen bg-brand-cream pb-24'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
                <FadeIn>
                    <div className='text-3xl sm:text-4xl mb-8 font-medium'>
                        <Title text1={'SECURE'} text2={'CHECKOUT'} />
                    </div>

                    <form onSubmit={onSubmitHandler} className='flex flex-col lg:flex-row gap-10 lg:gap-12'>
                        
                        {/* ------------- Left Side: Address ---------------- */}
                        <div className='lg:w-2/3'>
                            <div className='bg-white rounded-3xl p-6 sm:p-10 shadow-soft border border-neutral-100'>
                                <h2 className='font-display text-xl sm:text-2xl font-medium mb-8 text-brand-black flex items-center gap-3'>
                                    <span className='flex items-center justify-center w-8 h-8 rounded-full bg-brand-black text-white text-sm'>1</span>
                                    Delivery Information
                                </h2>
                                
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                                    <div className='space-y-1.5'>
                                        <label className='text-sm font-medium text-neutral-700 ml-1'>First Name <span className='text-red-500'>*</span></label>
                                        <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} className='w-full border border-neutral-200 rounded-xl px-4 py-3 bg-neutral-50 focus:bg-white transition-colors' type="text" placeholder='John' />
                                    </div>
                                    <div className='space-y-1.5'>
                                        <label className='text-sm font-medium text-neutral-700 ml-1'>Last Name <span className='text-red-500'>*</span></label>
                                        <input required onChange={onChangeHandler} name='lastName' value={formData.lastName} className='w-full border border-neutral-200 rounded-xl px-4 py-3 bg-neutral-50 focus:bg-white transition-colors' type="text" placeholder='Doe' />
                                    </div>
                                    <div className='space-y-1.5 md:col-span-2'>
                                        <label className='text-sm font-medium text-neutral-700 ml-1'>Email Address <span className='text-red-500'>*</span></label>
                                        <input required onChange={onChangeHandler} name='email' value={formData.email} className='w-full border border-neutral-200 rounded-xl px-4 py-3 bg-neutral-50 focus:bg-white transition-colors' type="email" placeholder='john.doe@example.com' />
                                    </div>
                                    <div className='space-y-1.5 md:col-span-2'>
                                        <label className='text-sm font-medium text-neutral-700 ml-1'>Street Address <span className='text-red-500'>*</span></label>
                                        <input required onChange={onChangeHandler} name='street' value={formData.street} className='w-full border border-neutral-200 rounded-xl px-4 py-3 bg-neutral-50 focus:bg-white transition-colors' type="text" placeholder='123 Main St, Apt 4B' />
                                    </div>
                                    <div className='space-y-1.5'>
                                        <label className='text-sm font-medium text-neutral-700 ml-1'>City <span className='text-red-500'>*</span></label>
                                        <input required onChange={onChangeHandler} name='city' value={formData.city} className='w-full border border-neutral-200 rounded-xl px-4 py-3 bg-neutral-50 focus:bg-white transition-colors' type="text" placeholder='New York' />
                                    </div>
                                    <div className='space-y-1.5'>
                                        <label className='text-sm font-medium text-neutral-700 ml-1'>State / Province</label>
                                        <input onChange={onChangeHandler} name='state' value={formData.state} className='w-full border border-neutral-200 rounded-xl px-4 py-3 bg-neutral-50 focus:bg-white transition-colors' type="text" placeholder='NY' />
                                    </div>
                                    <div className='space-y-1.5'>
                                        <label className='text-sm font-medium text-neutral-700 ml-1'>ZIP / Postal Code <span className='text-red-500'>*</span></label>
                                        <input required onChange={onChangeHandler} name='zipcode' value={formData.zipcode} className='w-full border border-neutral-200 rounded-xl px-4 py-3 bg-neutral-50 focus:bg-white transition-colors' type="text" placeholder='10001' />
                                    </div>
                                    <div className='space-y-1.5'>
                                        <label className='text-sm font-medium text-neutral-700 ml-1'>Country <span className='text-red-500'>*</span></label>
                                        <input required onChange={onChangeHandler} name='country' value={formData.country} className='w-full border border-neutral-200 rounded-xl px-4 py-3 bg-neutral-50 focus:bg-white transition-colors' type="text" placeholder='United States' />
                                    </div>
                                    <div className='space-y-1.5 md:col-span-2'>
                                        <label className='text-sm font-medium text-neutral-700 ml-1'>Phone Number <span className='text-red-500'>*</span></label>
                                        <input required onChange={onChangeHandler} name='phone' value={formData.phone} className='w-full border border-neutral-200 rounded-xl px-4 py-3 bg-neutral-50 focus:bg-white transition-colors' type="tel" placeholder='+1 (555) 000-0000' />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ------------- Right Side: Payment & Totals ------------------ */}
                        <div className='lg:w-1/3'>
                            <div className='bg-white rounded-3xl p-6 shadow-soft border border-neutral-100 flex flex-col gap-8 sticky top-28'>
                                
                                {/* Totals Component */}
                                <div>
                                    <CartTotal deliveryFee={shippingFee} />
                                </div>

                                {/* Promo Code */}
                                <div>
                                    <div className='flex items-center justify-between mb-2'>
                                        <label className='text-sm font-medium text-brand-black'>Gift card or discount code</label>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <input 
                                            value={couponCodeInput} 
                                            onChange={e=>setCouponCodeInput(e.target.value)} 
                                            className='flex-1 border border-neutral-200 rounded-lg px-4 py-2.5 outline-none focus:border-brand-black transition-colors text-sm uppercase' 
                                            placeholder='Enter code' 
                                        />
                                        <button 
                                            type='button' 
                                            onClick={async ()=>{
                                                if (!couponCodeInput) return toast.error('Enter coupon code')
                                                setCouponLoading(true)
                                                await applyCoupon(couponCodeInput)
                                                setCouponLoading(false)
                                            }} 
                                            className='bg-brand-black text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-brand-charcoal transition-colors'
                                        >
                                            {couponLoading ? '...' : 'Apply'}
                                        </button>
                                    </div>
                                    {coupon && (
                                        <div className='mt-2 flex items-center justify-between px-3 py-2 bg-green-50 border border-green-100 rounded-lg text-xs'>
                                            <span className='text-green-700 font-medium'>Code {coupon.code} applied (-{currency}{discountAmount})</span>
                                            <button type='button' onClick={()=>{ removeCoupon(); setCouponCodeInput('') }} className='text-red-500 hover:text-red-600 underline'>Remove</button>
                                        </div>
                                    )}
                                </div>

                                {/* Payment Methods */}
                                <div>
                                    <h3 className='font-display text-xl font-medium mb-4 text-brand-black flex items-center gap-3'>
                                        <span className='flex items-center justify-center w-7 h-7 rounded-full bg-brand-black text-white text-xs'>2</span>
                                        Payment Method
                                    </h3>
                                    
                                    <div className='flex flex-col gap-3'>
                                        {/* Razorpay Option */}
                                        <label className={`relative flex items-center justify-between p-4 cursor-pointer rounded-xl border-2 transition-all ${method === 'razorpay' ? 'border-brand-black bg-neutral-50' : 'border-neutral-200 hover:border-neutral-300'}`}>
                                            <div className='flex items-center gap-3'>
                                                <input 
                                                    type="radio" 
                                                    name="paymentMethod" 
                                                    checked={method === 'razorpay'} 
                                                    onChange={() => setMethod('razorpay')}
                                                    className="w-4 h-4 text-brand-black bg-gray-100 border-gray-300 focus:ring-brand-black focus:ring-2" 
                                                />
                                                <span className='font-medium text-brand-black'>Pay Online securely</span>
                                            </div>
                                            <div className="flex gap-1">
                                                 <img className='h-5 opacity-70' src={assets.razorpay_logo} alt="Razorpay" />
                                            </div>
                                        </label>

                                        {/* COD Option */}
                                        <label className={`relative flex items-center justify-between p-4 cursor-pointer rounded-xl border-2 transition-all ${method === 'cod' ? 'border-brand-black bg-neutral-50' : 'border-neutral-200 hover:border-neutral-300'}`}>
                                            <div className='flex items-center gap-3'>
                                                <input 
                                                    type="radio" 
                                                    name="paymentMethod" 
                                                    checked={method === 'cod'} 
                                                    onChange={() => setMethod('cod')}
                                                    className="w-4 h-4 text-brand-black bg-gray-100 border-gray-300 focus:ring-brand-black focus:ring-2" 
                                                />
                                                <div className='flex flex-col'>
                                                    <span className='font-medium text-brand-black'>Cash on Delivery</span>
                                                    <span className='text-xs text-neutral-500'>Pay when you receive the order</span>
                                                </div>
                                            </div>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M12 12h.01"/><path d="M17 12h.01"/><path d="M7 12h.01"/></svg>
                                        </label>
                                    </div>
                                </div>

                                <div className='pt-4 border-t border-neutral-100'>
                                    <button type='submit' className='btn-primary w-full py-4 text-base rounded-xl shadow-soft group relative overflow-hidden'>
                                        <span className='relative z-10 flex items-center justify-center gap-2'>
                                            Complete Order
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                                        </span>
                                    </button>
                                    <p className='text-center text-xs text-neutral-400 mt-4 flex items-center justify-center gap-1.5'>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                        Secure encrypted checkout
                                    </p>
                                </div>

                            </div>
                        </div>
                    </form>
                </FadeIn>
            </div>
        </div>
    )
}

export default PlaceOrder
