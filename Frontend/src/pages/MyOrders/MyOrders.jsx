import React, { useState, useEffect, useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "./MyOrders.css";
import { assets } from '../../assets/assets';

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [deliveryMarker, setDeliveryMarker] = useState(null);
  const [trackingInterval, setTrackingInterval] = useState(null);
  const [eta, setEta] = useState("Calculating..."); // Use state for ETA
  const initialSourceCoordinates = [80.3603, 16.2615]; // Placeholder source location
  const deliverySpeedKmh = 30; // Delivery speed: 30 km/h

  // Fetch orders for the logged-in user
  const fetchOrders = async () => {
    try {
      const response = await axios.post(
        `${url}/api/order/userorders`,
        {},
        { headers: { token } }
      );
      setOrders(response.data.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // Calculate estimated delivery time based on distance
  const calculateETA = (distanceKm) => {
    const timeInHours = distanceKm / deliverySpeedKmh;
    const timeInMinutes = Math.round(timeInHours * 60);
    return `${timeInMinutes} minutes`;
  };

  // Decode polyline from OpenRouteService
  const decodePolyline = (polyline) => {
    let index = 0,
      lat = 0,
      lng = 0,
      coordinates = [],
      shift = 0,
      result = 0,
      byte = null;

    while (index < polyline.length) {
      shift = 0;
      result = 0;
      do {
        byte = polyline.charCodeAt(index++) - 63;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);
      const deltaLat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
      lat += deltaLat;

      shift = 0;
      result = 0;
      do {
        byte = polyline.charCodeAt(index++) - 63;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);
      const deltaLng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
      lng += deltaLng;

      coordinates.push([lng / 1e5, lat / 1e5]);
    }
    return coordinates;
  };

  // Initialize map with destination and initial source markers
  const initializeMap = async (order) => {
    try {
      const mapContainer = document.getElementById("map");

      if (mapInstance) {
        mapInstance.remove(); // Remove existing map instance
      }

      const map = new maplibregl.Map({
        container: mapContainer,
        style: "https://api.maptiler.com/maps/streets/style.json?key=EjBcSB0AjZylSCnAuoxl",
        center: initialSourceCoordinates,
        zoom: 12,
      });

      // Add destination marker
      new maplibregl.Marker({ color: "red" })
        .setLngLat([order.address.lon, order.address.lat])
        .setPopup(new maplibregl.Popup().setText("Delivery Destination"))
        .addTo(map);

      // Add placeholder source marker
      const marker = new maplibregl.Marker({ color: "blue" })
        .setLngLat(initialSourceCoordinates)
        .setPopup(new maplibregl.Popup().setText("Initial Delivery Boy Location"))
        .addTo(map);

      setDeliveryMarker(marker);
      setMapInstance(map);

      // Display initial route
      const directionsResponse = await axios.post(
        "https://api.openrouteservice.org/v2/directions/driving-car",
        {
          coordinates: [
            initialSourceCoordinates,
            [order.address.lon, order.address.lat],
          ],
        },
        {
          headers: {
            Authorization: "5b3ce3597851110001cf62483b6381d6acf243b8b65187942c94f362",
            "Content-Type": "application/json",
          },
        }
      );

      const routeGeometry = directionsResponse.data.routes[0].geometry;
      const decodedRoute = decodePolyline(routeGeometry);

      map.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: decodedRoute,
          },
        },
      });

      map.addLayer({
        id: "route-layer",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#ff0000",
          "line-width": 4,
        },
      });

      // Calculate and set ETA
      const distanceKm = directionsResponse.data.routes[0].summary.distance / 1000;
      setEta(calculateETA(distanceKm));

      // Start live location tracking
      const intervalId = setInterval(() => updateTracking(order, map), 15000);
      setTrackingInterval(intervalId);
    } catch (error) {
      console.error("Error initializing map:", error);
    }
  };

  // Update source dynamically with delivery boy's live location
  const updateTracking = async (order, map) => {
    try {
      // Fetch all live locations
      const response = await axios.get(`${url}/api/delivery/live-location`, {
        headers: { token },
      });
  
      const liveLocationData = response.data.data;
  
      // Filter the live location by order ID
      const liveLocation = liveLocationData.orderId === order._id ? liveLocationData : null;
  
      if (liveLocation) {
        const { lat, lon } = liveLocation;
  
        if (lat && lon) {
          // Smoothly animate the marker's movement
          const previousLngLat = deliveryMarker
            ? deliveryMarker.getLngLat()
            : initialSourceCoordinates;
  
          const animateMarker = (start, end, duration) => {
            let startTime = null;
  
            const animateStep = (timestamp) => {
              if (!startTime) startTime = timestamp;
  
              const elapsed = timestamp - startTime;
              const progress = Math.min(elapsed / duration, 1);
  
              const lng = start.lng + (end.lng - start.lng) * progress;
              const lat = start.lat + (end.lat - start.lat) * progress;
  
              deliveryMarker.setLngLat([lng, lat]);
  
              if (progress < 1) {
                requestAnimationFrame(animateStep);
              }
            };
  
            requestAnimationFrame(animateStep);
          };
  
          if (deliveryMarker) {
            animateMarker(previousLngLat, { lng: lon, lat: lat }, 1000); // Animate for 1 second
          } else {
            const bikeIcon = document.createElement("div");
            bikeIcon.className = "bike-icon";
            bikeIcon.style.width = "30px";
            bikeIcon.style.height = "30px";
            bikeIcon.style.backgroundImage = `url(${assets.bike})`; // Replace with your bike icon
            bikeIcon.style.backgroundSize = "cover";
  
            const marker = new maplibregl.Marker({element : bikeIcon})
              .setLngLat([lon, lat])
              .addTo(map);
  
            setDeliveryMarker(marker);
          }
  
          // Update route dynamically
          const directionsResponse = await axios.post(
            "https://api.openrouteservice.org/v2/directions/driving-car",
            {
              coordinates: [
                [lon, lat],
                [order.address.lon, order.address.lat],
              ],
            },
            {
              headers: {
                Authorization: "5b3ce3597851110001cf62483b6381d6acf243b8b65187942c94f362",
                "Content-Type": "application/json",
              },
            }
          );
  
          const routeGeometry = directionsResponse.data.routes[0].geometry;
          const decodedRoute = decodePolyline(routeGeometry);
  
          if (map.getSource("route")) {
            map.getSource("route").setData({
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: decodedRoute,
              },
            });
          }
  
          // Update ETA
          const distanceKm =
            directionsResponse.data.routes[0].summary.distance / 1000;
          document.getElementById(
            "eta"
          ).innerText = `Estimated Time to Deliver: ${calculateETA(distanceKm)}`;
        }
      } else {
        console.error("No live location data found for the selected order.");
      }
    } catch (error) {
      console.error("Error updating live location:", error);
    }
  };
  

  // Track order and initialize map
  const trackOrder = (order) => {
    setSelectedOrder(order);
    initializeMap(order);
    document.getElementById("map-section").scrollIntoView({ behavior: "smooth" });
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (trackingInterval) clearInterval(trackingInterval);
    };
  }, [trackingInterval]);

  // Fetch orders on component mount
  useEffect(() => {
    if (token) fetchOrders();
  }, [token]);

  return (
    <div className="my-orders">
      <h2>My Orders</h2>
      <div className="container">
        {orders.map((order, index) => (
          <div key={index} className="my-orders-order">
            <p>
              {order.items.map((item, idx) =>
                idx === order.items.length - 1
                  ? `${item.name} x ${item.quantity}`
                  : `${item.name} x ${item.quantity}, `
              )}
            </p>
            <p>₹{order.amount}.00</p>
            <p>Items: {order.items.length}</p>
            <p>
              <span>&#x25cf; </span>
              <b>{order.status}</b>
            </p>
            <button onClick={() => trackOrder(order)}>Track Order</button>
          </div>
        ))}
      </div>

      {selectedOrder && (
        <div id="map-section" style={{ marginTop: "20px" }}>
          <h3>Live Tracking</h3>
          <div id="map" style={{ width: "100%", height: "500px", marginTop: "20px" }}></div>
          <p
            id="eta"
            style={{
              marginTop: "10px",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            Estimated Time to Deliver: {eta}
          </p>
        </div>
      )}

      <div
        id="map-loader"
        style={{ display: "none", textAlign: "center", marginTop: "20px" }}
      >
        Loading route...
      </div>
    </div>
  );
};

export default MyOrders;
