import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

export default function HomePage({ onConnectWallet, isConnected }) {
  const navigate = useNavigate();

  const handleStartPlaying = () => {
    if (isConnected) {
      navigate('/play');
    } else {
      onConnectWallet();
    }
  };

  const handleMarketplace = () => {
    alert('Marketplace coming soon!');
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
            <li>Battle with other players</li>
            <li>Trade on the marketplace</li>
            <li>Earn rewards and climb the leaderboard</li>
          </ul>
        </section>

        <section className="how-to-play nes-container with-title">
          <h3 className="title">How to Play</h3>
          <ol className="nes-list is-numbered">
            <li>Connect your wallet</li>
            <li>Get your first Linkagotchi</li>
            <li>Feed and train your pet</li>
            <li>Battle with other players</li>
            <li>Trade and collect rare Linkagotchis</li>
          </ol>
        </section>
      </main>

      <footer className="homepage-footer nes-container">
        <p>&copy; 2024 Linkagotchi. All rights reserved.</p>
        <div className="social-links">
          <a href="#" className="nes-icon twitter is-medium"></a>
          <a href="#" className="nes-icon facebook is-medium"></a>
          <a href="#" className="nes-icon github is-medium"></a>
        </div>
      </footer>
    </div>
  );
}