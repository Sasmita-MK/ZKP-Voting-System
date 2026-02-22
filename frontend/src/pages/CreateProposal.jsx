import { useState } from 'react';
import { getContract } from '../constants/contracts';
import { ethers } from 'ethers';

const CreateProposal = () => {
    const [id, setId] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

   const handleCreate = async () => {
    if (!id || !description) return alert("Please fill all fields");
    setLoading(true);

    try {
        const contract = await getContract();
        
        // Match the NEW ABI: (uint256, string)
        const tx = await contract.createProposal(BigInt(id), description);

        console.log("Tx Hash:", tx.hash);
        await tx.wait();
        
        alert("✅ Proposal Created Successfully!");
    } catch (err) {
        console.error("Trace:", err);
        alert("Error: " + (err.reason || err.message));
    } finally {
        setLoading(false);
    }
};
    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded-xl border">
            <h2 className="text-xl font-bold mb-4">Admin: Create Proposal</h2>
            
            <label className="block text-sm font-medium mb-1">Proposal ID</label>
            <input 
                type="number" 
                placeholder="e.g. 1" 
                value={id}
                className="w-full border p-2 mb-4 rounded"
                onChange={(e) => setId(e.target.value)}
            />
            
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea 
                placeholder="What is this proposal about?" 
                value={description}
                className="w-full border p-2 mb-4 rounded h-32"
                onChange={(e) => setDescription(e.target.value)}
            />
            
            <button 
                onClick={handleCreate}
                className={`w-full py-2 rounded text-white font-bold ${
                    loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
                }`}
                disabled={loading}
            >
                {loading ? "Processing..." : "Create Proposal"}
            </button>
        </div>
    );
};

export default CreateProposal;