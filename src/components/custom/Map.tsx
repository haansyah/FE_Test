"use client";

import { useEffect } from "react";
import L from "leaflet";

const Map = () => {
  useEffect(() => {
    const map = L.map("map").setView([-7.25, 110.5], 7);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const roadCoordinates: L.LatLngExpression[] = [
      [-6.2088, 106.8456],
      [-6.25, 106.8],
      [-6.35, 106.75],
      [-6.4, 106.7],
    ];

    const roadLine = L.polyline(roadCoordinates, {
      color: "blue",
      weight: 4,
      opacity: 0.7,
    }).addTo(map);

    map.fitBounds(roadLine.getBounds());
  }, []);

  return <div id="map" style={{ height: "1500px", width: "100%" }}></div>;
};

export default Map;
