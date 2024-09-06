<div align="center">
    <h1>Linkagotchi</h1>
    <i>Blockagotchis on the chain</i>
</div>
<div align="center">
  Since we are bringing everything on chain, let`s bring tamagotchis too. 
</div>

<div align="center">
  
  <a href="">[![Static Badge](https://img.shields.io/badge/chainlink--VRF-2.5-5bd1d7)](https://docs.chain.link/vrf)</a>
  <a href="">[![Static Badge](https://img.shields.io/badge/solidity-green)](https://ethereum.org/en/developers/docs/)</a>
  <a href="">[![Static Badge](https://img.shields.io/badge/react-green)](https://react.dev/)</a>
</div>


Linkagotchi is a blockchain-based virtual pet game inspired by the classic Tamagotchi. Raise and train with your unique digital creatures on the Ethereum blockchain!

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Smart Contract](#smart-contract)
- [Frontend](#frontend)
- [Contributing](#contributing)
- [License](#license)

## Features

- Create and raise your own Blockagotchi
- Train and evolve your Blockagotchi through various activities
- Rare shiny Blockagotchis with special visual effects
- Blockchain-based ownership and interactions
- Responsive and retro-style user interface

## Getting Started

### Prerequisites

- Node.js (v18.0.0 or later)
- npm (v6.0.0 or later)
- MetaMask browser extension
- Ethereum testnet account (e.g., Sepolia) with test ETH

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/linkagotchi.git
   cd linkagotchi
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   yarn dev
   ```

## Usage

1. Connect your MetaMask wallet to the app
2. Create a new Blockagotchi or interact with your existing one
3. Perform actions like feeding, bathing, and training to raise your Blockagotchi
4. Watch your Blockagotchi evolve as it gains experience
5. Explore Blockagotchi Market (coming soon)
6. Explore Blockagotchi Rankings

## Smart Contract

The Linkagotchi smart contract is deployed on the Ethereum testnet (Sepolia). It manages the creation, ownership, and interactions of Blockagotchis. All blockagotchis are NFTs.

Key functions:
- `createBlockagotchi`: Create a new Blockagotchi
- `performAction`: Perform an action on your Blockagotchi

For more details, check the `Linkagotchi.sol` file in the `contract` directory.

## Frontend

The frontend is built with React and uses ethers.js for blockchain interactions. It features a retro-style UI inspired by the original Tamagotchi devices.

Key components:
- `Linkagotchi.jsx`: Main component for Blockagotchi interactions
- `custom-alert-component.jsx`: Custom alert component for user feedback
- `BlockagotchiRanking.jsx`: Leaderboard component

Styling is done using CSS modules and the NES.css library for the retro look.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
