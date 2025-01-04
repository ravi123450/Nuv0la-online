import React, { useState } from 'react';
import './WhyNuvola.css';
import { assets } from '../../assets/assets'; // Update with correct asset paths

const WhyNuvola = () => {
  const [currentCard, setCurrentCard] = useState(0);

  const cards = [
    {
      img: assets.nut,
      title: 'By Nutritionists',
      description: 'All meals are designed by our nutrition experts using only the finest quality ingredients.',
    },
    {
      img: assets.del,
      title: 'Free Delivery',
      description: 'Delivered to your home, office, or gym, wherever you wish to enjoy nutritious meals.',
    },
    {
      img: assets.fresh,
      title: 'Fresh Ingredients',
      description: 'We procure fresh, high-quality ingredients to deliver wholesome meals every day.',
    },
    {
      img: assets.pres,
      title: 'No Preservatives',
      description: 'Your ultimate plan for clean eating without added preservatives or artificial additives.',
    },
  ];

  const handleNext = () => {
    setCurrentCard((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setCurrentCard((prev) => (prev - 1 + cards.length) % cards.length);
  };

  return (
    <div className="why-nuvola-container">
      <h2 className="why-nuvola-title">Why Nuvola?</h2>

      {/* Desktop View */}
      <div className="why-nuvola-cards desktop-view">
        {cards.map((card, index) => (
          <div key={index} className="nuvola-card">
            <img src={card.img} alt={card.title} />
            <h3>{card.title}</h3>
            <p>{card.description}</p>
          </div>
        ))}
      </div>

      {/* Mobile View */}
      <div className="why-nuvola-cards mobile-view">
        <button className="scroll-btn left" onClick={handlePrev}>
          &#9664;
        </button>
        <div className="nuvola-card">
          <img src={cards[currentCard].img} alt={cards[currentCard].title} />
          <h3>{cards[currentCard].title}</h3>
          <p>{cards[currentCard].description}</p>
        </div>
        <button className="scroll-btn right" onClick={handleNext}>
          &#9654;
        </button>
      </div>
    </div>
  );
};

export default WhyNuvola;
