// src/components/ConnectWalletButton.tsx
"use client";

import { useWeb3 } from "@/contexts/Web3Provider";
import { Wallet, Loader2 } from "lucide-react"; 

export const ConnectWalletButton = () => {
  const { account, isLoading, connectWallet } = useWeb3();

  const truncateAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const buttonTitle = isLoading
    ? "Menghubungkan..."
    : account
    ? `Terhubung: ${account}`
    : "Hubungkan Wallet";

  return (
    <button
      onClick={connectWallet}
      disabled={isLoading}
      title={buttonTitle} // Tooltip untuk aksesibilitas
      className="relative flex h-10 w-10 items-center justify-center rounded-full border border-neutral-400 text-neutral-700 transition-colors hover:bg-black hover:text-white disabled:bg-gray-700 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <Wallet className="h-5 w-5" />
      )}
      
      {/* Indikator titik hijau saat terhubung */}
      {account && !isLoading && (
        <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-white dark:ring-gray-800" />
      )}
    </button>
  );
};
