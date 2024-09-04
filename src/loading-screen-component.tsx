import React, { useState, useEffect } from 'react';

const loadingMessages = [
  "Did you know? Blockagotchis love to exercise in the blockchain!",
  "Rumor has it that some Blockagotchis can predict the next block...",
  "Feeding your Blockagotchi crypto snacks helps it grow stronger!",
  "A well-rested Blockagotchi is a happy Blockagotchi!",
  "Some say the rarest Blockagotchis are born during network congestion.",
  "Blockagotchis dream in binary, or so we've heard!",
  "Legend tells of a Blockagotchi that mined its own block...",
  "Remember: A clean Blockagotchi is a healthy Blockagotchi!",
  "Blockagotchis love solving cryptographic puzzles in their spare time.",
  "Did you know? Blockagotchis can have different personalities based on their creation block!"
];

export default function LoadingScreen() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const intervalId = setInterval(() => {
      setMessage(loadingMessages[Math.floor(Math.random() * loadingMessages.length)]);
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="loading-screen nes-container with-title">
      <p className="title">Loading...</p>
      <p>{message}</p>
      <progress className="nes-progress is-pattern" value="70" max="100"></progress>
    </div>
  );
}
