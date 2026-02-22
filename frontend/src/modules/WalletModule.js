function WalletModule({ account, setAccount }) {
  const connectWallet = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setAccount(accounts[0]);
  };

  return (
    <div className="module-card">
      <div className="module-title">Module 1: Wallet & Identity</div>
      <div className="module-desc">
        Connects user wallet and establishes decentralized identity.
      </div>

      {!account ? (
        <button className="button" onClick={connectWallet}>
          Connect MetaMask
        </button>
      ) : (
        <div className="status">Connected: {account}</div>
      )}
    </div>
  );
}

export default WalletModule;
