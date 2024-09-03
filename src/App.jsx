import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';
import Linkagotchi from './Linkagotchi';
import { contractAddress,contractABI } from './constants';

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const init = async () => {
      const ethProvider = await detectEthereumProvider();
      
      if (ethProvider) {
        const provider = new ethers.providers.Web3Provider(ethProvider);
        setProvider(provider);

        const signer = provider.getSigner();
        setSigner(signer);

        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        setContract(contract);

        const accounts = await ethProvider.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }

        ethProvider.on('accountsChanged', (newAccounts) => {
          setAccount(newAccounts[0]);
        });
      }
    };

    init();
  }, []);

  const connectWallet = async () => {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const accounts = await provider.listAccounts();
      setAccount(accounts[0]);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  return (
    <div className="App">
      <h1>Linkagotchi</h1>
      {!account ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <Linkagotchi contract={contract} account={account} />
      )}
    </div>
  );
}

export default App;