// client/src/app/(dashboard)/subjects/SubjectForm.tsx
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

const departmentOptions = [ "Computer Science", "Information Technology", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering", "Business Administration", "Humanities" ];
const courseTypeOptions = ['Core', 'Professional Elective', 'Open Elective', 'Skill'];

const formSchema = z.object({
  name: z.string().min(3, { message: "Subject name must be at least 3 characters." }),
  code: z.string().min(3, { message: "Subject code is required." }),
  semester: z.coerce.number().min(1).max(8),
  department: z.string().min(1, { message: "Please select a department." }),
  lectureHours: z.coerce.number().min(0).default(0),
  labHours: z.coerce.number().min(0).default(0),
  tutorialHours: z.coerce.number().min(0).default(0),
  courseType: z.string().min(1, { message: "Please select a course type." }),
});

type SubjectFormValues = z.infer<typeof formSchema>;

interface Subject {
  _id: string;
  name: string;
  code: string;
  semester: number;
  department: string;
  lectureHours: number;
  labHours: number;
  tutorialHours: number;
  courseType: string;
}

interface SubjectFormProps {
  subjectToEdit?: Subject | null;
  onSuccess: () => void;
  setOpen: (open: boolean) => void;
}

export function SubjectForm({ subjectToEdit, onSuccess, setOpen }: SubjectFormProps) {
  const { toast } = useToast();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", code: "", semester: 1, department: "", lectureHours: 3, labHours: 0, tutorialHours: 1, courseType: "Core" },
  });

  const { isSubmitting } = form.formState;

  useEffect(() => {
    if (subjectToEdit) {
      form.reset({ ...subjectToEdit });
    } else {
      form.reset({ name: "", code: "", semester: 1, department: "", lectureHours: 3, labHours: 0, tutorialHours: 1, courseType: "Core" });
    }
  }, [subjectToEdit, form]);

  async function onSubmit(values: SubjectFormValues) {
    try {
      if (subjectToEdit) {
        await axios.put(`${API_URL}/api/subjects/${subjectToEdit._id}`, values);
        toast({ title: "Success", description: "Subject updated successfully." });
      } else {
        await axios.post(`${API_URL}/api/subjects`, values);
        toast({ title: "Success", description: "Subject created successfully." });
      }
      onSuccess();
      setOpen(false);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: `Failed to ${subjectToEdit ? 'update' : 'create'} subject.` });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField control={form.control} name="name" render={({ field }) => ( <FormItem> <FormLabel>Subject Name</FormLabel> <FormControl><Input placeholder="e.g., Data Structures" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
          <FormField control={form.control} name="code" render={({ field }) => ( <FormItem> <FormLabel>Subject Code</FormLabel> <FormControl><Input placeholder="e.g., CS201" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField control={form.control} name="department" render={({ field }) => (
            <FormItem>
              <FormLabel>Department</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger><SelectValue placeholder="Select a department" /></SelectTrigger>
                <SelectContent>
                  {departmentOptions.map(dept => ( <SelectItem key={dept} value={dept}>{dept}</SelectItem> ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="semester" render={({ field }) => ( <FormItem> <FormLabel>Semester</FormLabel> <FormControl><Input type="number" value={String(field.value || "")} onChange={(e) => field.onChange(e.target.valueAsNumber)} onBlur={field.onBlur} name={field.name} ref={field.ref} /></FormControl> <FormMessage /> </FormItem> )} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField control={form.control} name="lectureHours" render={({ field }) => ( <FormItem> <FormLabel>Lecture Hrs/Wk</FormLabel> <FormControl><Input type="number" value={String(field.value || "")} onChange={(e) => field.onChange(e.target.valueAsNumber)} onBlur={field.onBlur} name={field.name} ref={field.ref} /></FormControl> <FormMessage /> </FormItem> )} />
          <FormField control={form.control} name="labHours" render={({ field }) => ( <FormItem> <FormLabel>Lab Hrs/Wk</FormLabel> <FormControl><Input type="number" value={String(field.value || "")} onChange={(e) => field.onChange(e.target.valueAsNumber)} onBlur={field.onBlur} name={field.name} ref={field.ref} /></FormControl> <FormMessage /> </FormItem> )} />
          <FormField control={form.control} name="tutorialHours" render={({ field }) => ( <FormItem> <FormLabel>Tutorial Hrs/Wk</FormLabel> <FormControl><Input type="number" value={String(field.value || "")} onChange={(e) => field.onChange(e.target.valueAsNumber)} onBlur={field.onBlur} name={field.name} ref={field.ref} /></FormControl> <FormMessage /> </FormItem> )} />
        </div>
        <FormField control={form.control} name="courseType" render={({ field }) => (
            <FormItem>
              <FormLabel>Course Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger><SelectValue placeholder="Select a type" /></SelectTrigger>
                <SelectContent>
                  {courseTypeOptions.map(type => ( <SelectItem key={type} value={type}>{type}</SelectItem> ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
        )} />
        <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {subjectToEdit ? 'Saving...' : 'Submit'}
        </Button>
      </form>
    </Form>
  )
}