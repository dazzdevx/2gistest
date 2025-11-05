import React from 'react';

const getTotalDistance = (route) => {
  if (!route || !route.maneuvers) return 0;
  return route.maneuvers.reduce((total, maneuver) => {
    return total + (maneuver.distance || 0);
  }, 0);
};

const NextManeuverInfo = ({ route, userLocation }) => {
  if (!route || !route.maneuvers || !userLocation) return null;
  
  return (
    <div className="next-maneuver">
      <h4>Следующий маневр:</h4>
      <p>{route.maneuvers[0]?.text || 'Нет данных'}</p>
    </div>
  );
};

export const InfoPanel = ({ 
  travelledDistance, 
  isNavigating, 
  route, 
  userLocation 
}) => {
  const remainingDistance = route ? 
    Math.max(0, getTotalDistance(route) - travelledDistance) : 0;

  return (
    <div className="info-panel">
      <div>Пройдено: {travelledDistance.toFixed(2)} км</div>
      <div>Осталось: {remainingDistance.toFixed(2)} км</div>
      <div>Навигация: {isNavigating ? 'Включена' : 'Ожидание'}</div>
      {isNavigating && route && userLocation && (
        <NextManeuverInfo route={route} userLocation={userLocation} />
      )}
    </div>
  );
};