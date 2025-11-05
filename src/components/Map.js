import React, { useEffect, useRef, useState } from 'react';
import { load } from '@2gis/mapgl';

export const Map = ({ apiKey, onMapClick, userLocation, destination, route, isNavigating }) => {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);
  const userMarker = useRef(null);
  const destinationMarker = useRef(null);
  const routeLayer = useRef(null);
  const [mapgl, setMapgl] = useState(null);
  const isFirstLoad = useRef(true);

  // Инициализация карты
  useEffect(() => {
    load().then((mapglInstance) => {
      setMapgl(mapglInstance);
      mapInstance.current = new mapglInstance.Map(mapContainer.current, {
        key: apiKey,
        center: [74.612, 42.874],
        zoom: 15,
        pitch: 0,
        rotation: 0,
      });

      mapInstance.current.on('click', (e) => {
        const { lng, lat } = e.lngLat;
        onMapClick({ lngLat: { lng, lat } });
      });
    });

    return () => mapInstance.current?.destroy();
  }, [apiKey, onMapClick]);

  // Обновление позиции пользователя
  useEffect(() => {
    if (!mapInstance.current || !mapgl || !userLocation) return;

    if (userMarker.current) userMarker.current.destroy();

    userMarker.current = new mapgl.Marker(mapInstance.current, {
      coordinates: [userLocation.lng, userLocation.lat],
      icon: {
        html: `<div style="width: 20px; height: 20px; background: #4285F4; border-radius: 50%; border: 3px solid white;"></div>`,
      },
    });

    // Следование за пользователем
    if (isNavigating) {
      mapInstance.current.easeTo({
        center: [userLocation.lng, userLocation.lat],
        zoom: 18.5,
        pitch: 60,
        duration: 1000,
      });
    } else if (isFirstLoad.current) {
      mapInstance.current.setCenter([userLocation.lng, userLocation.lat]);
      isFirstLoad.current = false;
    }
  }, [userLocation, mapgl, isNavigating]);

  // Маркер пункта назначения
  useEffect(() => {
    if (!mapInstance.current || !mapgl || !destination) return;

    if (destinationMarker.current) destinationMarker.current.destroy();

    destinationMarker.current = new mapgl.Marker(mapInstance.current, {
      coordinates: [destination.lng, destination.lat],
      icon: {
        html: `<div style="width: 20px; height: 20px; background: #DB4437; border-radius: 50%; border: 3px solid white;"></div>`,
      },
    });
  }, [destination, mapgl]);

  // Отрисовка маршрута
  useEffect(() => {
    if (!mapInstance.current || !mapgl || !route) return;

    if (routeLayer.current) routeLayer.current.destroy();

    if (route.waypoints?.length > 0) {
      const coords = route.waypoints.map(wp => [wp.lon, wp.lat]);
      routeLayer.current = new mapgl.Polyline(mapInstance.current, {
        coordinates: coords,
        width: 6,
        color: '#4285F4',
      });
    }
  }, [route, mapgl]);

  return <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />;
};
