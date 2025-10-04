'use client';

import React, { useContext, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import AuthContext from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { School, CalendarDays, Users, Book, Layers, ArrowRight, Loader2, Warehouse, UsersRound, Building, BookA, LayoutGrid, Landmark, Users2, BookmarkCheck, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';

// This interface now matches the data structure from your new, single API endpoint
interface DashboardStats {
  totalClassrooms: number;
  totalCapacity: number;
  totalFaculty: number;
  totalSubjects: number;
  totalSections: number;
  totalStudents: number;
  totalLocations: number;
  totalDepartments: number;
  totalCourseTypes: number;
  totalLectureHours: number;
}

const StatDisplay: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
  <Card className="flex items-center gap-4 p-4 transition-all hover:shadow-lg">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
      {icon}
    </div>
    <div className="flex-1 overflow-hidden">
      <div className="text-sm font-medium text-muted-foreground truncate">{title}</div>
      <div className="text-xl font-bold text-foreground truncate">{value}</div>
    </div>
  </Card>
);

export default function DashboardPage() {
  const authContext = useContext(AuthContext);
  const user = authContext?.user;
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // UPDATED AND SIMPLIFIED: This function now makes a single API call
  const fetchDashboardStats = useCallback(async () => {
    try {
      // The four separate API calls have been replaced by this one line
      const response = await axios.get(`${API_URL}/api/dashboard/stats`);
      
      // All client-side calculation logic is removed. We just set the state directly.
      setStats(response.data.data);

    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to fetch dashboard statistics." });
    } finally {
      setIsLoadingStats(false);
    }
  }, [API_URL, toast]);

  useEffect(() => {
    if (authContext?.isAuthenticated) {
      fetchDashboardStats();
    }
  }, [authContext?.isAuthenticated, fetchDashboardStats]);

  return (
    <div className="space-y-10 p-4 md:p-6 lg:p-8">
      {/* --- NO UI/UX CHANGES BELOW THIS LINE --- */}
      
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          Welcome, {user?.name || 'User'}
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Your centralized hub for managing academic data and generating timetables.
        </p>
      </div>

      <Card className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between shadow-lg transition-all duration-300 hover:shadow-xl">
        <div className="flex items-center gap-6">
          <div className="p-4 rounded-full bg-primary/10 text-primary">
            <CalendarDays className="h-10 w-10" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Generate Timetable</CardTitle>
            <CardDescription className="mt-1 max-w-lg">
              Ready to create a new academic schedule? Start the generation process here.
            </CardDescription>
          </div>
        </div>
        <div className="mt-6 md:mt-0 md:ml-auto">
          <Link href="/dashboard/schedule">
            <Button size="lg" className="group">
              Start Generation
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </Card>
      
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Quick Actions</h2>
        <p className="text-muted-foreground mt-1">Easily navigate and manage your core institutional data.</p>
        <div className="grid gap-4 mt-6 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/dashboard/classrooms">
            <Card className="card-animated-border h-full transition-shadow duration-300 hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Classrooms</CardTitle>
                <School className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">Manage</div>
                <p className="text-xs text-muted-foreground">Add, edit, or view physical spaces.</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/faculty">
            <Card className="card-animated-border h-full transition-shadow duration-300 hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Faculty</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">Manage</div>
                <p className="text-xs text-muted-foreground">Add, edit, or update faculty members.</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/subjects">
            <Card className="card-animated-border h-full transition-shadow duration-300 hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Subjects</CardTitle>
                <Book className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">Manage</div>
                <p className="text-xs text-muted-foreground">Add, edit, or view all subjects.</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/sections">
            <Card className="card-animated-border h-full transition-shadow duration-300 hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sections</CardTitle>
                <Layers className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">Manage</div>
                <p className="text-xs text-muted-foreground">Define and manage class sections.</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Overview & Statistics</h2>
        <p className="text-muted-foreground mt-1">Key metrics across your academic data.</p>
        {isLoadingStats ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid gap-4 mt-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            <StatDisplay title="Total Classrooms" value={stats?.totalClassrooms ?? 0} icon={<School className="h-5 w-5" />} />
            <StatDisplay title="Total Faculty" value={stats?.totalFaculty ?? 0} icon={<UsersRound className="h-5 w-5" />} />
            <StatDisplay title="Total Subjects" value={stats?.totalSubjects ?? 0} icon={<BookA className="h-5 w-5" />} />
            <StatDisplay title="Total Sections" value={stats?.totalSections ?? 0} icon={<Building className="h-5 w-5" />} />
            <StatDisplay title="Total Students" value={stats?.totalStudents ?? 0} icon={<Users2 className="h-5 w-5" />} />

            <StatDisplay title="Total Capacity" value={stats?.totalCapacity ?? 0} icon={<Warehouse className="h-5 w-5" />} />
            <StatDisplay title="Total Locations" value={stats?.totalLocations ?? 0} icon={<Landmark className="h-5 w-5" />} />
            <StatDisplay title="Total Departments" value={stats?.totalDepartments ?? 0} icon={<Building2 className="h-5 w-5" />} />
            <StatDisplay title="Total Course Types" value={stats?.totalCourseTypes ?? 0} icon={<LayoutGrid className="h-5 w-5" />} />
            <StatDisplay title="Total Lecture Hours" value={stats?.totalLectureHours ?? 0} icon={<BookmarkCheck className="h-5 w-5" />} />
          </div>
        )}
      </div>
    </div>
  );
}