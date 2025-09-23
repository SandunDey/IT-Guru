// src/components/Splash.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logo.jpg"; // put your logo at src/assets/logo.png

export default function Splash({ onDone = () => {} , minDelay = 1800 }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), minDelay);
    return () => clearTimeout(t);
  }, [minDelay]);

  useEffect(() => {
    if (ready) onDone();
  }, [ready, onDone]);

  return (
    <div
      className="relative min-h-dvh w-full overflow-hidden bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900"
      aria-busy={!ready}
      aria-live="polite"
    >
      {/* Subtle vignette + noise overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-40 [background:radial-gradient(60%_50%_at_50%_30%,_rgba(255,255,255,0.20)_0%,_transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-10 noise-texture" />

      {/* Center content */}
      <div className="relative z-10 flex min-h-dvh items-center justify-center px-6">
        <div className="flex flex-col items-center text-center">
          {/* Logo + halo */}
          <div className="relative mb-8">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative"
            >
              <img
                src={logo}
                alt="Brand logo"
                className="h-20 w-20 rounded-2xl object-contain shadow-2xl"
                draggable="false"
              />
              {/* Glow ring */}
              <div className="absolute -inset-6 -z-10 rounded-3xl bg-blue-400/20 blur-2xl" />
            </motion.div>

            {/* Soft pulsing aura */}
            <motion.div
              className="absolute inset-0 -z-10 rounded-3xl"
              animate={{ boxShadow: ["0 0 0 0 rgba(147,197,253,0.0)", "0 0 60px 10px rgba(147,197,253,0.35)", "0 0 0 0 rgba(147,197,253,0.0)"] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          {/* Title */}
          <motion.h1
            className="text-white/90 text-2xl md:text-3xl font-semibold tracking-tight"
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            Welcome to <span className="text-white">ITGuru</span>
          </motion.h1>
          <motion.p
            className="mt-2 text-blue-100/80 text-sm md:text-base"
            initial={{ y: 6, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.5 }}
          >
            Loading a clean & professional experience…
          </motion.p>

          {/* Loading bar */}
          <motion.div
            className="mt-8 h-2 w-[280px] max-w-[80vw] overflow-hidden rounded-full bg-white/15 shadow-inner"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            role="progressbar"
            aria-label="Loading"
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <motion.div
              className="h-full w-1/3 rounded-full bg-white/90"
              initial={{ x: "-100%" }}
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>

          {/* Dots */}
          <div className="mt-4 flex items-center gap-2">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="inline-block h-2 w-2 rounded-full bg-white/80"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.12, ease: "easeInOut" }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Corner accent shapes */}
      <AnimatePresence>
        <motion.div
          className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-blue-400/10 blur-3xl"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        />
        <motion.div
          className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-indigo-400/10 blur-3xl"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        />
      </AnimatePresence>
    </div>
  );
}
