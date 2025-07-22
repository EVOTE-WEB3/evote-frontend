"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, easeInOut, spring } from "framer-motion";
import { useWeb3 } from "@/contexts/Web3Provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Vote,
  CheckCircle,
  Loader2,
  Sparkles,
  Zap,
  Crown,
  Star,
  ArrowRight,
  Shield,
  Wallet,
  Users,
  AlertTriangle,
} from "lucide-react";
import BottomNav from "@/components/BottomNav";

// Tipe data gabungan (On-chain + Off-chain)
interface Candidate {
  id: number;
  name: string;
  votes: number;
  party?: string;
  position?: string;
  image?: string;
  description?: string;
  supporters?: number;
  color?: string;
  percentage?: number;
}

// Tipe untuk status pemilih dari smart contract
interface VoterStatus {
  isRegistered: boolean;
  hasRightToVote: boolean;
  hasVoted: boolean;
}

// Data statis/off-chain untuk kandidat.
// PENTING: Urutan di sini HARUS SAMA dengan urutan saat Anda mendeploy smart contract.
const staticCandidateDetails = [
    { party: "Progressive Alliance", position: "Presidential Candidate", image: "/placeholder.svg?height=300&width=300", description: "Experienced leader focused on sustainable development.", supporters: 2847, color: "from-green-400 to-emerald-600" },
    { party: "Innovation Party", position: "Presidential Candidate", image: "/placeholder.svg?height=300&width=300", description: "Tech entrepreneur advocating for digital transformation.", supporters: 3156, color: "from-blue-400 to-cyan-600" },
    { party: "People's Unity", position: "Presidential Candidate", image: "/placeholder.svg?height=300&width=300", description: "Healthcare professional fighting for accessible healthcare.", supporters: 2634, color: "from-purple-400 to-pink-600" },
    { party: "Economic Freedom", position: "Presidential Candidate", image: "/placeholder.svg?height=300&width=300", description: "Business leader focused on economic growth.", supporters: 2891, color: "from-orange-400 to-red-600" },
];

