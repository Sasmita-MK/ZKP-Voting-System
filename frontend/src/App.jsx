import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ethers } from 'ethers';
import CreateProposal from './pages/CreateProposal';
import Vote from './pages/Vote';
import Results from './pages/Results';

// This is the file your deploy script created!
import addresses from './utils/addresses.json';

function App() {
  const [account, setAccount] = useState(null);

  // Function to connect MetaMask
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
      } catch (error) {
        console.error("User denied account access");
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation Bar */}
        <nav className="bg-indigo-600 p-4 text-white shadow-lg">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">ZKP DAO</h1>
            <div className="flex items-center space-x-6">
              <Link to="/" className="hover:text-indigo-200">Create</Link>
              <Link to="/vote" className="hover:text-indigo-200">Vote</Link>
              <Link to="/results" className="hover:text-indigo-200">Results</Link>
              
              <button 
                onClick={connectWallet}
                className="bg-indigo-800 px-4 py-1 rounded-lg text-sm font-medium hover:bg-indigo-900 transition"
              >
                {account ? `${account.substring(0, 6)}...${account.substring(38)}` : "Connect Wallet"}
              </button>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <div className="max-w-4xl mx-auto py-10 px-4">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <Routes>
              {/* We pass the contract address down as a prop to ensure pages use the NEW one */}
              <Route path="/" element={<CreateProposal contractAddress={addresses.dao} />} />
              <Route path="/vote" element={<Vote contractAddress={addresses.dao} />} />
              <Route path="/results" element={<Results contractAddress={addresses.dao} />} />
            </Routes>
          </div>
        </div>

        {/* Status Bar */}
        <footer className="fixed bottom-0 w-full bg-gray-200 p-2 text-center text-xs text-gray-600">
          Connected to Hardhat Local: <span className="font-mono">{addresses.dao}</span>
        </footer>
      </div>
    </Router>
  );
}

export default App;