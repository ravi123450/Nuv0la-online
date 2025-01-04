import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../../assets/assets';
import './DietPlan.css';

const DietPlan = () => {
    const [currentBox, setCurrentBox] = useState(0);

    const dietPlans = [
        {
            title: "Diet Plans",
            description:
                "Achieving your health goals is 20% exercise and 80% diet. Subscribe to our Weekly and Monthly Diet Plans and enjoy perfectly balanced, nutritious meals delivered to your doorstep every day.",
            buttonLabel: "Subscribe Now",
            imgSrc: assets.gym,
        },
        {
            title: "Healthy Meals",
            description:
                "Our nutritious diet plans are specially crafted for individuals managing health conditions and recovery needs. These plans focus on providing balanced, tailored meals to support patients with specific health issues, ensuring optimal nourishment and faster healing.",
            buttonLabel: "Subscribe Now",
            imgSrc: assets.image,
        },
    ];

    const handleNext = () => {
        setCurrentBox((prev) => (prev + 1) % dietPlans.length);
    };

    const handlePrev = () => {
        setCurrentBox((prev) => (prev - 1 + dietPlans.length) % dietPlans.length);
    };

    return (
        <div className="diet-plan-carousel">
            <button className="scroll-btn left" onClick={handlePrev}>
                &#9664;
            </button>

            <div className="diet-plan-container">
                <div className="diet-plan-content">
                    <h1>{dietPlans[currentBox].title}</h1>
                    <p>{dietPlans[currentBox].description}</p>
                    <Link to="/subscriptions">
                        <button className="diet-plan-btn">{dietPlans[currentBox].buttonLabel}</button>
                    </Link>
                </div>
                <div className="diet-plan-image">
                    <img
                        src={dietPlans[currentBox].imgSrc}
                        alt={dietPlans[currentBox].title}
                    />
                </div>
            </div>

            <button className="scroll-btn right" onClick={handleNext}>
                &#9654;
            </button>
        </div>
    );
};

export default DietPlan;
