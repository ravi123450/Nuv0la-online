import express from "express";
import authMiddleware from "../middleware/auth.js";
import { placeOrder, userOrders, verifyOrder, listOrders, updateStatus, updateOrderLocation } from "../controllers/orderController.js";
import orderModel from "../models/orderModel.js";

const orderRouter = express.Router();

orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/verify", verifyOrder);
orderRouter.post("/userorders", authMiddleware, userOrders);
orderRouter.get("/list", listOrders);
orderRouter.post("/status", updateStatus);

// Endpoint for updating the live location of the delivery boy
orderRouter.post("/live-location",  async (req, res) => {
  const { orderId, lat, lon } = req.body;

  try {
    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Update the live location
    order.address.lat = lat;
    order.address.lon = lon;
    order.updatedAt = new Date();
    await order.save();

    res.json({
      success: true,
      message: "Live location updated successfully",
      data: {
        lat: order.address.lat,
        lon: order.address.lon,
        updatedTime: order.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error updating live location:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to update live location. Please try again later.",
    });
  }
});

// Endpoint for retrieving the live location of an order
orderRouter.get("/live-location/:orderId",  async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      data: {
        lat: order.address.lat,
        lon: order.address.lon,
        status: order.status,
        updatedTime: order.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error fetching live location:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch live location. Please try again later.",
    });
  }
});

// Other routes
orderRouter.get("/userorders", authMiddleware, userOrders);

export default orderRouter;
