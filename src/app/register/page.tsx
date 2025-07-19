// src/app/register/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useWeb3 } from '@/contexts/Web3Provider'; // Import hook kita
import { ConnectWalletButton } from '@/components/ConnectWalletBtn';
import { UserPlus, Loader2 } from 'lucide-react'; // Import ikon untuk tombol registrasi

export default function RegisterPage() {
  const { account, contract } = useWeb3(); // Ambil 'contract' dari context
  const [age, setAge] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [voterStatus, setVoterStatus] = useState({ isRegistered: false });

  // Cek status pendaftaran saat akun berubah
  useEffect(() => {
    const checkStatus = async () => {
      if (account && contract) {
        // voters(address) adalah cara memanggil mapping publik di Solidity
        const status = await contract.voters(account);
        setVoterStatus({ isRegistered: status.isRegistered });
      }
    };
    checkStatus();
  }, [account, contract]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account || !contract) {
      setMessage({ type: 'error', text: 'Harap hubungkan wallet dan tunggu koneksi siap.' });
      return;
    }

    setIsLoading(true);
    setMessage({ type: 'info', text: 'Memproses transaksi... Harap konfirmasi di MetaMask.' });

    try {
      const ageNumber = parseInt(age);
      if (isNaN(ageNumber) || ageNumber <= 0) {
        throw new Error("Usia tidak valid.");
      }

      // Panggil fungsi smart contract
      const tx = await contract.registerVoter(ageNumber);
      await tx.wait(); // Menunggu transaksi selesai

      setMessage({ type: 'success', text: 'Registrasi berhasil! Status Anda telah dicatat di blockchain.' });
      setAge('');
      // Refresh status setelah berhasil
      const status = await contract.voters(account);
      setVoterStatus({ isRegistered: status.isRegistered });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.reason || 'Transaksi registrasi gagal.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Registrasi Pemilih</h1>
          <p className="text-gray-400">Daftarkan diri Anda untuk berpartisipasi dalam pemilihan.</p>
        </div>

        <div className="flex justify-center">
            <ConnectWalletButton />
        </div>

        {account && (
          voterStatus.isRegistered ? (
            <div className="text-center p-4 bg-green-900/50 border border-green-700 rounded-lg">
              <p className="text-green-300">Anda sudah terdaftar sebagai pemilih.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="wallet" className="block text-sm font-medium text-gray-300">Alamat Wallet</label>
                <input
                  id="wallet"
                  type="text"
                  value={account}
                  readOnly
                  className="w-full px-3 py-2 mt-1 text-gray-400 bg-gray-700 border border-gray-600 rounded-md shadow-sm cursor-not-allowed"
                />
              </div>
              
              {/* Form Input Usia dan Tombol Ikon */}
              <div className="flex items-end gap-x-3">
                <div className="flex-grow">
                  <label htmlFor="age" className="block text-sm font-medium text-gray-300">Usia Anda</label>
                  <input
                    id="age"
                    type="number"
                    placeholder="Contoh: 25"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    required
                    className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  title="Daftar"
                  className="flex-shrink-0 flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white transition-colors hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed"
                >
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <UserPlus className="h-5 w-5" />}
                </button>
              </div>
            </form>
          )
        )}

        {message.text && (
          <p className={`text-center mt-4 ${
            message.type === 'success' ? 'text-green-400' : 
            message.type === 'error' ? 'text-red-400' : 'text-yellow-400'
          }`}>
            {message.text}
          </p>
        )}
      </div>
    </div>
  );
}
