// src/components/landing/lead-capture-form.tsx
'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import React, { useState } from 'react';
import axios from 'axios'; // Import axios

export default function LeadCaptureForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      institution: formData.get('institution'),
      message: formData.get('message'),
    };

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    try {
      // --- Use Axios instead of Fetch ---
      const response = await axios.post(`${apiUrl}/api/messages`, data);

      // Axios automatically checks for success (status 2xx)
      toast({
        title: "Message Sent!",
        description: "Thank you for your interest. We'll be in touch shortly.",
      });
      e.currentTarget.reset();

    } catch (error: any) {
      // Axios puts server errors in error.response
      if (error.response) {
        toast({
          title: "Submission Failed",
          description: error.response.data?.message || "Something went wrong on the server.",
          variant: 'destructive',
        });
      } else {
        // This handles actual network errors
        toast({
          title: "Network Error",
          description: "Could not send message. Please check your connection.",
          variant: 'destructive',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Ready to Simplify Your Scheduling?</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Contact us for a personalized demo or to start your free trial today.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="mt-10 max-w-xl mx-auto space-y-4">
          <Input type="text" placeholder="Your Name" name="name" required />
          <Input type="email" placeholder="Your Email" name="email" required />
          <Input type="text" placeholder="Institution Name" name="institution" required />
          <Textarea placeholder="Your Message (Optional)" name="message" />
          <Button
            type="submit"
            size="lg"
            className="w-full bg-foreground text-background hover:bg-foreground/80"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Request a Demo'}
          </Button>
        </form>
      </div>
    </section>
  );
}