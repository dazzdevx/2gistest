import React from 'react';

export const Controls = ({ onStart, onReset, onToggle3D, isNavigating }) => {
  return (
    <div className="controls">
      <div>
        <select id="direction-type">
          <option value="carrouting">Авто</option>
          <option value="truck">Грузовой</option>
        </select>
      </div>
      
      <button onClick={onStart} disabled={isNavigating}>
        {isNavigating ? 'Навигация активна' : 'Начать навигацию'}
      </button>
      
      <button onClick={onReset}>Сбросить</button>
      <button onClick={onToggle3D}>2D/3D</button>
    </div>
  );
};