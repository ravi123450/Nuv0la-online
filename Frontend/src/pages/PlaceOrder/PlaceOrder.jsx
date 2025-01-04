import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "", // Default pincode
    country: "",
    phone: "",
    lat: 16.3067, // Default latitude (Guntur)
    lon: 80.4365, // Default longitude (Guntur)
  });

  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);

  useEffect(() => {
    if (!token) {
      alert("Please log in to proceed with the order.");
      navigate("/login");
    } else if (getTotalCartAmount() === 0) {
      alert("Your cart is empty. Add items to your cart before placing an order.");
      navigate("/cart");
    }
  }, [token, navigate, getTotalCartAmount]);

  useEffect(() => {
    // Initialize the map
    const initializeMap = () => {
      const mapInstance = new maplibregl.Map({
        container: "map",
        style: "https://api.maptiler.com/maps/streets/style.json?key=EjBcSB0AjZylSCnAuoxl",
        center: [formData.lon, formData.lat],
        zoom: 14,
      });

      const initialMarker = new maplibregl.Marker({ draggable: true })
        .setLngLat([formData.lon, formData.lat])
        .addTo(mapInstance);

      initialMarker.on("dragend", async () => {
        const lngLat = initialMarker.getLngLat();
        const updatedAddress = await reverseGeocode(lngLat.lat, lngLat.lng);

        if (updatedAddress) {
          setFormData((prevData) => ({
            ...prevData,
            street: updatedAddress.street || "",
            city: updatedAddress.city || "",
            state: updatedAddress.state || "",
            country: updatedAddress.country || "",
            zipcode: updatedAddress.zipcode || "", // Update pincode
            lat: lngLat.lat,
            lon: lngLat.lng,
          }));
        }
      });

      setMap(mapInstance);
      setMarker(initialMarker);
    };

    initializeMap();
  }, []);

  useEffect(() => {
    // Update marker position when the user enters a new pincode
    if (map && marker && formData.zipcode) {
      const updateMarkerPosition = async () => {
        const geocodedAddress = await geocodePincode();
        if (geocodedAddress) {
          marker.setLngLat([geocodedAddress.lon, geocodedAddress.lat]);
          map.flyTo({ center: [geocodedAddress.lon, geocodedAddress.lat], zoom: 14 });

          setFormData((prevData) => ({
            ...prevData,
            lat: geocodedAddress.lat,
            lon: geocodedAddress.lon,
          }));
        }
      };

      updateMarkerPosition();
    }
  }, [formData.zipcode]);

  const geocodePincode = async () => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?postalcode=${formData.zipcode}&countrycodes=in&format=json&limit=1`
      );
      const data = await response.json();

      if (data.length > 0) {
        const { lat, lon } = data[0];
        return { lat: parseFloat(lat), lon: parseFloat(lon) };
      } else {
        console.error("Geocoding failed for the provided pincode.");
        return null;
      }
    } catch (error) {
      console.error("Error during geocoding:", error);
      return null;
    }
  };

  const reverseGeocode = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`
      );
      const data = await response.json();

      if (data && data.address) {
        return {
          street: data.address.road || "",
          city: data.address.city || data.address.town || data.address.village || "",
          state: data.address.state || "",
          country: data.address.country || "",
          zipcode: data.address.postcode || "", // Extracting pincode
        };
      } else {
        console.error("Reverse geocoding failed.");
        return null;
      }
    } catch (error) {
      console.error("Error performing reverse geocoding:", error);
      return null;
    }
  };

  const placeOrder = async (event) => {
    event.preventDefault();

    const orderItems = food_list.reduce((acc, item) => {
      if (cartItems[item._id] > 0) {
        acc.push({ name: item.name, price: item.price, quantity: cartItems[item._id] });
      }
      return acc;
    }, []);

    const orderData = {
      address: formData,
      items: orderItems,
      amount: getTotalCartAmount() + 2, // Including delivery fee
      userId: token,
    };

    try {
      const response = await axios.post(`${url}/api/order/place`, orderData, {
        headers: { token },
      });

      if (response.data.success) {
        // Razorpay Integration
        const { order_id, amount } = response.data;
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";

        script.onload = () => {
          const options = {
            key: "rzp_test_SyFe1hELG5eMsl", // Replace with your Razorpay key
            amount,
            currency: "INR",
            name: "Cloud Kitchen",
            description: "Order Payment",
            order_id,
            handler: async (paymentResponse) => {
              try {
                const verificationResponse = await axios.post(
                  `${url}/api/order/verify`,
                  {
                    razorpay_payment_id: paymentResponse.razorpay_payment_id,
                    razorpay_order_id: paymentResponse.razorpay_order_id,
                    razorpay_signature: paymentResponse.razorpay_signature,
                  },
                  { headers: { token } }
                );

                if (verificationResponse.data.success) {
                  alert("Payment successful! Your order has been placed.");
                  navigate("/myorders");
                } else {
                  alert("Payment verification failed. Please contact support.");
                }
              } catch (error) {
                console.error("Payment verification error:", error.message);
                alert("Failed to verify payment. Please try again.");
              }
            },
            prefill: {
              name: `${formData.firstName} ${formData.lastName}`,
              email: formData.email,
              contact: formData.phone,
            },
            theme: {
              color: "#28a745",
            },
          };

          const razorpay = new window.Razorpay(options);
          razorpay.open();
        };

        document.body.appendChild(script);
      } else {
        alert(`Error: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error placing order:", error.message);
      alert("Failed to place the order. Please try again.");
    }
  };

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <p style={{ color: "gray" }}>
          <strong>Note:</strong> Select Address from the Below Map.
        </p>
        <div className="multi-fields">
          <input
            required
            name="firstName"
            onChange={onChangeHandler}
            value={formData.firstName}
            type="text"
            placeholder="First Name"
          />
          <input
            required
            name="lastName"
            onChange={onChangeHandler}
            value={formData.lastName}
            type="text"
            placeholder="Last Name"
          />
        </div>
        <input
          required
          name="email"
          onChange={onChangeHandler}
          value={formData.email}
          type="email"
          placeholder="Email Address"
        />
        <input
          name="street"
          value={formData.street}
          type="text"
          readOnly
          placeholder="Street (Auto-filled)"
        />
        <div className="multi-fields">
          <input
            name="city"
            value={formData.city}
            type="text"
            readOnly
            placeholder="City (Auto-filled)"
          />
          <input
            name="state"
            value={formData.state}
            type="text"
            readOnly
            placeholder="State (Auto-filled)"
          />
        </div>
        <div className="multi-fields">
          <input
            required
            name="zipcode"
            onChange={onChangeHandler}
            value={formData.zipcode}
            type="text"
            placeholder="Pincode"
          />
          <input
            name="country"
            value={formData.country}
            type="text"
            readOnly
            placeholder="Country (Auto-filled)"
          />
        </div>
        <input
          required
          name="phone"
          onChange={onChangeHandler}
          value={formData.phone}
          type="text"
          placeholder="Phone"
        />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>₹{getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>₹{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</b>
            </div>
          </div>
          <button type="submit">PROCEED TO PAYMENT</button>
        </div>
      </div>
      <div id="map" style={{ width: "100%", height: "400px", marginTop: "20px" }}></div>
    </form>
  );
};

export default PlaceOrder;
