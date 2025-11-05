import React, { useEffect, useRef } from 'react';
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

  useEffect(() => {
    load().then((mapgl) => {
      mapInstance.current = new mapgl.Map(mapContainer.current, {
        key: apiKey,
        center: userLocation ? [userLocation.lng, userLocation.lat] : [74.612, 42.874],
        zoom: 16,
        pitch: 45,
        rotation: 0,
        style: isNavigating ? 'c080bb6a-8134-4993-93a1-5b4d8c36a59b' : '2b27210c-ca16-4295-bce7-aacd55cb7097'
      });

      mapInstance.current.on('click', onMapClick);
    });

    return () => mapInstance.current?.destroy();
  }, [apiKey]);

  useEffect(() => {
    if (!mapInstance.current || !userLocation) return;

    if (userMarker.current) {
      userMarker.current.destroy();
    }

    userMarker.current = new mapgl.Marker(mapInstance.current, {
      coordinates: [userLocation.lng, userLocation.lat],
      icon: 'https://docs.2gis.com/img/mapgl/marker.svg'
    });
  }, [userLocation]);

  useEffect(() => {
    if (!mapInstance.current || !destination) return;

    if (destinationMarker.current) {
      destinationMarker.current.destroy();
    }

    destinationMarker.current = new mapgl.Marker(mapInstance.current, {
      coordinates: [destination.lng, destination.lat]
    });
  }, [destination]);

  useEffect(() => {
    if (!mapInstance.current || !route) return;

    if (routeLayer.current) {
      routeLayer.current.destroy();
    }

    // Draw route on map
    routeLayer.current = new mapgl.Polyline(mapInstance.current, {
      coordinates: route.geometry.coordinates,
      width: 5,
      color: '#2196f3'
    });
  }, [route]);

  return <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />;
};