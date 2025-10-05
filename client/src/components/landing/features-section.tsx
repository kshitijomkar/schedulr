// src/components/landing/features-section.tsx
'use client';

import { Card, CardTitle } from '@/components/ui/card';
import { CalendarDays, Users, FileUp, LayoutDashboard, Cpu, Building2 } from 'lucide-react';
import React from 'react';

const features = [
  {
    icon: <CalendarDays className="w-6 h-6" />,
    title: 'Automated Scheduling',
    description: 'Efficiently generate conflict-free schedules based on your constraints.',
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Resource Management',
    description: 'Simplify allocation of classrooms, faculty, and other academic assets.',
  },
  {
    icon: <FileUp className="w-6 h-6" />,
    title: 'Data Import/Export',
    description: 'Seamlessly move your data with robust Excel and CSV support.',
  },
  {
    icon: <LayoutDashboard className="w-6 h-6" />,
    title: 'Real-Time Analytics',
    description: 'Gain visual insights into resource utilization and scheduling efficiency.',
  },
  {
    icon: <Cpu className="w-6 h-6" />,
    title: 'Constraint-Based Engine',
    description: 'Our core algorithm respects faculty availability, room capacity, and time slots.',
  },
  {
    icon: <Building2 className="w-6 h-6" />,
    title: 'Multi-Department Support',
    description: 'Handle multiple departments and various course types within one system.',
  },
];

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string; }) => (
  <Card className="p-6 bg-card/60 backdrop-blur-sm border border-transparent hover:border-border/40 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
    <div className="flex items-start gap-4">
      <div className="p-2 bg-muted rounded-md w-fit h-fit">{icon}</div>
      <div>
        <CardTitle className="text-base font-semibold mb-2">{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  </Card>
);

export default function FeaturesSection() {
  return (
    <section id="features" className="py-28 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Everything You Need</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            A comprehensive toolset to streamline your institution's scheduling.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}