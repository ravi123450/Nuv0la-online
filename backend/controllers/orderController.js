import Razorpay from 'razorpay';
import orderModel from "../models/orderModel.js";
import userModel from '../models/userModel.js';
import crypto from 'crypto';

const razorpay = new Razorpay({
  key_id: 'rzp_test_SyFe1hELG5eMsl', // Replace with your Razorpay Key ID
  key_secret: 'jFNB4qMsPUxaXea1eWGK1STE', // Replace with your Razorpay Key Secret
});

// Place Order (Create Razorpay Order)
const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    // Step 1: Create a new order in the database
    const newOrder = new orderModel({
      userId,
      items,
      amount,
      address,
      payment: false, // Initially set to false until payment is verified
    });

    const savedOrder = await newOrder.save();

    // Step 2: Create a Razorpay order
    const options = {
      amount: amount * 100, // Convert amount to paise
      currency: 'INR',
      receipt: savedOrder._id.toString(),
      payment_capture: 1,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Step 3: Update the order with the Razorpay order ID
    savedOrder.razorpayOrderId = razorpayOrder.id;
    await savedOrder.save();

    res.json({
      success: true,
      order_id: razorpayOrder.id,
      amount: razorpayOrder.amount,
    });
  } catch (error) {
    console.error("Error placing order:", error.message);
    res.status(500).json({ success: false, message: "Error placing order." });
  }
};

// Verify Order (Validate Razorpay payment)
const verifyOrder = async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

  try {
      // Find the order using the Razorpay order ID
      const order = await orderModel.findOne({ razorpayOrderId: razorpay_order_id });
      if (!order) {
          return res.status(404).json({ success: false, message: 'Order not found.' });
      }

      // Verify payment signature using Razorpay
      const generatedSignature = crypto
          .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
          .update(`${razorpay_order_id}|${razorpay_payment_id}`)
          .digest('hex');

      if (generatedSignature === razorpay_signature) {
          // Update the order's payment status to true
          order.payment = true;
          await order.save();

          res.status(200).json({ success: true, message: 'Payment verified successfully.' });
      } else {
          res.status(400).json({ success: false, message: 'Invalid payment signature.' });
      }
  } catch (error) {
      console.error('Payment verification error:', error.message);
      res.status(500).json({ success: false, message: 'Error verifying payment.' });
  }
};
// Fetch User Orders
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId }).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error("Error fetching user orders:", error.message);
    res.status(500).json({ success: false, message: "Error fetching orders." });
  }
};

// Fetch All Orders (Admin Panel)
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    res.status(500).json({ success: false, message: "Error fetching orders." });
  }
};

// Update Order Status (Admin API)
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    const updatedOrder = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true });

    if (updatedOrder) {
      res.json({ success: true, message: "Order status updated successfully." });
    } else {
      res.status(404).json({ success: false, message: "Order not found." });
    }
  } catch (error) {
    console.error("Error updating order status:", error.message);
    res.status(500).json({ success: false, message: "Error updating order status." });
  }
};
const updateOrderLocation = async (req, res) => {
  try {
    const { orderId, lat, lon } = req.body;

    if (!orderId || !lat || !lon) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Update latitude and longitude in the order's address
    order.address.lat = lat;
    order.address.lon = lon;

    await order.save(); // Save changes to the database

    res.status(200).json({ success: true, message: "Order location updated", data: order });
  } catch (error) {
    console.error("Error updating order location:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus,updateOrderLocation };
