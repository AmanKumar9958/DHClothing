import couponModel from '../models/couponModel.js'

// Admin: create a coupon
const createCoupon = async (req,res) => {
    try {
        const { code, type, value, expiresAt, minSubtotal, maxDiscount } = req.body
        if (!code || !value) return res.json({success:false, message: 'Code and value are required'})

        const existing = await couponModel.findOne({ code: code.trim().toUpperCase() })
        if (existing) return res.json({ success:false, message: 'Coupon code already exists' })

        const coupon = new couponModel({ 
            code: code.trim().toUpperCase(), 
            type, 
            value, 
            expiresAt: expiresAt || null,
            minSubtotal: Number(minSubtotal) || 0,
            maxDiscount: Number(maxDiscount) || 0
        })
        await coupon.save()
        res.json({ success:true, coupon })
    } catch (error) {
        console.log(error)
        res.json({ success:false, message: error.message })
    }
}

// Admin: list all coupons
const listCoupons = async (req,res) => {
    try {
        const coupons = await couponModel.find({}).sort({ createdAt: -1 })
        res.json({ success:true, coupons })
    } catch (error) {
        console.log(error)
        res.json({ success:false, message: error.message })
    }
}

// Admin: toggle active state
const toggleCoupon = async (req,res) => {
    try {
        const { couponId, active } = req.body
        await couponModel.findByIdAndUpdate(couponId, { active })
        res.json({ success:true })
    } catch (error) {
        console.log(error)
        res.json({ success:false, message: error.message })
    }
}

// Verify coupon for frontend: returns discount and new amount
const verifyCoupon = async (req,res) => {
    try {
        const { code, amount } = req.body
        if (!code) return res.json({ success:false, message: 'Coupon code is required' })
        const coupon = await couponModel.findOne({ code: code.trim().toUpperCase() })
        if (!coupon) return res.json({ success:false, message: 'Invalid coupon code' })
        if (!coupon.active) return res.json({ success:false, message: 'Coupon is not active' })
        if (coupon.expiresAt && Date.now() > coupon.expiresAt) return res.json({ success:false, message: 'Coupon has expired' })

        const numericAmount = Number(amount) || 0

        if (coupon.minSubtotal && numericAmount < coupon.minSubtotal) {
            return res.json({ success:false, message: `Minimum subtotal of ${coupon.minSubtotal} required` })
        }

        // calculate discount
        let discount = 0
        if (coupon.type === 'percent') {
            discount = Math.round((numericAmount * coupon.value) / 100)
        } else {
            discount = Number(coupon.value)
        }

        if (coupon.maxDiscount && coupon.maxDiscount > 0 && discount > coupon.maxDiscount) {
            discount = coupon.maxDiscount
        }

        if (discount > numericAmount) discount = numericAmount

        const newAmount = Math.max(0, numericAmount - discount)

        res.json({ 
            success:true, 
            coupon: { 
                code: coupon.code, 
                type: coupon.type, 
                value: coupon.value,
                minSubtotal: coupon.minSubtotal,
                maxDiscount: coupon.maxDiscount
            }, 
            discount, 
            newAmount 
        })

    } catch (error) {
        console.log(error)
        res.json({ success:false, message: error.message })
    }
}

// Admin: delete coupon
const deleteCoupon = async (req,res) => {
    try {
        const { id } = req.body
        await couponModel.findByIdAndDelete(id)
        res.json({ success:true, message: 'Coupon deleted' })
    } catch (error) {
        console.log(error)
        res.json({ success:false, message: error.message })
    }
}

export { createCoupon, listCoupons, toggleCoupon, verifyCoupon, deleteCoupon }
