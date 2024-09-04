import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import Linkagotchi from './Linkagotchi';
import { contractAddress, contractABI } from './constants';

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

  const connectWallet = async (navigate) => {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const accounts = await provider.listAccounts();
      setAccount(accounts[0]);
      navigate('/play');
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  function ConnectWalletWrapper({ children }) {
    const navigate = useNavigate();
    return React.cloneElement(children, { onConnectWallet: () => connectWallet(navigate) });
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/" 
            element={
              <ConnectWalletWrapper>
                <HomePage isConnected={!!account} />
              </ConnectWalletWrapper>
            } 
          />
          <Route 
            path="/play" 
            element={account ? <Linkagotchi contract={contract} account={account} /> : <Navigate to="/" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;