// client/src/app/page.tsx
'use client';

import { useContext } from 'react';
import Link from 'next/link';
import AuthContext from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

const FeatureCard = ({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) => (
  <div className="bg-card p-6 rounded-lg border border-border text-center transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-bold text-foreground">{title}</h3>
    <p className="mt-2 text-muted-foreground">{children}</p>
  </div>
);

export default function LandingPage() {
  const authContext = useContext(AuthContext);
  const isAuthenticated = authContext?.isAuthenticated ?? false;

  return (
    <div>
      <section className="container mx-auto px-4 sm:px-6 py-20 text-center">
        <h1 className="font-heading text-5xl md:text-7xl font-bold tracking-tighter text-foreground leading-tight animate-in fade-in slide-in-from-bottom-4 duration-1000">
          Effortless University Scheduling
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
          Our intelligent platform automates and optimizes class timetables, saving you time and eliminating conflicts. Focus on education, we'll handle the logistics.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-400">
          <Button asChild size="lg">
            <Link href={isAuthenticated ? "/dashboard" : "/register"}>
              {isAuthenticated ? "Go to Dashboard" : "Get Started"}
            </Link>
          </Button>
        </div>
      </section>
      
      <section id="features" className="py-20 bg-muted/40">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl font-bold text-foreground">Why Choose Us?</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              Everything you need to create perfect schedules in minutes, not weeks.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard icon="💡" title="AI-Powered Optimization">
              Automatically generate the most efficient, conflict-free schedules based on your constraints.
            </FeatureCard>
            <FeatureCard icon="🔄" title="Real-Time Updates">
              Instantly see the impact of changes, from faculty leave to room availability, across all schedules.
            </FeatureCard>
            <FeatureCard icon="📊" title="Data-Driven Insights">
              Analyze resource utilization and faculty workload with our intuitive analytics dashboard.
            </FeatureCard>
          </div>
        </div>
      </section>
    </div>
  );
}