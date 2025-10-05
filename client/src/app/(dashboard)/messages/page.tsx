// src/app/(dashboard)/messages/page.tsx
'use client';

import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import { DataTable } from '@/components/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import AuthContext from '@/context/AuthContext';
import axios from 'axios';
import { format } from 'date-fns';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
});

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

type Message = {
  _id: string;
  name: string;
  email: string;
  institution: string;
  message: string;
  submittedAt: string;
};

const columns: ColumnDef<Message>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'institution', header: 'Institution' },
  { accessorKey: 'message', header: 'Message', cell: ({ row }) => <p className="truncate max-w-xs">{row.original.message}</p> },
  { accessorKey: 'submittedAt', header: 'Date', cell: ({ row }) => format(new Date(row.original.submittedAt), 'PPp') },
];

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const authContext = useContext(AuthContext);
  const router = useRouter(); // Initialize router

  const user = authContext?.user;
  const isLoadingAuth = authContext?.isLoading;

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await api.get('/api/messages');
        setMessages(response.data);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      } finally {
        setLoading(false);
      }
    };
    
    // If auth has loaded
    if (!isLoadingAuth) {
      if (user && user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
        fetchMessages();
      } else {
        // If not admin, redirect to not-found page
        router.push('/not-found');
      }
    }
  }, [user, isLoadingAuth, router]);

  // While checking auth, show a loading state
  if (isLoadingAuth) {
    return <div>Verifying access...</div>;
  }

  // If the user somehow gets here but isn't the admin, render nothing while redirecting
  if (!user || user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    return null; 
  }

  if (loading) return <div>Loading messages...</div>;

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Contact Form Messages</h1>
      <DataTable columns={columns} data={messages} />
    </div>
  );
}