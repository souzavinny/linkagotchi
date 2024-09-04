import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import 'nes.css/css/nes.min.css';
import blobSprite from '../src/assets/blockagotchis/Bird.png';

export default function Linkagotchi({ contract, account }) {
    const [blockagotchi, setBlockagotchi] = useState(null);
    const [newBlockagotchiName, setNewBlockagotchiName] = useState('');
    const [loading, setLoading] = useState(true);
    const [gameBalance, setGameBalance] = useState('0.00');
    const [animationState, setAnimationState] = useState('idle');
  
    useEffect(() => {
      if (contract && account) {
        loadActiveBlockagotchi();
        fetchBalance();
      }
    }, [contract, account]);

  const loadActiveBlockagotchi = async () => {
    setLoading(true);
    try {
      const activeBlockagotchiId = await contract.activeBlockagotchi(account);
      const blockagotchiData = await contract.blockagotchis(activeBlockagotchiId);
      
      if (blockagotchiData.isActive) {
        setBlockagotchi({
          id: activeBlockagotchiId.toNumber(),
          name: blockagotchiData.name,
          stage: blockagotchiData.stage,
          race: blockagotchiData.race,
          experience: blockagotchiData.experience.toNumber(),
          happiness: blockagotchiData.happiness.toNumber(),
          health: blockagotchiData.health.toNumber(),
        });
      } else {
        setBlockagotchi(null);
      }
    } catch (error) {
      console.error("Failed to load active Blockagotchi:", error);
      setBlockagotchi(null);
    }
    setLoading(false);
  };

  const fetchBalance = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const balance = await provider.getBalance(account);
      setGameBalance(ethers.utils.formatEther(balance));
    }
  };

  const getBlockagotchiSprite = (stage, race) => {
    // Lógica para selecionar o sprite correto baseado no estágio e raça
    // Por enquanto, vamos usar o blob para todos
    return blobSprite;
  };

  const createBlockagotchi = async () => {
    if (!newBlockagotchiName) {
      alert("Please enter a name for your Blockagotchi");
      return;
    }
    setLoading(true);
    try {
      const tx = await contract.createBlockagotchi(account, newBlockagotchiName);
      await tx.wait();
      alert("Blockagotchi created! Waiting for it to hatch...");
      setNewBlockagotchiName('');
      setTimeout(loadActiveBlockagotchi, 5000);
    } catch (error) {
      console.error("Failed to create Blockagotchi:", error);
      alert("Failed to create Blockagotchi. Please try again.");
    }
    setLoading(false);
  };

  const performAction = async (actionType) => {
    if (!blockagotchi) {
      alert("No active Blockagotchi to perform action on!");
      return;
    }
    setAnimationState(actionType);
    setLoading(true);
    try {
      const tx = await contract.performAction(blockagotchi.id, actionType);
      await tx.wait();
      alert(`Action ${actionType} performed successfully!`);
      await loadActiveBlockagotchi();
    } catch (error) {
      console.error(`Failed to perform action ${actionType}:`, error);
      alert(`Failed to perform action ${actionType}. Please try again.`);
    }
    setLoading(false);
    // Reset animation state after a delay
    setTimeout(() => setAnimationState('idle'), 2000);
  };

  if (loading) {
    return <div className="nes-container">Loading...</div>;
  }

  return (
    <div className="linkagotchi-wrapper">
      <h1 className="linkagotchi-main-title">Linkagotchi</h1>
      <div className="nes-container with-title is-centered">
        <p className="title">Linkagotchi</p>
        <div className="nes-container is-rounded">
          <div className="linkagotchi-menu">
            <button className="nes-btn is-primary">Ranking</button>
            <span>Game balance: {parseFloat(gameBalance).toFixed(2)} ETH</span>
            <span className="wallet-address">{account.slice(0,6)}...{account.slice(-4)}</span>
          </div>
          
          {blockagotchi ? (
            <>
              <h2 className="blockagotchi-name">{blockagotchi.name}</h2>
              <div className="blockagotchi-sprite-container">
                <div 
                  className={`blockagotchi-sprite ${animationState}`}
                  style={{
                    backgroundImage: `url(${getBlockagotchiSprite(blockagotchi.stage, blockagotchi.race)})`,
                  }}
                />
              </div>
              <div className="linkagotchi-info">
                <p>ID: {blockagotchi.id}</p>
                <p>Stage: {blockagotchi.stage}</p>
                <p>Race: {blockagotchi.race}</p>
                <p>Experience: {blockagotchi.experience}</p>
                <p>Happiness: {blockagotchi.happiness}</p>
                <p>Health: {blockagotchi.health}</p>
              </div>
              <div className="linkagotchi-actions">
                <button className="nes-btn" onClick={() => performAction('feed')}>Feed</button>
                <button className="nes-btn" onClick={() => performAction('bathe')}>Bathe</button>
                <button className="nes-btn" onClick={() => performAction('fly')}>Fly</button>
                <button className="nes-btn" onClick={() => performAction('run')}>Run</button>
                <button className="nes-btn" onClick={() => performAction('climb')}>Climb</button>
              </div>
            </>
          ) : (
            <div className="linkagotchi-create">
              <h2>Create a blockagotchi</h2>
              <div className="nes-field">
                <label htmlFor="name_field">Name</label>
                <input
                  type="text"
                  id="name_field"
                  className="nes-input"
                  placeholder="Insert a name"
                  value={newBlockagotchiName}
                  onChange={(e) => setNewBlockagotchiName(e.target.value)}
                />
              </div>
              <button className="nes-btn is-primary" onClick={createBlockagotchi}>Create</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}