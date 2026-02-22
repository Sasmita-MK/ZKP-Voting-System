import { Box, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { DAO_CONTRACT_ADDRESS, DAO_ABI } from "../constants/contracts";

function ResultsPanel() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!window.ethereum) return;
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(DAO_CONTRACT_ADDRESS, DAO_ABI, provider);

        // Replace with your actual DAO contract method to fetch results
        const votes = await contract.getResults(); 
        setResults(votes);
      } catch (err) {
        console.error(err);
      }
    };

    fetchResults();
  }, []);

  return (
    <Box p={4} bg="white" borderRadius="md" shadow="md">
      <VStack align="stretch" spacing={2}>
        <Text fontWeight="bold">Voting Results</Text>
        {results.length === 0 ? (
          <Text>No votes yet.</Text>
        ) : (
          results.map((res, idx) => (
            <Text key={idx}>{res}</Text>
          ))
        )}
      </VStack>
    </Box>
  );
}

export default ResultsPanel;
