import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import birdSprite from '../assets/blockagotchis/Bird.png';
import catSprite from '../assets/blockagotchis/Cat.png';
import dogSprite from '../assets/blockagotchis/Dog.png';
import CustomAlert from '../custom-alert-component';

export default function HomePage({ onConnectWallet, isConnected }) {
  const navigate = useNavigate();
  const [alert, setAlert] = useState(null);

  const handleStartPlaying = () => {
    if (isConnected) {
      navigate('/play');
    } else {
      onConnectWallet();
    }
  };

  const handleMarketplace = () => {
    setAlert({message: 'Marketplace coming soon!'});
  };

  return (
    <div className="linkagotchi-homepage nes-container">
      <header className="homepage-header">
        <h1 className="nes-text is-primary">Linkagotchi</h1>
        {!isConnected && (
          <button className="nes-btn" onClick={onConnectWallet}>Connect Wallet</button>
        )}
      </header>

      <main className="homepage-main">
        <div className="linkagotchi-sprites-banner">
          <div className="sprite-container">
            <img src={birdSprite} alt="Bird Linkagotchi" className="linkagotchi-sprite bird-sprite" />
          </div>
          <div className="sprite-container">
            <img src={catSprite} alt="Cat Linkagotchi" className="linkagotchi-sprite cat-sprite" />
          </div>
          <div className="sprite-container">
            <img src={dogSprite} alt="Dog Linkagotchi" className="linkagotchi-sprite dog-sprite" />
          </div>
        </div>
        
        <section className="hero-section nes-container with-title">
          <h2 className="title">Welcome to Linkagotchi!</h2>
          <p>Collect, raise, and battle with your own blockchain pets!</p>
          <div className="cta-buttons">
            <button onClick={handleStartPlaying} className="nes-btn is-primary">
              Start Playing
            </button>
            <button onClick={handleMarketplace} className="nes-btn is-success">
              Visit Marketplace
            </button>
          </div>
        </section>

        <section className="features-section">
          <h3 className="nes-text is-primary">Game Features</h3>
          <ul className="nes-list is-circle">
            <li>Collect unique Linkagotchi pets</li>
            <li>Train and evolve your Linkagotchis</li>
            <li>Trade on the marketplace</li>
            <li>Earn rewards and climb the leaderboard</li>
          </ul>
        </section>
        {alert && (
        <CustomAlert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}

        <section className="how-to-play nes-container with-title">
          <h3 className="title">How to Play</h3>
          <ol className="nes-list is-numbered">
            <li>Connect your wallet</li>
            <li>Get your first Linkagotchi</li>
            <li>Feed and train your pet</li>
            <li>Trade and collect rare Linkagotchis</li>
          </ol>
        </section>
      </main>

      <footer className="homepage-footer nes-container">
        <p>&copy; 2024 Linkagotchi. All rights reserved.</p>
        <div className="social-links">
          <a href="https://x.com/mvinnysl" className="nes-icon twitter is-medium"></a>
          <a href="https://github.com/souzavinny" className="nes-icon github is-medium"></a>
        </div>
      </footer>
    </div>
  );
}