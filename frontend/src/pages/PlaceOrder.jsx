import { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const PlaceOrder = () => {

<<<<<<< HEAD
    const [method, setMethod] = useState('cod');
=======
    const [method, setMethod] = useState('razorpay');
>>>>>>> 8a2bd36143404301793d0f415d3f73208d9e9099
    const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products, currency } = useContext(ShopContext);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zipcode: '',
        country: '',
        phone: ''
    })
    const [couponCode, setCouponCode] = useState('')
    const [couponInfo, setCouponInfo] = useState(null)
    const [couponLoading, setCouponLoading] = useState(false)

    const onChangeHandler = (event) => {
        const name = event.target.name
        const value = event.target.value
        setFormData(data => ({ ...data, [name]: value }))
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
                console.log(response)
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

            let orderItems = []

            for (const items in cartItems) {
                for (const item in cartItems[items]) {
                    if (cartItems[items][item] > 0) {
                        // items may be composite key productId::variantId
                        const [productId, variantId] = items.split('::')
                        const product = structuredClone(products.find(product => product._id === productId))
                        const itemInfo = product
                        // attach variant info if present
                        if (itemInfo && variantId) {
                            const variant = itemInfo.variants && (itemInfo.variants.find(v => (v.id && v.id.toString() === variantId.toString()) ) || (itemInfo.variants[Number(variantId)]))
                            if (variant) {
                                itemInfo.variant = {
                                    id: variant.id || Number(variantId),
                                    colorName: variant.colorName || variant.color || variant.name || '',
                                    colorHex: variant.colorHex || variant.color || variant.hex || '',
                                    sku: variant.sku || ''
                                }
                                // override image and price if variant provides them
                                if (variant.images && variant.images.length) itemInfo.image = variant.images
                                if (variant.price) itemInfo.price = variant.price
                            }
                        }
                        if (itemInfo) {
                            itemInfo.size = item
                            itemInfo.quantity = cartItems[items][item]
                            orderItems.push(itemInfo)
                        }
                    }
                }
            }

            let baseAmount = getCartAmount() + delivery_fee
            let finalAmount = baseAmount
            if (couponInfo && couponInfo.discount) {
                finalAmount = couponInfo.newAmount
            }

            let orderData = {
                address: formData,
                items: orderItems,
                amount: finalAmount,
                couponCode: couponInfo ? couponInfo.coupon.code : null
            }
            

            switch (method) {

                // API Calls for COD
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
        <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
            {/* ------------- Left Side ---------------- */}
            <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>

                <div className='text-xl sm:text-2xl my-3'>
                    <Title text1={'DELIVERY'} text2={'INFORMATION'} />
                </div>
                <div className='flex gap-3'>
                    <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='First name' />
                    <input required onChange={onChangeHandler} name='lastName' value={formData.lastName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Last name' />
                </div>
                <input required onChange={onChangeHandler} name='email' value={formData.email} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="email" placeholder='Email address' />
                <input required onChange={onChangeHandler} name='street' value={formData.street} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Street' />
                <div className='flex gap-3'>
                    <input required onChange={onChangeHandler} name='city' value={formData.city} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='City' />
                    <input onChange={onChangeHandler} name='state' value={formData.state} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='State' />
                </div>
                <div className='flex gap-3'>
                    <input required onChange={onChangeHandler} name='zipcode' value={formData.zipcode} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Zipcode' />
                    <input required onChange={onChangeHandler} name='country' value={formData.country} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Country' />
                </div>
                <input required onChange={onChangeHandler} name='phone' value={formData.phone} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Phone' />
            </div>

            {/* ------------- Right Side ------------------ */}
            <div className='mt-8'>

                <div className='mt-8 min-w-80'>
                    <CartTotal />
                </div>

                <div className='mt-12'>
                    <Title text1={'PAYMENT'} text2={'METHOD'} />
                    <div className='mt-4 mb-4'>
                        <label className='text-sm mr-2'>Have a coupon?</label>
                        <input value={couponCode} onChange={e=>setCouponCode(e.target.value)} className='border p-2 mr-2' placeholder='Enter coupon code' />
                        <button onClick={async ()=>{
                            try {
                                if (!couponCode) return toast.error('Enter coupon code')
                                setCouponLoading(true)
                                const res = await axios.post(backendUrl + '/api/coupon/verify', { code: couponCode, amount: getCartAmount() + delivery_fee })
                                setCouponLoading(false)
                                    if (res.data.success) {
                                        // normalize returned fields for use in the UI
                                        setCouponInfo({
                                            coupon: res.data.coupon,
                                            discount: res.data.discount,
                                            newAmount: res.data.newAmount
                                        })
                                        toast.success('Coupon applied')
                                    } else {
                                        toast.error(res.data.message)
                                    }
                            } catch (error) {
                                setCouponLoading(false)
                                toast.error(error.message)
                            }
                        }} className='bg-black text-white px-3 py-1 text-sm'>{couponLoading ? 'Checking...' : 'Add'}</button>

                        {couponInfo && couponInfo.discount !== undefined && (
                            <div className='mt-2 text-sm text-green-600'>Applied {couponInfo.coupon.code}: -{currency}{couponInfo.discount} (New total: {currency}{couponInfo.newAmount})</div>
                        )}
                    </div>
                    {/* --------------- Payment Method Selection ------------- */}
                    <div className='flex gap-3 flex-col lg:flex-row'>
                        {/* <div onClick={() => setMethod('stripe')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-green-400' : ''}`}></p>
                            <img className='h-5 mx-4' src={assets.stripe_logo} alt="" />
                        </div> */}
                        <div onClick={() => setMethod('razorpay')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'razorpay' ? 'bg-green-400' : ''}`}></p>
                            {/* <img className='h-5 mx-4' src={assets.razorpay_logo} alt="" /> */}
                            <p className='text-gray-500 text-sm font-medium mx-4'>PAY ONLINE</p>
                        </div>
                        <div onClick={() => setMethod('cod')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-400' : ''}`}></p>
                            <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
                        </div>
                    </div>

                    <div className='w-full text-end mt-8'>
                        <button type='submit' className='bg-black text-white px-16 py-3 text-sm'>PLACE ORDER</button>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default PlaceOrder
