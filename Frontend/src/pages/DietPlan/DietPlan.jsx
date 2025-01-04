import React from "react";
import "./DietPlan.css";
import { Link } from "react-router-dom";

const DietPlan = () => {
    return (
        <div className="diet-plan-wrapper">
            <h1 className="diet-plan-title">Sample Meal Plan (Non-Veg & Veg)</h1>
            <div className="diet-plan-container">
                <table className="diet-plan-table">
                    <thead>
                        <tr>
                            <th>Day</th>
                            <th>Lunch</th>
                            <th>Dinner</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Mon</td>
                            <td>Egg & Brown Rice with Lettuce, Green Peas, Carrot</td>
                            <td>Fish & Roti with Lettuce, Green Peas, Carrot</td>
                        </tr>
                        <tr>
                            <td>Tue</td>
                            <td>Chicken & Millets with Cabbage, Carrot, Red Cabbage</td>
                            <td>Egg & Spaghetti with Broccoli, Cucumber, Beetroot</td>
                        </tr>
                        <tr>
                            <td>Wed</td>
                            <td>Prawn & Pasta with Cucumber, Beetroot</td>
                            <td>Soya Chunks & Roti with Beetroot, Sweet Corn</td>
                        </tr>
                        <tr>
                            <td>Thu</td>
                            <td>Egg & Brown Rice with Beetroot, Sweet Corn, Spinach</td>
                            <td>Chicken & Brown Bread with Cabbage, Carrot, Red Cabbage</td>
                        </tr>
                        <tr>
                            <td>Fri</td>
                            <td>Rajma & Millets with Cauliflower, Capsicum, Green Peas</td>
                            <td>Egg & Spaghetti with Carrot, Cucumber, Sweet Corn</td>
                        </tr>
                        <tr>
                            <td>Sat</td>
                            <td>Paneer & Pasta with Carrot, Cucumber, Sweet Corn</td>
                            <td>Fish & Spaghetti with Cabbage, Carrot, Red Cabbage</td>
                        </tr>
                        <tr>
                            <td>Sun</td>
                            <td>Chicken & Brown Rice with Carrot, Cucumber, Sweet Corn</td>
                            <td>Mushroom & Brown Bread with Cauliflower, Capsicum, Green Peas</td>
                        </tr>
                    </tbody>
                </table>
                {/* Button placed outside the table */}
                <div className="button-container">
                    <Link to="/subscriptions">
                        <button className="subscribe-now-btn">Subscribe Now</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default DietPlan;
