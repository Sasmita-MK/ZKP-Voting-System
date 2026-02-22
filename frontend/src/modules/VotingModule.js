function VotingModule({ account }) {
  return (
    <div className="module-card">
      <div className="module-title">Module 4: Anonymous Voting</div>
      <div className="module-desc">
        Cast vote anonymously after successful ZKP verification.
      </div>
      <button className="button" disabled={!account}>
        Vote YES
      </button>
      &nbsp;
      <button className="button" disabled={!account}>
        Vote NO
      </button>
      {!account && <p style={{ fontSize: "12px" }}>Connect wallet first</p>}
    </div>
  );
}

export default VotingModule;
