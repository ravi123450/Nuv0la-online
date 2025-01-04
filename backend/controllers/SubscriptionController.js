
import Razorpay from 'razorpay';
import Subscription from '../models/SubscriptionModel.js';




// Initialize Razorpay with your credentials
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID, // Your Razorpay Key ID
    key_secret: process.env.RAZORPAY_KEY_SECRET // Your Razorpay Key Secret
});

// Static subscription plans
const getStaticPlans = async (req, res) => {
const staticPlans = [
    {
        "id": 1,
        "name": "Weight Loss Plan (Veg)",
        "description": "Perfect plan for weight loss with balanced vegetarian meals.",
        "price_1_day": 420,
        "price_7_days": 2940,
        "price_30_days": 12600,
        "breakfast_price": 100,
        "lunch_price": 150,
        "dinner_price": 170,
        "full_day_price": 420,
        "image": "https://via.placeholder.com/400x300"
    },
    {
        "id": 2,
        "name": "Weight Loss Plan (Non-Veg)",
        "description": "A balanced non-vegetarian meal plan designed for effective weight loss.",
        "price_1_day": 475,
        "price_7_days": 3325,
        "price_30_days": 14250,
        "breakfast_price": 120,
        "lunch_price": 180,
        "dinner_price": 200,
        "full_day_price": 475,
        "image": "https://via.placeholder.com/400x300"
    },
    {
        "id": 3,
        "name": "Weight Gain Plan (Veg)",
        "description": "High-calorie vegetarian meal plan for healthy weight gain.",
        "price_1_day": 480,
        "price_7_days": 3360,
        "price_30_days": 14400,
        "breakfast_price": 120,
        "lunch_price": 160,
        "dinner_price": 200,
        "full_day_price": 480,
        "image": "https://via.placeholder.com/400x300"
    },
    {
        "id": 4,
        "name": "Weight Gain Plan (Non-Veg)",
        "description": "Calorie-rich non-vegetarian plan tailored for effective weight gain.",
        "price_1_day": 550,
        "price_7_days": 3850,
        "price_30_days": 16500,
        "breakfast_price": 140,
        "lunch_price": 200,
        "dinner_price": 250,
        "full_day_price": 550,
        "image": "https://via.placeholder.com/400x300"
    },
    {
        "id": 5,
        "name": "Balanced Diet Plan (Veg)",
        "description": "A vegetarian diet for maintaining a healthy weight and energy levels.",
        "price_1_day": 450,
        "price_7_days": 3150,
        "price_30_days": 13500,
        "breakfast_price": 110,
        "lunch_price": 150,
        "dinner_price": 190,
        "full_day_price": 450,
        "image": "https://via.placeholder.com/400x300"
    },
    {
        "id": 6,
        "name": "Balanced Diet Plan (Non-Veg)",
        "description": "A non-vegetarian diet plan focused on overall health and wellness.",
        "price_1_day": 500,
        "price_7_days": 3500,
        "price_30_days": 15000,
        "breakfast_price": 130,
        "lunch_price": 180,
        "dinner_price": 220,
        "full_day_price": 500,
        "image": "https://via.placeholder.com/400x300"
    }
]

res.json(staticPlans);
};
const getStaticPlanById = async (req, res) => {
    const staticPlans = 
    [
        {
            "id": 1,
            "name": "Weight Loss Plan (Veg)",
            "description": "Perfect plan for weight loss with balanced vegetarian meals.",
            "price_1_day": 420,
            "price_7_days": 2940,
            "price_30_days": 12600,
            "breakfast_price": 100,
            "lunch_price": 150,
            "dinner_price": 170,
            "full_day_price": 420,
            "image": "backend/controllers/subscriptionlogo.png"

        },
        {
            "id": 2,
            "name": "Weight Loss Plan (Non-Veg)",
            "description": "A balanced non-vegetarian meal plan designed for effective weight loss.",
            "price_1_day": 475,
            "price_7_days": 3325,
            "price_30_days": 14250,
            "breakfast_price": 120,
            "lunch_price": 180,
            "dinner_price": 200,
            "full_day_price": 475,
            "image": "https://via.placeholder.com/400x300"
        },
        {
            "id": 3,
            "name": "Weight Gain Plan (Veg)",
            "description": "High-calorie vegetarian meal plan for healthy weight gain.",
            "price_1_day": 480,
            "price_7_days": 3360,
            "price_30_days": 14400,
            "breakfast_price": 120,
            "lunch_price": 160,
            "dinner_price": 200,
            "full_day_price": 480,
            "image": "https://via.placeholder.com/400x300"
        },
        {
            "id": 4,
            "name": "Weight Gain Plan (Non-Veg)",
            "description": "Calorie-rich non-vegetarian plan tailored for effective weight gain.",
            "price_1_day": 550,
            "price_7_days": 3850,
            "price_30_days": 16500,
            "breakfast_price": 140,
            "lunch_price": 200,
            "dinner_price": 250,
            "full_day_price": 550,
            "image": "https://via.placeholder.com/400x300"
        },
        {
            "id": 5,
            "name": "Balanced Diet Plan (Veg)",
            "description": "A vegetarian diet for maintaining a healthy weight and energy levels.",
            "price_1_day": 450,
            "price_7_days": 3150,
            "price_30_days": 13500,
            "breakfast_price": 110,
            "lunch_price": 150,
            "dinner_price": 190,
            "full_day_price": 450,
            "image": "https://via.placeholder.com/400x300"
        },
        {
            "id": 6,
            "name": "Balanced Diet Plan (Non-Veg)",
            "description": "A non-vegetarian diet plan focused on overall health and wellness.",
            "price_1_day": 500,
            "price_7_days": 3500,
            "price_30_days": 15000,
            "breakfast_price": 130,
            "lunch_price": 180,
            "dinner_price": 220,
            "full_day_price": 500,
            "image": "https://via.placeholder.com/400x300"
        }
    ]
    
    const plan = staticPlans.find((sub) => sub.id === parseInt(req.params.id));
    if (plan) {
        res.json(plan);
    } else {
        res.status(404).json({ message: "Plan not found" });
    }
};

