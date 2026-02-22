export default function StepIndicator({ step }) {
  const steps = [
    "Wallet",
    "Eligibility",
    "ZKP Proof",
    "Vote",
    "Result",
  ];

  return (
    <div className="card">
      {steps.map((s, i) => (
        <div
          key={i}
          className={`step ${step === i + 1 ? "active" : ""}`}
        >
          {i + 1}. {s}
        </div>
      ))}
    </div>
  );
}
