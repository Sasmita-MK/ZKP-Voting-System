import { useState } from "react";
import StepIndicator from "../components/StepIndicator";
import WalletStep from "../components/WalletStep";
import EligibilityStep from "../components/EligibilityStep";
import ProofStep from "../components/ProofStep";
import VoteStep from "../components/VoteStep";
import ResultStep from "../components/ResultStep";

function VotingFlow() {
  const [step, setStep] = useState(0);
  const [account, setAccount] = useState(null);

  return (
    <div className="page">
      <h1>ZKP DAO Voting</h1>

      <StepIndicator step={step} />

      {step === 0 && <WalletStep setAccount={setAccount} onNext={() => setStep(1)} />}
      {step === 1 && <EligibilityStep account={account} onNext={() => setStep(2)} />}
      {step === 2 && <ProofStep onNext={() => setStep(3)} />}
      {step === 3 && <VoteStep onNext={() => setStep(4)} />}
      {step === 4 && <ResultStep />}
    </div>
  );
}

export default VotingFlow;
