import { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import axiosInstance from "./axioxinstance";

const MapComponent = ({ address }) => {
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const response = await axiosInstance.get("/api/get-coordinates/", {
          params: { address: address },
        });
        setCoordinates(response.data);
      } catch (error) {
        console.error("Error fetching coordinates:", error);
      }
    };

    if (address) {
      fetchCoordinates();
    }
  }, [address]);

  return (
    <div>
      {coordinates.lat && coordinates.lng ? (
        <MapContainer center={[coordinates.lat, coordinates.lng]} zoom={13} style={{ height: "400px", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href='https://osm.org/copyright'>OpenStreetMap</a> contributors"
          />
          <Marker position={[coordinates.lat, coordinates.lng]}>
            <Popup>Your location</Popup>
          </Marker>
        </MapContainer>
      ) : (
        <p>Loading map...</p>
      )}
    </div>
  );
};

export default MapComponent;
