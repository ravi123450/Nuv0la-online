import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Subscriptions.css';
import { assets } from '../../assets/assets';

const Subscriptions = () => {
    const [plans, setPlans] = useState([]); // State to hold subscription plans
    const [loading, setLoading] = useState(true); // State for loading spinner
    const [error, setError] = useState(null); // State for error handling
    const url = "http://localhost:4000";

    // Fetch plans from the backend
    useEffect(() => {
        const fetchSubscriptions = async () => {
            try {
                const token = localStorage.getItem("token"); // Retrieve token from local storage
                if (!token) {
                    alert("User not logged in. Please log in to view subscriptions.");
                    window.location.href = "/login"; // Redirect to login page if not logged in
                    return;
                }

                const response = await fetch(`${url}/api/plans`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setPlans(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSubscriptions();
    }, []);

    return (
        <div className="subscriptions-page">
            <h1>Choose Your Plan</h1>

            {/* Loading spinner */}
            {loading && <div className="loading-spinner">Loading plans...</div>}

            {/* Error message */}
            {error && <div className="error-message">Error fetching plans: {error}</div>}

            {/* Display subscription plans */}
            <div className="subscriptions-list">
                {!loading && !error && plans.length === 0 && (
                    <p>No plans available at the moment. Please check back later.</p>
                )}
                {plans.map((plan) => (
                    <div key={plan.id} className="subscription-card">
                        <h2>{plan.name}</h2>
                        <div className="stamp-logo">
                            <img src={assets.logo} alt="Logo" />
                        </div>
                        <p>{plan.description}</p>
                        <p>Price: ₹{plan.price_1_day} per day</p>
                        <Link to={`/subscriptions/${plan.id}`}>
                            <button className="view-details-btn">View Details</button>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Subscriptions;
