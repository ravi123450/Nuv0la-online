import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MySubscriptions.css';

const MySubscriptions = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const url = "https://cloud-kitchen-6.onrender.com" // Backend URL

    useEffect(() => {
        const fetchUserSubscriptions = async () => {
            const token = localStorage.getItem("token");
            console.log("Token retrieved:", token);

            if (!token) {
                alert("User not logged in. Redirecting to login.");
                window.location.href = "/login";
                return;
            }

            try {
                const response = await axios.get(`${url}/api/user-subscriptions`, {
                    headers: { token },
                });
                console.log("API Response:", response); // Debugging

                if (response.data.success) {
                    setSubscriptions(response.data.data);
                } else {
                    setError(response.data.message || "Failed to fetch subscriptions.");
                }
            } catch (err) {
                console.error("Error fetching subscriptions:", err.message);
                setError("Error fetching subscriptions. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchUserSubscriptions();
    }, []);

    if (loading) {
        return <div className="loading">Loading your subscriptions...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="my-subscriptions">
            <h1>My Subscriptions</h1>
            {subscriptions.length === 0 ? (
                <p>No active subscriptions. Explore our plans to subscribe!</p>
            ) : (
                <div className="subscription-list">
                    {subscriptions.map((sub) => (
                        <div key={sub._id} className="subscription-card">
                            <h3>Subscription ID: {sub.subscriptionId}</h3>
                            <p><strong>Meal Type:</strong> {sub.mealType}</p>
                            <p><strong>Duration:</strong> {sub.duration} days</p>
                            <p><strong>Quantity:</strong> {sub.quantity}</p>
                            <p><strong>Total Cost:</strong> ₹{sub.totalCost}</p>
                            <p><strong>Start Date:</strong> {new Date(sub.createdAt).toLocaleDateString()}</p>
                            <p><strong>Status:</strong> Active</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MySubscriptions;
