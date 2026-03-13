import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { generateZKP } from '../utils/zkp';
import { getContract } from '../constants/contracts';

const CastVote = ({ signer }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [secret, setSecret] = useState('');
    const [selectedOption, setSelectedOption] = useState('');
    const [status, setStatus] = useState('idle');
    const [proposal, setProposal] = useState(null);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("dao_proposals") || "[]");
        const found = saved.find(p => p.id === parseInt(id));
        setProposal(found);
    }, [id]);

    const handleVote = async () => {
        if (!selectedOption) return alert("Select an option");
        if (!secret) return alert("Please enter your secret");
        
        setStatus('submitting');
        try {
            // 1. Get the index of the option (e.g., 'Abstain' -> index 2)
            const optionIndex = proposal.options.indexOf(selectedOption);
            
            // 2. Generate ZK Proof
            const zkp = await generateZKP(secret, id.toString());
            const contract = await getContract(signer);

            // 3. Send to Contract (Matches updated DAOVoting.sol)
            const tx = await contract.vote(
                BigInt(id),
                BigInt(optionIndex),
                zkp.a, 
                zkp.b, 
                zkp.c,
                zkp.publicSignals,
                zkp.nullifierHash
            );

            console.log("Transaction sent:", tx.hash);
            await tx.wait();
            
            alert(`✅ Vote for "${selectedOption}" cast successfully!`);
            navigate(`/results/${id}`);
        } catch (err) {
            console.error(err);
            alert("Error: " + (err.reason || "Voting failed. You might have already voted or the secret is wrong."));
            setStatus('idle');
        }
    };

    if (!proposal) return null;

    return (
        <div className="w-full pt-10 pb-20 px-6 flex justify-center">
            <div className="w-full max-w-lg bg-white p-10 rounded-[2.5rem] border-2 border-black shadow-none">
                <h2 className="text-2xl font-black mb-6 uppercase">Cast Vote</h2>
                
                <div className="space-y-6">
                    <div className="p-4 bg-slate-50 border-2 border-black rounded-xl">
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Voting For</p>
                        <p className="font-bold">{proposal.title}</p>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                        {proposal.options.map((opt, i) => (
                            <button 
                                key={i} 
                                onClick={() => setSelectedOption(opt)} 
                                className={`p-4 border-2 rounded-xl font-bold transition-all shadow-none ${
                                    selectedOption === opt 
                                    ? 'bg-blue-700 text-white border-blue-700' 
                                    : 'bg-white border-black hover:bg-slate-50'
                                }`}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>

                    <input 
                        type="password" 
                        placeholder="Enter your ZK-Secret" 
                        className="w-full bg-slate-50 border-2 border-black p-4 rounded-xl font-bold outline-none" 
                        value={secret} 
                        onChange={e => setSecret(e.target.value)} 
                    />

                    <button 
                        onClick={handleVote} 
                        disabled={status === 'submitting'} 
                        className={`w-full py-5 rounded-2xl font-black uppercase border-2 border-black shadow-none ${
                            status === 'submitting' 
                            ? 'bg-slate-100 text-slate-400' 
                            : 'bg-blue-700 text-white'
                        }`}
                    >
                        {status === 'submitting' ? "Generating Proof..." : "Submit Vote"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CastVote;