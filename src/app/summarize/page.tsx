// src/app/summarize/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useInView,
  spring,
  easeInOut,
} from "framer-motion";
import { useWeb3 } from "@/contexts/Web3Provider"; // Import hook Web3
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Trophy,
  Users,
  Crown,
  Wallet,
  Hash,
  CheckCircle2,
} from "lucide-react";
import BottomNav from "@/components/BottomNav";

// Tipe data gabungan (On-chain + Off-chain)
interface Candidate {
  id: number;
  name: string;
  votes: number;
  party?: string;
  image?: string;
  percentage?: number;
  color?: string;
}

// Tipe untuk data event Voted dari smart contract
interface VoteEvent {
  voter: string;
  candidateName: string;
  transactionHash: string;
}

// Data statis/off-chain untuk kandidat.
// PENTING: Urutan di sini HARUS SAMA dengan urutan saat Anda mendeploy smart contract.
const staticCandidateDetails = [
    { party: "Progressive Alliance", image: "/placeholder.svg?height=300&width=300", color: "from-green-400 to-emerald-600" },
    { party: "Innovation Party", image: "/placeholder.svg?height=300&width=300", color: "from-blue-400 to-cyan-600" },
    { party: "People's Unity", image: "/placeholder.svg?height=300&width=300", color: "from-purple-400 to-pink-600" },
];

export default function ResultsPage() {
  const { contract } = useWeb3();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [recentVotes, setRecentVotes] = useState<VoteEvent[]>([]);

  // Fungsi untuk mengambil data utama (total suara dan peringkat)
  const fetchData = async () => {
    if (!contract) {
      return;
    }
    try {
      const [names, voteCounts] = await contract.getResults();
      const total = voteCounts.reduce((acc: bigint, count: bigint) => acc + count, BigInt(0));
      setTotalVotes(Number(total));

      const candidateData = names.map((name: string, index: number) => {
        const staticData = staticCandidateDetails[index] || {};
        const votes = Number(voteCounts[index]);
        return {
          id: index,
          name,
          votes,
          percentage: total > 0 ? (votes / Number(total)) * 100 : 0,
          ...staticData,
        };
      });
      setCandidates(candidateData);
    } catch (error) {
      console.error("Gagal mengambil hasil:", error);
    }
  };

  // Mengelola loading dan listener event
  useEffect(() => {
    if (contract) {
      setIsLoading(true);
      
      const initializeDataAndListeners = async () => {
        await fetchData(); // Ambil data peringkat

        // Ambil riwayat vote
        const filter = contract.filters.Voted();
        const pastEvents = await contract.queryFilter(filter);
        const candidateNames = (await contract.getResults())[0];

        const formattedVotes = pastEvents.map((event: any) => {
          const voterAddress = event.args[0];
          const candidateId = Number(event.args[1]);
          return {
            voter: voterAddress,
            candidateName: candidateNames[candidateId] || 'Unknown',
            transactionHash: event.transactionHash,
          };
        }).reverse();
        setRecentVotes(formattedVotes.slice(0, 20));
        
        // Siapkan listener untuk vote baru
        const handleNewVote = (voterAddress: string, candidateIdBigInt: bigint, event: any) => {
          const candidateId = Number(candidateIdBigInt);
          const newVote: VoteEvent = {
            voter: voterAddress,
            candidateName: candidateNames[candidateId] || 'Unknown',
            transactionHash: event.log.transactionHash,
          };
          setRecentVotes(prev => [newVote, ...prev.slice(0, 19)]);
          fetchData(); // Refresh total suara
        };

        contract.on(filter, handleNewVote);
        setIsLoading(false);

        return () => {
          contract.off(filter, handleNewVote);
        };
      };

      initializeDataAndListeners();
    } else {
      setIsLoading(false);
    }
  }, [contract]);

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2, }, }, };
  const itemVariants = { hidden: { opacity: 0, y: 50, scale: 0.9 }, visible: { opacity: 1, y: 0, scale: 1, transition: { type: spring, stiffness: 100, damping: 15, }, }, };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        Memuat Hasil...
      </div>
    );
  }

  return (
    <>
      <BottomNav />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 relative overflow-hidden">
        <div className="relative z-10 container mx-auto px-4 py-12">
          <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: "easeOut" }} className="text-center mb-16">
            <motion.div className="inline-flex items-center gap-4 mb-8" animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}>
              <Trophy className="w-16 h-16 text-yellow-400" />
              <span className="text-green-400 font-semibold">LIVE RESULTS</span>
            </motion.div>
            <motion.h1 className="text-6xl md:text-8xl font-bold mb-6" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}>
              <span className="bg-gradient-to-r from-yellow-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">VOTING RESULTS</span>
            </motion.h1>
            <motion.p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}>
              Real-time blockchain voting results with complete transparency and immutable records.
            </motion.p>
          </motion.div>

          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <motion.div variants={itemVariants}>
              <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-white mb-2">{totalVotes.toLocaleString()}</div>
                  <p className="text-slate-400 text-sm">Total Votes</p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Candidates Rankings */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible" // <-- PERUBAHAN DI SINI
            className="mb-16"
          >
            <motion.h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent" variants={itemVariants}>
              Candidate Rankings
            </motion.h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {candidates
                .sort((a, b) => b.votes - a.votes)
                .map((candidate, index) => (
                  <motion.div key={candidate.id} variants={itemVariants} className="group relative" style={{ zIndex: candidates.length - index }}>
                    <Card className="relative bg-slate-800/50 backdrop-blur-xl border-slate-700/50 hover:border-slate-600/50 transition-all duration-500 overflow-hidden">
                      <motion.div className={`h-2 bg-gradient-to-r ${candidate.color}`} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1, delay: index * 0.2 }} />
                      <CardHeader className="pb-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="w-16 h-16 border-4 border-white/20">
                            <AvatarImage src={candidate.image || "/placeholder.svg"} alt={candidate.name} />
                            <AvatarFallback>{candidate.name?.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <CardTitle className="text-xl text-white mb-1">{candidate.name}</CardTitle>
                            <CardDescription className="text-slate-300">{candidate.party}</CardDescription>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-bold text-white mb-1">{(candidate.percentage || 0).toFixed(1)}%</div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-slate-400">Total Votes</span>
                          <span className="text-2xl font-bold text-white">{candidate.votes.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
                          <motion.div
                            className={`h-full bg-gradient-to-r ${candidate.color}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${candidate.percentage || 0}%` }}
                            transition={{ duration: 2, delay: index * 0.2 + 1, ease: "easeOut" }}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
            </div>
          </motion.div>

          {/* Live Vote Feed */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <motion.h2 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent" variants={itemVariants}>
              Live Vote Feed
            </motion.h2>
            <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50">
              <CardContent className="p-6">
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  <AnimatePresence>
                    {recentVotes.length === 0 && <p className="text-slate-400 text-center">Menunggu suara baru...</p>}
                    {recentVotes.map((vote) => (
                      <motion.div
                        key={vote.transactionHash}
                        layout
                        initial={{ opacity: 0, x: -50, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 50, scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        className="flex items-center justify-between p-4 bg-slate-700/20 rounded-lg border border-slate-600/20"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <div className="text-white font-semibold">
                              Vote untuk <span className="text-blue-300">{vote.candidateName}</span>
                            </div>
                            <div className="text-sm text-slate-400 font-mono">
                              Dari: {`${vote.voter.substring(0, 6)}...${vote.voter.substring(vote.voter.length - 4)}`}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
}
