import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { placeOrder, verifyPayment, verifyResponse } from '../controllers/orderController.js';

const orderRouter = express.Router();
orderRouter.post('/place', authMiddleware, placeOrder);
orderRouter.post('/khalti-verify', authMiddleware, verifyPayment);
orderRouter.get('/verify', verifyResponse); // Add this route to handle the verification response

export default orderRouter;
