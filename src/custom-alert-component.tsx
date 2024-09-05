import React, { useState, useEffect } from 'react';

export default function CustomAlert({ message, onClose, type = 'info', spriteUrl, action, isShiny }) {
  const [evolutionStage, setEvolutionStage] = useState(0);

  useEffect(() => {
    let interval;
    if (type === 'evolution' || type === 'shiny') {
      interval = setInterval(() => {
        setEvolutionStage((prev) => (prev + 1) % 4);
      }, 500);
    }
    return () => clearInterval(interval);
  }, [type]);

  const getAnimationStyle = (action, isShiny) => {
    let baseAnimation;
    switch (action) {
      case 'evolve':
        baseAnimation = 'custom-sprite-evolve 2s steps(4) infinite';
        break;
      case 'idle':
        baseAnimation = 'custom-sprite-idle 1s steps(2) infinite';
        break;
      case 'move':
      case 'fly':
      case 'run':
        baseAnimation = 'custom-sprite-move 0.5s steps(2) infinite';
        break;
      case 'climb':
        baseAnimation = 'custom-sprite-climb 0.5s infinite';
        break;
      case 'bathe':
        baseAnimation = 'custom-sprite-bathe 0.5s infinite';
        break;
      default:
        baseAnimation = 'custom-sprite-idle 1s steps(2) infinite';
    }
    console.log("Shiny: " +isShiny)
    return isShiny ? `${baseAnimation}, custom-sprite-shiny 2s linear infinite` : baseAnimation;
  };

  const getAlertTitle = () => {
    switch (type) {
      case 'error': return 'Error';
      case 'warning': return 'Warning';
      case 'evolution': return 'Evolution';
      case 'shiny': return 'Shiny!';
      case 'info': return 'Info';
      default: return 'Success';
    }
  };

  const getTextClass = () => {
    switch (type) {
      case 'error': return 'is-error';
      case 'warning': return 'is-warning';
      case 'shiny': return 'is-warning';
      case 'info': return 'is-info';
      default: return 'is-primary';
    }
  };

  return (
    <div className="custom-alert-overlay">
      <div className="custom-alert nes-container is-rounded">
        <p className="title">{getAlertTitle()}</p>
        <div className="custom-alert-content">
          {spriteUrl && (
            <div className="blockagotchi-sprite-container">
              <div 
                className={`blockagotchi-sprite ${isShiny ? 'shiny' : ''} ${type === 'evolution' ? 'evolving' : ''}`}
                style={{
                  backgroundImage: `url(${spriteUrl})`,
                  animation: getAnimationStyle(action, isShiny),
                  opacity: (type === 'evolution') ? (evolutionStage % 2 === 0 ? 1 : 0.5) : 1
                }}
              />
            </div>
          )}
          <p className={`nes-text ${getTextClass()}`}>
            {message}
          </p>
          <button className="nes-btn is-primary" onClick={onClose}>OK</button>
        </div>
      </div>
    </div>
  );
}
