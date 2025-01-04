import React from 'react';
import './Header.css';
import { Link } from 'react-router-dom'; // Import Link for navigation

const Header = () => {
  return (
    <div className='header'>
      <div className="header-contents">
        <h2>Order your favourite Healthy food here</h2>
        <p>
          Welcome to our nutritious food ordering platform! Browse our diverse menu, 
          from healthy appetizers to mouthwatering entrees. Order your favorites with ease 
          and convenience. Enjoy healthy and delicious meals delivered right to your doorstep!
        </p>
        <Link to="/subscriptions">
          <button>Order now</button>
        </Link>
      </div>
    </div>
  );
};

export default Header;
