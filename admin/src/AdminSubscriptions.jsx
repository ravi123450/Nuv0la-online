import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminSubscriptions.css';

const AdminSubscriptions = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null); // State for selected user details
    const [showModal, setShowModal] = useState(false); // State to toggle modal visibility

    const url = "https://nuv0la-online-3.onrender.com";

    useEffect(() => {
        const fetchSubscriptions = async () => {
            try {
                const response = await axios.get(`${url}/api/subscriptions`);
                setSubscriptions(response.data);
                setLoading(false);
            } catch (error) {
                setError('Failed to fetch subscriptions');
                setLoading(false);
            }
        };

        fetchSubscriptions();
    }, []);

    const handleUserClick = async (userId) => {
        try {
            // Fetch user details from API
            const response = await axios.get(`${url}/api/users/${userId}`);
            if (response.data && response.data.user) {
                setSelectedUser(response.data.user); // Ensure correct data assignment
                setShowModal(true); // Show modal with user details
            } else {
                alert('No user details found');
            }
        } catch (error) {
            console.error("Error fetching user details:", error.message);
            alert('Failed to fetch user details');
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedUser(null);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>Users - Subscriptions</h1>
            <table>
                <thead>
                    <tr>
                        <th>User ID</th>
                        <th>Subscription ID</th>
                        <th>Meal Type</th>
                        <th>Duration (Days)</th>
                        <th>Quantity</th>
                        <th>Total Cost</th>
                        <th>Created At</th>
                    </tr>
                </thead>
                <tbody>
                    {subscriptions.map((sub) => (
                        <tr key={sub._id || sub.subscriptionId}>
                            <td
                                className="clickable"
                                onClick={() => handleUserClick(sub.userId)}
                            >
                                {sub.userId}
                            </td>
                            <td>{sub.subscriptionId}</td>
                            <td>{sub.mealType}</td>
                            <td>{sub.duration}</td>
                            <td>{sub.quantity}</td>
                            <td>₹{sub.totalCost}</td>
                            <td>{sub.createdAt ? new Date(sub.createdAt).toLocaleString() : 'N/A'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* User Details Modal */}
            {showModal && selectedUser && (
                <div className="modal">
                    <div className="modal-content">
                        <button className="close-button" onClick={closeModal}>
                            Close
                        </button>
                        <h2>User Details</h2>
                        <p><strong>Name:</strong> {selectedUser.name}</p>
                        <p><strong>Email:</strong> {selectedUser.email}</p>
                        <p><strong>User ID:</strong> {selectedUser._id}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminSubscriptions;