// Save subscription
const saveSubscription = async (req, res) => {
    const { subscriptionId, mealType, duration, quantity, totalCost } = req.body;
    const userId = req.body.userId; // Extracted by authMiddleware

    if (!userId || !subscriptionId || !mealType || !duration || !quantity || !totalCost) {
        return res.status(400).json({ error: "All fields are required." });
    }

    try {
        const subscription = new Subscription({
            userId,
            subscriptionId,
            mealType,
            duration,
            quantity,
            totalCost,
        });
        await subscription.save();
        res.status(201).json({ message: "Subscription saved successfully." });
    } catch (error) {
        console.error("Error saving subscription:", error.message);
        res.status(500).json({ error: "Failed to save subscription." });
    }
};

// Create Razorpay Checkout session
const createCheckoutSession = async (req, res) => {
    const { subscriptionId, mealType, duration, quantity, totalCost } = req.body;

    if (!subscriptionId || !mealType || !duration || !quantity || !totalCost) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        const options = {
            amount: totalCost * 100, // Convert INR to paise
            currency: "INR",
            receipt: `subscription_${subscriptionId}_${mealType}_${duration}`,
            payment_capture: 1, // Auto-capture the payment
        };

        const order = await razorpay.orders.create(options);

        res.status(200).json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            notes: options.receipt,
        });
    } catch (error) {
        console.error("Error creating Razorpay session:", error.message);
        res.status(500).json({ error: "Failed to create Razorpay session" });
    }
};

// Fetch all user subscriptions
const getUserSubscriptions = async (req, res) => {
    try {
        const subscriptions = await Subscription.find();
        res.json(subscriptions);
    } catch (error) {
        console.error("Error fetching subscriptions:", error.message);
        res.status(500).json({ error: "Failed to fetch subscriptions" });
    }
};

export { getStaticPlans, getStaticPlanById, saveSubscription, createCheckoutSession, getUserSubscriptions };
