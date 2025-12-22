import express from 'express'
import adminAuth from '../middleware/adminAuth.js'
import { createCoupon, listCoupons, toggleCoupon, verifyCoupon, deleteCoupon } from '../controllers/couponController.js'

const router = express.Router()

router.post('/create', adminAuth, createCoupon)
router.get('/list', adminAuth, listCoupons)
router.post('/toggle', adminAuth, toggleCoupon)
router.post('/delete', adminAuth, deleteCoupon)
router.post('/verify', verifyCoupon) // public endpoint for frontend to verify coupon

export default router
