import React, { useState } from 'react';
import './ExploreMenu.css';
import { menu_list } from '../../assets/assets';
import nuvolaLogo from '../../assets/logo.png'; // Import Nuvola logo
import { useNavigate } from 'react-router-dom';

const ExploreMenu = ({ setCategory }) => {
    const [currentIndex, setCurrentIndex] = useState(0); // Track the currently displayed item
    const navigate = useNavigate();

    const handleCategoryClick = (menu_name) => {
        setCategory(menu_name); // Update selected category
        navigate('/top-dishes', { state: { category: menu_name } }); // Navigate with category
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % menu_list.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + menu_list.length) % menu_list.length);
    };

    return (
        <div className="explore-menu" id="explore-menu">
            <h1></h1>
            <p className="explore-menu-text">
                Welcome to our nutritious food ordering platform! Browse our menu and order your favorite dishes for a delightful dining experience.
            </p>

            {/* Carousel for Mobile Screens */}
            <div className="explore-menu-carousel">
                <button className="carousel-button prev" onClick={handlePrev}>
                    &#8249;
                </button>
                <div className="carousel-item">
                    <div
                        className="explore-menu-list-items"
                        onClick={() => handleCategoryClick(menu_list[currentIndex].menu_name)}
                    >
                        {/* Nuvola Logo */}
                        <div className="card-logo">
                            <img src={nuvolaLogo} alt="Nuvola Logo" />
                        </div>

                        {/* Menu Image */}
                        <img
                            src={menu_list[currentIndex].menu_image}
                            alt={menu_list[currentIndex].menu_name}
                            className="menu-image"
                        />
                        <p>{menu_list[currentIndex].menu_name}</p>
                    </div>
                </div>
                <button className="carousel-button next" onClick={handleNext}>
                    &#8250;
                </button>
            </div>

            {/* Desktop Layout */}
            <div className="explore-menu-list">
                {menu_list.map((item, index) => (
                    <div
                        key={index}
                        className="explore-menu-list-items"
                        onClick={() => handleCategoryClick(item.menu_name)}
                    >
                        {/* Nuvola Logo */}
                        <div className="card-logo">
                            <img src={nuvolaLogo} alt="Nuvola Logo" />
                        </div>

                        {/* Menu Image */}
                        <img src={item.menu_image} alt={item.menu_name} className="menu-image" />
                        <p>{item.menu_name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ExploreMenu;
