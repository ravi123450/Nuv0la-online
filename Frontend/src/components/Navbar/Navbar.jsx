import React, { useContext, useState } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";

const Navbar = ({ setShowLogin }) => {
    const [menu, setMenu] = useState("home");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const navigate = useNavigate();

    const { getTotalCartAmount, token, setToken } = useContext(StoreContext);

    const menuList = [
        { menu_name: "Weight Loss" },
        { menu_name: "Weight Gain" },
        { menu_name: "Healthy Diet" },
        { menu_name: "Custom Food" },
        { menu_name: "High Protein" },
        { menu_name: "Pure Veg" },
        { menu_name: "Low Carb" },
        { menu_name: "High Carb" },
    ];

    const logout = () => {
        localStorage.removeItem("token");
        setToken("");
        navigate("/");
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const handleSearchChange = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchText(value);

        if (menuList.length > 0) {
            const filtered = menuList.filter((item) =>
                item.menu_name.toLowerCase().startsWith(value)
            );
            setFilteredSuggestions(filtered);
        } else {
            setFilteredSuggestions([]);
        }
    };

    const handleSearchClick = (searchValue) => {
        const selectedMenu = menuList.find(
            (item) => item.menu_name.toLowerCase() === searchValue.toLowerCase()
        );

        if (selectedMenu) {
            navigate("/top-dishes", { state: { category: selectedMenu.menu_name } });
        } else {
            navigate("/explore-menu");
        }

        setSearchText("");
        setFilteredSuggestions([]);
    };

    const handleMenuClick = (newMenu) => {
        setMenu(newMenu);
        setSearchText(""); // Clear search text
        setFilteredSuggestions([]); // Clear suggestions
    };

    return (
        <div className="navbar">
            <Link to="/" onClick={() => handleMenuClick("home")}>
                <img src={assets.logo} alt="Logo" className="logo" />
            </Link>

            <div className="navbar-toggle" onClick={toggleMobileMenu}>
                {!isMobileMenuOpen && (
                    <>
                        <div className="bar"></div>
                        <div className="bar"></div>
                        <div className="bar"></div>
                    </>
                )}
            </div>

            {isMobileMenuOpen && (
                <div className="navbar-menu-mobile">
                    <div className="close-button" onClick={closeMobileMenu}>
                        ×
                    </div>
                    <ul>
                        <li>
                            <Link
                                to="/"
                                onClick={() => {
                                    handleMenuClick("home");
                                    closeMobileMenu();
                                }}
                                className={menu === "home" ? "active" : ""}
                            >
                                Home
                            </Link>
                        </li>
                        <li>
                            <a
                                href="#explore-menu"
                                onClick={() => {
                                    handleMenuClick("menu");
                                    closeMobileMenu();
                                }}
                                className={menu === "menu" ? "active" : ""}
                            >
                                Menu
                            </a>
                        </li>
                        <li>
                            <Link
                                to="/diet-plan"
                                onClick={() => {
                                    handleMenuClick("diet-plan");
                                    closeMobileMenu();
                                }}
                                className={menu === "diet-plan" ? "active" : ""}
                            >
                                Diet Plan
                            </Link>
                        </li>
                        <li>
                            <a
                                href="#footer"
                                onClick={() => {
                                    handleMenuClick("contact-us");
                                    closeMobileMenu();
                                }}
                                className={menu === "contact-us" ? "active" : ""}
                            >
                                Contact Us
                            </a>
                        </li>
                        <li>
                            <Link
                                to="/subscriptions"
                                onClick={() => {
                                    handleMenuClick("subscriptions");
                                    closeMobileMenu();
                                }}
                                className={menu === "subscriptions" ? "active" : ""}
                            >
                                Subscriptions
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/about-us"
                                onClick={() => {
                                    handleMenuClick("about-us");
                                    closeMobileMenu();
                                }}
                                className={menu === "about-us" ? "active" : ""}
                            >
                                About Us
                            </Link>
                        </li>
                    </ul>
                </div>
            )}

            <ul className="navbar-menu">
                <Link
                    to="/"
                    onClick={() => handleMenuClick("home")}
                    className={menu === "home" ? "active" : ""}
                >
                    Home
                </Link>
                <a
                    href="#explore-menu"
                    onClick={() => handleMenuClick("menu")}
                    className={menu === "menu" ? "active" : ""}
                >
                    Menu
                </a>
                <Link
                    to="/diet-plan"
                    onClick={() => handleMenuClick("diet-plan")}
                    className={menu === "diet-plan" ? "active" : ""}
                >
                    Diet Plan
                </Link>
                <a
                    href="#footer"
                    onClick={() => handleMenuClick("contact-us")}
                    className={menu === "contact-us" ? "active" : ""}
                >
                    Contact Us
                </a>
                <Link
                    to="/subscriptions"
                    onClick={() => handleMenuClick("subscriptions")}
                    className={menu === "subscriptions" ? "active" : ""}
                >
                    Subscriptions
                </Link>
                <Link
                    to="/about-us"
                    onClick={() => handleMenuClick("about-us")}
                    className={menu === "about-us" ? "active" : ""}
                >
                    About Us
                </Link>
            </ul>

            <div className="navbar-right">
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search Menu..."
                        value={searchText}
                        onChange={handleSearchChange}
                        className="search-input"
                    />
                    <div className="search-suggestions">
                        {filteredSuggestions.length ? (
                            filteredSuggestions.map((item, index) => (
                                <div
                                    key={index}
                                    className="search-suggestion"
                                    onClick={() => handleSearchClick(item.menu_name)}
                                >
                                    {item.menu_name}
                                </div>
                            ))
                        ) : (
                            searchText && (
                                <div className="no-suggestions">No results found</div>
                            )
                        )}
                    </div>
                </div>
                <Link to="/cart">
                    <div className="navbar-cart">
                        <img src={assets.basket_icon} alt="Cart" />
                        <div className={getTotalCartAmount() > 0 ? "dot" : ""}></div>
                    </div>
                </Link>
                {!token ? (
                    <button onClick={() => setShowLogin(true)}>Sign in</button>
                ) : (
                    <div className="navbar-profile">
                        <img src={assets.profile_icon} alt="Profile" />
                        <ul className="nav-profile-dropdown">
                            <li onClick={() => navigate("/myorders")}>
                                <img src={assets.bag_icon} alt="Orders" />
                                <p>Orders</p>
                            </li>
                            <li onClick={() => navigate("/my-subscriptions")}>
                                <img src={assets.subscriptions_icon} alt="Subscriptions" />
                                <p>My Subscriptions</p>
                            </li>
                            <hr />
                            <li onClick={logout}>
                                <img src={assets.logout_icon} alt="Logout" />
                                <p>Logout</p>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;
