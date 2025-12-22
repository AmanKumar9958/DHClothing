import mongoose from 'mongoose'

const couponSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    type: { type: String, enum: ['percent','fixed'], default: 'percent' },
    value: { type: Number, required: true },
    minSubtotal: { type: Number, default: 0 },
    maxDiscount: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
    expiresAt: { type: Number, default: null },
    createdAt: { type: Number, default: Date.now }
})

const couponModel = mongoose.models.coupon || mongoose.model('coupon', couponSchema)
export default couponModel
