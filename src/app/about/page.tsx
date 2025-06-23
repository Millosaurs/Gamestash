"use client";

import { Sparkles, Star, Shield, CheckCircle, Zap, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/header";

const stats = [
  {
    number: "12.5k+",
    label: "Satisfied Customers",
    description:
      "We have helped 12,500+ gamers find their perfect setup since our launch",
  },
  {
    number: "5+",
    label: "Years of Experience",
    description:
      "Half a decade of expertise in gaming setup curation and marketplace innovation",
  },
  {
    number: "25k+",
    label: "Discord Members",
    description:
      "Join our thriving community of gaming enthusiasts and setup creators",
  },
];

const trustedPartners = [
  {
    name: "Razer",
    logo: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=120&h=60&fit=crop&q=80",
    description: "Gaming peripherals",
  },
  {
    name: "Corsair",
    logo: "https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=120&h=60&fit=crop&q=80",
    description: "PC components",
  },
  {
    name: "SteelSeries",
    logo: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=120&h=60&fit=crop&q=80",
    description: "Gaming gear",
  },
  {
    name: "NZXT",
    logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=120&h=60&fit=crop&q=80",
    description: "PC cases & cooling",
  },
  {
    name: "HyperX",
    logo: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=120&h=60&fit=crop&q=80",
    description: "Gaming accessories",
  },
];

const features = [
  {
    icon: Shield,
    title: "Verified Quality",
    description:
      "Every setup goes through our rigorous quality verification process before being listed.",
  },
  {
    icon: CheckCircle,
    title: "Trusted Sellers",
    description:
      "All our developers are verified professionals with proven track records.",
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
      "24/7 customer support to help you with any questions or issues.",
  },
];

const teamMembers = [
  {
    name: "Alex Chen",
    role: "Founder & CEO",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face",
    description: "Gaming enthusiast with 10+ years in the industry",
  },
  {
    name: "Sarah Johnson",
    role: "Head of Design",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    description: "UI/UX expert specializing in gaming interfaces",
  },
  {
    name: "Mike Rodriguez",
    role: "Community Manager",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    description: "Professional gamer and content creator",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="py-20 bg-background">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 bg-primary text-primary-foreground border-0">
            About us
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 font-display">
            Built for gamers, by <span className="text-primary">gamers!</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            We have a vision to create a marketplace where we gather the most
            talented gaming setup creators and share their valuable products for
            the benefit of all gamers.
          </p>

          {/* Trustpilot-style rating */}
          <div className="flex items-center justify-center gap-2 mb-8">
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
          </div>
          <Button variant="default" size="lg">
            Learn More
          </Button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 relative bg-green-accent-50 dark:bg-green-accent-950">
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
      </section>

      {/* What is Gamestash Section */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="secondary" className="mb-4">
            What is SkriptStore?
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 font-display">
            Gamestash is much more than a platform!
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Gamestash is a platform that sells everything that goes into the
            perfect gaming setup. On our marketplace you can buy products within
            several different categories, and from several different skilled
            creators and developers. From RGB lighting configurations to
            complete battlestation blueprints, we have everything you need to
            create your dream gaming environment.
          </p>
        </div>
      </section>

      {/* Trusted Partners */}
      <section className="py-16 bg-muted/20">
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
                  <img
                    src={partner.logo || "/placeholder.svg"}
                    alt={partner.name}
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
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              Why choose products from Gamestash?
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 font-display">
              With us you are always in safe hands.
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We sell plugins, ready-made setups, configurations & quality
              guides that just work. All products that are put up for sale are
              quality checked and verified. You can therefore expect that the
              products just work, and you get what you pay for.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow duration-200"
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <p className="text-muted-foreground mb-6">
              All developers have gone through a longer process to become
              "Verified" - at the same time, each individual product is reviewed
              so that we can ensure the quality we want,{" "}
              <strong>every time!</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Custom Orders Section */}
      <section className="relative py-20 bg-gradient-to-br from-[#18181b] via-[#23272f] to-[#1e293b] overflow-hidden">
        {/* Optional: Decorative background shapes */}
        <div className="absolute inset-0 pointer-events-none">
          <svg
            className="absolute top-0 right-0 opacity-20"
            width="400"
            height="400"
            fill="none"
            viewBox="0 0 400 400"
          >
            <circle cx="200" cy="200" r="200" fill="#22d3ee" />
          </svg>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Card */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl shadow-xl p-10 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <svg
                  className="w-8 h-8 text-primary"
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
                <h2 className="text-3xl md:text-4xl font-bold text-white font-display">
                  Custom Orders
                </h2>
              </div>
              <p className="text-lg text-slate-200 mb-8 leading-relaxed">
                Get your very own gaming setup designed to your exact needs! Our
                expert developers can create custom configurations, lighting
                setups, and complete battlestation designs tailored specifically
                for you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-primary text-white hover:bg-primary/90 shadow-lg"
                >
                  Create Order
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/10"
                >
                  Read More
                </Button>
              </div>
            </div>
            {/* Images */}
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=300&h=200&fit=crop&q=80"
                alt="Custom setup example 1"
                className="rounded-xl shadow-lg object-cover aspect-video"
              />
              <img
                src="https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=300&h=200&fit=crop&q=80"
                alt="Custom setup example 2"
                className="rounded-xl shadow-lg object-cover aspect-video"
              />
              <img
                src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop&q=80"
                alt="Custom setup example 3"
                className="rounded-xl shadow-lg object-cover aspect-video"
              />
              <img
                src="https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300&h=200&fit=crop&q=80"
                alt="Custom setup example 4"
                className="rounded-xl shadow-lg object-cover aspect-video"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 font-display">
              Meet our team
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The passionate individuals behind Gamestash, working tirelessly to
              bring you the best gaming setup marketplace experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow duration-200"
              >
                <CardContent className="p-6">
                  <img
                    src={member.avatar || "/placeholder.svg"}
                    alt={member.name}
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
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center flex flex-col items-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl text-foreground font-display">
                Gamestash
              </span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              The ultimate marketplace for gaming setups. Discover, buy, and
              sell the perfect gaming battlestation.
            </p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span>© 2024 Gamestash. All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
