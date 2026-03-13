import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [proposals, setProposals] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("dao_proposals") || "[]");
        setProposals(saved);
    }, []);

    const now = Date.now();
    const openProposals = proposals.filter(p => p.expiryTimestamp > now);
    const closedProposals = proposals.filter(p => p.expiryTimestamp <= now);

    const ProposalCard = ({ proposal, isOpen }) => (
        <div 
            onClick={() => navigate(`/vote/${proposal.id}`)}
            className="bg-white border-2 border-black p-6 rounded-[2rem] hover:transition-all cursor-pointer mb-6 group"
        >
            {/* Top Row: Title and Status */}
            <div className="flex justify-between items-start mb-6">
                <h4 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {proposal.title}
                </h4>
                <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border-2 border-black ${
                    isOpen ? 'bg-emerald-400 text-black' : 'bg-slate-200 text-slate-600 border-slate-400'
                }`}>
                    {isOpen ? 'Active' : 'Expired'}
                </span>
            </div>
            
            {/* Bottom Row: Date/Time (Left) and View Details (Right) */}
            <div className="flex justify-between items-end border-t-2 border-slate-100 pt-4">
                <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Closing Schedule</span>
                    <span className="text-xs font-bold text-slate-900">
                        {proposal.endDate} <span className="text-slate-400 mx-1">|</span> {proposal.endTime}
                    </span>
                </div>
                
                <span className="text-indigo-600 font-black text-xs uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                    View Details →
                </span>
            </div>
        </div>
    );

    return (
        <div className="w-full max-w-6xl mx-auto pt-8 pb-20 px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                
                {/* Column 1: Open Proposals */}
                <div className="space-y-4">
                    <h3 className="text-lg font-black text-black uppercase tracking-[0.2em] opacity-60 mb-6 ml-2">Open Proposals</h3>
                    {openProposals.length > 0 ? (
                        openProposals.map(p => <ProposalCard key={p.id} proposal={p} isOpen={true} />)
                    ) : (
                        <div className="border-2 border-dashed border-slate-200 rounded-[2rem] p-12 text-center text-slate-300 font-bold uppercase text-xs tracking-widest">
                            No Active Votes
                        </div>
                    )}
                </div>

                {/* Column 2: Closed Archive */}
                <div className="space-y-4">
                    <h3 className="text-lg font-black text-black uppercase tracking-[0.2em] mb-6 opacity-60 ml-2">Closed Archive</h3>
                    {closedProposals.length > 0 ? (
                        closedProposals.map(p => <ProposalCard key={p.id} proposal={p} isOpen={false} />)
                    ) : (
                        <div className="border-2 border-dashed border-slate-200 rounded-[2rem] p-12 text-center text-slate-300 font-bold uppercase text-xs tracking-widest">
                            No Past History
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Dashboard;