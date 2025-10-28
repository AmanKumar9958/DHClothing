import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import couponModel from "../models/couponModel.js";
import productModel from "../models/productModel.js";
import Stripe from 'stripe'
import razorpay from 'razorpay'

// global variables
const currency = 'inr'

// gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const razorpayInstance = new razorpay({
    key_id : process.env.RAZORPAY_KEY_ID,
    key_secret : process.env.RAZORPAY_KEY_SECRET,
})

// Compute subtotal from items using server-side product data (no deals)
const computeSubtotalFromItems = async (items) => {
    if (!Array.isArray(items)) return 0
    let total = 0
    for (const it of items) {
        try {
            const id = it._id || it.productId || (it.id && it.id._id)
            if (!id) continue
            const prod = await productModel.findById(id)
            if (!prod) continue
            let price = Number(prod.price) || 0
            // try variant override if provided
            if (it.variant && (it.variant.id || it.variant.colorName || it.variant.colorHex)) {
                const byId = it.variant.id && Array.isArray(prod.variants) && prod.variants.find(v => (v.id && v.id.toString() === it.variant.id.toString()))
                let variantDoc = byId
                if (!variantDoc && Array.isArray(prod.variants)) {
                    variantDoc = prod.variants.find(v => (
                        (it.variant.colorHex && (v.colorHex === it.variant.colorHex)) ||
                        (it.variant.colorName && (v.colorName === it.variant.colorName))
                    ))
                }
                if (variantDoc && variantDoc.price) {
                    price = Number(variantDoc.price)
                }
            }
            const qty = Number(it.quantity) || 0
            total += price * qty
        } catch (e) {
            // skip invalid rows
        }
    }
    return total
}

// Compute subtotal applying bundle deals for Oversize and Regular fit, never charging more than base prices
const computeSubtotalWithDeals = async (items) => {
    if (!Array.isArray(items)) return 0
    let total = 0
    let oversizeCount = 0, oversizeBase = 0
    let regularCount = 0, regularBase = 0

    for (const it of items) {
        try {
            const id = it._id || it.productId || (it.id && it.id._id)
            if (!id) continue
            const prod = await productModel.findById(id)
            if (!prod) continue
            let price = Number(prod.price) || 0
            // variant override
            if (it.variant && (it.variant.id || it.variant.colorName || it.variant.colorHex)) {
                const byId = it.variant.id && Array.isArray(prod.variants) && prod.variants.find(v => (v.id && v.id.toString() === it.variant.id.toString()))
                let variantDoc = byId
                if (!variantDoc && Array.isArray(prod.variants)) {
                    variantDoc = prod.variants.find(v => (
                        (it.variant.colorHex && (v.colorHex === it.variant.colorHex)) ||
                        (it.variant.colorName && (v.colorName === it.variant.colorName))
                    ))
                }
                if (variantDoc && variantDoc.price) {
                    price = Number(variantDoc.price)
                }
            }
            const qty = Number(it.quantity) || 0
            const sc = (prod.subCategory || '').toLowerCase()
            if (sc === 'oversize') {
                oversizeCount += qty
                oversizeBase += price * qty
            } else if (sc === 'regular fit') {
                regularCount += qty
                regularBase += price * qty
            } else {
                total += price * qty
            }
        } catch (e) { /* ignore */ }
    }

    const priceOversize = (n) => {
        let t = 0
        while (n >= 3) { t += 999; n -= 3 }
        if (n === 2) t += 799
        else if (n === 1) t += 499
        return t
    }
    const priceRegular = (n) => {
        let t = 0
        while (n >= 4) { t += 999; n -= 4 }
        while (n >= 3) { t += 799; n -= 3 }
        if (n > 0) t += n * 299
        return t
    }

    total += Math.min(oversizeBase, priceOversize(oversizeCount))
    total += Math.min(regularBase, priceRegular(regularCount))

    return total
}

