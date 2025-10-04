// client/src/app/register/page.tsx
'use client';

import React, { useState, useContext } from 'react';
import Link from 'next/link';
import AuthContext from '@/context/AuthContext';
import Logo from '@/components/Logo';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast'; // CORRECTED IMPORT PATH

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const authContext = useContext(AuthContext);
  if (!authContext) return null;
  const { register } = authContext;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({ variant: "destructive", title: "Invalid Password", description: "Password must be at least 6 characters long." });
      return;
    }
    setIsSubmitting(true);
    try {
      await register(name, email, password);
      toast({ title: "Account Created", description: "Welcome! Your account has been created successfully." });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Registration Failed", description: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40 px-4 py-12">
      <Card className="w-full max-w-sm animate-in fade-in-50 zoom-in-95">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Link href="/" aria-label="Go to homepage"><Logo /></Link>
          </div>
          <CardTitle className="font-heading text-3xl">Create an Account</CardTitle>
          <CardDescription>Enter your details below to get started.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="Jane Doe" required value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="name@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline">Sign in</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;