import React, { useState } from 'react';

const Login = ({ account, connectWallet, onAuthSuccess }) => {
    const [secret, setSecret] = useState("");

    const VALID_MEMBER_SECRETS = ["11", "22", "33", "44", "55", "66", "77", "88"];

    const handleMembershipCheck = () => {
        const cleanSecret = secret.trim();
        if (VALID_MEMBER_SECRETS.includes(cleanSecret)) {
            onAuthSuccess(cleanSecret);
        } else {
            alert("Authentication Failed: Identity secret not found.");
            setSecret("");
        }
    };

    return (
        /* This wrapper ensures the content is perfectly centered vertically and horizontally */
        <div className="fixed inset-0 flex items-center justify-center p-4 bg-slate-50">
            <div className="w-full max-w-lg bg-white p-8 rounded-[2.5rem] shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-500">
                
                {/* Header Section */}
                <div className="text-center">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-indigo-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    
                    <h1 className="text-3xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
                        ZKP Based DAO Voting System
                    </h1>
                    
                    <div className="space-y-2 text-slate-500 text-[16px] leading-relaxed px-4 mb-4">
                        <p>
                            A secure and private platform for group decision-making. 
                            Participate in community governance without ever revealing 
                            your personal identity.
                        </p>
                        <p>
                            Our system ensures that every vote counts, but remains 100% 
                            private, allowing you to voice your opinion with total 
                            confidentiality and security.
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    {!account ? (
                        <button 
                            onClick={connectWallet} 
                            className="w-full bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-4 rounded-2xl shadow-xl transition-all active:scale-95"
                        >
                            Connect Wallet
                        </button>
                    ) : (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 ">
                            <div className="flex flex-col items-center w-full">
                                <label className="text-base font-bold text-black mb-1 ml-1">Member Identity Secret</label>
                                <input
                                    type="password"
                                    placeholder="Enter your secret key"
                                    className="w-7/12 bg-slate-50 border-2 border-black p-2 rounded-xl outline-none text-center font-bold tracking-widest text-indigo-900 text-[14px] focus:border-black focus:bg-white transition-all shadow-sm"
                                    value={secret}
                                    onChange={(e) => setSecret(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleMembershipCheck()}
                                />
                            </div>
                            
                            <button 
                                onClick={handleMembershipCheck}
                                className="w-full bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-4 rounded-2xl shadow-xl transition-all active:scale-95"
                            >
                                Authenticate & Enter
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;