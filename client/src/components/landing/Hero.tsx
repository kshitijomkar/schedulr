// client/src/components/landing/Hero.tsx
'use client';

import Link from 'next/link';
import { useContext } from 'react';
import AuthContext from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export const LandingHero = () => {
  const authContext = useContext(AuthContext);
  const isAuthenticated = authContext?.isAuthenticated ?? false;

  const FADE_UP_ANIMATION_VARIANTS = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' } },
  } as const;

  return (
    <section className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4 pt-24 text-center sm:px-6">
      <motion.div
        initial="hidden"
        animate="show"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: 0.15,
            },
          },
        }}
      >
        <motion.h1
          className="font-heading text-5xl font-bold tracking-tighter text-foreground md:text-7xl"
          variants={FADE_UP_ANIMATION_VARIANTS}
        >
          Intelligent scheduling, <br />
          <span className="bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
            beautifully simple.
          </span>
        </motion.h1>

        <motion.p
          className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground"
          variants={FADE_UP_ANIMATION_VARIANTS}
        >
          Schedulr automates and optimizes university timetables, eliminating conflicts and saving countless hours. Focus on education, not logistics.
        </motion.p>

        <motion.div
          className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
          variants={FADE_UP_ANIMATION_VARIANTS}
        >
          <Button asChild size="lg">
            <Link href={isAuthenticated ? "/dashboard" : "/register"}>
              {isAuthenticated ? "Go to Dashboard" : "Get Started Free"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
};