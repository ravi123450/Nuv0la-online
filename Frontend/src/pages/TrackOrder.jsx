import React, { useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "./TrackOrder.css";
import axios from "axios";

const TrackOrder = () => {
  const [orderData, setOrderData] = useState(null); // Current order details
  const [map, setMap] = useState(null);
  const [route, setRoute] = useState(null); // Route data
  const source = {
    lat: 16.3067, // Source Latitude (Potturu, Guntur)
    lon: 80.4365, // Source Longitude (Potturu, Guntur)
  };

  const fetchOrderData = async () => {
    try {
      const response = await axios.get("https://nuv0la-online-3.onrender.com/api/order/list/");
      const orders = response.data.data;

      // Filter for "Out for Delivery" status
      const currentOrder = orders.find((order) => order.status === "Out for Delivery");

      if (currentOrder) {
        setOrderData(currentOrder);
        await fetchRoute(currentOrder.address);
      } else {
        alert("No orders are currently out for delivery.");
      }
    } catch (error) {
      console.error("Error fetching order data:", error);
    }
  };

  const fetchRoute = async (destination) => {
    try {
      // Use OpenStreetMap or other routing API for route calculation
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${source.lon},${source.lat};${destination.lon},${destination.lat}?overview=full&geometries=geojson`
      );
      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        setRoute(data.routes[0].geometry.coordinates); // Extract route coordinates
      } else {
        console.error("No route found.");
      }
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  };

  useEffect(() => {
    fetchOrderData();
  }, []);

  useEffect(() => {
    if (route) {
      // Initialize the map after the route is fetched
      const mapInstance = new maplibregl.Map({
        container: "map",
        style: "https://api.maptiler.com/maps/streets/style.json?key=EjBcSB0AjZylSCnAuoxl",
        center: [source.lon, source.lat], // Start with the source location
        zoom: 10,
      });

      // Add source marker
      new maplibregl.Marker({ color: "green" })
        .setLngLat([source.lon, source.lat])
        .addTo(mapInstance);

      // Add destination marker
      if (orderData) {
        new maplibregl.Marker({ color: "red" })
          .setLngLat([orderData.address.lon, orderData.address.lat])
          .addTo(mapInstance);
      }

      // Add the route line
      if (route) {
        const routeLine = {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: route,
          },
        };

        mapInstance.on("load", () => {
          mapInstance.addSource("route", {
            type: "geojson",
            data: routeLine,
          });

          mapInstance.addLayer({
            id: "route",
            type: "line",
            source: "route",
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": "#ff5733",
              "line-width": 4,
            },
          });
        });
      }

      setMap(mapInstance);
    }
  }, [route]);

  return (
    <div className="track-order">
      <h2>Track Your Order</h2>
      {orderData ? (
        <div className="order-details">
          <p>
            <strong>Order ID:</strong> {orderData._id}
          </p>
          <p>
            <strong>Destination:</strong> {`${orderData.address.street}, ${orderData.address.city}, ${orderData.address.state}, ${orderData.address.zipcode}`}
          </p>
          <p>
            <strong>Status:</strong> {orderData.status}
          </p>
        </div>
      ) : (
        <p>Fetching order details...</p>
      )}
      <div id="map" style={{ width: "100%", height: "500px", marginTop: "20px" }}></div>
    </div>
  );
};

export default TrackOrder;
