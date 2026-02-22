const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  // 1. HARDCODED "GOLDEN ROOT"
  // This matches your zkp.js Depth 20 Poseidon calculation exactly.
  const merkleRoot =
    "16209824357902857056243669891917724992574446525991984476020997454112409809171";

  console.log("🚀 Starting deployment on network:", hre.network.name);
  console.log("📂 Using Merkle Root:", merkleRoot);

  // 2. Deploy Verifier
  console.log("⏳ Deploying Verifier...");
  const Verifier = await hre.ethers.getContractFactory("Groth16Verifier");
  const verifier = await Verifier.deploy({ gasLimit: 15000000 });
  await verifier.deployed();

  const verifierAddress = verifier.address;
  console.log("✅ Verifier deployed to:", verifierAddress);

  // 3. Deploy DAO Voting Contract
  console.log("⏳ Deploying DAOVoting...");
  const DAOVoting = await hre.ethers.getContractFactory("DAOVoting");

  // Passing the Verifier address and the Golden Root to the constructor
  const dao = await DAOVoting.deploy(verifierAddress, merkleRoot, {
    gasLimit: 15000000,
  });
  await dao.deployed();

  const daoAddress = dao.address;
  console.log("✅ DAOVoting deployed to:", daoAddress);

  // 4. Save deployment info for the Frontend
  const deploymentInfo = {
    verifier: verifierAddress,
    dao: daoAddress,
    merkleRoot: merkleRoot,
    network: hre.network.name,
    timestamp: new Date().toISOString(),
  };

  const frontendDir = path.join(__dirname, "../frontend/src/utils");
  if (!fs.existsSync(frontendDir))
    fs.mkdirSync(frontendDir, { recursive: true });

  fs.writeFileSync(
    path.join(frontendDir, "addresses.json"),
    JSON.stringify(deploymentInfo, null, 2),
  );

  console.log("📝 Metadata saved to frontend/src/utils/addresses.json");
  console.log("\n⭐️ DEPLOYMENT SUCCESSFUL ⭐️");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
