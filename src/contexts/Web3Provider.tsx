// src/contexts/Web3Provider.tsx
"use client";

import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import { contractABI, contractAddress } from '../lib/contractConstants';

declare global {
  interface Window {
    ethereum?: any;
  }
}

// 1. Tambahkan 'disconnectWallet' ke dalam tipe context
interface Web3ContextType {
  account: string | null;
  contract: ethers.Contract | null;
  isLoading: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void; // <-- TAMBAHKAN INI
}

const Web3Context = createContext<Web3ContextType | null>(null);

export function Web3Provider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<string | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null); // Tambahkan state untuk signer
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert("Harap install MetaMask untuk menggunakan aplikasi ini.");
      return;
    }

    setIsLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);

      const signer = await provider.getSigner();
      setSigner(signer);
      
      const votingContract = new ethers.Contract(contractAddress, contractABI, signer);
      setContract(votingContract);

    } catch (error) {
      console.error("Gagal menghubungkan wallet:", error);
    }
    setIsLoading(false);
  };

  // 2. Buat fungsi untuk disconnect
  const disconnectWallet = () => {
    setAccount(null);
    setContract(null);
    setSigner(null);
    console.log("Wallet disconnected");
  };

  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          connectWallet();
        } else {
          disconnectWallet(); // Panggil disconnect jika pengguna mengunci MetaMask
        }
      };
      const handleChainChanged = () => window.location.reload();

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  return (
    // 3. Sediakan fungsi disconnect ke dalam context
    <Web3Context.Provider value={{ account, contract, isLoading, connectWallet, disconnectWallet }}>
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
}
