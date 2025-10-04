// client/src/app/(dashboard)/timetables/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Zap } from 'lucide-react';
import { TimetableGrid } from './TimetableGrid';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Section {
  _id: string;
  year: number;
  department: string;
  sectionName: string;
}

interface ScheduledClass {
    _id: string;
    day: string;
    timeSlot: { _id: string; period: number; startTime: string; endTime: string; };
    subject: { name: string; };
    faculty: { name: string; }[];
    classroom: { name: string; };
    labBatchNumber?: number;
}

export default function TimetablesPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [schedule, setSchedule] = useState<ScheduledClass[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchSections = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/api/sections`);
      setSections(response.data.data);
      // Automatically select the first section if available
      if (response.data.data.length > 0) {
        setSelectedSection(response.data.data[0]._id);
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to fetch sections." });
    }
  }, [API_URL, toast]);

  const fetchSchedule = useCallback(async () => {
    if (!selectedSection) return;
    setIsLoading(true);
    try {
      // In a real app, you'd fetch the schedule for the selected section.
      // For now, we fetch ALL scheduled classes and filter on the frontend.
      const response = await axios.get(`${API_URL}/api/schedule`); // We'll create this GET endpoint next
      const filteredSchedule = response.data.data.filter((item: ScheduledClass) => item.section === selectedSection);
      setSchedule(filteredSchedule);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to fetch schedule." });
    } finally {
      setIsLoading(false);
    }
  }, [API_URL, selectedSection, toast]);

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  useEffect(() => {
    fetchSchedule();
  }, [selectedSection, fetchSchedule]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    toast({ title: "Generating Timetable...", description: "This may take a moment." });
    try {
      await axios.post(`${API_URL}/api/schedule/generate`);
      toast({ title: "Success", description: "Timetable generated successfully. Please refresh." });
      // Re-fetch the schedule to display the new data
      fetchSchedule();
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to generate timetable." });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">
            View Timetables
          </h1>
          <p className="text-muted-foreground mt-1">
            Generate and view the master timetable for any section.
          </p>
        </div>
        <Button onClick={handleGenerate} disabled={isGenerating}>
          {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
          Generate New Timetable
        </Button>
      </div>
      
      <div className="flex items-center gap-4 mb-4">
        <label className="font-medium">Select Section:</label>
        <Select onValueChange={setSelectedSection} value={selectedSection || ''}>
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Select a section..." />
          </SelectTrigger>
          <SelectContent>
            {sections.map(sec => (
              <SelectItem key={sec._id} value={sec._id}>
                {`${sec.year} Year, ${sec.department} - ${sec.sectionName}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center rounded-lg border-2 border-dashed h-96">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <TimetableGrid schedule={schedule} />
      )}
    </div>
  );
}