// Placing orders using COD Method
const placeOrder = async (req,res) => {
    try {
    const { userId, items, address, couponCode } = req.body;

        // compute subtotal from items server-side
    const subtotal = await computeSubtotalWithDeals(items)
    const shipping = 79 // COD only
    let finalAmount = subtotal + shipping
        let discountAmount = 0
        if (couponCode) {
            const c = await couponModel.findOne({ code: couponCode.trim().toUpperCase() })
            if (!c || !c.active || (c.expiresAt && Date.now() > c.expiresAt)) {
                return res.json({ success:false, message: 'Invalid or inactive coupon' })
            }
            if (c.type === 'percent') discountAmount = Math.round((finalAmount * c.value)/100)
            else discountAmount = Number(c.value)
            if (discountAmount > finalAmount) discountAmount = finalAmount
            finalAmount = Math.max(0, finalAmount - discountAmount)
        }

        const orderData = {
            userId,
            items,
            address,
            amount: finalAmount,
            couponCode: couponCode || null,
            discount: discountAmount || 0,
            paymentMethod:"COD",
            payment:false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        await userModel.findByIdAndUpdate(userId,{cartData:{}})

        res.json({success:true,message:"Order Placed"})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }

}

// Placing orders using Stripe Method
const placeOrderStripe = async (req,res) => {
    try {
    const { userId, items, address, couponCode } = req.body
        const { origin } = req.headers;

        // compute subtotal from items server-side
    const subtotal = await computeSubtotalWithDeals(items)
    let finalAmount = subtotal // Online has no delivery charge
        let discountAmount = 0
        if (couponCode) {
            const c = await couponModel.findOne({ code: couponCode.trim().toUpperCase() })
            if (!c || !c.active || (c.expiresAt && Date.now() > c.expiresAt)) {
                return res.json({ success:false, message: 'Invalid or inactive coupon' })
            }
            if (c.type === 'percent') discountAmount = Math.round((finalAmount * c.value)/100)
            else discountAmount = Number(c.value)
            if (discountAmount > finalAmount) discountAmount = finalAmount
            finalAmount = Math.max(0, finalAmount - discountAmount)
        }

        const orderData = {
            userId,
            items,
            address,
            amount: finalAmount,
            couponCode: couponCode || null,
            discount: discountAmount || 0,
            paymentMethod:"Stripe",
            payment:false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        // Use a single line item for total amount so Stripe charges the discounted total
        const line_items = [{
            price_data: {
                currency:currency,
                product_data: { name: 'Order Payment' },
                unit_amount: Math.round(finalAmount * 100)
            },
            quantity: 1
        }]

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url:  `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: 'payment',
        })

        res.json({success:true,session_url:session.url});

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

// Verify Stripe 
const verifyStripe = async (req,res) => {

    const { orderId, success, userId } = req.body

    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, {payment:true});
            await userModel.findByIdAndUpdate(userId, {cartData: {}})
            res.json({success: true});
        } else {
            await orderModel.findByIdAndDelete(orderId)
            res.json({success:false})
        }
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }

}

// Placing orders using Razorpay Method
const placeOrderRazorpay = async (req,res) => {
    try {
    const { userId, items, address, couponCode } = req.body

        // compute subtotal from items server-side
    const subtotal = await computeSubtotalWithDeals(items)
    let finalAmount = subtotal // Online has no delivery charge
        let discountAmount = 0
        if (couponCode) {
            const c = await couponModel.findOne({ code: couponCode.trim().toUpperCase() })
            if (!c || !c.active || (c.expiresAt && Date.now() > c.expiresAt)) {
                return res.json({ success:false, message: 'Invalid or inactive coupon' })
            }
            if (c.type === 'percent') discountAmount = Math.round((finalAmount * c.value)/100)
            else discountAmount = Number(c.value)
            if (discountAmount > finalAmount) discountAmount = finalAmount
            finalAmount = Math.max(0, finalAmount - discountAmount)
        }

        const orderData = {
            userId,
            items,
            address,
            amount: finalAmount,
            couponCode: couponCode || null,
            discount: discountAmount || 0,
            paymentMethod:"Razorpay",
            payment:false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        const options = {
            amount: Math.round(finalAmount * 100),
            currency: currency.toUpperCase(),
            receipt : newOrder._id.toString()
        }

        await razorpayInstance.orders.create(options, (error,order)=>{
            if (error) {
                console.log(error)
                return res.json({success:false, message: error})
            }
            res.json({success:true,order})
        })

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

const verifyRazorpay = async (req,res) => {
    try {
        
        const { userId, razorpay_order_id  } = req.body

        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
        if (orderInfo.status === 'paid') {
            await orderModel.findByIdAndUpdate(orderInfo.receipt,{payment:true});
            await userModel.findByIdAndUpdate(userId,{cartData:{}})
            res.json({ success: true, message: "Payment Successful" })
        } else {
             res.json({ success: false, message: 'Payment Failed' });
        }

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}


// All Orders data for Admin Panel
const allOrders = async (req,res) => {

    try {
        
        const orders = await orderModel.find({})
        res.json({success:true,orders})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }

}

// User Order Data For Forntend
const userOrders = async (req,res) => {
    try {
        
        const { userId } = req.body

        const orders = await orderModel.find({ userId })
        res.json({success:true,orders})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

// update order status from Admin Panel
const updateStatus = async (req,res) => {
    try {
        
        const { orderId, status } = req.body

        await orderModel.findByIdAndUpdate(orderId, { status })
        res.json({success:true,message:'Status Updated'})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

export {verifyRazorpay, verifyStripe ,placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateStatus}