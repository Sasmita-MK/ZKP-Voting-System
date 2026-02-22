import React, { useState } from "react";
import { ethers } from "ethers";
import { groth16 } from "snarkjs";
import votingAbi from "../abis/VotingContract.json";

const CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS";

export default function VotingPage() {
  const [secret, setSecret] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function generateProof() {
    setLoading(true);
    setStatus("Generating proof...");

    try {
      const input = { secret: secret };

      const { proof, publicSignals } = await groth16.fullProve(
        input,
        "/circuits/membership.wasm",
        "/circuits/membership_final.zkey"
      );

      return { proof, publicSignals };
    } catch (err) {
      setStatus("Error generating proof");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function castVote() {
    const { proof, publicSignals } = await generateProof();
    if (!proof) return;

    setStatus("Submitting vote...");

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, votingAbi, signer);

      const tx = await contract.castVote(
        proof.a,
        proof.b,
        proof.c,
        publicSignals
      );

      await tx.wait();
      setStatus("Vote submitted successfully!");
    } catch (err) {
      console.error(err);
      setStatus("Vote failed.");
    }
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Private DAO Voting</h2>

      <input
        style={styles.input}
        type="text"
        placeholder="Enter your secret"
        value={secret}
        onChange={(e) => setSecret(e.target.value)}
      />

      <button style={styles.button} onClick={castVote} disabled={loading}>
        {loading ? "Processing..." : "Vote"}
      </button>

      <p style={styles.status}>{status}</p>
    </div>
  );
}

const styles = {
  container: {
    margin: "50px auto",
    maxWidth: "400px",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    textAlign: "center",
    fontFamily: "Arial",
  },
  title: { fontSize: "22px", marginBottom: "15px" },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "5px",
    border: "1px solid #888",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#0a66c2",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
  status: { marginTop: "20px", minHeight: "20px" },
};
