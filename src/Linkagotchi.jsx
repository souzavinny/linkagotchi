import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import 'nes.css/css/nes.min.css';
import BlockagotchiRanking from './BlockagotchiRanking';
import LoadingScreen from './loading-screen-component';
import CustomAlert from './custom-alert-component';
import shinyMark from './assets/blockagotchis/shiny_mark.png';

export default function Linkagotchi({ contract, account }) {
    const [blockagotchi, setBlockagotchi] = useState(null);
    const [newBlockagotchiName, setNewBlockagotchiName] = useState('');
    const [loading, setLoading] = useState(true);
    const [gameBalance, setGameBalance] = useState('0.00');
    const [animationState, setAnimationState] = useState('idle');
    const [showRanking, setShowRanking] = useState(false);
    const [alert, setAlert] = useState(null);
  
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
        
        if (activeBlockagotchiId.toNumber() === 0) {
          console.log("No active Blockagotchi found");
          setBlockagotchi(null);
          setLoading(false);
          return null;
        }
    
        const blockagotchiData = await contract.blockagotchis(activeBlockagotchiId);
        
        const updatedBlockagotchi = {
          id: activeBlockagotchiId.toNumber(),
          name: blockagotchiData.name,
          stage: blockagotchiData.stage,
          race: blockagotchiData.race,
          experience: blockagotchiData.experience.toNumber(),
          happiness: blockagotchiData.happiness.toNumber(),
          health: blockagotchiData.health.toNumber(),
          isShiny: blockagotchiData.isShiny
        };
        
        console.log("RACA: " + updatedBlockagotchi.race + ", SHINY: " + updatedBlockagotchi.isShiny);
        setBlockagotchi(updatedBlockagotchi);
        setLoading(false);
        setAnimationState('idle');
        return updatedBlockagotchi;
      } catch (error) {
        console.error("Failed to load active Blockagotchi:", error);
        setBlockagotchi(null);
        setLoading(false);
        return null;
      }
    };

  const fetchBalance = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const balance = await provider.getBalance(account);
      setGameBalance(ethers.utils.formatEther(balance));
    }
  };

  const getBlockagotchiSprite = (race) => {
    console.log(race);
    const raceSprites = {
      0: 'blobSprite.png',
      1: 'Bird.png',
      2: 'Dog.png',
      3: 'Cat.png',
      4: 'Duck.png', 
      5: 'Wolf.png',
      6: 'Tiger.png',
      7: 'Lion.png'  
    };
  
    return `/src/assets/blockagotchis/${raceSprites[race] || 'blobSprite.png'}`;
  };

  const getStageString = (stage) => {
    const stages = ['Blob', 'Child', 'Teen', 'Adult', 'Old'];
    return stages[stage] || 'Unknown';
  };

  const createBlockagotchi = async () => {
    if (!newBlockagotchiName) {
      setAlert({ message: "Please enter a name for your Blockagotchi", type: 'error' });
      return;
    }
    setLoading(true);
    try {
      setAlert({ message: "Creating your Blockagotchi... This may take a moment.", type: 'info' });
      
      const tx = await contract.createBlockagotchi(account, newBlockagotchiName);
      await tx.wait();
      
      // Espera adicional e verificação
      let newBlockagotchi = null;
      let attempts = 0;
      const maxAttempts = 10;
      
      while (!newBlockagotchi && attempts < maxAttempts) {
        attempts++;
        await new Promise(resolve => setTimeout(resolve, 10000)); // Espera 10 segundos entre tentativas
        newBlockagotchi = await loadActiveBlockagotchi();
        
        if (newBlockagotchi && newBlockagotchi.name === newBlockagotchiName) {
          break; // Blockagotchi encontrado
        }
      }
      
      if (newBlockagotchi && newBlockagotchi.name === newBlockagotchiName) {
        if (newBlockagotchi.isShiny) {
          setAlert({
            message: "Congratulations! You hatched a shiny Blockagotchi!",
            type: 'shiny',
            spriteUrl: getBlockagotchiSprite(newBlockagotchi.race),
            action: 'shiny'
          });
        } else {
          setAlert({ 
            message: "Blockagotchi created successfully!", 
            type: 'success',
            spriteUrl: getBlockagotchiSprite(newBlockagotchi.race),
            action: 'idle'
          });
        }
        setNewBlockagotchiName('');
      } else {
        setAlert({ message: "Blockagotchi creation confirmed, but not yet visible. Please check again in a moment.", type: 'warning' });
      }
    } catch (error) {
      console.error("Failed to create Blockagotchi:", error);
      setAlert({ message: "Failed to create Blockagotchi. Please try again.", type: 'error' });
    }
    setLoading(false);
  };

  const getRaceString = (race) => {
    const races = [
      'None',   // 0
      'Bird',   // 1
      'Dog',    // 2
      'Cat',    // 3
      'Eagle',  // 4
      'Wolf',   // 5
      'Tiger'   // 6
    ];
    return races[race] || 'Unknown';
  };

  const performAction = async (actionType) => {
    if (!blockagotchi) {
      setAlert({ message: "No active Blockagotchi to perform action on!", type: 'error' });
      return;
    }
    setLoading(true);
    try {
      const tx = await contract.performAction(blockagotchi.id, actionType);
      await tx.wait();
      
      const updatedBlockagotchi = await loadActiveBlockagotchi();
      
      if (!updatedBlockagotchi) {
        setAlert({ message: "Failed to load Blockagotchi after action", type: 'error' });
        return;
      }
  
      if (updatedBlockagotchi.stage !== blockagotchi.stage || updatedBlockagotchi.race !== blockagotchi.race) {
        // Blockagotchi evoluiu
        setAlert({
          message: "Congratulations! Your Blockagotchi evolved!",
          type: 'evolution',
          spriteUrl: getBlockagotchiSprite(updatedBlockagotchi.race),
          action: 'evolve',
          isShiny: updatedBlockagotchi.isShiny
        });
      } else {
        // Ação normal
        setAlert({ 
          message: `Action ${actionType} performed successfully!`, 
          type: 'success',
          spriteUrl: getBlockagotchiSprite(updatedBlockagotchi.race),
          action: actionType,
          isShiny: updatedBlockagotchi.isShiny
        });
      }
    } catch (error) {
      console.error(`Failed to perform action ${actionType}:`, error);
      setAlert({ message: `Failed to perform action ${actionType}. Please try again.`, type: 'error' });
    }
    setLoading(false);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="linkagotchi-wrapper">
      <h1 className="linkagotchi-main-title">Linkagotchi</h1>
      {showRanking ? (
        <BlockagotchiRanking contract={contract} onClose={() => setShowRanking(false)} />
      ) : (
        <div className="nes-container with-title is-centered">
          <p className="title">Linkagotchi</p>
          <div className="nes-container is-rounded">
            <div className="linkagotchi-menu">
              <button className="nes-btn is-primary" onClick={() => setShowRanking(true)}>Ranking</button>
              <span>Game balance: {parseFloat(gameBalance).toFixed(2)} ETH</span>
              <span className="wallet-address">{account.slice(0,6)}...{account.slice(-4)}</span>
            </div>
            
            {blockagotchi ? (
              <>
                <h2 className="blockagotchi-name">
                  {blockagotchi.name}
                  {blockagotchi.isShiny && <img src={shinyMark} alt="Shiny" className="shiny-mark" />}
                </h2>
                <div className="blockagotchi-sprite-container">
                <div className={`blockagotchi-sprite ${blockagotchi.isShiny ? 'shiny' : ''} ${animationState}`}
  style={{
    backgroundImage: `url(${getBlockagotchiSprite(blockagotchi.race)})`,
    animation: 'custom-sprite-idle 1s steps(2) infinite'
  }}
/>

                </div>
                <div className="linkagotchi-info">
                  <p>ID: {blockagotchi.id}</p>
                  <p>Stage: {getStageString(blockagotchi.stage)}</p>
                  <p>Race: {getRaceString(blockagotchi.race)}</p>
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
            {alert && (
  <CustomAlert
  message={alert.message}
  type={alert.type}
  spriteUrl={alert.spriteUrl}
  action={alert.action}
  isShiny={blockagotchi?.isShiny}
  onClose={() => setAlert(null)}
/>
)}
          </div>
        </div>
      )}
    </div>
  );
}