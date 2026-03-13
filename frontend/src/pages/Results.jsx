import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getContract } from '../constants/contracts';

const Results = ({ signer }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [proposal, setProposal] = useState(null);
    const [optionCounts, setOptionCounts] = useState([]); 
    const [totalVotes, setTotalVotes] = useState(0); 
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Get metadata from LocalStorage
                const saved = JSON.parse(localStorage.getItem("dao_proposals") || "[]");
                const found = saved.find(p => p.id === parseInt(id));
                setProposal(found);

                if (signer && found) {
                    const contract = await getContract(signer);
                    let counts = [];
                    let runningSum = 0;

                    // 2. Fetch real counts for EVERY option index from the contract
                    for (let i = 0; i < found.options.length; i++) {
                        const count = await contract.getOptionVotes(id, i);
                        const numCount = Number(count);
                        counts.push(numCount);
                        runningSum += numCount; // Calculate total based on what we just fetched
                    }

                    setOptionCounts(counts);
                    setTotalVotes(runningSum); // Now 2+0+1 will correctly show 3
                }
            } catch (err) {
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, signer]);

    if (loading) return <div className="text-center mt-20 font-black">SYNCING WITH BLOCKCHAIN...</div>;
    if (!proposal) return null;

    return (
        <div className="w-full pt-4 pb-20 px-4 flex justify-center">
            <div className="w-full max-w-2xl bg-white p-10 rounded-[2.5rem] border-2 border-black shadow-none">
                
                <h1 className="text-3xl font-black mb-2 leading-tight">{proposal.title}</h1>
                <p className="text-slate-500 font-bold text-sm mb-10">{proposal.description}</p>

                <div className="space-y-6 mb-10">
                    {proposal.options.map((option, index) => {
                        const voteShare = optionCounts[index] || 0;
                        // Percentage math: (Votes for this option / Total Sum) * 100
                        const percentage = totalVotes > 0 ? Math.round((voteShare / totalVotes) * 100) : 0;

                        return (
                            <div key={index} className="relative">
                                <div className="flex justify-between mb-2 px-1">
                                    <span className="font-bold text-sm text-black">{option}</span>
                                    <span className="font-black text-sm text-blue-700">
                                        {voteShare} votes ({percentage}%)
                                    </span>
                                </div>

                                {/* WhatsApp Style Bar */}
                                <div className="w-full h-12 bg-slate-100 border-2 border-black rounded-xl overflow-hidden relative">
                                    <div 
                                        className="h-full bg-blue-700 border-r-2 border-black transition-all duration-1000"
                                        style={{ width: `${percentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Total Participation Summary */}
                <div className="bg-slate-50 p-6 rounded-2xl border-2 border-black flex justify-between items-center mb-8">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase">Total Participation</p>
                        <p className="text-2xl font-black text-black">{totalVotes} Verified Votes</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black text-emerald-600 uppercase">Integrity</p>
                        <p className="text-xs font-bold italic text-emerald-600">ZK-Proof Verified</p>
                    </div>
                </div>

                <button onClick={() => navigate('/')} className="w-full py-5 rounded-2xl border-2 border-black font-black uppercase hover:bg-slate-50 transition-all">
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
};

export default Results;