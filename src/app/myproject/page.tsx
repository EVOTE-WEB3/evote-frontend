"use client";

import { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useInView,
  useScroll,
  useTransform,
  spring,
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
  Code2,
  Rocket,
  Users,
  Star,
  Github,
  ExternalLink,
  Calendar,
  Award,
  Globe,
  Database,
  Brain,
  Shield,
  Palette,
  Mail,
  Linkedin,
  Twitter,
  ChevronRight,
  Target,
  Eye,
  Download,
} from "lucide-react";

interface Project {
  id: number;
  title: string;
  description: string;
  longDescription: string;
  image: string;
  category: string;
  technologies: string[];
  status: "completed" | "in-progress" | "planning";
  featured: boolean;
  stats: {
    users: number;
    downloads: number;
    stars: number;
    views: number;
  };
  links: {
    github?: string;
    live?: string;
    demo?: string;
  };
  timeline: string;
  color: string;
  achievements: string[];
}

interface Skill {
  name: string;
  level: number;
  icon: any;
  color: string;
  projects: number;
}

const projects: Project[] = [
  {
    id: 1,
    title: "Web3 Voting Platform",
    description: "Decentralized voting system built on blockchain technology",
    longDescription:
      "A revolutionary voting platform that leverages blockchain technology to ensure transparent, secure, and immutable elections. Features real-time results, candidate management, and voter verification.",
    image: "/placeholder.svg?height=400&width=600",
    category: "Blockchain",
    technologies: [
      "Next.js",
      "Solidity",
      "Web3.js",
      "TypeScript",
      "Tailwind CSS",
    ],
    status: "completed",
    featured: true,
    stats: {
      users: 15420,
      downloads: 8900,
      stars: 342,
      views: 45600,
    },
    links: {
      github: "https://github.com/username/web3-voting",
      live: "https://web3-voting.vercel.app",
      demo: "https://demo.web3-voting.com",
    },
    timeline: "6 months",
    color: "from-blue-500 to-purple-600",
    achievements: [
      "Best Blockchain Project 2024",
      "Featured on Product Hunt",
      "10k+ Active Users",
    ],
  },
  {
    id: 2,
    title: "AI-Powered Analytics Dashboard",
    description: "Machine learning dashboard for business intelligence",
    longDescription:
      "An intelligent analytics platform that uses AI to provide actionable insights from complex data sets. Features predictive analytics, real-time monitoring, and automated reporting.",
    image: "/placeholder.svg?height=400&width=600",
    category: "AI/ML",
    technologies: ["React", "Python", "TensorFlow", "D3.js", "FastAPI"],
    status: "completed",
    featured: true,
    stats: {
      users: 8750,
      downloads: 12300,
      stars: 189,
      views: 32100,
    },
    links: {
      github: "https://github.com/username/ai-dashboard",
      live: "https://ai-dashboard.vercel.app",
    },
    timeline: "4 months",
    color: "from-green-500 to-teal-600",
    achievements: [
      "AI Innovation Award",
      "Featured in TechCrunch",
      "500+ Enterprise Clients",
    ],
  },
  {
    id: 3,
    title: "Mobile E-Commerce App",
    description: "Cross-platform shopping app with AR features",
    longDescription:
      "A cutting-edge mobile commerce application featuring augmented reality product visualization, AI-powered recommendations, and seamless payment integration.",
    image: "/placeholder.svg?height=400&width=600",
    category: "Mobile",
    technologies: ["React Native", "Node.js", "MongoDB", "AR.js", "Stripe"],
    status: "in-progress",
    featured: false,
    stats: {
      users: 25600,
      downloads: 45200,
      stars: 567,
      views: 78900,
    },
    links: {
      github: "https://github.com/username/mobile-ecommerce",
      demo: "https://demo.mobile-app.com",
    },
    timeline: "8 months",
    color: "from-pink-500 to-rose-600",
    achievements: [
      "App Store Featured",
      "Google Play Editor's Choice",
      "1M+ Downloads",
    ],
  },
  {
    id: 4,
    title: "Cloud Infrastructure Manager",
    description: "DevOps automation platform for cloud deployment",
    longDescription:
      "A comprehensive DevOps platform that automates cloud infrastructure management, deployment pipelines, and monitoring across multiple cloud providers.",
    image: "/placeholder.svg?height=400&width=600",
    category: "DevOps",
    technologies: ["Docker", "Kubernetes", "AWS", "Terraform", "Go"],
    status: "completed",
    featured: false,
    stats: {
      users: 3420,
      downloads: 7800,
      stars: 234,
      views: 18500,
    },
    links: {
      github: "https://github.com/username/cloud-manager",
      live: "https://cloud-manager.com",
    },
    timeline: "5 months",
    color: "from-orange-500 to-red-600",
    achievements: [
      "DevOps Tool of the Year",
      "Open Source Contributor",
      "Enterprise Adoption",
    ],
  },
  {
    id: 5,
    title: "Social Media Analytics",
    description: "Real-time social media monitoring and analytics",
    longDescription:
      "Advanced social media analytics platform that provides real-time insights, sentiment analysis, and competitor tracking across multiple social platforms.",
    image: "/placeholder.svg?height=400&width=600",
    category: "Analytics",
    technologies: ["Vue.js", "Python", "Redis", "PostgreSQL", "Chart.js"],
    status: "planning",
    featured: false,
    stats: {
      users: 0,
      downloads: 0,
      stars: 0,
      views: 1200,
    },
    links: {
      github: "https://github.com/username/social-analytics",
    },
    timeline: "3 months",
    color: "from-purple-500 to-indigo-600",
    achievements: [
      "Concept Phase",
      "Market Research Complete",
      "Funding Secured",
    ],
  },
];

