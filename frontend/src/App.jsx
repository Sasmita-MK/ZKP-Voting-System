import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ethers } from 'ethers'; 

// Page Imports
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateProposal from './pages/CreateProposal';
import Vote from './pages/Vote';
import CastVote from './pages/CastVote';
import Results from './pages/Results';

function App() {
  const [account, setAccount] = useState(null);
  const [signer, setSigner] = useState(null);
  const [voterSecret, setVoterSecret] = useState(""); 
  const [isMember, setIsMember] = useState(false);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await window.ethereum.request({ 
            method: 'wallet_requestPermissions', 
            params: [{ eth_accounts: {} }] 
        });
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const userSigner = await provider.getSigner(); 
        setAccount(accounts[0]);
        setSigner(userSigner);
      } catch (error) {
        console.error("Wallet connection cancelled.");
      }
    } else {
      alert("MetaMask not detected!");
    }
  };

  const handleFullAuth = (secret) => {
    setVoterSecret(secret);
    setIsMember(true);
  };

  const logout = () => {
    setAccount(null);
    setSigner(null);
    setIsMember(false);
    setVoterSecret("");
  };

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 font-sans antialiased text-slate-900">
        
        {/* Navigation Bar - Fixed with Shadow and Blue Logout */}
        {isMember && (
          <nav className="bg-white p-4 sticky top-0 z-50 shadow-md border-none">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
              
              <div className="flex items-center space-x-10">
                <span className="text-indigo-600 font-black text-2xl tracking-tighter">ZKP-DAO</span>
                <div className="flex space-x-8">
                  <Link to="/" className="text-slate-600 hover:text-indigo-600 font-bold text-sm transition-colors uppercase tracking-wider">Dashboard</Link>
                  <Link to="/create" className="text-slate-600 hover:text-indigo-600 font-bold text-sm transition-colors uppercase tracking-wider">Create</Link>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Identity Verified</span>
                  <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                    {account?.substring(0, 6)}...{account?.substring(38)}
                  </span>
                </div>
                
                {/* Logout Button - Blue 600 */}
                <button 
                  onClick={logout}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-200 active:scale-95 flex items-center space-x-2"
                >
                  <span>Logout</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>

            </div>
          </nav>
        )}

        <div className="w-full">
          {!isMember ? (
            <div className="flex items-center justify-center pt-20">
              <Login 
                account={account} 
                connectWallet={connectWallet} 
                onAuthSuccess={handleFullAuth} 
              />
            </div>
          ) : (
            <div className="animate-in fade-in duration-500">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/create" element={<CreateProposal signer={signer} />} />
                <Route path="/vote/:id" element={<Vote />} />
                <Route path="/cast-vote/:id" element={<CastVote signer={signer} />} />
                <Route path="/results/:id" element={<Results signer={signer} />} />
              </Routes>
            </div>
          )}
        </div>
        
        {isMember && (
          <div className="text-center py-12">
            <span className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.3em]">
              Secured by Zero-Knowledge Proofs
            </span>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;