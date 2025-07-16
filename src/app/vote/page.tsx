"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, easeInOut, spring } from "framer-motion";
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
} from "lucide-react";
import BottomNav from "@/components/BottomNav";

interface Candidate {
  id: number;
  name: string;
  party: string;
  position: string;
  image: string;
  description: string;
  supporters: number;
  color: string;
  votes: number;
  percentage: number;
}

const candidates: Candidate[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    party: "Progressive Alliance",
    position: "Presidential Candidate",
    image: "/placeholder.svg?height=300&width=300",
    description:
      "Experienced leader focused on sustainable development and social justice.",
    supporters: 2847,
    color: "from-green-400 to-emerald-600",
    votes: 1247,
    percentage: 32.5,
  },
  {
    id: 2,
    name: "Michael Chen",
    party: "Innovation Party",
    position: "Presidential Candidate",
    image: "/placeholder.svg?height=300&width=300",
    description: "Tech entrepreneur advocating for digital transformation.",
    supporters: 3156,
    color: "from-blue-400 to-cyan-600",
    votes: 1456,
    percentage: 38.0,
  },
  {
    id: 3,
    name: "Dr. Maria Rodriguez",
    party: "People's Unity",
    position: "Presidential Candidate",
    image: "/placeholder.svg?height=300&width=300",
    description: "Healthcare professional fighting for accessible healthcare.",
    supporters: 2634,
    color: "from-purple-400 to-pink-600",
    votes: 892,
    percentage: 23.2,
  },
  {
    id: 4,
    name: "Robert Thompson",
    party: "Economic Freedom",
    position: "Presidential Candidate",
    image: "/placeholder.svg?height=300&width=300",
    description: "Business leader focused on economic growth.",
    supporters: 2891,
    color: "from-orange-400 to-red-600",
    votes: 238,
    percentage: 6.3,
  },
];

