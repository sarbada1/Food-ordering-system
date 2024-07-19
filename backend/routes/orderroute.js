import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  placeOrder,
  verifyPayment,
  verifyResponse,
  getAllOrders,
  deleteOrder,
} from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/khalti-verify", authMiddleware, verifyPayment);
orderRouter.get("/verify", verifyResponse);
orderRouter.get("/get", getAllOrders);
orderRouter.delete("/:id", deleteOrder);

export default orderRouter;
