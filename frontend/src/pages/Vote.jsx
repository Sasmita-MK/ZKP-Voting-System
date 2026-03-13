import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Vote = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [proposal, setProposal] = useState(null);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("dao_proposals") || "[]");
        const found = saved.find(p => p.id === parseInt(id));
        setProposal(found);
    }, [id]);

    if (!proposal) return null;

    const isClosed = Date.now() > proposal.expiryTimestamp;

    return (
        <div className="w-full pt-4 pb-20 px-4 flex justify-center">
            {/* Flat card with no shadow as requested */}
            <div className="w-full max-w-3xl bg-white p-10 rounded-[2.5rem] border-2 border-black shadow-none">
                
                {/* Header: Title and Status */}
                <div className="flex justify-between items-start mb-6">
                    <h1 className="text-3xl font-black text-black leading-tight">{proposal.title}</h1>
                    <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase border-2 border-black ${!isClosed ? 'bg-emerald-400 text-black' : 'bg-slate-200 text-slate-500 border-slate-300'}`}>
                        {!isClosed ? 'Active' : 'Closed'}
                    </span>
                </div>

                {/* Description Box */}
                <div className="bg-slate-50 p-6 rounded-2xl border-2 border-black mb-6 text-sm font-bold text-slate-600">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Proposal Overview</label>
                    {proposal.description}
                </div>

                {/* Row Manner: Options and Expiration side-by-side */}
                <div className="flex flex-col md:flex-row gap-4 mb-10">
                    {/* Options Row Item */}
                    <div className="flex-1 p-5 border-2 border-black rounded-2xl bg-white">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Voting Options</label>
                        <div className="flex flex-wrap gap-2">
                            {proposal.options.map((opt, i) => (
                                <span key={i} className="bg-slate-100 text-black border border-black px-3 py-1 rounded-lg text-xs font-bold">
                                    {opt}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Expiration Row Item */}
                    <div className="flex-1 p-5 border-2 border-black rounded-2xl bg-white">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                            {isClosed ? "Expired On" : "Expires On"}
                        </label>
                        <p className={`text-sm font-black ${isClosed ? 'text-slate-500' : 'text-red-600'}`}>
                            {proposal.endDate} <span className="text-black">@</span> {proposal.endTime}
                        </p>
                    </div>
                </div>

                {/* Buttons: Blue 700 */}
                <div className="flex flex-col space-y-4">
                    {!isClosed && (
                        <button 
                            onClick={() => navigate(`/cast-vote/${id}`)}
                            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-black py-5 rounded-2xl border-2 border-black uppercase tracking-widest transition-all active:translate-y-1"
                        >
                            Vote Now
                        </button>
                    )}
                    <button 
                        onClick={() => navigate(`/results/${id}`)}
                        className={`w-full font-black py-5 rounded-2xl border-2 border-black uppercase tracking-widest transition-all active:translate-y-1 ${
                            isClosed 
                            ? 'bg-blue-700 text-white hover:bg-blue-800' 
                            : 'bg-white text-black hover:bg-slate-50'
                        }`}
                    >
                        See Results
                    </button>
                </div>

                {/* Footer Back Link */}
                <button 
                    onClick={() => navigate('/')}
                    className="mt-8 w-full text-center text-[10px] font-black uppercase text-slate-400 hover:text-black tracking-tighter"
                >
                    ← Back to Dashboard
                </button>
            </div>
        </div>
    );
};

export default Vote;