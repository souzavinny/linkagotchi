import React, { useState, useEffect } from 'react';

export default function BlockagotchiRanking({ contract, onClose }) {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRanking();
  }, []);

  const fetchRanking = async () => {
    try {
      setLoading(true);
      const leaderboardIds = await contract.getLeaderboard();
      const rankingData = await Promise.all(
        leaderboardIds.map(async (id, index) => {
          const blockagotchi = await contract.blockagotchis(id);
          return {
            id: id.toNumber(),
            name: blockagotchi.name,
            age: blockagotchi.age.toNumber(),
            stage: getStageString(blockagotchi.stage),
            score: calculateScore(blockagotchi),
          };
        })
      );
      setRanking(rankingData);
    } catch (error) {
      console.error("Failed to fetch ranking:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStageString = (stage) => {
    const stages = ['Blob', 'Child', 'Teen', 'Adult', 'Old'];
    return stages[stage] || 'Unknown';
  };

  const calculateScore = (blockagotchi) => {
    // Esta é uma função simplificada de cálculo de pontuação.
    // Ajuste conforme a lógica real do seu contrato.
    return blockagotchi.experience.toNumber() + blockagotchi.happiness.toNumber();
  };

  if (loading) {
    return <div className="nes-container">Loading ranking...</div>;
  }

  return (
    <div className="nes-container with-title">
      <h2 className="title">⭐Blockagotchi ranking⭐</h2>
      <table className="nes-table is-bordered is-centered">
        <thead>
          <tr>
            <th>id</th>
            <th>name</th>
            <th>age</th>
            <th>stage</th>
            <th>score</th>
          </tr>
        </thead>
        <tbody>
          {ranking.map((blockagotchi, index) => (
            <tr key={blockagotchi.id}>
              <td>{blockagotchi.id}</td>
              <td>{blockagotchi.name}</td>
              <td>{blockagotchi.age}</td>
              <td>{blockagotchi.stage}</td>
              <td>{blockagotchi.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="nes-btn" onClick={onClose}>Close</button>
    </div>
  );
}