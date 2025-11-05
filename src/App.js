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
  const [mapInstance, setMapInstance] = useState(null);
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
        `https://routing.api.2gis.com/get_route?` +
        `key=${process.env.REACT_APP_DGIS_KEY}&` +
        `points=${start.lng},${start.lat}|${end.lng},${end.lat}&` +
        `type=car`
      );
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      if (data.result && data.result.routes && data.result.routes[0]) {
        setRoute(data.result.routes[0]);
      }
    } catch (error) {
      console.error('Ошибка построения маршрута:', error);
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