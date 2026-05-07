"use client";

import { useEffect, useRef, useState } from "react";
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// fix default icon path issues in some bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function DraggableMarker({ position, onChange }) {
  const [draggable, setDraggable] = useState(true);
  const markerRef = useRef(null);

  useMapEvents({
    click(e) {
      onChange([e.latlng.lat, e.latlng.lng]);
    },
  });

  useEffect(() => {
    const marker = markerRef.current;
    if (marker) {
      const handleDragEnd = () => {
        const latlng = marker.getLatLng();
        onChange([latlng.lat, latlng.lng]);
      };

      marker.on('dragend', handleDragEnd);
      return () => marker.off('dragend', handleDragEnd);
    }
  }, [onChange]);

  return (
    <Marker
      draggable={draggable}
      eventHandlers={{
        dragstart() {
          setDraggable(true);
        },
      }}
      position={position}
      ref={markerRef}
    />
  );
}

export default function MapPicker({ initialPosition = [-14.2350, -51.9253], initialZoom = 4, onChange }) {
  const [position, setPosition] = useState(initialPosition);

  useEffect(() => {
    if (initialPosition && initialPosition.length === 2) {
      setPosition(initialPosition);
    }
  }, [initialPosition]);

  function handleChange(latlng) {
    setPosition(latlng);
    if (onChange) onChange({ latitude: Number(latlng[0]), longitude: Number(latlng[1]) });
  }

  return (
    <div className="w-full h-64 rounded-xl overflow-hidden">
      <MapContainer center={position} zoom={initialZoom} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <DraggableMarker position={position} onChange={(latlng) => handleChange(latlng)} />
      </MapContainer>
    </div>
  );
}
