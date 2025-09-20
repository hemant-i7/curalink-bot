"use client";

import React from "react";
import { motion } from "framer-motion";
import { Stethoscope } from "lucide-react";
import HealthMentorUI from "@/components/health-mentor/HealthMentorUI";

const ConsultationsPage = () => {
  return (
    <div className="min-h-screen bg-[#FFFFF4] relative overflow-hidden">
      {/* Dotted Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(#151616 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
            opacity: "0.05",
          }}
        />
      </div>

      {/* Simple Header */}
      <section className="pt-20 pb-12 relative z-10">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center max-w-4xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 bg-[#151616] text-white rounded-full px-4 py-2 mb-6 border-2 border-[#151616] shadow-[4px_4px_0px_0px_#D6F32F]"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <motion.div
                className="w-2 h-2 bg-[#D6F32F] rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
              />
              <span className="text-sm font-poppins font-medium">AI Health Consultations</span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-instrument-serif font-bold text-[#151616] mb-6">
              Health Consultant
              <div className="relative inline-block mx-2">
                <span className="relative z-10">AI</span>
                <motion.div
                  className="absolute bottom-2 left-0 right-0 h-4 bg-[#D6F32F] -z-10"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                />
              </div>
            </h1>

            <p className="text-xl text-[#151616]/70 mb-8 max-w-3xl mx-auto font-poppins">
              Connect with our AI Health Consultant for personalized medical guidance through live voice consultations.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Health Consultation UI - Main Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <HealthMentorUI />
        </div>
      </section>
    </div>
  );
};

export default ConsultationsPage;
