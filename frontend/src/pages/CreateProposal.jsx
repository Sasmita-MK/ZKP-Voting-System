import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getContract } from '../constants/contracts';

const CreateProposal = ({ signer }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ title: '', description: '', endDate: '', endTime: '' });
    const [options, setOptions] = useState(['', '']);

    const handleSubmit = async (e) => {
    e.preventDefault();
    if (!signer) return alert("Please connect wallet");

    setLoading(true);
    try {
        const contract = await getContract(signer);
        const proposalId = Math.floor(Date.now() / 1000);
        
        // Convert UI date/time to Unix Timestamp for Solidity uint256
        const expiryUnix = Math.floor(new Date(`${formData.endDate}T${formData.endTime}`).getTime() / 1000);

        // SENDING 4 PARAMETERS NOW:
        const tx = await contract.createProposal(
            proposalId,
            formData.title,
            formData.description,
            expiryUnix
        );
        
        await tx.wait();

        // Save to LocalStorage (including options for UI rendering)
        const newProposal = {
            id: proposalId,
            ...formData,
            options: options.filter(opt => opt !== ""),
            expiryTimestamp: expiryUnix * 1000
        };

        const existing = JSON.parse(localStorage.getItem("dao_proposals") || "[]");
        localStorage.setItem("dao_proposals", JSON.stringify([...existing, newProposal]));

        navigate('/');
    } catch (err) {
        console.error(err);
        alert("Transaction Failed: Are you the Admin?");
    } finally {
        setLoading(false);
    }
};
    return (
        <div className="w-full pt-10 pb-20 px-6 flex justify-center">
            <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-white p-10 rounded-[2.5rem] border-2 border-black shadow-none">
                <h2 className="text-2xl font-black mb-8 uppercase">Create Proposal</h2>
                <div className="space-y-6">
                    <input required placeholder="Proposal Title" className="w-full bg-slate-50 border-2 border-black p-4 rounded-xl font-bold outline-none" onChange={e => setFormData({...formData, title: e.target.value})} />
                    <textarea required placeholder="Description" className="w-full bg-slate-50 border-2 border-black p-4 rounded-xl font-bold outline-none h-32" onChange={e => setFormData({...formData, description: e.target.value})} />
                    
                    <div className="flex gap-4">
                        <input type="date" required className="flex-1 bg-slate-50 border-2 border-black p-4 rounded-xl font-bold" onChange={e => setFormData({...formData, endDate: e.target.value})} />
                        <input type="time" required className="flex-1 bg-slate-50 border-2 border-black p-4 rounded-xl font-bold" onChange={e => setFormData({...formData, endTime: e.target.value})} />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase ml-1">Options</label>
                        {options.map((opt, i) => (
                            <input key={i} placeholder={`Option ${i+1}`} className="w-full bg-slate-50 border-2 border-black p-3 rounded-xl font-bold outline-none" onChange={e => {
                                const newOpts = [...options];
                                newOpts[i] = e.target.value;
                                setOptions(newOpts);
                            }} />
                        ))}
                        <button type="button" onClick={() => setOptions([...options, ''])} className="text-indigo-600 font-bold text-xs uppercase">+ Add Option</button>
                    </div>

                    <button disabled={loading} className="w-full bg-blue-700 text-white font-black py-5 rounded-2xl border-2 border-black uppercase tracking-widest">
                        {loading ? "Publishing to Blockchain..." : "Create Proposal"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateProposal;