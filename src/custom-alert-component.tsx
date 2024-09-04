import React from 'react';

export default function CustomAlert({ message, onClose, type = 'info', spriteUrl, action }) {
  const getAnimationStyle = (action) => {
    switch (action) {
      case 'evolve':
        return `custom-sprite-evolve 2s steps(4) infinite`;
      case 'idle':
        return 'custom-sprite-idle 1s steps(2) infinite';
      case 'move':
        return 'custom-sprite-move 0.05s steps(2) infinite';
      case 'climb':
        return 'custom-sprite-climb 0.5s infinite';
      case 'bathe':
        return 'custom-sprite-bathe 0.5s infinite';
      default:
        return 'custom-sprite-idle 0.1s steps(2) infinite';
    }
  };

  return (
    <div className="custom-alert-overlay">
      <div className="custom-alert nes-container is-rounded">
        <p className="title">{type === 'error' ? 'Error' : 'Success'}</p>
        <div className="custom-alert-content">
          {spriteUrl && action && (
            <div className="blockagotchi-sprite-container">
              <div 
                className="blockagotchi-sprite"
                style={{
                  backgroundImage: `url(${spriteUrl})`,
                  animation: getAnimationStyle(action)
                }}
              />
            </div>
          )}
          <p className={`nes-text ${type === 'error' ? 'is-error' : 'is-primary'}`}>
            {message}
          </p>
          <button className="nes-btn is-primary" onClick={onClose}>OK</button>
        </div>
      </div>
    </div>
  );
}