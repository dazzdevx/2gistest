import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Map } from './components/Map';
import { NavigationPanel } from './components/NavigationPanel';

const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
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
`;

function App() {
  const [mapInstance, setMapInstance] = useState(null);
  const [route, setRoute] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    if ("geolocation" in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => console.error(error),
        { enableHighAccuracy: true }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  const handleMapClick = (e) => {
    if (isNavigating) return;
    setDestination({
      lng: e.lngLat.lng,
      lat: e.lngLat.lat
    });
  };

  const handleReset = () => {
    setDestination(null);
    setRoute(null);
    setIsNavigating(false);
  };

  const handleStartNavigation = async () => {
    if (!userLocation || !destination) return;
    
    try {
      const directions = await fetch(
        `https://routing.api.2gis.com/get_route?` +
        `key=${process.env.REACT_APP_DGIS_KEY}&` +
        `points=${userLocation.lng},${userLocation.lat}|${destination.lng},${destination.lat}&` +
        `type=car`
      ).then(res => res.json());

      setRoute(directions.result);
      setIsNavigating(true);
    } catch (error) {
      console.error('Failed to get route:', error);
    }
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