const skills: Skill[] = [
  {
    name: "React/Next.js",
    level: 95,
    icon: Code2,
    color: "from-blue-400 to-blue-600",
    projects: 12,
  },
  {
    name: "TypeScript",
    level: 90,
    icon: Code2,
    color: "from-blue-500 to-indigo-600",
    projects: 10,
  },
  {
    name: "Node.js",
    level: 88,
    icon: Database,
    color: "from-green-400 to-green-600",
    projects: 8,
  },
  {
    name: "Python",
    level: 85,
    icon: Brain,
    color: "from-yellow-400 to-orange-600",
    projects: 6,
  },
  {
    name: "Blockchain",
    level: 80,
    icon: Shield,
    color: "from-purple-400 to-purple-600",
    projects: 4,
  },
  {
    name: "UI/UX Design",
    level: 92,
    icon: Palette,
    color: "from-pink-400 to-rose-600",
    projects: 15,
  },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "CTO at TechCorp",
    avatar: "/placeholder.svg?height=100&width=100",
    content:
      "Exceptional work quality and innovative solutions. The blockchain voting platform exceeded our expectations.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Product Manager at StartupXYZ",
    avatar: "/placeholder.svg?height=100&width=100",
    content:
      "Outstanding technical skills and great communication. Delivered the project ahead of schedule.",
    rating: 5,
  },
  {
    name: "Dr. Maria Rodriguez",
    role: "Research Director",
    avatar: "/placeholder.svg?height=100&width=100",
    content:
      "The AI analytics dashboard transformed how we analyze our data. Highly recommended!",
    rating: 5,
  },
];

