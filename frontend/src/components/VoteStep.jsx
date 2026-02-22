export default function VoteStep({ next }) {
  return (
    <div className="card">
      <h2>Cast Vote</h2>
      <p>Vote submitted anonymously.</p>
      <button onClick={next}>View Results</button>
    </div>
  );
}
