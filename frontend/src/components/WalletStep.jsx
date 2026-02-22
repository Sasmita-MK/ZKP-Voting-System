export default function WalletStep({ setAccount, next }) {
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask not installed");
      return;
    }

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    setAccount(accounts[0]);
    next();
  };

  return (
    <div className="card">
      <h2>Connect Wallet</h2>
      <p>Authenticate using MetaMask</p>
      <button onClick={connectWallet}>Connect Wallet</button>
    </div>
  );
}
