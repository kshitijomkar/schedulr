// client/src/app/(dashboard)/sections/SectionForm.tsx
"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import axios from "axios";
import React, { useEffect } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { SubjectMultiSelect } from "./SubjectMultiSelect";

const departmentOptions = [ "Computer Science", "Information Technology", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering", "Business Administration", "Humanities" ];

const formSchema = z.object({
  year: z.coerce.number().min(1, "Year is required."),
  semester: z.coerce.number().min(1, "Semester is required."),
  department: z.string({ required_error: "Please select a department." }),
  sectionName: z.string().min(1, { message: "Section name is required." }),
  studentCount: z.coerce.number().min(1, { message: "Student count is required." }),
  numLabBatches: z.coerce.number().min(1, { message: "Number of lab batches is required." }),
  subjects: z.array(z.string()).default([]),
});

type SectionFormValues = z.infer<typeof formSchema>;

// This interface now reflects the populated subject data
interface Subject {
  _id: string;
  name: string;
  code: string;
}

interface Section {
  _id: string;
  year: number;
  semester: number;
  department: string;
  sectionName: string;
  studentCount: number;
  numLabBatches: number;
  subjects: Subject[]; // The API returns an array of Subject objects
}

interface SectionFormProps {
  sectionToEdit?: Section | null;
  onSuccess: () => void;
  setOpen: (open: boolean) => void;
}

export function SectionForm({ sectionToEdit, onSuccess, setOpen }: SectionFormProps) {
  const { toast } = useToast();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const form = useForm<SectionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { year: 3, semester: 1, department: "Computer Science", sectionName: "A", studentCount: 60, numLabBatches: 2, subjects: [] },
  });

  const { isSubmitting } = form.formState;

  useEffect(() => {
    if (sectionToEdit) {
      // THE FIX: We now map over the array of subject objects
      // and extract just the _id for each one, creating the array of strings the form expects.
      form.reset({
        year: sectionToEdit.year,
        semester: sectionToEdit.semester,
        department: sectionToEdit.department,
        sectionName: sectionToEdit.sectionName,
        studentCount: sectionToEdit.studentCount,
        numLabBatches: sectionToEdit.numLabBatches,
        subjects: sectionToEdit.subjects.map(subject => subject._id),
      });
    } else {
      form.reset({ year: 3, semester: 1, department: "Computer Science", sectionName: "A", studentCount: 60, numLabBatches: 2, subjects: [] });
    }
  }, [sectionToEdit, form]);

  async function onSubmit(values: SectionFormValues) {
    try {
      if (sectionToEdit) {
        await axios.put(`${API_URL}/api/sections/${sectionToEdit._id}`, values);
        toast({ title: "Success", description: "Section updated successfully." });
      } else {
        await axios.post(`${API_URL}/api/sections`, values);
        toast({ title: "Success", description: "Section created successfully." });
      }
      onSuccess();
      setOpen(false);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: `Failed to ${sectionToEdit ? 'update' : 'create'} section.` });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField control={form.control} name="year" render={({ field }) => ( <FormItem> <FormLabel>Year</FormLabel> <FormControl><Input type="number" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
          <FormField control={form.control} name="semester" render={({ field }) => ( <FormItem> <FormLabel>Semester</FormLabel> <FormControl><Input type="number" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
          <FormField control={form.control} name="sectionName" render={({ field }) => ( <FormItem> <FormLabel>Section</FormLabel> <FormControl><Input placeholder="e.g., A" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
        </div>
        <FormField control={form.control} name="department" render={({ field }) => ( <FormItem> <FormLabel>Department</FormLabel> <Select onValueChange={field.onChange} value={field.value}> <SelectTrigger><SelectValue placeholder="Select a department" /></SelectTrigger> <SelectContent> {departmentOptions.map(dept => ( <SelectItem key={dept} value={dept}>{dept}</SelectItem> ))} </SelectContent> </Select> <FormMessage /> </FormItem> )} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField control={form.control} name="studentCount" render={({ field }) => ( <FormItem> <FormLabel>Student Count</FormLabel> <FormControl><Input type="number" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
          <FormField control={form.control} name="numLabBatches" render={({ field }) => ( <FormItem> <FormLabel>Lab Batches</FormLabel> <FormControl><Input type="number" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
        </div>
        <FormField control={form.control} name="subjects" render={({ field }) => ( <FormItem> <FormLabel>Subjects</FormLabel> <FormControl><SubjectMultiSelect field={field} /></FormControl> <FormMessage /> </FormItem> )} />
        <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {sectionToEdit ? 'Saving...' : 'Submit'}
        </Button>
      </form>
    </Form>
  )
}