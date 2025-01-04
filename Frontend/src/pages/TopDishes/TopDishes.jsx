import React from 'react';
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay';
import { useLocation } from 'react-router-dom';
import './TopDishes.css';

const TopDishes = () => {
    // Retrieve the selected category from React Router state
    const location = useLocation();
    const selectedCategory = location.state?.category || 'All';

    return (
        <div className="top-dishes-container">
            <p className="top-dishes-description">
                Explore the best dishes in <b>{selectedCategory}</b>
            </p>
            {/* Reuse FoodDisplay to list dishes based on the selected category */}
            <FoodDisplay category={selectedCategory} />
        </div>
    );
};

export default TopDishes;
