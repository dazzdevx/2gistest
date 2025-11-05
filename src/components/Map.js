import React, { useEffect, useRef, useState } from 'react';
import { load } from '@2gis/mapgl';

export const Map = ({ 
  apiKey, 
  onMapClick,
  userLocation, 
  destination, 
  route, 
  isNavigating 
}) => {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);
  const userMarker = useRef(null);
  const destinationMarker = useRef(null);
  const routeLayer = useRef(null);
  const [mapgl, setMapgl] = useState(null);

  // Initialize map and load mapgl
  useEffect(() => {
    load().then((mapglInstance) => {
      setMapgl(mapglInstance);
      mapInstance.current = new mapglInstance.Map(mapContainer.current, {
        key: apiKey,
        center: userLocation ? [userLocation.lng, userLocation.lat] : [74.612, 42.874],
        zoom: 16,
        pitch: 45,
        rotation: 0
      });

      mapInstance.current.on('click', onMapClick);
    });

    return () => mapInstance.current?.destroy();
  }, [apiKey, onMapClick]);

  // Handle user location updates
  useEffect(() => {
    if (!mapInstance.current || !mapgl || !userLocation) return;

    if (userMarker.current) {
      userMarker.current.destroy();
    }

    userMarker.current = new mapgl.Marker(mapInstance.current, {
      coordinates: [userLocation.lng, userLocation.lat],
      icon: 'https://docs.2gis.com/img/mapgl/marker.svg'
    });
  }, [userLocation, mapgl]);

  // Handle destination updates
  useEffect(() => {
    if (!mapInstance.current || !mapgl || !destination) return;

    if (destinationMarker.current) {
      destinationMarker.current.destroy();
    }

    destinationMarker.current = new mapgl.Marker(mapInstance.current, {
      coordinates: [destination.lng, destination.lat]
    });
  }, [destination, mapgl]);

  // Handle route updates
  useEffect(() => {
    if (!mapInstance.current || !mapgl || !route) return;

    if (routeLayer.current) {
      routeLayer.current.destroy();
    }

    routeLayer.current = new mapgl.Polyline(mapInstance.current, {
      coordinates: route.geometry.coordinates,
      width: 5,
      color: '#2196f3'
    });
  }, [route, mapgl]);

  return <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />;
};