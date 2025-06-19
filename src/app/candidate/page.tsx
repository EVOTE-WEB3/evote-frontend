"use client";

import { Variants, easeInOut } from "framer-motion";
import { useState } from "react";
import { motion } from "framer-motion";
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

interface Candidate {
  id: number;
  name: string;
  party: string;
  position: string;
  image: string;
  description: string;
  experience: string[];
  achievements: string[];
  vision: string;
  age: number;
  location: string;
  supporters: number;
  color: string;
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
    experience: [
      "Former Governor of California (2018-2022)",
      "Senator (2012-2018)",
      "Environmental Law Attorney (2005-2012)",
    ],
    achievements: [
      "Reduced state carbon emissions by 40%",
      "Implemented universal healthcare program",
      "Created 500,000 green jobs",
    ],
    vision:
      "Building a sustainable future where every citizen has equal opportunities to thrive while protecting our planet for future generations.",
    age: 52,
    location: "San Francisco, CA",
    supporters: 2847,
    color: "bg-green-500",
  },
  {
    id: 2,
    name: "Michael Chen",
    party: "Innovation Party",
    position: "Presidential Candidate",
    image: "/placeholder.svg?height=300&width=300",
    description:
      "Tech entrepreneur and former mayor advocating for digital transformation.",
    experience: [
      "Mayor of Austin (2019-2023)",
      "CEO of TechForward Inc. (2010-2019)",
      "Software Engineer at Google (2005-2010)",
    ],
    achievements: [
      "Transformed Austin into a smart city",
      "Founded 3 successful startups",
      "Pioneered blockchain voting systems",
    ],
    vision:
      "Leveraging technology to create transparent, efficient governance that serves all citizens in the digital age.",
    age: 45,
    location: "Austin, TX",
    supporters: 3156,
    color: "bg-blue-500",
  },
  {
    id: 3,
    name: "Dr. Maria Rodriguez",
    party: "People's Unity",
    position: "Presidential Candidate",
    image: "/placeholder.svg?height=300&width=300",
    description:
      "Healthcare professional and community organizer fighting for accessible healthcare.",
    experience: [
      "Chief Medical Officer, State Health Dept (2020-2024)",
      "Emergency Room Physician (2008-2020)",
      "Community Health Advocate (2005-2008)",
    ],
    achievements: [
      "Led COVID-19 response strategy",
      "Established 50 community health centers",
      "Reduced infant mortality by 30%",
    ],
    vision:
      "Ensuring healthcare is a human right, not a privilege, while building stronger communities through unity and compassion.",
    age: 48,
    location: "Phoenix, AZ",
    supporters: 2634,
    color: "bg-purple-500",
  },
  {
    id: 4,
    name: "Robert Thompson",
    party: "Economic Freedom",
    position: "Presidential Candidate",
    image: "/placeholder.svg?height=300&width=300",
    description:
      "Business leader and former congressman focused on economic growth and job creation.",
    experience: [
      "U.S. Congressman (2016-2024)",
      "CEO of Thompson Industries (2005-2016)",
      "Small Business Owner (1995-2005)",
    ],
    achievements: [
      "Authored 15 bipartisan bills",
      "Created 10,000+ manufacturing jobs",
      "Reduced business regulations by 25%",
    ],
    vision:
      "Fostering economic prosperity through free enterprise, innovation, and reducing government interference in business.",
    age: 58,
    location: "Detroit, MI",
    supporters: 2891,
    color: "bg-orange-500",
  },
];

export default function CandidatesPage() {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: easeInOut,
      },
    },
    hover: {
      y: -10,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: easeInOut,
      },
    },
  };

  return (
    <>
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
              Learn about each candidate's vision, experience, and plans for the
              future. Your vote matters in shaping our tomorrow.
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
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                      className="mx-auto mb-4"
                    >
                      <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                        <AvatarImage
                          src={candidate.image || "/placeholder.svg"}
                          alt={candidate.name}
                        />
                        <AvatarFallback className="text-2xl font-bold">
                          {candidate.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    </motion.div>

                    <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                      {candidate.name}
                    </CardTitle>

                    <Badge variant="secondary" className="mx-auto w-fit">
                      {candidate.party}
                    </Badge>

                    <CardDescription className="text-base mt-2">
                      {candidate.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>Age: {candidate.age}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{candidate.location}</span>
                      </div>
                      <div className="flex items-center gap-2 col-span-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span>
                          {candidate.supporters.toLocaleString()} supporters
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="flex-1 group-hover:border-primary transition-colors"
                            onClick={() => setSelectedCandidate(candidate)}
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <div className="flex items-center gap-4 mb-4">
                              <Avatar className="w-16 h-16">
                                <AvatarImage
                                  src={candidate.image || "/placeholder.svg"}
                                  alt={candidate.name}
                                />
                                <AvatarFallback>
                                  {candidate.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <DialogTitle className="text-2xl">
                                  {candidate.name}
                                </DialogTitle>
                                <DialogDescription className="text-lg">
                                  {candidate.party} • {candidate.position}
                                </DialogDescription>
                              </div>
                            </div>
                          </DialogHeader>

                          <div className="space-y-6">
                            {/* Vision */}
                            <div>
                              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                                <Award className="w-5 h-5" />
                                Vision
                              </h3>
                              <p className="text-muted-foreground leading-relaxed">
                                {candidate.vision}
                              </p>
                            </div>

                            {/* Experience */}
                            <div>
                              <h3 className="text-lg font-semibold mb-3">
                                Experience
                              </h3>
                              <ul className="space-y-2">
                                {candidate.experience.map((exp, index) => (
                                  <li
                                    key={index}
                                    className="flex items-start gap-2"
                                  >
                                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                                    <span className="text-muted-foreground">
                                      {exp}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Achievements */}
                            <div>
                              <h3 className="text-lg font-semibold mb-3">
                                Key Achievements
                              </h3>
                              <ul className="space-y-2">
                                {candidate.achievements.map(
                                  (achievement, index) => (
                                    <li
                                      key={index}
                                      className="flex items-start gap-2"
                                    >
                                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                                      <span className="text-muted-foreground">
                                        {achievement}
                                      </span>
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                        <Vote className="w-4 h-4 mr-2" />
                        Vote Now
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
                <h2 className="text-2xl font-bold mb-4">
                  Ready to Make Your Choice?
                </h2>
                <p className="text-muted-foreground mb-6">
                  Every vote counts in shaping our future. Review the candidates
                  and cast your vote securely using blockchain technology.
                </p>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Vote className="w-5 h-5 mr-2" />
                  Go to Voting Page
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
}
