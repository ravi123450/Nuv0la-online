import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema({
  deliveryId: { type: String, required: true, unique: true },
  currentLocation: {
    lat: { type: Number, required: true },
    lon: { type: Number, required: true },
  },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Delivery", deliverySchema);
