import { Box, Button, VStack, Text, Input } from "@chakra-ui/react";
import { useState } from "react";
import { ethers } from "ethers";
import { DAO_CONTRACT_ADDRESS, DAO_ABI, VERIFIER_CONTRACT_ADDRESS, VERIFIER_ABI } from "../constants/contracts";

function VotingPanel({ account }) {
  const [vote, setVote] = useState("");
  const [loading, setLoading] = useState(false);

  const castVote = async () => {
    if (!account) {
      alert("Connect your wallet first!");
      return;
    }

    if (!vote) {
      alert("Enter a vote option!");
      return;
    }

    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // DAO contract instance
      const daoContract = new ethers.Contract(DAO_CONTRACT_ADDRESS, DAO_ABI, signer);

      // Call castVote (replace with your actual contract method)
      const tx = await daoContract.castVote(vote);
      await tx.wait();

      alert(`Vote casted successfully: ${vote}`);
      setVote("");
    } catch (err) {
      console.error(err);
      alert("Error casting vote. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={4} bg="white" borderRadius="md" shadow="md">
      <VStack spacing={4} align="stretch">
        <Text fontWeight="bold">Voting Panel</Text>
        <Input
          placeholder="Enter your vote"
          value={vote}
          onChange={(e) => setVote(e.target.value)}
        />
        <Button colorScheme="blue" onClick={castVote} isLoading={loading}>
          Cast Vote
        </Button>
      </VStack>
    </Box>
  );
}

export default VotingPanel;
