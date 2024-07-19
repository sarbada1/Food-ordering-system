import orderModel from "../models/orderModel.js";
import userModel from "../models/userModule.js";
import axios from "axios";

const key = "key 9920eba90c99477b9262d02a033223bc";

const initiateKhaltiPayment = async (order) => {
  const options = {
    method: "POST",
    url: "https://a.khalti.com/api/v2/epayment/initiate/",
    headers: {
      Authorization: key,
      "Content-Type": "application/json",
    },
    data: {
      return_url: "http://localhost:5173/",
      website_url: "http://localhost:5173/",
      amount: order.amount * 100,
      purchase_order_id: order._id,
      purchase_order_name: "Order Form tomato",
      customer_info: {
        name: `${order.address.firstName} ${order.address.lastName}`,
        email: order.address.email,
        phone: order.address.phone,
      },
    },
  };
  try {
    const response = await axios(options);
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error initiating Khalti payment:", error.response.data);
    throw new Error("Error initiating Khalti payment");
  }
};

const placeOrder = async (req, res) => {
  try {
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
      status: "Pending",
    });
    await newOrder.save();
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });
    const khaltiResponse = await initiateKhaltiPayment(newOrder);
    res.status(200).json({
      order: newOrder,
      payment: khaltiResponse,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error placing order" });
  }
};
const verifyPayment = async (req, res) => {
  const { pidx, productIdentity } = req.body;
  try {
    const response = await axios.post(
      "https://a.khalti.com/api/v2/epayment/lookup/",
      {
        pidx: pidx,
      },
      {
        headers: {
          Authorization: key,
        },
      }
    );
    if (response.data.status === "Completed") {
      await orderModel.findByIdAndUpdate(productIdentity, { status: "Paid" });
      res.status(200).json({
        success: true,
        message: "Payment verified",
        data: response.data,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Payment verification failed",
        data: response.data,
      });
    }
  } catch (error) {
    console.error("Error verifying payment", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
export const verifyResponse = (req, res) => {
  const { success, orderId } = req.query;
  if (success === "true") {
    res.send(`Payment verification successful for order ID: ${orderId}`);
  } else {
    res.send(`Payment verification failed for order ID: ${orderId}`);
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const deletedOrder = await orderModel.findByIdAndDelete(orderId);
    if (!deletedOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
export { placeOrder, verifyPayment, getAllOrders, deleteOrder };
