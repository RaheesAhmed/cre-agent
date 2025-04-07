"use client"

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Header from '@/components/header'
import { FeaturesShowcase } from '@/components/features-showcase';
import { CTA, EconomicIndicators } from "@/components/cta";
import Footer from "@/components/footer";


export default function Home() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground relative overflow-x-hidden">
      {/* Use theme variables from globals.css */}
      
      {/* Enhanced Background - Subtle grid and gradient orbs */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-50" />
        <div className="absolute top-0 -left-32 w-96 h-96 bg-primary/10 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob" />
        <div className="absolute top-32 -right-32 w-96 h-96 bg-secondary/10 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-32 left-1/4 w-96 h-96 bg-accent/10 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob animation-delay-4000" />
      </div>
      
      {/* Header - Ensure it has appropriate background/blur if needed */}
      <Header />

      {/* Main Content - Relative to allow z-indexing above background */}
      <main className="relative z-10">
        {/* Hero Section - Increased padding, clearer text hierarchy */}
        <section className="py-32 sm:py-48">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-6 md:space-y-8">
              {/* Tag */}
              <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-border bg-card/50 backdrop-blur-sm mb-4 shadow-sm">
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-primary text-primary-foreground">New</span>
                <span className="ml-3 text-sm text-muted-foreground">AI-Powered Commercial Real Estate Analysis</span>
              </div>
              
              {/* Headline */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tighter leading-tight">
                <span className="block animate-text-gradient bg-gradient-to-r from-primary via-blue-500 to-primary bg-[200%_auto] bg-clip-text text-transparent">
                  Commercial Real Estate
                </span>
                <span className="block text-foreground">Analysis Agent</span>
              </h1>
              
              {/* Sub-headline */}
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Unlock deeper property insights, analyze market trends, and make data-driven decisions with our intelligent CRE assistant.
              </p>
              
              {/* Call to Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
                <Link 
                  href="/chat"
                  className="group inline-flex items-center justify-center gap-2 px-8 py-3 text-base font-medium rounded-md bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 shadow hover:shadow-md w-full sm:w-auto"
                >
                  Start Analyzing
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <a 
                  href="#features"
                  className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-md border border-border hover:bg-muted transition-colors duration-300 w-full sm:w-auto"
                >
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section - Add ID for anchor link */}
        <section id="features" className="py-16 sm:py-24 bg-muted/30">
           <FeaturesShowcase />
        </section>

        {/* How It Works (CTA) Section */}
        <section className="py-16 sm:py-24">
           <CTA />
        </section>

        {/* Economic Indicators Section */}
        <section className="py-16 sm:py-24 bg-muted/30">
           <EconomicIndicators />
        </section>
        
        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
}

