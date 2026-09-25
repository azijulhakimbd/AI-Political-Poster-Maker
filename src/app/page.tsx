"use client";
import CTA from "@/components/home/CTA";
import Features from "@/components/home/Features";
import Footer from "@/components/home/Footer";
import Hero from "@/components/home/Hero";

import Navbar from "@/components/home/Navbar";
import PosterTypes from "@/components/home/PosterTypes";
import TemplateSection from "@/components/home/TemplateSection";


export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <Navbar />
      <Hero />
      <PosterTypes />
      <Features />
      <TemplateSection />
      <CTA />
      <Footer />
    </main>
  );
}
