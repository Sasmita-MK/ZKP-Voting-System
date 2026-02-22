/* global BigInt */
/* eslint-disable no-undef */
import { useState } from 'react';
// FIXED: Updated path to match your folder structure
import { getContract } from '../constants/contracts';

const Results = () => {
    const [proposalId, setProposalId] = useState('');
    const [count, setCount] = useState(null);
    const [status, setStatus] = useState('idle');

    const fetchResults = async () => {
        if (proposalId === '') return alert("Please enter a Proposal ID");
        
        setStatus('fetching');
        try {
            const contract = await getContract();
            
            // Calls the proposals mapping in your Solidity contract
            const data = await contract.proposals(BigInt(proposalId)); 
            
            // data.voteCount comes from the Solidity struct
            setCount(data.voteCount.toString());
            setStatus('success');
        } catch (err) {
            console.error("Error fetching results:", err);
            alert("Could not fetch results. Make sure the Proposal ID exists on-chain.");
            setStatus('idle');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-xl rounded-2xl border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">View Proposal Results</h2>
            
            <div className="space-y-4">
                {/* Single Input for Proposal ID */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Enter Proposal ID</label>
                    <input 
                        type="number" 
                        placeholder="e.g. 0" 
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        value={proposalId}
                        onChange={(e) => setProposalId(e.target.value)}
                    />
                </div>

                {/* Check Button - matching the Vote styling */}
                <button 
                    onClick={fetchResults} 
                    disabled={status === 'fetching'}
                    className={`w-full py-3 px-4 rounded-lg font-bold text-white transition-all ${
                        status === 'fetching' ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-lg'
                    }`}
                >
                    {status === 'fetching' ? "Connecting to Chain..." : "Check Vote Count"}
                </button>

                {/* Results Display */}
                {status === 'success' && count !== null && (
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl text-center">
                        <p className="text-sm text-blue-600 uppercase font-semibold tracking-wider">Current Tally</p>
                        <p className="text-4xl font-extrabold text-blue-800 mt-2">
                            {count} <span className="text-lg font-medium">Votes</span>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Results;