export default function VotePage() {
  const { account, contract } = useWeb3();
  
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [voterStatus, setVoterStatus] = useState<VoterStatus | null>(null);
  const [totalVotes, setTotalVotes] = useState(0);
  
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [notification, setNotification] = useState("");
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [votingProgress, setVotingProgress] = useState(0);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 5000);
  };

  // Fungsi untuk mengambil semua data dari blockchain
  const fetchData = async () => {
    if (contract) {
      setIsVoting(true); // Gunakan state isVoting untuk loading awal
      try {
        // 1. Ambil hasil suara
        const [names, voteCounts] = await contract.getResults();
        const total = voteCounts.reduce((acc: bigint, count: bigint) => acc + count, BigInt(0));
        setTotalVotes(Number(total));

        // 2. Gabungkan data on-chain dan off-chain
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
        setCandidates(candidateData as Candidate[]);

        // 3. Ambil status pemilih
        if (account) {
          const status = await contract.voters(account);
          setVoterStatus({ 
            isRegistered: status.isRegistered,
            hasRightToVote: status.hasRightToVote,
            hasVoted: status.hasVoted 
          });
        }
      } catch (error) {
        console.error("Gagal mengambil data:", error);
        showNotification("Gagal memuat data dari blockchain.");
      }
      setIsVoting(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [contract, account]);
  
  // Particle effect
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles((prev) => [
        ...prev.slice(-20), { id: Date.now(), x: Math.random() * 100, y: Math.random() * 100, },
      ]);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  const handleVoteClick = (candidate: Candidate) => {
    if (!account) {
      showNotification("Harap hubungkan wallet Anda terlebih dahulu.");
      return;
    }
    if (voterStatus && !voterStatus.isRegistered) {
      showNotification("Anda belum terdaftar. Silakan daftar di halaman registrasi.");
      return;
    }
    if (voterStatus && !voterStatus.hasRightToVote) {
      showNotification("Maaf, Anda tidak memiliki hak suara (usia dibawah 18 tahun).");
      return;
    }
    if (voterStatus && voterStatus.hasVoted) {
      showNotification("Anda sudah memberikan suara.");
      return;
    }
    setSelectedCandidate(candidate);
    setShowConfirmation(true);
  };

  const confirmVote = async () => {
    if (!selectedCandidate || !contract) return;

    setIsVoting(true);
    setShowConfirmation(false);
    showNotification("Memproses transaksi Anda... Harap konfirmasi di MetaMask.");

    try {
      const tx = await contract.vote(selectedCandidate.id);
      
      // Animasikan progress bar saat menunggu
      setVotingProgress(30);
      await tx.wait(); // Menunggu transaksi di-mine
      setVotingProgress(100);

      showNotification(`Vote untuk ${selectedCandidate.name} berhasil!`);
      await fetchData(); // Refresh data untuk menampilkan hasil terbaru
      
      // Reset setelah perayaan
      setTimeout(() => {
        setIsVoting(false);
        setVotingProgress(0);
      }, 4000);

    } catch (error: any) {
      console.error("Gagal vote:", error);
      showNotification(error?.reason || "Transaksi vote gagal.");
      setIsVoting(false);
    }
  };

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2, }, }, };
  const cardVariants = { hidden: { opacity: 0, y: 100, rotateX: -15, scale: 0.8, }, visible: { opacity: 1, y: 0, rotateX: 0, scale: 1, transition: { type: spring, stiffness: 100, damping: 15, duration: 0.8, }, }, hover: { y: -20, scale: 1.05, rotateY: 5, transition: { type: spring, stiffness: 400, damping: 25, }, }, };
  const glowVariants = { initial: { opacity: 0, scale: 0.8 }, hover: { opacity: 1, scale: 1.2, transition: { duration: 0.3, ease: easeInOut, }, }, };

  return (
    <>
      <BottomNav />
      {notification && (
        <div className="fixed top-24 right-5 p-4 bg-blue-600 text-white rounded-lg shadow-lg z-[100]">
          {notification}
        </div>
      )}
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Animated Background & Particles */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
          <div
            className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,rgba(59,130,246,0.1),rgba(147,51,234,0.1),rgba(59,130,246,0.1))] animate-spin"
            style={{ animationDuration: "20s" }}
          />
        </div>
        <div className="absolute inset-0 pointer-events-none">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-1 h-1 bg-blue-400 rounded-full"
              initial={{ x: `${particle.x}%`, y: `${particle.y}%`, opacity: 0, scale: 0 }}
              animate={{ y: `${particle.y - 100}%`, opacity: [0, 1, 0], scale: [0, 1, 0] }}
              transition={{ duration: 3, ease: "easeOut" }}
            />
          ))}
        </div>

        <div className="relative z-10 container mx-auto px-4 py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              className="inline-block mb-6"
            >
              <div className="relative">
                <Crown className="w-16 h-16 text-yellow-400 mx-auto" />
                <motion.div
                  className="absolute -inset-2 bg-yellow-400/20 rounded-full blur-xl"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                />
              </div>
            </motion.div>
            <motion.h1
              className="text-6xl md:text-8xl font-bold mb-6"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
            >
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
                CAST YOUR VOTE
              </span>
            </motion.h1>
            <motion.p
              className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Your voice matters in shaping the future. Cast your vote securely
              on the blockchain and be part of the democratic revolution.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex justify-center items-center gap-8 mt-8 text-slate-300"
            >
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                <span>{totalVotes.toLocaleString()} Total Votes</span>
              </div>
              <div className="flex items-center gap-2"><Shield className="w-5 h-5 text-green-400" /><span>Blockchain Secured</span></div>
              <div className="flex items-center gap-2"><Wallet className="w-5 h-5 text-purple-400" /><span>Web3 Verified</span></div>
            </motion.div>
          </motion.div>

          <AnimatePresence>
            {account && voterStatus && (
              <motion.div initial={{opacity: 0, y: -20}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: -20}}>
                {!voterStatus.isRegistered && (
                  <Card className="max-w-3xl mx-auto my-8 bg-yellow-900/50 border-yellow-700/50 text-yellow-200">
                    <CardHeader className="flex flex-row items-center gap-4">
                      <AlertTriangle className="w-8 h-8"/>
                      <div>
                        <CardTitle>Anda Belum Terdaftar</CardTitle>
                        <CardDescription className="text-yellow-300">Silakan daftar di halaman registrasi untuk dapat memberikan suara.</CardDescription>
                      </div>
                    </CardHeader>
                  </Card>
                )}
                {voterStatus.isRegistered && !voterStatus.hasRightToVote && (
                  <Card className="max-w-3xl mx-auto my-8 bg-red-900/50 border-red-700/50 text-red-200">
                    <CardHeader className="flex flex-row items-center gap-4">
                      <AlertTriangle className="w-8 h-8"/>
                      <div>
                        <CardTitle>Tidak Memiliki Hak Suara</CardTitle>
                        <CardDescription className="text-red-300">Berdasarkan data registrasi, Anda tidak memenuhi syarat usia untuk memilih.</CardDescription>
                      </div>
                    </CardHeader>
                  </Card>
                )}
                {voterStatus.hasVoted && (
                   <Card className="max-w-3xl mx-auto my-8 bg-green-900/50 border-green-700/50 text-green-200">
                     <CardHeader className="flex flex-row items-center gap-4">
                       <CheckCircle className="w-8 h-8"/>
                       <div>
                         <CardTitle>Terima Kasih!</CardTitle>
                         <CardDescription className="text-green-300">Anda sudah memberikan suara. Hasil akan terus diperbarui secara real-time.</CardDescription>
                       </div>
                     </CardHeader>
                   </Card>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Voting Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16"
          >
            {candidates.map((candidate, index) => (
              <motion.div key={candidate.id} variants={cardVariants} whileHover="hover" className="group relative perspective-1000">
                <motion.div variants={glowVariants} initial="initial" whileHover="hover" className={`absolute -inset-1 bg-gradient-to-r ${candidate.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition-all duration-500`} />
                <div className="absolute -top-4 -right-4 z-20">
                  <motion.div className="relative w-16 h-16" whileHover={{ rotate: 360 }} transition={{ duration: 1 }}>
                    <svg className="w-16 h-16 transform -rotate-90">
                      <circle cx="32" cy="32" r="28" stroke="rgba(255,255,255,0.1)" strokeWidth="4" fill="none" />
                      <motion.circle
                        cx="32" cy="32" r="28"
                        stroke={`url(#gradient-${candidate.id})`}
                        strokeWidth="4" fill="none" strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: (candidate.percentage || 0) / 100 }}
                        transition={{ duration: 2, delay: index * 0.2 }}
                        strokeDasharray="175.929" strokeDashoffset="175.929"
                      />
                      <defs>
                        <linearGradient id={`gradient-${candidate.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#3B82F6" />
                          <stop offset="100%" stopColor="#8B5CF6" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-bold text-white">
                        {(candidate.percentage || 0).toFixed(1)}%
                      </span>
                    </div>
                  </motion.div>
                </div>
                <Card className="relative h-full bg-slate-800/50 backdrop-blur-xl border-slate-700/50 overflow-hidden group-hover:border-slate-600/50 transition-all duration-500">
                  <motion.div className={`h-1 bg-gradient-to-r ${candidate.color}`} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1, delay: index * 0.1 }} />
                  <CardHeader className="text-center pb-4 relative">
                    <motion.div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" animate={{ y: [0, -10, 0], rotate: [0, 10, -10, 0] }} transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}>
                      <Star className="w-4 h-4 text-yellow-400" />
                    </motion.div>
                    <motion.div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" animate={{ y: [0, -8, 0], rotate: [0, -10, 10, 0] }} transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.5 }}>
                      <Sparkles className="w-4 h-4 text-blue-400" />
                    </motion.div>
                    <motion.div className="mx-auto mb-4 relative" whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }} transition={{ duration: 0.5 }}>
                      <Avatar className="w-24 h-24 border-4 border-white/20 shadow-2xl">
                        <AvatarImage src={candidate.image || "/placeholder.svg"} alt={candidate.name} />
                        <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-slate-700 to-slate-800">
                          {candidate.name?.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <motion.div className={`absolute inset-0 bg-gradient-to-r ${candidate.color} rounded-full blur-md opacity-0 group-hover:opacity-30`} animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }} />
                    </motion.div>
                    <CardTitle className="text-2xl font-bold text-white mb-2">{candidate.name}</CardTitle>
                    <Badge variant="secondary" className="mx-auto w-fit bg-slate-700/50 text-slate-200 border-slate-600/50">{candidate.party}</Badge>
                    <CardDescription className="text-slate-300 mt-3 leading-relaxed">{candidate.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <motion.div className="text-center p-3 bg-slate-700/30 rounded-lg border border-slate-600/30" whileHover={{ scale: 1.05 }}>
                        <div className="text-2xl font-bold text-blue-400">{candidate.votes.toLocaleString()}</div>
                        <div className="text-slate-400">Votes</div>
                      </motion.div>
                      <motion.div className="text-center p-3 bg-slate-700/30 rounded-lg border border-slate-600/30" whileHover={{ scale: 1.05 }}>
                        <div className="text-2xl font-bold text-green-400">{(candidate.supporters || 0).toLocaleString()}</div>
                        <div className="text-slate-400">Supporters</div>
                      </motion.div>
                    </div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        onClick={() => handleVoteClick(candidate)}
                        disabled={isVoting || (voterStatus ? !voterStatus.isRegistered || !voterStatus.hasRightToVote || voterStatus.hasVoted : true)}
                        className={`w-full h-14 text-lg font-bold bg-gradient-to-r ${candidate.color} hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 relative overflow-hidden group`}
                      >
                        <motion.div className="absolute inset-0 bg-white/20" initial={{ x: "-100%" }} whileHover={{ x: "100%" }} transition={{ duration: 0.6 }} />
                        <Vote className="w-5 h-5 mr-2" />
                        <span className="relative z-10">
                          {voterStatus?.hasVoted ? "Vote Cast!" : isVoting ? "Voting..." : "Vote Now"}
                        </span>
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Voting Status Modal */}
          <AnimatePresence>
            {isVoting && !showConfirmation && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 50 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
              >
                <Card className="w-full max-w-md bg-slate-800/90 backdrop-blur-xl border-slate-700/50">
                  <CardContent className="p-8 text-center">
                    {voterStatus?.hasVoted ? (
                       <>
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }} className="mx-auto mb-6">
                          <CheckCircle className="w-20 h-20 text-green-400" />
                        </motion.div>
                        <motion.h3 className="text-3xl font-bold text-white mb-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                          Vote Successfully Cast!
                        </motion.h3>
                      </>
                    ) : (
                      <>
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }} className="mx-auto mb-6">
                          <Loader2 className="w-16 h-16 text-blue-400" />
                        </motion.div>
                        <h3 className="text-2xl font-bold text-white mb-4">Processing Your Vote</h3>
                        <p className="text-slate-300 mb-6">Securing your vote on the blockchain...</p>
                        <div className="w-full bg-slate-700 rounded-full h-3 mb-4">
                          <motion.div className="bg-gradient-to-r from-blue-400 to-purple-400 h-3 rounded-full" initial={{ width: 0 }} animate={{ width: `${votingProgress}%` }} transition={{ duration: 0.3 }} />
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Confirmation Dialog */}
          <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
            <DialogContent className="bg-slate-800/95 backdrop-blur-xl border-slate-700/50 text-white">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-center">
                  Confirm Your Vote
                </DialogTitle>
                <DialogDescription className="text-slate-300 text-center">
                  You are about to vote for{" "}
                  <strong className="text-white">
                    {selectedCandidate?.name}
                  </strong>
                  . This action cannot be undone.
                </DialogDescription>
              </DialogHeader>

              <div className="flex gap-4 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmVote}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Confirm Vote
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
}
