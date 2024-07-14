import orderModel from '../models/orderModel.js';
import userModel from '../models/userModule.js';

const placeOrder = async (req, res) => {
  const frontend_url="http://localhost:5173"
  try {
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
      status: 'Pending'
    });
    await newOrder.save();
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    res.status(200).json({
      success: true,
      order: newOrder
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const verifyPayment = async (req, res) => {
  const { token, amount, productIdentity } = req.body;

  try {
    const response = await axios.post('https://khalti.com/api/v2/payment/verify/', {
      token,
      amount
    }, {
      headers: {
        'Authorization': `Key ${process.env.SECRET_KEY}`
      }
    });

    if (response.data.state.name === 'Completed') {
      await orderModel.findByIdAndUpdate(productIdentity, { status: 'Paid' });
      res.status(200).json({ success: true, message: 'Payment verified', data: response.data });
    } else {
      res.status(400).json({ success: false, message: 'Payment verification failed', data: response.data });
    }
  } catch (error) {
    console.error('Error verifying payment', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};
export const verifyResponse = (req, res) => {
  const { success, orderId } = req.query;
  if (success === 'true') {
    res.send(`Payment verification successful for order ID: ${orderId}`);
  } else {
    res.send(`Payment verification failed for order ID: ${orderId}`);
  }
};
export { placeOrder, verifyPayment };
