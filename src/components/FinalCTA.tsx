"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const FinalCTA = () => {
  const router = useRouter();

  return (
    <section className="w-full bg-ink py-20 lg:py-32 relative overflow-hidden border-t border-border/10">
      {/* Subtle green overlay */}
      <div className="absolute inset-0 bg-primary/5 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-8 relative z-10">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
          Ready to experience the future of HealthTech?
        </h2>
        <p className="text-ink-muted text-sm sm:text-base font-semibold leading-relaxed max-w-xl mx-auto">
          Join thousands of patients, doctors, and pharmacy sellers who are streamlining prescription logistics and medicine search on MediFind.
        </p>
        <div className="flex justify-center pt-4">
          <Button
            onClick={() => router.push("/login")}
            className="h-[48px] px-8 flex items-center gap-2 group shadow-sm bg-primary text-white hover:bg-primary-hover border-none"
          >
            <span>Get Started Now</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
