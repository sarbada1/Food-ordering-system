import express from 'express'
import authMiddleware from '../middleware/auth.js'
import { placeOrder, verifyPayment } from '../controllers/orderController.js';

const orderRouter= express.Router();
orderRouter.post('/place-order',authMiddleware,placeOrder)
orderRouter.post('/khalti-verify',authMiddleware,verifyPayment)

export default orderRouter