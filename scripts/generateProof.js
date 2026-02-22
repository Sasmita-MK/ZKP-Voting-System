// scripts/generateProof.js
const snarkjs = require("snarkjs");
const fs = require("fs");

(async () => {
  try {
    const input = JSON.parse(fs.readFileSync("input.json"));

    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
      input,
      "circuits/build/membership_js/membership.wasm",
      "membership_final.zkey",
    );

    fs.writeFileSync("proof.json", JSON.stringify(proof, null, 2));
    fs.writeFileSync("public.json", JSON.stringify(publicSignals, null, 2));

    console.log("✅ Proof generated successfully");
  } catch (err) {
    console.error("❌ Error generating proof:", err);
  } finally {
    process.exit(0); // 👈 add THIS as the last line
  }
})();
