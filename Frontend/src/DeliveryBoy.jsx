import React, { useState, useEffect } from "react";
import axios from "axios";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "./DeliveryBoyPage.css";

const DeliveryBoyPage = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [deliveryMarker, setDeliveryMarker] = useState(null);
  const [status, setStatus] = useState("Fetching location...");
  const [eta, setEta] = useState("Calculating...");
  const backendUrl = "http://localhost:4000"; // Backend URL
  const deliverySpeedKmh = 30; // Delivery speed in km/h

  // Fetch orders assigned to the delivery boy
  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/order/list`);
      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        console.error("Failed to fetch orders:", response.data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // Calculate ETA based on distance
  const calculateETA = (distanceKm) => {
    const timeInHours = distanceKm / deliverySpeedKmh;
    const timeInMinutes = Math.round(timeInHours * 60);
    return `${timeInMinutes} minutes`;
  };

  // Update the live location
  const updateLocation = async (order) => {
    if (!navigator.geolocation) {
      setStatus("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          await axios.post(`${backendUrl}/api/delivery/update-location`, {
            lat: latitude,
            lon: longitude,
            orderId: order._id,
          });

          setStatus(`Location updated for Order ID: ${order._id}`);

          // Update the map marker for the delivery boy
          if (deliveryMarker) {
            deliveryMarker.setLngLat([longitude, latitude]);
          } else {
            const marker = new maplibregl.Marker({ color: "blue" })
              .setLngLat([longitude, latitude])
              .setPopup(new maplibregl.Popup().setText("Your Location"))
              .addTo(mapInstance);
            setDeliveryMarker(marker);
          }

          // Fetch and update the route
          const directionsResponse = await axios.post(
            "https://api.openrouteservice.org/v2/directions/driving-car",
            {
              coordinates: [
                [longitude, latitude],
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

          if (!mapInstance.getSource("route")) {
            mapInstance.addSource("route", {
              type: "geojson",
              data: {
                type: "Feature",
                geometry: {
                  type: "LineString",
                  coordinates: decodedRoute,
                },
              },
            });

            mapInstance.addLayer({
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
          } else {
            mapInstance.getSource("route").setData({
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: decodedRoute,
              },
            });
          }

          // Calculate and update ETA
          const distanceKm =
            directionsResponse.data.routes[0].summary.distance / 1000; // Convert to km
          setEta(calculateETA(distanceKm));
        } catch (error) {
          console.error("Error updating route:", error);
        }
      },
      (error) => {
        console.error("Error fetching location:", error);
        setStatus("Failed to fetch location.");
      }
    );
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

  // Initialize the map
  const initializeMap = (order) => {
    const mapContainer = document.getElementById("map");

    if (mapInstance) {
      mapInstance.remove();
    }

    const map = new maplibregl.Map({
      container: mapContainer,
      style: "https://api.maptiler.com/maps/streets/style.json?key=EjBcSB0AjZylSCnAuoxl",
      center: [order.address.lon, order.address.lat], // Center to destination
      zoom: 12,
    });

    // Add the destination marker
    new maplibregl.Marker({ color: "red" })
      .setLngLat([order.address.lon, order.address.lat])
      .setPopup(new maplibregl.Popup().setText("Delivery Destination"))
      .addTo(map);

    setMapInstance(map);
    document.getElementById("map-section").scrollIntoView({ behavior: "smooth" });
  };

  // Handle order selection
  const handleSelectOrder = (order) => {
    setSelectedOrder(order);
    initializeMap(order);
    updateLocation(order); // Immediately update location
  };

  useEffect(() => {
    fetchOrders();

    // Update location every 15 seconds for the selected order
    const interval = setInterval(() => {
      if (selectedOrder) {
        updateLocation(selectedOrder);
      }
    }, 15000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [selectedOrder]);

  return (
    <div>
      <h2>Delivery Boy Dashboard</h2>
      <p>Status: {status}</p>
      <h3>Orders</h3>
      <ul>
        {orders.length > 0 ? (
          orders.map((order) => (
            <li key={order._id}>
              Order ID: {order._id} - {order.address.street}, {order.address.city}
              <button onClick={() => handleSelectOrder(order)}>Select Order</button>
            </li>
          ))
        ) : (
          <p>No orders available.</p>
        )}
      </ul>
      {selectedOrder && (
        <div id="map-section">
          <h3>Live Location for Order ID: {selectedOrder._id}</h3>
          <div id="map" style={{ width: "100%", height: "500px", marginTop: "20px" }}></div>
          <p>Estimated Time to Deliver: {eta}</p>
        </div>
      )}
    </div>
  );
};

export default DeliveryBoyPage;
