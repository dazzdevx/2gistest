import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Map } from './components/Map';
import { NavigationPanel } from './components/NavigationPanel';

const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
`;

const ResetButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 10px 20px;
  background: white;
  border: none;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  cursor: pointer;
`;

function App() {
  const [route, setRoute] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);

  // Watch user location
  useEffect(() => {
    if (!navigator.geolocation) {
      console.error('Геолокация не поддерживается');
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserLocation(newLocation);

        // If navigating, update route
        if (isNavigating && destination) {
          updateRoute(newLocation, destination);
        }
      },
      (error) => console.error('Ошибка геолокации:', error),
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [isNavigating, destination]);

  const updateRoute = async (start, end) => {
    try {
      const response = await fetch(
        `https://routing.api.2gis.com/routing/7.0.0/global?key=${process.env.REACT_APP_DGIS_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            points: [
              { type: "stop", lon: start.lng, lat: start.lat },
              { type: "stop", lon: end.lng, lat: end.lat }
            ],
            locale: "ru",
            transport: "driving",
            route_mode: "fastest",
            traffic_mode: "jam"
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Ошибка сети: ${response.status}`);
      }

      const data = await response.json();

      if (data.result && data.result[0] && data.result[0].route) {
        setRoute(data.result[0].route);
      } else {
        console.error("Маршрут не найден:", data);
      }
    } catch (error) {
      console.error("Ошибка построения маршрута:", error);
    }
  };


  const handleMapClick = async (e) => {
    if (isNavigating) return;

    const clickedPoint = {
      lng: e.lngLat.lng,
      lat: e.lngLat.lat
    };

    setDestination(clickedPoint);

    if (userLocation) {
      await updateRoute(userLocation, clickedPoint);
    }
  };

  const handleStartNavigation = () => {
    if (!userLocation || !destination) return;
    setIsNavigating(true);
  };

  const handleReset = () => {
    setDestination(null);
    setRoute(null);
    setIsNavigating(false);
  };

  return (
    <AppContainer>
      <Map
        apiKey={process.env.REACT_APP_DGIS_KEY}
        onMapClick={handleMapClick}
        userLocation={userLocation}
        destination={destination}
        route={route}
        isNavigating={isNavigating}
      />
      <ResetButton onClick={handleReset}>
        Сбросить
      </ResetButton>
      {destination && (
        <NavigationPanel
          route={route}
          isNavigating={isNavigating}
          onStartNavigation={handleStartNavigation}
          userLocation={userLocation}
        />
      )}
    </AppContainer>
  );
}

export default App;