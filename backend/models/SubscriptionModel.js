// models/SubscriptionModel.js
import mongoose from "mongoose";

// Define the Subscription schema
const subscriptionSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    subscriptionId: { type: String, required: true },
    mealType: { type: String, required: true },
    duration: { type: Number, required: true },
    quantity: { type: Number, required: true },
    totalCost: { type: Number, required: true },
    // Optional fields
    name: { type: String, required: false },
    description: { type: String, required: false },
    breakfast_price: { type: Number, required: false },
    lunch_price: { type: Number, required: false },
    dinner_price: { type: Number, required: false },
    price_1_day: { type: Number, required: false },
    price_7_days: { type: Number, required: false },
    price_30_days: { type: Number, required: false },
    image: { type: String, required: false },
});

// Export the Subscription model
const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