export default function VotePage() {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null
  );
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [votingProgress, setVotingProgress] = useState(0);
  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; y: number }>
  >([]);

  // Particle animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles((prev) => [
        ...prev.slice(-20),
        {
          id: Date.now(),
          x: Math.random() * 100,
          y: Math.random() * 100,
        },
      ]);
    }, 200);

    return () => clearInterval(interval);
  }, []);

  const handleVote = async (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setShowConfirmation(true);
  };

  const confirmVote = async () => {
    if (!selectedCandidate) return;

    setIsVoting(true);
    setShowConfirmation(false);

    // Simulate blockchain transaction
    for (let i = 0; i <= 100; i += 10) {
      setVotingProgress(i);
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    setIsVoting(false);
    setHasVoted(true);

    // Reset after celebration
    setTimeout(() => {
      setHasVoted(false);
      setVotingProgress(0);
      setSelectedCandidate(null);
    }, 4000);
  };

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

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 100,
      rotateX: -15,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      scale: 1,
      transition: {
        type: spring,
        stiffness: 100,
        damping: 15,
        duration: 0.8,
      },
    },
    hover: {
      y: -20,
      scale: 1.05,
      rotateY: 5,
      transition: {
        type: spring,
        stiffness: 400,
        damping: 25,
      },
    },
  };

  const glowVariants = {
    initial: { opacity: 0, scale: 0.8 },
    hover: {
      opacity: 1,
      scale: 1.2,
      transition: {
        duration: 0.3,
        ease: easeInOut,
      },
    },
  };

  return (
    <>
      <BottomNav />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
          <div
            className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,rgba(59,130,246,0.1),rgba(147,51,234,0.1),rgba(59,130,246,0.1))] animate-spin"
            style={{ animationDuration: "20s" }}
          />
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-1 h-1 bg-blue-400 rounded-full"
              initial={{
                x: `${particle.x}%`,
                y: `${particle.y}%`,
                opacity: 0,
                scale: 0,
              }}
              animate={{
                y: `${particle.y - 100}%`,
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 3,
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
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="inline-block mb-6"
            >
              <div className="relative">
                <Crown className="w-16 h-16 text-yellow-400 mx-auto" />
                <motion.div
                  className="absolute -inset-2 bg-yellow-400/20 rounded-full blur-xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
              </div>
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

            {/* Stats Bar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex justify-center items-center gap-8 mt-8 text-slate-300"
            >
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                <span>3,833 Total Votes</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-400" />
                <span>Blockchain Secured</span>
              </div>
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-purple-400" />
                <span>Web3 Verified</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Voting Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16"
          >
            {candidates.map((candidate, index) => (
              <motion.div
                key={candidate.id}
                variants={cardVariants}
                whileHover="hover"
                className="group relative perspective-1000"
              >
                {/* Glow Effect */}
                <motion.div
                  variants={glowVariants}
                  initial="initial"
                  whileHover="hover"
                  className={`absolute -inset-1 bg-gradient-to-r ${candidate.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition-all duration-500`}
                />

                {/* Progress Ring */}
                <div className="absolute -top-4 -right-4 z-20">
                  <motion.div
                    className="relative w-16 h-16"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 1 }}
                  >
                    <svg className="w-16 h-16 transform -rotate-90">
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="4"
                        fill="none"
                      />
                      <motion.circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke={`url(#gradient-${candidate.id})`}
                        strokeWidth="4"
                        fill="none"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: candidate.percentage / 100 }}
                        transition={{ duration: 2, delay: index * 0.2 }}
                        strokeDasharray="175.929"
                        strokeDashoffset="175.929"
                      />
                      <defs>
                        <linearGradient
                          id={`gradient-${candidate.id}`}
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#3B82F6" />
                          <stop offset="100%" stopColor="#8B5CF6" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-bold text-white">
                        {candidate.percentage}%
                      </span>
                    </div>
                  </motion.div>
                </div>

                <Card className="relative h-full bg-slate-800/50 backdrop-blur-xl border-slate-700/50 overflow-hidden group-hover:border-slate-600/50 transition-all duration-500">
                  {/* Animated Top Bar */}
                  <motion.div
                    className={`h-1 bg-gradient-to-r ${candidate.color}`}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  />

                  <CardHeader className="text-center pb-4 relative">
                    {/* Floating Icons */}
                    <motion.div
                      className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      animate={{
                        y: [0, -10, 0],
                        rotate: [0, 10, -10, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                    >
                      <Star className="w-4 h-4 text-yellow-400" />
                    </motion.div>

                    <motion.div
                      className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      animate={{
                        y: [0, -8, 0],
                        rotate: [0, -10, 10, 0],
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                        delay: 0.5,
                      }}
                    >
                      <Sparkles className="w-4 h-4 text-blue-400" />
                    </motion.div>

                    <motion.div
                      className="mx-auto mb-4 relative"
                      whileHover={{
                        scale: 1.1,
                        rotate: [0, -5, 5, 0],
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <Avatar className="w-24 h-24 border-4 border-white/20 shadow-2xl">
                        <AvatarImage
                          src={candidate.image || "/placeholder.svg"}
                          alt={candidate.name}
                        />
                        <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-slate-700 to-slate-800">
                          {candidate.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>

                      {/* Avatar Glow */}
                      <motion.div
                        className={`absolute inset-0 bg-gradient-to-r ${candidate.color} rounded-full blur-md opacity-0 group-hover:opacity-30`}
                        animate={{
                          scale: [1, 1.2, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }}
                      />
                    </motion.div>

                    <CardTitle className="text-2xl font-bold text-white mb-2">
                      {candidate.name}
                    </CardTitle>

                    <Badge
                      variant="secondary"
                      className="mx-auto w-fit bg-slate-700/50 text-slate-200 border-slate-600/50"
                    >
                      {candidate.party}
                    </Badge>

                    <CardDescription className="text-slate-300 mt-3 leading-relaxed">
                      {candidate.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Vote Stats */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <motion.div
                        className="text-center p-3 bg-slate-700/30 rounded-lg border border-slate-600/30"
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="text-2xl font-bold text-blue-400">
                          {candidate.votes.toLocaleString()}
                        </div>
                        <div className="text-slate-400">Votes</div>
                      </motion.div>
                      <motion.div
                        className="text-center p-3 bg-slate-700/30 rounded-lg border border-slate-600/30"
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="text-2xl font-bold text-green-400">
                          {candidate.supporters.toLocaleString()}
                        </div>
                        <div className="text-slate-400">Supporters</div>
                      </motion.div>
                    </div>

                    {/* Vote Button */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        onClick={() => handleVote(candidate)}
                        disabled={hasVoted || isVoting}
                        className={`w-full h-14 text-lg font-bold bg-gradient-to-r ${candidate.color} hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 relative overflow-hidden group`}
                      >
                        <motion.div
                          className="absolute inset-0 bg-white/20"
                          initial={{ x: "-100%" }}
                          whileHover={{ x: "100%" }}
                          transition={{ duration: 0.6 }}
                        />
                        <Vote className="w-5 h-5 mr-2" />
                        <span className="relative z-10">
                          {hasVoted
                            ? "Vote Cast!"
                            : isVoting
                            ? "Voting..."
                            : "Vote Now"}
                        </span>
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Voting Status */}
          <AnimatePresence>
            {(isVoting || hasVoted) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 50 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
              >
                <Card className="w-full max-w-md bg-slate-800/90 backdrop-blur-xl border-slate-700/50">
                  <CardContent className="p-8 text-center">
                    {isVoting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                          }}
                          className="mx-auto mb-6"
                        >
                          <Loader2 className="w-16 h-16 text-blue-400" />
                        </motion.div>
                        <h3 className="text-2xl font-bold text-white mb-4">
                          Processing Your Vote
                        </h3>
                        <p className="text-slate-300 mb-6">
                          Securing your vote on the blockchain...
                        </p>

                        {/* Progress Bar */}
                        <div className="w-full bg-slate-700 rounded-full h-3 mb-4">
                          <motion.div
                            className="bg-gradient-to-r from-blue-400 to-purple-400 h-3 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${votingProgress}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                        <p className="text-sm text-slate-400">
                          {votingProgress}% Complete
                        </p>
                      </>
                    ) : (
                      <>
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 15,
                          }}
                          className="mx-auto mb-6"
                        >
                          <CheckCircle className="w-20 h-20 text-green-400" />
                        </motion.div>

                        <motion.h3
                          className="text-3xl font-bold text-white mb-4"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          Vote Successfully Cast!
                        </motion.h3>

                        <motion.p
                          className="text-slate-300 mb-6"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                          Your vote for{" "}
                          <strong>{selectedCandidate?.name}</strong> has been
                          recorded on the blockchain.
                        </motion.p>

                        {/* Celebration Effects */}
                        <div className="absolute inset-0 pointer-events-none">
                          {[...Array(20)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                              initial={{
                                x: "50%",
                                y: "50%",
                                scale: 0,
                              }}
                              animate={{
                                x: `${50 + (Math.random() - 0.5) * 200}%`,
                                y: `${50 + (Math.random() - 0.5) * 200}%`,
                                scale: [0, 1, 0],
                                rotate: 360,
                              }}
                              transition={{
                                duration: 2,
                                delay: i * 0.1,
                                ease: "easeOut",
                              }}
                            />
                          ))}
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
