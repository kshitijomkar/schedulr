// client/src/app/(dashboard)/faculty/FacultyForm.tsx
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
import { SubjectMultiSelect } from "./SubjectMultiSelect"; // Import our new component

const departmentOptions = [ "Computer Science", "Information Technology", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering", "Business Administration", "Humanities" ];

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  employeeId: z.string().min(1, { message: "Employee ID is required." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  department: z.string({ required_error: "Please select a department." }).min(1, { message: "Please select a department." }),
  subjectsTaught: z.array(z.string()).default([]), // Now expects an array of strings (IDs)
});

type FacultyFormValues = z.infer<typeof formSchema>;

interface Faculty {
  _id: string;
  name: string;
  employeeId: string;
  email: string;
  department: string;
  subjectsTaught: string[];
}

interface FacultyFormProps {
  facultyToEdit?: Faculty | null;
  onSuccess: () => void;
  setOpen: (open: boolean) => void;
}

export function FacultyForm({ facultyToEdit, onSuccess, setOpen }: FacultyFormProps) {
  const { toast } = useToast();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const form = useForm<FacultyFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", employeeId: "", email: "", department: "", subjectsTaught: [] },
  });

  const { isSubmitting } = form.formState;

  useEffect(() => {
    if (facultyToEdit) {
      form.reset({
        name: facultyToEdit.name,
        employeeId: facultyToEdit.employeeId,
        email: facultyToEdit.email,
        department: facultyToEdit.department,
        subjectsTaught: facultyToEdit.subjectsTaught || [],
      });
    } else {
      form.reset({ name: "", employeeId: "", email: "", department: "", subjectsTaught: [] });
    }
  }, [facultyToEdit, form]);

  async function onSubmit(values: FacultyFormValues) {
    try {
      // The payload is now correct as 'values' already has the array of IDs
      if (facultyToEdit) {
        await axios.put(`${API_URL}/api/faculty/${facultyToEdit._id}`, values);
        toast({ title: "Success", description: "Faculty member updated successfully." });
      } else {
        await axios.post(`${API_URL}/api/faculty`, values);
        toast({ title: "Success", description: "Faculty member created successfully." });
      }
      onSuccess();
      setOpen(false);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: `Failed to ${facultyToEdit ? 'update' : 'create'} faculty member.` });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="name" render={({ field }) => ( <FormItem> <FormLabel>Full Name</FormLabel> <FormControl><Input placeholder="e.g., Dr. Alan Turing" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField control={form.control} name="employeeId" render={({ field }) => ( <FormItem> <FormLabel>Employee ID</FormLabel> <FormControl><Input placeholder="e.g., EMP101" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
          <FormField control={form.control} name="email" render={({ field }) => ( <FormItem> <FormLabel>Email</FormLabel> <FormControl><Input type="email" placeholder="e.g., alan.t@example.com" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
        </div>
        <FormField control={form.control} name="department" render={({ field }) => (
            <FormItem>
              <FormLabel>Department</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl><SelectTrigger><SelectValue placeholder="Select a department" /></SelectTrigger></FormControl>
                <SelectContent> {departmentOptions.map(dept => ( <SelectItem key={dept} value={dept}>{dept}</SelectItem> ))} </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
        )} />
        {/* THE FIX: Replaced the simple Input with our new SubjectMultiSelect component */}
        <FormField
          control={form.control}
          name="subjectsTaught"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subjects Taught</FormLabel>
              <FormControl>
                <SubjectMultiSelect field={field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {facultyToEdit ? 'Saving Changes...' : 'Submit'}
        </Button>
      </form>
    </Form>
  )
}