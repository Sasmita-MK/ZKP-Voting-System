export default function EligibilityStep({ next }) {
  return (
    <div className="card">
      <h2>Membership Verification</h2>
      <p>Merkle proof verified successfully.</p>
      <button onClick={next}>Continue</button>
    </div>
  );
}
