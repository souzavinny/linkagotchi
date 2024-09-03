import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

function Linkagotchi({ contract, account }) {
  const [blockagotchi, setBlockagotchi] = useState(null);
  const [newBlockagotchiName, setNewBlockagotchiName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (contract && account) {
      loadActiveBlockagotchi();
    }
  }, [contract, account]);

  const loadActiveBlockagotchi = async () => {
    setLoading(true);
    try {
      const activeBlockagotchiId = await contract.activeBlockagotchi(account);
      console.log("Active Blockagotchi ID:", activeBlockagotchiId.toNumber());

      if (activeBlockagotchiId.toNumber() == 0) {
        const blockagotchiData = await contract.blockagotchis(activeBlockagotchiId);
        console.log("Blockagotchi Data:", blockagotchiData);

        setBlockagotchi({
          id: activeBlockagotchiId.toNumber(),
          name: blockagotchiData.name,
          birthTime: blockagotchiData.birthTime.toNumber(),
          age: blockagotchiData.age.toNumber(),
          happiness: blockagotchiData.happiness.toNumber(),
          health: blockagotchiData.health.toNumber(),
          experience: blockagotchiData.experience.toNumber(),
          stage: blockagotchiData.stage,
          race: blockagotchiData.race,
          isShiny: blockagotchiData.isShiny,
          isActive: blockagotchiData.isActive,
          generation: blockagotchiData.generation
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
      // Wait a bit and then reload the active Blockagotchi
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
  };

  const getStageString = (stage) => {
    const stages = ['Blob', 'Child', 'Teen', 'Adult', 'Old'];
    return stages[stage] || 'Unknown';
  };

  const getRaceString = (race) => {
    const races = ['None', 'Bird', 'Dog', 'Cat', 'Eagle', 'Wolf', 'Tiger'];
    return races[race] || 'Unknown';
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {blockagotchi ? (
        <div>
          <h2>{blockagotchi.name}</h2>
          <p>ID: {blockagotchi.id}</p>
          <p>Stage: {getStageString(blockagotchi.stage)}</p>
          <p>Race: {getRaceString(blockagotchi.race)}</p>
          <p>Experience: {blockagotchi.experience}</p>
          <p>Happiness: {blockagotchi.happiness}</p>
          <p>Health: {blockagotchi.health}</p>
          <p>Age: {blockagotchi.age}</p>
          <p>Is Shiny: {blockagotchi.isShiny ? 'Yes' : 'No'}</p>
          <p>Generation: {blockagotchi.generation}</p>
          <button onClick={() => performAction('feed')}>Feed</button>
          <button onClick={() => performAction('bathe')}>Bathe</button>
          <button onClick={() => performAction('fly')}>Fly</button>
          <button onClick={() => performAction('run')}>Run</button>
          <button onClick={() => performAction('climb')}>Climb</button>
        </div>
      ) : (
        <div>
          <p>You don't have an active Blockagotchi. Create one!</p>
          <input 
            type="text" 
            value={newBlockagotchiName} 
            onChange={(e) => setNewBlockagotchiName(e.target.value)}
            placeholder="Enter Blockagotchi name"
          />
          <button onClick={createBlockagotchi}>Create Blockagotchi</button>
        </div>
      )}
    </div>
  );
}

export default Linkagotchi;