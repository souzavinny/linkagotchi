import React from 'react';

export default function CustomAlert({ message, onClose, type = 'info' }) {
  return (
    <div className="custom-alert-overlay">
      <div className="custom-alert nes-container is-rounded with-title">
        <p className="title">{type === 'error' ? 'Error' : 'Message'}</p>
        <div className="custom-alert-content">
          <p className={`nes-text ${type === 'error' ? 'is-error' : 'is-primary'}`}>
            {message}
          </p>
          <button className="nes-btn is-primary" onClick={onClose}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
