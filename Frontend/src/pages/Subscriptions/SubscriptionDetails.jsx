import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './PlanDetails.css';
import axios from 'axios';
import { assets } from '../../assets/assets';

const PlanDetails = () => {
    const { id } = useParams(); // Get the plan ID from the URL
    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const url = "https://nuv0la-online-3.onrender.com"; // Backend API URL

    // State for user selection
    const [mealType, setMealType] = useState("breakfast");
    const [duration, setDuration] = useState(1); // Default to 1 day
    const [quantity, setQuantity] = useState(1);
    const [totalCost, setTotalCost] = useState(0);

    // Fetch static plan details based on the ID
    useEffect(() => {
        const fetchPlan = async () => {
            try {
                const res = await axios.get(`${url}/api/plans/${id}`);
                setPlan(res.data);
                console.log(res.data)
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetchPlan();
    }, [id]);

    // Calculate total cost dynamically
    useEffect(() => {
        if (plan) {
            let mealCost = 0;

            // Determine meal type price
            if (mealType === "breakfast") mealCost = plan.breakfast_price;
            console.log(plan.breakfast_price)
            if (mealType === "lunch") mealCost = plan.lunch_price;
            if (mealType === "dinner") mealCost = plan.dinner_price;
            if(mealType=== "fulldaymeal")mealCost = plan.full_day_price;
            console.log(plan.full_day_price)

            // Calculate duration cost
            const durationMultiplier = duration === 7 ? 7 : duration === 30 ? 30 : 1;

            // Total = Meal cost * Quantity * Duration
            const total = mealCost * quantity * durationMultiplier;
            setTotalCost(total);
        }
    }, [mealType, duration, quantity, plan]);

    // Handle "Buy Now" click
    const handleBuyNow = async () => {
        const token = localStorage.getItem("token"); // Retrieve JWT token
        if (!token) {
            alert("User not logged in. Please log in to proceed.");
            window.location.href = "/login"; // Redirect to login page
            return;
        }

        try {
            // Create Razorpay order
            const response = await axios.post(
                `${url}/api/subscriptions/create-checkout-session`,
                {
                    subscriptionId: plan.id,
                    mealType,
                    duration,
                    quantity,
                    totalCost,
                },
                {
                    headers: { token }, // Send the JWT token via the 'token' header
                }
            );

            const { orderId, amount, currency } = response.data;

            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => {
                const options = {
                    key: "rzp_test_SyFe1hELG5eMsl",
                    amount,
                    currency,
                    name: "Your Business Name",
                    description: `Subscription for ${plan.name}`,
                    order_id: orderId,
                    handler: async () => {
                        try {
                            // Save subscription
                            await axios.post(
                                `${url}/api/subscriptions/save-subscription`,
                                {
                                    subscriptionId: plan.id,
                                    mealType,
                                    duration,
                                    quantity,
                                    totalCost,
                                },
                                {
                                    headers: { token }, // Send the JWT token via the 'token' header
                                }
                            );
                            alert("Payment successful and subscription saved!");
                        } catch (error) {
                            console.error("Error saving subscription:", error.message);
                            alert("Payment successful but failed to save subscription.");
                        }
                    },
                };
                const razorpay = new window.Razorpay(options);
                razorpay.open();
            };
            document.body.appendChild(script);
        } catch (error) {
            console.error("Error initiating Razorpay payment:", error.message);
            alert("Failed to initiate payment. Please try again.");
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">Error: {error}</div>;
    if (!plan) return <div className="error">Plan not found</div>;

    return (
        <div className="plan-details">
            <div className="plan-details-card">
                <div className="plan-image">
                    <img src={assets.subscriptionlogo} alt={plan.name} />
                </div>
                <div className="plan-info">
                    <h1>{plan.name}</h1>
                    <p>{plan.description}</p>
                    <div className="plan-options">
                        <label>Meal Type:</label>
                        <select value={mealType} onChange={(e) => setMealType(e.target.value)}>
                            <option value="breakfast">Breakfast</option>
                            <option value="lunch">Lunch</option>
                            <option value="dinner">Dinner</option>
                            <option value="fulldaymeal">fulldaymeal</option>
                            
                        </select>
                        <label>Duration:</label>
                        <select value={duration} onChange={(e) => setDuration(parseInt(e.target.value))}>
                            <option value="1">1 Day</option>
                            <option value="7">7 Days</option>
                            <option value="30">30 Days</option>
                        </select>
                        <label>Quantity:</label>
                        <input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value))}
                        />
                        <div className="total-cost">
                            <h2>Total Cost: ₹{totalCost.toFixed(2)}</h2>
                        </div>
                        <button className="buy-now-btn" onClick={handleBuyNow}>
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlanDetails;
