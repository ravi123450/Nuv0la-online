let deliveryLocation = {}; // Temporarily store location in memory (use DB for production)

// Update delivery boy's live location
export const updateDeliveryLocation = (req, res) => {
  const { lat, lon, orderId } = req.body;

  if (!lat || !lon || !orderId) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  // Update the delivery location
  deliveryLocation = { lat, lon, orderId, updatedAt: new Date() };
  return res.status(200).json({ success: true, message: "Location updated" });
};

// Get delivery boy's live location
export const getDeliveryLocation = (req, res) => {
  if (!deliveryLocation.lat || !deliveryLocation.lon) {
    return res.status(404).json({ success: false, message: "No live location available" });
  }

  return res.status(200).json({ success: true, data: deliveryLocation });
};
