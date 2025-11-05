import React from 'react';
import styled from 'styled-components';

const Panel = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  padding: 20px;
  border-radius: 20px 20px 0 0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
`;

const StartButton = styled.button`
  width: 100%;
  padding: 16px;
  background: #2196f3;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  margin-top: 16px;
`;

const ManeuverText = styled.div`
  font-size: 18px;
  margin: 10px 0;
`;

const DistanceText = styled.div`
  color: #666;
  font-size: 14px;
`;

export const NavigationPanel = ({ route, isNavigating, onStartNavigation, userLocation }) => {
  if (!route) return null;

  const nextManeuver = route.maneuvers?.[0];
  const distance = nextManeuver?.distance || 0;

  return (
    <Panel>
      {isNavigating ? (
        <>
          <ManeuverText>{nextManeuver?.text || 'Двигайтесь по маршруту'}</ManeuverText>
          <DistanceText>
            {distance > 1000 
              ? `${(distance / 1000).toFixed(1)} км` 
              : `${Math.round(distance)} м`}
          </DistanceText>
        </>
      ) : (
        <>
          <DistanceText>
            Расстояние: {(route.total_distance / 1000).toFixed(1)} км
            Время: {Math.round(route.total_time / 60)} мин
          </DistanceText>
          <StartButton onClick={onStartNavigation}>
            Начать навигацию
          </StartButton>
        </>
      )}
    </Panel>
  );
};