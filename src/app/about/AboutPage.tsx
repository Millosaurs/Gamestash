"use client";

import {
  Sparkles,
  Star,
  Shield,
  CheckCircle,
  Zap,
  Award,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/header";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const features = [
  {
    icon: Shield,
    title: "Report a problem",
    description:
      "You can report a problem regarding a product to help keep the platform safe.",
  },
  {
    icon: CheckCircle,
    title: "Developer’s Rating",
    description:
      "You can always check the developer’s rating before buying from them. Please be aware that developers are not manually verified by Gamestash.",
  },
  {
    icon: Zap,
    title: "Instant Delivery",
    description:
      "Get your setup configurations and guides delivered instantly after purchase.",
  },
  {
    icon: Award,
    title: "Premium Support",
    description:
      "Customer support is available to help you with any questions or issues.",
  },
];

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardHover = {
  rest: {
    scale: 1,
    boxShadow:
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  },
  hover: {
    scale: 1.03,
    boxShadow:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] },
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background font-sans antialiased overflow-hidden">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="py-24 bg-background relative"
      >
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-4 bg-primary text-primary-foreground border-0 px-3 py-1 text-sm animate-pulse-subtle">
              About us
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold text-foreground mb-6 font-display tracking-tight"
          >
            Built for gamers, by{" "}
            <span className="text-primary relative inline-block">
              gamers!
              <span className="absolute bottom-0 left-0 w-full h-1 bg-primary/30 rounded-full"></span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            We have a vision to create a marketplace where we gather the most
            talented gaming setup creators and share their valuable products for
            the benefit of all gamers.
          </motion.p>

          {/* Trustpilot-style rating */}
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex items-center justify-center gap-2 mb-8"
          >
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-5 h-5 fill-current text-yellow-400"
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              4.8 out of 5 based on 2,847 reviews
            </span>
          </motion.div> */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          ></motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      {/* <section className="py-16 relative bg-green-accent-50 dark:bg-green-accent-950">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&h=600&fit=crop&q=80')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-6 rounded-lg shadow-md">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2 font-display">
                  {stat.number}
                </div>
                <div className="text-xl font-semibold text-foreground mb-2">
                  {stat.label}
                </div>
                <p className="text-muted-foreground">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* What is Gamestash Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeIn}
        className="py-24 relative"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background pointer-events-none" />

        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="secondary" className="mb-4 px-3 py-1 text-sm">
              What is Gamestash?
            </Badge>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-3xl md:text-5xl font-bold text-foreground mb-6 font-display tracking-tight"
          >
            Gamestash is much more than a platform!
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="relative p-6 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 shadow-sm"
          >
            <p className="text-lg text-muted-foreground leading-relaxed">
              Gamestash is a platform that offers easy ways to set up your
              server. We help connect the developers of these setups with you,
              to help the gaming community grow stronger! We offer products
              ranging from free to premium, and many of these have had
              significant time and effort put into them.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Trusted Partners */}
      {/* <section className="py-16 bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12 font-display">
            These brands trust us
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {trustedPartners.map((partner, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-24 h-24 rounded-full bg-background border-2 border-border group-hover:border-primary transition-colors duration-200 flex items-center justify-center mb-3">
                  <Image
                    src={partner.logo || "/placeholder.svg"}
                    alt={partner.name}
                    width={64}
                    height={32}
                    className="w-16 h-16 object-contain rounded-full"
                  />
                </div>
                <h3 className="font-semibold text-foreground mb-1">
                  {partner.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {partner.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Why Choose Us */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="py-24 relative"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div variants={fadeIn} className="text-center mb-16">
            <Badge variant="outline" className="mb-4 px-3 py-1 text-sm">
              Why choose products from Gamestash?
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 font-display tracking-tight">
              With us you are always in{" "}
              <span className="text-primary relative inline-block">
                safe hands
                <span className="absolute bottom-0 left-0 w-full h-1 bg-primary/30 rounded-full"></span>
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We sell plugins, setups, configurations, and guides made to help
              your server grow. Please note: While we do our best to keep the
              platform clean, all products are uploaded by individual developers
              and are not manually scanned or verified for harmful content.
              Always use your own judgment before downloading.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                whileHover="hover"
                initial="rest"
                animate="rest"
              >
                <motion.div
                  whileHover={{
                    scale: 1.03,
                    boxShadow:
                      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                    transition: {
                      duration: 0.3,
                      ease: "easeOut",
                    },
                  }}
                  initial={{
                    scale: 1,
                    boxShadow:
                      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  }}
                >
                  <Card className="text-center h-full border border-border/50 overflow-hidden group">
                    <CardContent className="p-8 flex flex-col h-full">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                        <feature.icon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            variants={fadeIn}
            className="text-center bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 p-8 shadow-sm"
          >
            <p className="text-lg text-muted-foreground">
              We strive to keep our platform a safe place. If you experience any
              issues or believe a product is harmful or misleading, please
              contact us or use the report feature.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Custom Orders Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeIn}
        className="relative py-24 bg-gradient-to-br from-[#18181b] via-[#23272f] to-[#1e293b] overflow-hidden"
      >
        {/* Decorative background elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "loop",
              ease: "linear",
            }}
            className="absolute -top-40 -right-40 w-96 h-96"
          >
            <svg
              className="w-full h-full opacity-20"
              viewBox="0 0 400 400"
              fill="none"
            >
              <circle cx="200" cy="200" r="200" fill="url(#gradient1)" />
              <defs>
                <radialGradient
                  id="gradient1"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(200 200) rotate(90) scale(200)"
                >
                  <stop stopColor="#22d3ee" />
                  <stop offset="1" stopColor="#22d3ee" stopOpacity="0" />
                </radialGradient>
              </defs>
            </svg>
          </motion.div>

          <motion.div
            animate={{
              rotate: -360,
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              repeatType: "loop",
              ease: "linear",
            }}
            className="absolute -bottom-20 -left-20 w-80 h-80"
          >
            <svg
              className="w-full h-full opacity-10"
              viewBox="0 0 400 400"
              fill="none"
            >
              <circle cx="200" cy="200" r="200" fill="url(#gradient2)" />
              <defs>
                <radialGradient
                  id="gradient2"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(200 200) rotate(90) scale(200)"
                >
                  <stop stopColor="#1eb01a" />
                  <stop offset="1" stopColor="#1eb01a" stopOpacity="0" />
                </radialGradient>
              </defs>
            </svg>
          </motion.div>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Card */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white/5 backdrop-blur-md rounded-2xl shadow-xl p-10 border border-white/10 hover:border-white/20 transition-colors duration-300"
            >
              <div className="flex items-center gap-3 mb-6">
                <motion.div
                  animate={{
                    rotate: [0, 15, -15, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    repeatType: "loop",
                  }}
                  className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center"
                >
                  <svg
                    className="w-6 h-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.07-7.07l-1.41 1.41M6.34 17.66l-1.41 1.41m12.02 0l1.41-1.41M6.34 6.34L4.93 4.93"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.div>
                <h2 className="text-3xl md:text-4xl font-bold text-white font-display tracking-tight">
                  Custom Orders
                </h2>
              </div>
              <p className="text-lg text-slate-200 mb-8 leading-relaxed">
                Get your very own gaming setup designed to your exact needs! Our
                expert developers can create custom configurations, setups,
                plugins, and much more tailored specifically for you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="https://discord.gg/YhfMY3xXGg">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="lg"
                      className="bg-primary text-white hover:bg-primary/90 shadow-lg group"
                    >
                      Create Order
                      <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </motion.div>
                </Link>
              </div>
            </motion.div>

            {/* Images Grid */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 gap-4 hidden lg:grid"
            >
              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src="/placeholder.jpg"
                  alt="Custom setup example 1"
                  width={300}
                  height={200}
                  className="rounded-xl shadow-lg object-cover aspect-video border border-white/10 hover:border-white/30 transition-colors duration-300"
                />
              </motion.div>
              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src="/placeholder.jpg"
                  alt="Custom setup example 2"
                  width={300}
                  height={200}
                  className="rounded-xl shadow-lg object-cover aspect-video border border-white/10 hover:border-white/30 transition-colors duration-300"
                />
              </motion.div>
              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src="/placeholder.jpg"
                  alt="Custom setup example 3"
                  width={300}
                  height={200}
                  className="rounded-xl shadow-lg object-cover aspect-video border border-white/10 hover:border-white/30 transition-colors duration-300"
                />
              </motion.div>
              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src="/placeholder.jpg"
                  alt="Custom setup example 4"
                  width={300}
                  height={200}
                  className="rounded-xl shadow-lg object-cover aspect-video border border-white/10 hover:border-white/30 transition-colors duration-300"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Team Section */}
      {/* <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 font-display">
              Meet our team
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The passionate individuals behind Gamestash, working tirelessly to
              brings you the best gaming setup marketplace experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow duration-200"
              >
                <CardContent className="p-6">
                  <Image
                    src={member.avatar || "/placeholder.svg"}
                    alt={member.name}
                    width={96}
                    height={96}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="font-bold text-foreground mb-1">
                    {member.name}
                  </h3>
                  <p className="text-primary font-medium mb-2">{member.role}</p>
                  <p className="text-sm text-muted-foreground">
                    {member.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section> */}

      {/* Footer */}
      <motion.footer
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        className="border-t border-border/40 bg-muted/20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex items-center justify-center space-x-3 mb-6"
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "loop",
                }}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary"
              >
                <Sparkles className="h-6 w-6 text-primary-foreground" />
              </motion.div>
              <span className="font-bold text-2xl text-foreground font-display tracking-tight">
                Gamestash
              </span>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-muted-foreground mb-8 max-w-md text-lg"
            >
              The ultimate marketplace for gaming setups. Discover, buy, and
              sell the perfect gaming battlestation.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex items-center gap-6 text-sm text-muted-foreground"
            >
              <span>© 2025 Gamestash. All rights reserved.</span>
            </motion.div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
