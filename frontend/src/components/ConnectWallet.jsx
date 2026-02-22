// src/components/ConnectWallet.jsx
import { useState, useEffect } from "react";
import { Button, Box, Text } from "@chakra-ui/react";

function ConnectWallet({ setAccount }) {
  const [currentAccount, setCurrentAccount] = useState(null);

  // Check if wallet is already connected
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.request({ method: "eth_accounts" }).then((accounts) => {
        if (accounts.length > 0) {
          setCurrentAccount(accounts[0]);
          setAccount(accounts[0]);
        }
      });
    }
  }, [setAccount]);

  // Connect wallet function
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask is not installed!");
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setCurrentAccount(accounts[0]);
      setAccount(accounts[0]);
    } catch (err) {
      console.error("Wallet connection failed:", err);
    }
  };

  return (
    <Box mb={4}>
      {currentAccount ? (
        <Text fontSize="md" fontWeight="bold" color="green.500">
          Connected: {currentAccount.substring(0, 6)}...
          {currentAccount.substring(currentAccount.length - 4)}
        </Text>
      ) : (
        <Button colorScheme="teal" onClick={connectWallet}>
          Connect Wallet
        </Button>
      )}
    </Box>
  );
}

export default ConnectWallet;
