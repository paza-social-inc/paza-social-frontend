"use client";

import { useState, useEffect } from "react";
import Footer from "./Footer";
import GrainOverlay from "./GrainOverlay";
import Navbar from "./Navbar";
import SmoothScroll from "./SmoothScroll";

export default function HomeLayout({
  children,
  hideFooter = false,
}: {
  children: React.ReactNode;
  hideFooter?: boolean;
}) {
  const [showBar, setShowBar] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowBar(false), 1100);
    return () => clearTimeout(t);
  }, []);

  return (
    <main className="min-h-screen w-full bg-background antialiased page-enter">
      <SmoothScroll />
      <GrainOverlay />
      {showBar && <div className="loading-bar" />}
      <Navbar />
      <div className="relative">
        {children}
      </div>
      {!hideFooter && <Footer showMain />}
    </main>
  );
}