export default function PortfolioPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; y: number; color: string }>
  >([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const heroRef = useRef(null);
  const projectsRef = useRef(null);
  const skillsRef = useRef(null);
  const testimonialsRef = useRef(null);

  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const isHeroInView = useInView(heroRef, { once: true });
  const isProjectsInView = useInView(projectsRef, { once: true });
  const isSkillsInView = useInView(skillsRef, { once: true });
  const isTestimonialsInView = useInView(testimonialsRef, { once: true });

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Particle system
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles((prev) => [
        ...prev.slice(-30),
        {
          id: Date.now(),
          x: Math.random() * 100,
          y: Math.random() * 100,
          color: [
            "from-blue-400",
            "from-purple-400",
            "from-pink-400",
            "from-green-400",
          ][Math.floor(Math.random() * 4)],
        },
      ]);
    }, 300);

    return () => clearInterval(interval);
  }, []);

  const categories = [
    "all",
    "Blockchain",
    "AI/ML",
    "Mobile",
    "DevOps",
    "Analytics",
  ];

  const filteredProjects =
    selectedCategory === "all"
      ? projects
      : projects.filter((p) => p.category === selectedCategory);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Advanced Background Effects */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_70%)]"
          style={{ y, opacity }}
        />
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,rgba(59,130,246,0.1),rgba(147,51,234,0.1),rgba(236,72,153,0.1),rgba(34,197,94,0.1),rgba(59,130,246,0.1))]" />

        {/* Interactive Mouse Follower */}
        <motion.div
          className="absolute w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl pointer-events-none"
          animate={{
            x: mousePosition.x - 192,
            y: mousePosition.y - 192,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 30 }}
        />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className={`absolute w-2 h-2 rounded-full bg-gradient-to-r ${particle.color} to-transparent blur-sm`}
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
        {/* Hero Section */}
        <motion.div
          ref={heroRef}
          initial={{ opacity: 0 }}
          animate={isHeroInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={
              isHeroInView
                ? { scale: 1, rotate: 0 }
                : { scale: 0, rotate: -180 }
            }
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.2,
            }}
            className="inline-block mb-8"
          >
            <div className="relative">
              <motion.div
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 20,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
                className="w-24 h-24 mx-auto mb-6"
              >
                <div className="w-full h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full p-1">
                  <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center">
                    <Rocket className="w-10 h-10 text-white" />
                  </div>
                </div>
              </motion.div>

              {/* Orbiting Icons */}
              {[Code2, Database, Brain, Shield, Palette, Globe].map(
                (Icon, index) => (
                  <motion.div
                    key={index}
                    className="absolute w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center"
                    animate={{
                      rotate: 360,
                    }}
                    transition={{
                      duration: 15,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                      delay: index * 0.5,
                    }}
                    style={{
                      top: "50%",
                      left: "50%",
                      transformOrigin: `${40 + index * 10}px 0px`,
                      transform: `translate(-50%, -50%) rotate(${
                        index * 60
                      }deg)`,
                    }}
                  >
                    <Icon className="w-4 h-4 text-white" />
                  </motion.div>
                )
              )}
            </div>
          </motion.div>

          <motion.h1
            className="text-6xl md:text-8xl font-bold mb-6"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={
              isHeroInView
                ? { scale: 1, opacity: 1 }
                : { scale: 0.5, opacity: 0 }
            }
            transition={{
              duration: 1.2,
              ease: "easeOut",
              delay: 0.5,
            }}
          >
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              MY PROJECTS
            </span>
          </motion.h1>

          <motion.p
            className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={
              isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            Innovative solutions crafted with cutting-edge technologies. From
            blockchain platforms to AI-powered applications, each project
            represents a journey of creativity and technical excellence.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={
              isHeroInView
                ? { opacity: 1, scale: 1 }
                : { opacity: 0, scale: 0.8 }
            }
            transition={{ duration: 0.8, delay: 1 }}
            className="flex justify-center items-center gap-8 text-slate-300"
          >
            {[
              { icon: Code2, label: "Projects", value: "15+" },
              { icon: Users, label: "Happy Clients", value: "50+" },
              { icon: Award, label: "Awards", value: "8" },
              { icon: Star, label: "GitHub Stars", value: "1.2k+" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                whileHover={{ scale: 1.1, y: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <motion.div
                  className="w-12 h-12 mx-auto mb-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <stat.icon className="w-6 h-6 text-white" />
                </motion.div>
                <div className="text-2xl font-bold text-white">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={
            isProjectsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
          }
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-12"
        >
          <div className="flex flex-wrap gap-3 p-2 bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50">
            {categories.map((category) => (
              <motion.button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category === "all" ? "All Projects" : category}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          ref={projectsRef}
          variants={containerVariants}
          initial="hidden"
          animate={isProjectsInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                variants={itemVariants}
                whileHover="hover"
                className="group relative"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                  delay: index * 0.1,
                }}
              >
                {/* Featured Badge */}
                {project.featured && (
                  <motion.div
                    className="absolute -top-3 -right-3 z-20"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 15,
                      delay: index * 0.1 + 0.5,
                    }}
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                  </motion.div>
                )}

                {/* Status Indicator */}
                <motion.div
                  className="absolute top-4 left-4 z-20"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  <Badge
                    variant="secondary"
                    className={`${
                      project.status === "completed"
                        ? "bg-green-500/20 text-green-400 border-green-500/30"
                        : project.status === "in-progress"
                        ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                        : "bg-orange-500/20 text-orange-400 border-orange-500/30"
                    }`}
                  >
                    {project.status === "completed"
                      ? "✓ Completed"
                      : project.status === "in-progress"
                      ? "⚡ In Progress"
                      : "📋 Planning"}
                  </Badge>
                </motion.div>

                {/* Glow Effect */}
                <motion.div
                  className={`absolute -inset-1 bg-gradient-to-r ${project.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-all duration-500`}
                  variants={cardHoverVariants}
                />

                <Card className="relative h-full bg-slate-800/50 backdrop-blur-xl border-slate-700/50 hover:border-slate-600/50 transition-all duration-500 overflow-hidden">
                  {/* Project Image */}
                  <div className="relative h-48 overflow-hidden">
                    <motion.img
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />

                    {/* Floating Tech Icons */}
                    <div className="absolute bottom-4 left-4 flex gap-2">
                      {project.technologies
                        .slice(0, 3)
                        .map((tech, techIndex) => (
                          <motion.div
                            key={tech}
                            className="w-8 h-8 bg-slate-800/80 backdrop-blur-sm rounded-full flex items-center justify-center border border-slate-600/50"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              delay: index * 0.1 + techIndex * 0.1 + 0.8,
                            }}
                            whileHover={{ scale: 1.2, rotate: 360 }}
                          >
                            <Code2 className="w-4 h-4 text-blue-400" />
                          </motion.div>
                        ))}
                      {project.technologies.length > 3 && (
                        <div className="w-8 h-8 bg-slate-800/80 backdrop-blur-sm rounded-full flex items-center justify-center border border-slate-600/50 text-xs text-slate-300">
                          +{project.technologies.length - 3}
                        </div>
                      )}
                    </div>
                  </div>

                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-xl text-white group-hover:text-blue-400 transition-colors">
                        {project.title}
                      </CardTitle>
                      <Badge
                        variant="outline"
                        className="text-xs border-slate-600 text-slate-300"
                      >
                        {project.category}
                      </Badge>
                    </div>
                    <CardDescription className="text-slate-300 leading-relaxed">
                      {project.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <motion.div
                        className="text-center p-2 bg-slate-700/30 rounded-lg border border-slate-600/30"
                        whileHover={{
                          scale: 1.05,
                          backgroundColor: "rgba(51, 65, 85, 0.5)",
                        }}
                      >
                        <div className="flex items-center justify-center gap-1 text-blue-400 mb-1">
                          <Users className="w-4 h-4" />
                          <span className="font-bold">
                            {project.stats.users.toLocaleString()}
                          </span>
                        </div>
                        <div className="text-slate-400 text-xs">Users</div>
                      </motion.div>
                      <motion.div
                        className="text-center p-2 bg-slate-700/30 rounded-lg border border-slate-600/30"
                        whileHover={{
                          scale: 1.05,
                          backgroundColor: "rgba(51, 65, 85, 0.5)",
                        }}
                      >
                        <div className="flex items-center justify-center gap-1 text-green-400 mb-1">
                          <Star className="w-4 h-4" />
                          <span className="font-bold">
                            {project.stats.stars}
                          </span>
                        </div>
                        <div className="text-slate-400 text-xs">Stars</div>
                      </motion.div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedProject(project)}
                        className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700 group"
                      >
                        <Eye className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                        Details
                      </Button>
                      {project.links.live && (
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Live
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Skills Section */}
        <motion.div
          ref={skillsRef}
          variants={containerVariants}
          initial="hidden"
          animate={isSkillsInView ? "visible" : "hidden"}
          className="mb-20"
        >
          <motion.h2
            className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
            variants={itemVariants}
          >
            Technical Expertise
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group"
              >
                <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 hover:border-slate-600/50 transition-all duration-500 overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <motion.div
                        className={`p-3 rounded-lg bg-gradient-to-r ${skill.color}`}
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                      >
                        <skill.icon className="w-6 h-6 text-white" />
                      </motion.div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {skill.name}
                        </h3>
                        <p className="text-sm text-slate-400">
                          {skill.projects} projects
                        </p>
                      </div>
                    </div>

                    {/* Skill Level */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-300">Proficiency</span>
                        <span className="text-white font-semibold">
                          {skill.level}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
                        <motion.div
                          className={`h-full bg-gradient-to-r ${skill.color} relative`}
                          initial={{ width: 0 }}
                          animate={
                            isSkillsInView
                              ? { width: `${skill.level}%` }
                              : { width: 0 }
                          }
                          transition={{
                            duration: 1.5,
                            delay: index * 0.1,
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
                              delay: index * 0.2,
                            }}
                          />
                        </motion.div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Testimonials */}
        <motion.div
          ref={testimonialsRef}
          variants={containerVariants}
          initial="hidden"
          animate={isTestimonialsInView ? "visible" : "hidden"}
          className="mb-20"
        >
          <motion.h2
            className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent"
            variants={itemVariants}
          >
            Client Testimonials
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05, rotateY: 5 }}
                className="group"
              >
                <Card className="bg-slate-800/50 backdrop-blur-xl border-slate-700/50 hover:border-slate-600/50 transition-all duration-500 h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar className="w-12 h-12 border-2 border-blue-400/50">
                        <AvatarImage
                          src={testimonial.avatar || "/placeholder.svg"}
                          alt={testimonial.name}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                          {testimonial.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="text-white font-semibold">
                          {testimonial.name}
                        </h4>
                        <p className="text-slate-400 text-sm">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 + i * 0.1 }}
                        >
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        </motion.div>
                      ))}
                    </div>

                    <p className="text-slate-300 leading-relaxed">
                      {testimonial.content}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <Card className="max-w-4xl mx-auto bg-gradient-to-r from-blue-900/50 to-purple-900/50 backdrop-blur-xl border-slate-700/50">
            <CardContent className="p-12">
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className="mb-8"
              >
                <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Rocket className="w-10 h-10 text-white" />
                </div>
              </motion.div>

              <h2 className="text-4xl font-bold text-white mb-6">
                Ready to Collaborate?
              </h2>
              <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                Let's build something amazing together. Whether you have a
                project in mind or want to discuss opportunities, I'm always
                excited to take on new challenges.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-lg px-8 py-4"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Get In Touch
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700 text-lg px-8 py-4"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Resume
                </Button>
              </div>

              {/* Social Links */}
              <div className="flex justify-center gap-6 mt-8">
                {[
                  { icon: Github, href: "#", label: "GitHub" },
                  { icon: Linkedin, href: "#", label: "LinkedIn" },
                  { icon: Twitter, href: "#", label: "Twitter" },
                  { icon: Mail, href: "#", label: "Email" },
                ].map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    className="w-12 h-12 bg-slate-700/50 hover:bg-slate-600/50 rounded-full flex items-center justify-center text-slate-300 hover:text-white transition-all duration-300"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="bg-slate-800/95 backdrop-blur-xl border-slate-700/50">
                <CardContent className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-2">
                        {selectedProject.title}
                      </h2>
                      <p className="text-slate-300">
                        {selectedProject.longDescription}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedProject(null)}
                      className="text-slate-400 hover:text-white"
                    >
                      ✕
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <img
                        src={selectedProject.image || "/placeholder.svg"}
                        alt={selectedProject.title}
                        className="w-full h-64 object-cover rounded-lg mb-6"
                      />

                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-2">
                            Technologies Used
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedProject.technologies.map((tech) => (
                              <Badge
                                key={tech}
                                variant="secondary"
                                className="bg-slate-700/50 text-slate-200"
                              >
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-white mb-2">
                            Achievements
                          </h3>
                          <ul className="space-y-2">
                            {selectedProject.achievements.map(
                              (achievement, index) => (
                                <li
                                  key={index}
                                  className="flex items-start gap-2 text-slate-300"
                                >
                                  <Award className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                                  {achievement}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        {[
                          {
                            icon: Users,
                            label: "Users",
                            value: selectedProject.stats.users.toLocaleString(),
                          },
                          {
                            icon: Download,
                            label: "Downloads",
                            value:
                              selectedProject.stats.downloads.toLocaleString(),
                          },
                          {
                            icon: Star,
                            label: "Stars",
                            value: selectedProject.stats.stars.toString(),
                          },
                          {
                            icon: Eye,
                            label: "Views",
                            value: selectedProject.stats.views.toLocaleString(),
                          },
                        ].map((stat) => (
                          <div
                            key={stat.label}
                            className="text-center p-4 bg-slate-700/30 rounded-lg border border-slate-600/30"
                          >
                            <stat.icon className="w-6 h-6 mx-auto mb-2 text-blue-400" />
                            <div className="text-2xl font-bold text-white">
                              {stat.value}
                            </div>
                            <div className="text-sm text-slate-400">
                              {stat.label}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-slate-300">
                          <Calendar className="w-4 h-4" />
                          <span>Timeline: {selectedProject.timeline}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-300">
                          <Target className="w-4 h-4" />
                          <span>Category: {selectedProject.category}</span>
                        </div>
                      </div>

                      <div className="flex gap-4 mt-8">
                        {selectedProject.links.github && (
                          <Button className="flex-1 bg-slate-700 hover:bg-slate-600">
                            <Github className="w-4 h-4 mr-2" />
                            GitHub
                          </Button>
                        )}
                        {selectedProject.links.live && (
                          <Button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Live Demo
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
