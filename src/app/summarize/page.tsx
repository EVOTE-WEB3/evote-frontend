"use client";

import { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useInView,
  useMotionValue,
  useSpring,
  spring,
  easeInOut,
} from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Trophy,
  Users,
  Zap,
  Crown,
  ChevronDown,
  Filter,
  Eye,
  Activity,
  Wallet,
  Hash,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import BottomNav from "@/components/BottomNav";

interface Candidate {
  id: number;
  name: string;
  party: string;
  image: string;
  votes: number;
  percentage: number;
  color: string;
  trend: "up" | "down" | "stable";
  trendValue: number;
}

interface Vote {
  id: string;
  candidateId: number;
  candidateName: string;
  timestamp: Date;
  walletAddress: string;
  transactionHash: string;
  blockNumber: number;
  gasUsed: number;
}

interface LiveStats {
  totalVotes: number;
  totalVoters: number;
  averageGasUsed: number;
  lastBlockNumber: number;
  votingRate: number;
}

const candidates: Candidate[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    party: "Progressive Alliance",
    image: "/placeholder.svg?height=300&width=300",
    votes: 1847,
    percentage: 42.3,
    color: "from-green-400 to-emerald-600",
    trend: "up",
    trendValue: 5.2,
  },
  {
    id: 2,
    name: "Michael Chen",
    party: "Innovation Party",
    image: "/placeholder.svg?height=300&width=300",
    votes: 1456,
    percentage: 33.4,
    color: "from-blue-400 to-cyan-600",
    trend: "up",
    trendValue: 2.1,
  },
  {
    id: 3,
    name: "Dr. Maria Rodriguez",
    party: "People's Unity",
    image: "/placeholder.svg?height=300&width=300",
    votes: 892,
    percentage: 20.4,
    color: "from-purple-400 to-pink-600",
    trend: "down",
    trendValue: -1.8,
  },
  {
    id: 4,
    name: "Robert Thompson",
    party: "Economic Freedom",
    image: "/placeholder.svg?height=300&width=300",
    votes: 168,
    percentage: 3.9,
    color: "from-orange-400 to-red-600",
    trend: "stable",
    trendValue: 0.3,
  },
];

