// src/app/candidate/page.tsx
"use client";

import { Variants, easeInOut, motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useWeb3 } from "@/contexts/Web3Provider"; // Import hook Web3
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MapPin,
  Calendar,
  Users,
  Award,
  ExternalLink,
  Vote,
} from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useRouter } from "next/navigation";

// Tipe data gabungan (On-chain + Off-chain)
interface Candidate {
  id: number;
  name: string; // Dari blockchain
  voteCount: number; // Dari blockchain
  party?: string; // Data statis (opsional)
  position?: string; // Data statis (opsional)
  image?: string; // Data statis (opsional)
  description?: string; // Data statis (opsional)
  experience?: string[]; // Data statis (opsional)
  achievements?: string[]; // Data statis (opsional)
  vision?: string; // Data statis (opsional)
  age?: number; // Data statis (opsional)
  location?: string; // Data statis (opsional)
  color?: string; // Data statis (opsional)
}

const staticCandidateDetails = [
  { // Indeks 0
    party: "Progressive Alliance",
    position: "Presidential Candidate",
    image: "/placeholder.svg?height=300&width=300",
    description: "Experienced leader focused on sustainable development and social justice.",
    experience: ["Former Governor of California (2018-2022)", "Senator (2012-2018)"],
    achievements: ["Reduced state carbon emissions by 40%", "Implemented universal healthcare program"],
    vision: "Building a sustainable future where every citizen has equal opportunities.",
    age: 52,
    location: "San Francisco, CA",
    color: "bg-green-500",
  },
  { // Indeks 1
    party: "Innovation Party",
    position: "Presidential Candidate",
    image: "/placeholder.svg?height=300&width=300",
    description: "Tech entrepreneur advocating for digital transformation.",
    experience: ["Mayor of Austin (2019-2023)", "CEO of TechForward Inc. (2010-2019)"],
    achievements: ["Transformed Austin into a smart city", "Pioneered blockchain voting systems"],
    vision: "Leveraging technology to create transparent, efficient governance.",
    age: 45,
    location: "Austin, TX",
    color: "bg-blue-500",
  },
  { // Indeks 2
    party: "People's Unity",
    position: "Presidential Candidate",
    image: "/placeholder.svg?height=300&width=300",
    description: "Healthcare professional fighting for accessible healthcare.",
    experience: ["Chief Medical Officer, State Health Dept (2020-2024)", "Emergency Room Physician (2008-2020)"],
    achievements: ["Led COVID-19 response strategy", "Established 50 community health centers"],
    vision: "Ensuring healthcare is a human right, not a privilege.",
    age: 48,
    location: "Phoenix, AZ",
    color: "bg-purple-500",
  },
];


export default function CandidatesPage() {
  const { account, contract } = useWeb3();
  const router = useRouter();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState("");

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 5000);
  };

  useEffect(() => {
    const fetchCandidates = async () => {
      if (contract) {
        setIsLoading(true);
        try {
          const [names, voteCounts] = await contract.getResults();
          
          const combinedData = names.map((name: string, index: number) => {
            // Cocokkan berdasarkan indeks
            const staticData = staticCandidateDetails[index] || {};
            return {
              id: index,
              name: name, // Data dari blockchain
              voteCount: Number(voteCounts[index]), // Data dari blockchain
              ...staticData, // Sisa data dari array statis
            };
          });

          setCandidates(combinedData);
        } catch (error) {
          console.error("Gagal mengambil data kandidat:", error);
          showNotification("Gagal memuat data kandidat.");
        }
        setIsLoading(false);
      }
    };
    fetchCandidates();
  }, [contract]);

  const handleVote = async (candidateId: number) => {
    if (!account) {
      showNotification("Harap hubungkan wallet Anda terlebih dahulu.");
      return;
    }
    if (!contract) {
      showNotification("Koneksi ke smart contract belum siap.");
      return;
    }
      
    setIsLoading(true);
    showNotification("Memproses suara Anda...");
    try {
      const tx = await contract.vote(candidateId);
      await tx.wait();
      showNotification("Terima kasih! Suara Anda telah berhasil dicatat.");
      // Refresh data setelah vote
      const [names, voteCounts] = await contract.getResults();
      const combinedData = names.map((name: string, index: number) => {
        const staticData = staticCandidateDetails[index] || {};
        return { id: index, name, voteCount: Number(voteCounts[index]), ...staticData };
      });
      setCandidates(combinedData);
    } catch (error: any) {
      console.error("Gagal memberikan suara:", error);
      showNotification(error?.reason || "Transaksi pemberian suara gagal.");
    }
    setIsLoading(false);
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: easeInOut },
    },
    hover: {
      y: -10,
      scale: 1.02,
      transition: { duration: 0.3, ease: easeInOut },
    },
  };

  return (
    <>
      {notification && (
        <div className="fixed top-24 right-5 p-4 bg-blue-600 text-white rounded-lg shadow-lg z-50">
          {notification}
        </div>
      )}
      {isLoading && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
           <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
         </div>
      )}
      <BottomNav />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Meet the Candidates
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Learn about each candidate's vision, experience, and plans for the future.
            </p>
          </motion.div>

          {/* Candidates Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto"
          >
            {candidates.map((candidate) => (
              <motion.div
                key={candidate.id}
                variants={cardVariants}
                whileHover="hover"
                className="group relative"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-lg blur opacity-0 group-hover:opacity-60 transition duration-300 group-hover:duration-200"></div>
                <Card className="relative h-full overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white/90 backdrop-blur-sm dark:bg-slate-800/90 border border-white/20 dark:border-slate-700/50">
                  <div className={`h-2 ${candidate.color}`} />
                  <CardHeader className="text-center pb-4">
                    <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.3 }} className="mx-auto mb-4">
                      <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                        <AvatarImage src={candidate.image || "/placeholder.svg"} alt={candidate.name} />
                        <AvatarFallback className="text-2xl font-bold">{candidate.name?.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                      </Avatar>
                    </motion.div>
                    <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-100">{candidate.name}</CardTitle>
                    <Badge variant="secondary" className="mx-auto w-fit">{candidate.party}</Badge>
                    <CardDescription className="text-base mt-2">{candidate.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-muted-foreground" /><span>Age: {candidate.age}</span></div>
                      <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-muted-foreground" /><span>{candidate.location}</span></div>
                      <div className="flex items-center gap-2 col-span-2"><Users className="w-4 h-4 text-muted-foreground" /><span>{(candidate.voteCount || 0).toLocaleString()} suara</span></div>
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="flex-1 group-hover:border-primary transition-colors">
                            <ExternalLink className="w-4 h-4 mr-2" /> View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                           {/* Konten Dialog Anda bisa diisi di sini */}
                        </DialogContent>
                      </Dialog>
                      <Button onClick={() => handleVote(candidate.id)} className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                        <Vote className="w-4 h-4 mr-2" /> Vote Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-16"
          >
            <Card className="max-w-2xl mx-auto bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-0">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">Ready to Make Your Choice?</h2>
                <p className="text-muted-foreground mb-6">Every vote counts in shaping our future. Review the candidates and cast your vote securely using blockchain technology.</p>
                <Button size="lg" onClick={() => router.push('/vote')} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Vote className="w-5 h-5 mr-2" /> Go to Voting Page
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
}