// src/components/landing/trust-signals-section.tsx
'use client';

import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { DotButton, PrevButton, NextButton } from './carousel-buttons';

const testimonials = [
  {
    quote: "This system cut our scheduling time by over 80%. What used to take weeks of manual effort now takes a few hours. A complete game-changer for our administration.",
    name: "Dr. Eleanor Vance",
    title: "Dean of Academics, Northwood University"
  },
  {
    quote: "The conflict detection is flawless. We've had zero scheduling errors since implementation, which has dramatically improved student and faculty satisfaction.",
    name: "Prof. Samuel Chen",
    title: "Head of Computer Science, Crestview College"
  },
  {
    quote: "Incredibly intuitive. Our administrative staff were able to master the software in less than a day with minimal training. The Excel import/export is a lifesaver.",
    name: "Maria Rodriguez",
    title: "University Registrar, Lakeside Institute"
  },
  { // <-- ADDED FOURTH TESTIMONIAL
    quote: "The analytics dashboard provides invaluable insights into our resource allocation. We can now make data-driven decisions to optimize classroom and faculty usage.",
    name: "David Lee",
    title: "Director of Operations, Oakridge Academy"
  }
];

const logos = [
  "Northwood University",
  "Crestview College",
  "Lakeside Institute",
  "Oakridge Academy",
  "Maple Creek University",
  "Stonewall College",
];

export default function TrustSignalsSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true, 
    align: 'start', // Changed to 'start' for a more natural feel with multiple items
  }, [Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })]);

  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);

  const scrollTo = React.useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  const onSelect = React.useCallback((emblaApi: { selectedScrollSnap: () => React.SetStateAction<number>; }) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  const onInit = React.useCallback((emblaApi: { scrollSnapList: () => React.SetStateAction<number[]>; }) => {
    setScrollSnaps(emblaApi.scrollSnapList());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onInit(emblaApi);
    onSelect(emblaApi);
    emblaApi.on('reInit', onInit);
    emblaApi.on('reInit', onSelect);
    emblaApi.on('select', onSelect);
  }, [emblaApi, onInit, onSelect]);
  
  const scrollPrev = React.useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = React.useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  return (
    <section className="py-28 sm:py-32 bg-background overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Trusted by Leading Institutions</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Hear from our partners about how our system transforms their scheduling.
          </p>
        </motion.div>
        
        <motion.div
          className="max-w-6xl mx-auto relative"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        >
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex -ml-4">
              {testimonials.map((testimonial, index) => (
                <div className="flex-shrink-0 flex-grow-0 basis-full pl-4 md:basis-1/2 lg:basis-1/3" key={index}>
                  <Card className="bg-background/80 shadow-lg border border-border/20 flex flex-col h-full hover:shadow-xl transition-shadow duration-300">
                    <CardContent className="p-8 text-center flex-grow flex flex-col justify-between">
                      <blockquote className="text-lg md:text-xl font-medium leading-relaxed flex-grow">
                        “{testimonial.quote}”
                      </blockquote>
                      <footer className="mt-6">
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-muted-foreground text-sm">{testimonial.title}</p>
                      </footer>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-center mt-8 space-x-2">
            {scrollSnaps.map((_, index) => (
              <DotButton
                key={index}
                onClick={() => scrollTo(index)}
                className={`w-2.5 h-2.5 rounded-full ${index === selectedIndex ? 'bg-primary' : 'bg-muted-foreground/40'} transition-colors`}
              />
            ))}
          </div>

          <PrevButton onClick={scrollPrev} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 hidden lg:block" />
          <NextButton onClick={scrollNext} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 hidden lg:block" />
        </motion.div>

        <div className="mt-24">
          <motion.p
            className="text-center text-sm font-semibold text-muted-foreground tracking-wider uppercase mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            POWERING SCHEDULES AT
          </motion.p>
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-8 gap-y-8 text-center items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {logos.map((name, index) => (
              <span key={index} className="text-lg font-medium text-muted-foreground/70">
                {name}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}