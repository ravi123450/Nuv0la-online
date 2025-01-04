import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const [cartItems, setCartItems] = useState({});
    const url = "https://nuv0la-online-3.onrender.com";
    const [token, setToken] = useState("");
    const [food_list, setFoodList] = useState([]);

    // Add to cart function with optional error handling
    const addToCart = async (itemId) => {
        try {
            if (!cartItems[itemId]) {
                setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
            } else {
                setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
            }

            if (token) {
                await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
            }
        } catch (error) {
            console.error("Error adding to cart:", error.message);
        }
    };

    // Remove from cart function with optional error handling
    const removeFromCart = async (itemId) => {
        try {
            if (cartItems[itemId] > 1) {
                setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
            } else {
                const { [itemId]: _, ...rest } = cartItems; // Remove the item from the cart
                setCartItems(rest);
            }

            if (token) {
                await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
            }
        } catch (error) {
            console.error("Error removing from cart:", error.message);
        }
    };

    // Function to calculate the total cart amount with safeguards
    const getTotalCartAmount = () => {
        try {
            let totalAmount = 0;
            for (const item in cartItems) {
                if (cartItems[item] > 0) {
                    const itemInfo = food_list.find((product) => product._id === item);
                    if (itemInfo && itemInfo.price) {
                        totalAmount += itemInfo.price * cartItems[item];
                    }
                }
            }
            return totalAmount;
        } catch (error) {
            console.error("Error calculating total cart amount:", error.message);
            return 0;
        }
    };

    // Fetch food list with error handling
    const fetchFoodList = async () => {
        try {
            const response = await axios.get(url + "/api/food/list");
            setFoodList(response.data.data || []);
        } catch (error) {
            console.error("Error fetching food list:", error.message);
        }
    };

    // Load cart data from the server
    const loadCartData = async (token) => {
        try {
            const response = await axios.post(url + "/api/cart/get", {}, { headers: { token } });
            setCartItems(response.data.cartData || {});
        } catch (error) {
            console.error("Error loading cart data:", error.message);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            await fetchFoodList();

            const storedToken = localStorage.getItem("token");
            if (storedToken) {
                setToken(storedToken);
                await loadCartData(storedToken);
            }
        };
        loadData();
    }, []);

    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken,
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
