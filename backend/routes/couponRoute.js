import express from 'express'
import adminAuth from '../middleware/adminAuth.js'
import { createCoupon, listCoupons, toggleCoupon, verifyCoupon } from '../controllers/couponController.js'

const router = express.Router()

router.post('/create', adminAuth, createCoupon)
router.get('/list', adminAuth, listCoupons)
router.post('/toggle', adminAuth, toggleCoupon)
router.post('/verify', verifyCoupon) // public endpoint for frontend to verify coupon

export default router
