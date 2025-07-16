// src/components/ConnectWalletButton.tsx
"use client";

import { useWeb3 } from "@/contexts/Web3Provider";

export const ConnectWalletButton = () => {
  const { account, isLoading, connectWallet } = useWeb3();

  const truncateAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <button
      onClick={connectWallet}
      disabled={isLoading || !!account}
      className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed"
    >
      {isLoading
        ? "Menghubungkan..."
        : account
        ? `Terhubung: ${truncateAddress(account)}`
        : "Hubungkan Wallet"}
    </button>
  );
};
