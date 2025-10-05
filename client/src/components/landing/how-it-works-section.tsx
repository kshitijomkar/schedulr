// src/components/landing/how-it-works-section.tsx
'use client'; 

import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Upload, Cpu, Settings, Share2 } from 'lucide-react';
import { motion, Variants } from 'framer-motion'; // Import Variants

const steps = [
  {
    icon: <Upload className="w-8 h-8" />,
    title: '1. Upload Your Data',
    description: 'Easily import classroom, faculty, and course information via a simple Excel or CSV file.',
  },
  {
    icon: <Cpu className="w-8 h-8" />,
    title: '2. Generate Timetable',
    description: 'Our system automatically generates an optimized, conflict-free timetable in minutes.',
  },
  {
    icon: <Settings className="w-8 h-8" />,
    title: '3. Review & Adjust',
    description: 'Review the suggested schedule and make any necessary manual adjustments with an intuitive editor.',
  },
  {
    icon: <Share2 className="w-8 h-8" />,
    title: '4. Export and Share',
    description: 'Export the final timetable in various formats or share it directly with your institution.',
  },
];

// Animation variants for the cards with the correct type
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 10 } },
};

export default function HowItWorksSection() {
  return (
    <section className="py-20 sm:py-32 bg-muted/40">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <motion.h2
            className="text-3xl font-bold tracking-tighter sm:text-4xl"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
          >
            A Simple, Powerful Process
          </motion.h2>
          <motion.p
            className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Go from complex data to a perfect schedule in four easy steps.
          </motion.p>
        </div>
        <motion.div
          className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={{
            show: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {steps.map((step, index) => (
            <motion.div key={index} variants={cardVariants}>
              <Card className="bg-background/70 backdrop-blur-sm border-border/20 hover:border-border/60 transition-all duration-300 flex items-start p-6 space-x-6 hover:shadow-lg h-full">
                <div className="p-3 bg-muted rounded-md w-fit h-fit transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                  {step.icon}
                </div>
                <div>
                  <CardTitle className="mb-2">{step.title}</CardTitle>
                  <CardDescription>{step.description}</CardDescription>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}