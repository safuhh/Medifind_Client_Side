"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default icon issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const myIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3204/3204121.png", // custom delivery boy icon
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38],
});

const shopIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/4320/4320336.png", // shop
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const homeIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/25/25694.png", // home
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

interface Location {
  lat: number;
  lng: number;
}

interface DeliveryMapProps {
  currentLocation: Location | null;
  pickupLocations: Location[];
  dropoffLocation: Location | null;
  orderStatus: "pending" | "confirmed" | "picked_up" | "delivered";
}

export default function DeliveryMap({ currentLocation, pickupLocations, dropoffLocation, orderStatus }: DeliveryMapProps) {
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Generate route using OSRM
    const fetchRoute = async () => {
      if (!currentLocation) return;

      try {
        let coordinates = "";

        if (orderStatus === "confirmed" || orderStatus === "pending") {
          // Route from current location to pickup locations
          if (pickupLocations.length === 0) return;
          coordinates = [
            `${currentLocation.lng},${currentLocation.lat}`,
            ...pickupLocations.map(p => `${p.lng},${p.lat}`)
          ].join(";");
        } else if (orderStatus === "picked_up") {
          // Route from current location to dropoff location
          if (!dropoffLocation) return;
          coordinates = [
            `${currentLocation.lng},${currentLocation.lat}`,
            `${dropoffLocation.lng},${dropoffLocation.lat}`
          ].join(";");
        } else {
          // If delivered or something else, no route
          setRouteCoords([]);
          return;
        }

        const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson`);
        
        if (!response.ok) {
          console.warn("OSRM API error or rate limit:", response.statusText);
          return;
        }

        const data = await response.json();

        if (data.routes && data.routes[0]) {
          // OSRM returns [lng, lat], Leaflet polyline needs [lat, lng]
          const latLngs = data.routes[0].geometry.coordinates.map((c: [number, number]) => [c[1], c[0]]);
          setRouteCoords(latLngs);
        }
      } catch (error) {
        console.error("Error fetching route:", error);
      }
    };

    fetchRoute();
  }, [currentLocation, pickupLocations, dropoffLocation, orderStatus]);

  const defaultCenter: [number, number] = currentLocation 
    ? [currentLocation.lat, currentLocation.lng] 
    : [11.2588, 75.7804]; // Default to Kozhikode

  if (!mounted) return null;

  return (
    <div style={{ height: "400px", width: "100%", borderRadius: "1rem", overflow: "hidden", border: "1px solid #e2e8f0" }}>
      <MapContainer center={defaultCenter} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {currentLocation && (
          <Marker position={[currentLocation.lat, currentLocation.lng]} icon={myIcon}>
            <Popup>You are here</Popup>
          </Marker>
        )}

        {(orderStatus === "confirmed" || orderStatus === "pending") && pickupLocations.map((loc, idx) => (
          <Marker key={idx} position={[loc.lat, loc.lng]} icon={shopIcon}>
            <Popup>Pickup Location {idx + 1}</Popup>
          </Marker>
        ))}

        {orderStatus === "picked_up" && dropoffLocation && (
          <Marker position={[dropoffLocation.lat, dropoffLocation.lng]} icon={homeIcon}>
            <Popup>Dropoff Location (Customer)</Popup>
          </Marker>
        )}

        {routeCoords.length > 0 && (
          <Polyline positions={routeCoords} color="blue" weight={5} opacity={0.7} />
        )}
      </MapContainer>
    </div>
  );
}