const generateVotes = (): Vote[] => {
  const votes: Vote[] = [];
  const walletPrefixes = [
    "0x1a2b",
    "0x3c4d",
    "0x5e6f",
    "0x7g8h",
    "0x9i0j",
    "0xkl1m",
    "0xno2p",
    "0xqr3s",
  ];

  for (let i = 0; i < 150; i++) {
    const candidate = candidates[Math.floor(Math.random() * candidates.length)];
    const timestamp = new Date(
      Date.now() - Math.random() * 24 * 60 * 60 * 1000
    );

    votes.push({
      id: `vote_${i}`,
      candidateId: candidate.id,
      candidateName: candidate.name,
      timestamp,
      walletAddress: `${
        walletPrefixes[Math.floor(Math.random() * walletPrefixes.length)]
      }...${Math.random().toString(36).substr(2, 4)}`,
      transactionHash: `0x${Math.random().toString(36).substr(2, 64)}`,
      blockNumber: 18500000 + Math.floor(Math.random() * 1000),
      gasUsed: 21000 + Math.floor(Math.random() * 50000),
    });
  }

  return votes.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

export default function ResultsPage() {
  const [votes, setVotes] = useState<Vote[]>([]);
  const [liveStats, setLiveStats] = useState<LiveStats>({
    totalVotes: 4363,
    totalVoters: 4363,
    averageGasUsed: 35420,
    lastBlockNumber: 18501247,
    votingRate: 12.5,
  });
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(
    null
  );
  const [showAllVotes, setShowAllVotes] = useState(false);
  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; y: number; color: string }>
  >([]);
  const [isLive, setIsLive] = useState(true);

  const statsRef = useRef(null);
  const candidatesRef = useRef(null);
  const votesRef = useRef(null);

  const isStatsInView = useInView(statsRef, { once: true });
  const isCandidatesInView = useInView(candidatesRef, { once: true });
  const isVotesInView = useInView(votesRef, { once: true });

  // Animated counters
  const totalVotesMotion = useMotionValue(0);
  const totalVotesSpring = useSpring(totalVotesMotion, {
    stiffness: 100,
    damping: 30,
  });

  useEffect(() => {
    setVotes(generateVotes());
    totalVotesMotion.set(liveStats.totalVotes);
  }, []);

  // Live updates simulation
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      // Simulate new vote
      if (Math.random() > 0.7) {
        const candidate =
          candidates[Math.floor(Math.random() * candidates.length)];
        const newVote: Vote = {
          id: `vote_${Date.now()}`,
          candidateId: candidate.id,
          candidateName: candidate.name,
          timestamp: new Date(),
          walletAddress: `0x${Math.random()
            .toString(36)
            .substr(2, 4)}...${Math.random().toString(36).substr(2, 4)}`,
          transactionHash: `0x${Math.random().toString(36).substr(2, 64)}`,
          blockNumber: liveStats.lastBlockNumber + 1,
          gasUsed: 21000 + Math.floor(Math.random() * 50000),
        };

        setVotes((prev) => [newVote, ...prev.slice(0, 149)]);
        setLiveStats((prev) => ({
          ...prev,
          totalVotes: prev.totalVotes + 1,
          lastBlockNumber: prev.lastBlockNumber + 1,
        }));

        // Add celebration particle
        setParticles((prev) => [
          ...prev.slice(-50),
          {
            id: Date.now(),
            x: Math.random() * 100,
            y: Math.random() * 100,
            color: candidate.color,
          },
        ]);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isLive, liveStats.lastBlockNumber]);

  // Particle cleanup
  useEffect(() => {
    const cleanup = setInterval(() => {
      setParticles((prev) => prev.slice(-30));
    }, 5000);

    return () => clearInterval(cleanup);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: spring,
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const cardHoverVariants = {
    hover: {
      scale: 1.05,
      rotateY: 5,
      z: 50,
      transition: {
        type: spring,
        stiffness: 300,
        damping: 20,
      },
    },
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        ease: easeInOut,
      },
    },
  };

  return (
    <>
      <BottomNav />

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 relative overflow-hidden">
        {/* Advanced Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.3),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,119,198,0.3),transparent_50%)]" />
          <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,rgba(59,130,246,0.1),rgba(147,51,234,0.1),rgba(236,72,153,0.1),rgba(59,130,246,0.1))]" />

          {/* Animated Grid */}
          <motion.div
            className="absolute inset-0 opacity-10"
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className={`absolute w-3 h-3 rounded-full bg-gradient-to-r ${particle.color} blur-sm`}
              initial={{
                x: `${particle.x}%`,
                y: `${particle.y}%`,
                opacity: 0,
                scale: 0,
              }}
              animate={{
                y: `${particle.y - 100}%`,
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
                rotate: 360,
              }}
              transition={{
                duration: 4,
                ease: "easeOut",
              }}
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
              className="inline-flex items-center gap-4 mb-8"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 8,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              >
                <Trophy className="w-16 h-16 text-yellow-400" />
              </motion.div>
              <motion.div
                variants={pulseVariants}
                animate="pulse"
                className="w-4 h-4 bg-green-400 rounded-full"
              />
              <span className="text-green-400 font-semibold">LIVE RESULTS</span>
            </motion.div>

            <motion.h1
              className="text-6xl md:text-8xl font-bold mb-6"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 1.2,
                ease: "easeOut",
                delay: 0.2,
              }}
            >
              <span className="bg-gradient-to-r from-yellow-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                VOTING RESULTS
              </span>
            </motion.h1>

            <motion.p
              className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Real-time blockchain voting results with complete transparency and
              immutable records.
            </motion.p>
          </motion.div>

          {/* Live Stats */}
          <motion.div
            ref={statsRef}
            variants={containerVariants}
            initial="hidden"
            animate={isStatsInView ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16"
          >
            {[
              {
                icon: Users,
                label: "Total Votes",
                value: liveStats.totalVotes.toLocaleString(),
                color: "from-blue-400 to-cyan-400",
                trend: "+12.5%",
              },
              {
                icon: Activity,
                label: "Voting Rate",
                value: `${liveStats.votingRate}/min`,
                color: "from-green-400 to-emerald-400",
                trend: "+8.2%",
              },
              {
                icon: Zap,
                label: "Avg Gas Used",
                value: liveStats.averageGasUsed.toLocaleString(),
                color: "from-purple-400 to-pink-400",
                trend: "-2.1%",
              },
              {
                icon: Hash,
                label: "Last Block",
                value: `#${liveStats.lastBlockNumber.toLocaleString()}`,
                color: "from-orange-400 to-red-400",
                trend: "Live",
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover="hover"
              >
                <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 hover:border-slate-600/50 transition-all duration-500 group relative overflow-hidden">
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                  />

                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <motion.div
                        whileHover={{ rotate: 360, scale: 1.2 }}
                        transition={{ duration: 0.6 }}
                        className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}
                      >
                        <stat.icon className="w-6 h-6 text-white" />
                      </motion.div>
                      <Badge
                        variant="secondary"
                        className="bg-slate-700/50 text-slate-200 border-slate-600/50"
                      >
                        {stat.trend}
                      </Badge>
                    </div>

                    <motion.div
                      className="text-3xl font-bold text-white mb-2"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 15,
                        delay: index * 0.1,
                      }}
                    >
                      {stat.value}
                    </motion.div>

                    <p className="text-slate-400 text-sm">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Candidates Results */}
          <motion.div
            ref={candidatesRef}
            variants={containerVariants}
            initial="hidden"
            animate={isCandidatesInView ? "visible" : "hidden"}
            className="mb-16"
          >
            <motion.h2
              className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
              variants={itemVariants}
            >
              Candidate Rankings
            </motion.h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {candidates
                .sort((a, b) => b.votes - a.votes)
                .map((candidate, index) => (
                  <motion.div
                    key={candidate.id}
                    variants={itemVariants}
                    whileHover="hover"
                    className="group relative"
                    style={{ zIndex: candidates.length - index }}
                  >
                    {/* Rank Badge */}
                    <motion.div
                      className="absolute -top-4 -left-4 z-20"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 15,
                        delay: index * 0.2,
                      }}
                    >
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                          index === 0
                            ? "bg-gradient-to-r from-yellow-400 to-orange-400"
                            : index === 1
                            ? "bg-gradient-to-r from-gray-300 to-gray-400"
                            : index === 2
                            ? "bg-gradient-to-r from-orange-400 to-yellow-600"
                            : "bg-gradient-to-r from-slate-400 to-slate-600"
                        }`}
                      >
                        {index === 0 && <Crown className="w-6 h-6" />}
                        {index !== 0 && index + 1}
                      </div>
                    </motion.div>

                    {/* Winner Glow */}
                    {index === 0 && (
                      <motion.div
                        className="absolute -inset-2 bg-gradient-to-r from-yellow-400/30 to-orange-400/30 rounded-2xl blur-xl"
                        animate={{
                          scale: [1, 1.1, 1],
                          opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }}
                      />
                    )}

                    <Card className="relative bg-slate-800/50 backdrop-blur-xl border-slate-700/50 hover:border-slate-600/50 transition-all duration-500 overflow-hidden">
                      <motion.div
                        className={`h-2 bg-gradient-to-r ${candidate.color}`}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 1, delay: index * 0.2 }}
                      />

                      <CardHeader className="pb-4">
                        <div className="flex items-center gap-4">
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Avatar className="w-16 h-16 border-4 border-white/20">
                              <AvatarImage
                                src={candidate.image || "/placeholder.svg"}
                                alt={candidate.name}
                              />
                              <AvatarFallback className="text-xl font-bold bg-gradient-to-br from-slate-700 to-slate-800">
                                {candidate.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                          </motion.div>

                          <div className="flex-1">
                            <CardTitle className="text-xl text-white mb-1">
                              {candidate.name}
                            </CardTitle>
                            <CardDescription className="text-slate-300">
                              {candidate.party}
                            </CardDescription>
                          </div>

                          <div className="text-right">
                            <motion.div
                              className="text-3xl font-bold text-white mb-1"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{
                                type: "spring",
                                stiffness: 200,
                                damping: 15,
                                delay: index * 0.1 + 0.5,
                              }}
                            >
                              {candidate.percentage}%
                            </motion.div>
                            <div className="flex items-center gap-1 text-sm">
                              {candidate.trend === "up" && (
                                <ArrowUp className="w-4 h-4 text-green-400" />
                              )}
                              {candidate.trend === "down" && (
                                <ArrowDown className="w-4 h-4 text-red-400" />
                              )}
                              <span
                                className={
                                  candidate.trend === "up"
                                    ? "text-green-400"
                                    : candidate.trend === "down"
                                    ? "text-red-400"
                                    : "text-slate-400"
                                }
                              >
                                {candidate.trendValue > 0 ? "+" : ""}
                                {candidate.trendValue}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="pt-0">
                        {/* Vote Count */}
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-slate-400">Total Votes</span>
                          <motion.span
                            className="text-2xl font-bold text-white"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.1 + 0.8 }}
                          >
                            {candidate.votes.toLocaleString()}
                          </motion.span>
                        </div>

                        {/* Progress Bar */}
                        <div className="relative">
                          <div className="w-full bg-slate-700/50 rounded-full h-3 mb-4 overflow-hidden">
                            <motion.div
                              className={`h-full bg-gradient-to-r ${candidate.color} relative`}
                              initial={{ width: 0 }}
                              animate={{ width: `${candidate.percentage}%` }}
                              transition={{
                                duration: 2,
                                delay: index * 0.2 + 1,
                                ease: "easeOut",
                              }}
                            >
                              <motion.div
                                className="absolute inset-0 bg-white/20"
                                animate={{
                                  x: ["-100%", "100%"],
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Number.POSITIVE_INFINITY,
                                  ease: "linear",
                                  delay: index * 0.5,
                                }}
                              />
                            </motion.div>
                          </div>
                        </div>

                        {/* Action Button */}
                        <Button
                          variant="outline"
                          onClick={() =>
                            setSelectedCandidate(
                              selectedCandidate === candidate.id
                                ? null
                                : candidate.id
                            )
                          }
                          className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 group"
                        >
                          <Eye className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                          {selectedCandidate === candidate.id ? "Hide" : "View"}{" "}
                          Voter Details
                          <ChevronDown
                            className={`w-4 h-4 ml-2 transition-transform ${
                              selectedCandidate === candidate.id
                                ? "rotate-180"
                                : ""
                            }`}
                          />
                        </Button>

                        {/* Voter Details */}
                        <AnimatePresence>
                          {selectedCandidate === candidate.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="mt-4 space-y-2 max-h-60 overflow-y-auto"
                            >
                              {votes
                                .filter(
                                  (vote) => vote.candidateId === candidate.id
                                )
                                .slice(0, 10)
                                .map((vote, voteIndex) => (
                                  <motion.div
                                    key={vote.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: voteIndex * 0.05 }}
                                    className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-slate-600/30"
                                  >
                                    <div className="flex items-center gap-3">
                                      <Wallet className="w-4 h-4 text-blue-400" />
                                      <span className="text-sm text-slate-300 font-mono">
                                        {vote.walletAddress}
                                      </span>
                                    </div>
                                    <div className="text-xs text-slate-400">
                                      {vote.timestamp.toLocaleTimeString()}
                                    </div>
                                  </motion.div>
                                ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
            </div>
          </motion.div>

          {/* Recent Votes Feed */}
          <motion.div
            ref={votesRef}
            variants={containerVariants}
            initial="hidden"
            animate={isVotesInView ? "visible" : "hidden"}
          >
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-between mb-8"
            >
              <h2 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                Live Vote Feed
              </h2>
              <div className="flex items-center gap-4">
                <motion.div
                  variants={pulseVariants}
                  animate="pulse"
                  className="flex items-center gap-2 text-green-400"
                >
                  <div className="w-3 h-3 bg-green-400 rounded-full" />
                  <span className="text-sm font-semibold">LIVE</span>
                </motion.div>
                <Button
                  variant="outline"
                  onClick={() => setShowAllVotes(!showAllVotes)}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  {showAllVotes ? "Show Recent" : "Show All"}
                </Button>
              </div>
            </motion.div>

            <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50">
              <CardContent className="p-6">
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  <AnimatePresence mode="popLayout">
                    {votes
                      .slice(0, showAllVotes ? votes.length : 20)
                      .map((vote, index) => (
                        <motion.div
                          key={vote.id}
                          layout
                          initial={{ opacity: 0, x: -50, scale: 0.9 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          exit={{ opacity: 0, x: 50, scale: 0.9 }}
                          transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 20,
                            delay: index * 0.02,
                          }}
                          whileHover={{
                            scale: 1.02,
                            backgroundColor: "rgba(51, 65, 85, 0.5)",
                          }}
                          className="flex items-center justify-between p-4 bg-slate-700/20 rounded-lg border border-slate-600/20 hover:border-slate-500/50 transition-all duration-300 cursor-pointer group"
                        >
                          <div className="flex items-center gap-4">
                            <motion.div
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.6 }}
                              className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                            >
                              <CheckCircle2 className="w-4 h-4 text-white" />
                            </motion.div>

                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-white font-semibold">
                                  {vote.candidateName}
                                </span>
                                <Badge variant="secondary" className="text-xs">
                                  Vote #{vote.blockNumber}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-slate-400">
                                <span className="font-mono">
                                  {vote.walletAddress}
                                </span>
                                <span>{vote.timestamp.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-sm text-slate-400 mb-1">
                              Gas Used
                            </div>
                            <div className="text-white font-semibold">
                              {vote.gasUsed.toLocaleString()}
                            </div>
                          </div>

                          {/* Hover Effect */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            initial={false}
                          />
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
