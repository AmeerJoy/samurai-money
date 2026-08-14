import React from 'react';
import { useGame } from '../context/GameContext';

export const FloatingNumbers: React.FC = () => {
  const { floatingNumbers, state } = useGame();

  if (!state.settings.showFloatingNumbers || floatingNumbers.length === 0) {
    return null;
  }

  return (
    <div className="floating-numbers-layer" aria-hidden="true">
      {floatingNumbers.map(item => (
        <div
          key={item.id}
          className={`floating-number-item ${item.isCritical ? 'critical' : ''}`}
          style={{
            left: `${item.x}px`,
            top: `${item.y}px`
          }}
        >
          {item.text}
        </div>
      ))}
    </div>
  );
};
