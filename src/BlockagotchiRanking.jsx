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
      const currentTimestamp = Math.floor(Date.now() / 1000); // Timestamp atual em segundos
      const rankingData = await Promise.all(
        leaderboardIds.map(async (id) => {
          try {
            const blockagotchi = await contract.blockagotchis(id);
            return {
              id: id.toNumber(),
              name: blockagotchi.name,
              stage: getStageString(blockagotchi.stage),
              score: calculateScore(blockagotchi, currentTimestamp),
            };
          } catch (error) {
            console.error(`Failed to fetch data for Blockagotchi ID ${id}:`, error);
            return null;
          }
        })
      );

      // Filtra os nulls (falhas) e remove duplicatas, mantendo o de maior score
      const uniqueRanking = rankingData
        .filter(Boolean)
        .reduce((acc, current) => {
          const x = acc.find(item => item.id === current.id);
          if (!x) {
            return acc.concat([current]);
          } else {
            return acc.map(item => item.id === current.id && item.score < current.score ? current : item);
          }
        }, []);

      // Ordena pelo score (maior para menor)
      uniqueRanking.sort((a, b) => b.score - a.score);

      setRanking(uniqueRanking);
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

  const calculateScore = (blockagotchi, currentTimestamp) => {
    const ageInDays = Math.floor((currentTimestamp - blockagotchi.birthTime.toNumber()) / 86400); // 86400 segundos em um dia
    return blockagotchi.experience.toNumber() + blockagotchi.happiness.toNumber() + ageInDays;
  };

  const getOrdinal = (n) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
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
            <th>Rank</th>
            <th>ID</th>
            <th>Name</th>
            <th>Stage</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {ranking.map((blockagotchi, index) => (
            <tr key={blockagotchi.id}>
              <td>{getOrdinal(index + 1)}</td>
              <td>{blockagotchi.id}</td>
              <td>{blockagotchi.name}</td>
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