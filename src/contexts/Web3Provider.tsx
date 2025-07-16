// src/contexts/Web3Provider.tsx
"use client"; // WAJIB: Menandakan ini adalah Client Component

import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import { contractABI, contractAddress } from '../lib/contractConstants';

// --- FIX UNTUK ERROR TYPESCRIPT ---
// Deklarasikan interface baru yang memperluas tipe Window global
// untuk menyertakan properti 'ethereum' yang diinjeksikan oleh MetaMask.
declare global {
  interface Window {
    ethereum?: any;
  }
}
// ------------------------------------

// Definisikan tipe untuk data context kita
interface Web3ContextType {
  account: string | null;
  contract: ethers.Contract | null;
  isLoading: boolean;
  connectWallet: () => Promise<void>;
}

// Buat context dengan nilai default
const Web3Context = createContext<Web3ContextType | null>(null);

// Buat komponen Provider
export function Web3Provider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<string | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert("Harap install MetaMask untuk menggunakan aplikasi ini.");
      return;
    }

    setIsLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      
      // Minta akses akun
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);

      const signer = await provider.getSigner();
      
      const votingContract = new ethers.Contract(contractAddress, contractABI, signer);
      setContract(votingContract);

    } catch (error) {
      console.error("Gagal menghubungkan wallet:", error);
      alert("Gagal menghubungkan wallet.");
    }
    setIsLoading(false);
  };

  // Efek untuk menangani perubahan akun atau jaringan di MetaMask
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          connectWallet(); // Re-connect untuk update signer dan kontrak
        } else {
          setAccount(null);
          setContract(null);
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
    <Web3Context.Provider value={{ account, contract, isLoading, connectWallet }}>
      {children}
    </Web3Context.Provider>
  );
}

// Custom hook untuk mempermudah penggunaan context
export function useWeb3() {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
}
