export default function ProofStep({ next }) {
  return (
    <div className="card">
      <h2>Zero Knowledge Proof</h2>
      <p>ZKP generated off-chain.</p>
      <button onClick={next}>Proceed to Vote</button>
    </div>
  );
}
