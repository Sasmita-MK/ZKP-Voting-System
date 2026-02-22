/* global BigInt */
/* eslint-disable no-undef */
import { useState } from 'react';
import { generateZKP } from '../utils/zkp';
import { getContract } from '../constants/contracts';

const Vote = () => {
    const [secret, setSecret] = useState('');
    const [proposalId, setProposalId] = useState('0'); // User can choose which proposal to vote on
    const [status, setStatus] = useState('idle');

    const handleVote = async () => {
        if (!secret) return alert("Please enter your secret member key");
        
        setStatus('submitting');
        try {
            // 1. Generate the ZK Proof and Nullifier off-chain (in browser)
            const zkp = await generateZKP(secret, proposalId);
            
            // 2. Connect to the DAOVoting contract
            const contract = await getContract();

            // 3. Submit to Blockchain: match DAOVoting.sol: vote(id, a, b, c, signals, nullifier)
            const tx = await contract.vote(
                BigInt(proposalId),
                zkp.a,
                zkp.b,
                zkp.c,
                zkp.publicSignals,
                zkp.nullifierHash
            );

            console.log("Transaction pending...", tx.hash);
            await tx.wait(); // Wait for block confirmation
            
            setStatus('success');
            setSecret(''); // Clear secret for security
        } catch (err) {
            console.error("Voting Error:", err);
            alert("Voting failed! Possible reasons: Wrong secret, already voted, or invalid proposal.");
            setStatus('idle');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-xl rounded-2xl border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Cast Private Vote</h2>
            
            <div className="space-y-4">
                {/* Proposal Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Select Proposal ID</label>
                    <input 
                        type="number"
                        value={proposalId}
                        onChange={(e) => setProposalId(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                </div>

                {/* Secret Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Your Private Secret</label>
                    <input 
                        type="password" 
                        placeholder="e.g. 33" 
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        value={secret}
                        onChange={(e) => setSecret(e.target.value)}
                    />
                </div>

                {/* Submit Button */}
                <button 
                    onClick={handleVote}
                    disabled={status === 'submitting'}
                    className={`w-full py-3 px-4 rounded-lg font-bold text-white transition-all ${
                        status === 'submitting' ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-lg'
                    }`}
                >
                    {status === 'submitting' ? "Generating ZK-Proof..." : "Submit Anonymous Vote"}
                </button>

                {status === 'success' && (
                    <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg text-center">
                        ✅ Vote successfully recorded on-chain!
                    </div>
                )}
            </div>
        </div>
    );
};

export default Vote;