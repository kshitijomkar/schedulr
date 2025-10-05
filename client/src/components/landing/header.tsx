// src/components/landing/header.tsx
'use client';

import Link from 'next/link';
import { useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthContext from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';

export default function Header() {
  const authContext = useContext(AuthContext);
  const isAuthenticated = authContext?.isAuthenticated ?? false;

  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Find the trigger element in the hero section by its ID
    const triggerElement = document.getElementById('hero-cta-trigger');
    if (!triggerElement) return;

    // Calculate the point below the hero button to trigger the animation
    const triggerPoint = triggerElement.offsetTop + triggerElement.offsetHeight;

    const handleScroll = () => {
      // Show the header button only when we've scrolled past the hero button
      if (window.scrollY > triggerPoint) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Cleanup the event listener on component unmount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []); // Empty array ensures this runs only once on mount

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-6 py-10">
        <Link href="/" aria-label="Go to homepage">
          <Logo />
        </Link>

        {/* AnimatePresence handles the enter/exit animations */}
        <AnimatePresence>
          {showButton && (
            <motion.div
              initial={{ opacity: 0, y: -25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -25 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <Button asChild>
                <Link href={isAuthenticated ? "/dashboard" : "/register"}>
                  {isAuthenticated ? "Go to Dashboard" : "Get Started"}
                </Link>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}