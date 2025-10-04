// client/src/app/(dashboard)/classrooms/ClassroomForm.tsx
"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import axios from "axios";
import React, { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { EquipmentInput } from "./EquipmentInput";

const departmentOptions = [ "Computer Science", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering", "Business Administration", "Humanities" ];

const formSchema = z.object({
  name: z.string().min(2, { message: "Classroom name must be at least 2 characters." }),
  capacity: z.string().min(1, { message: "Capacity is required." }),
  location: z.string().min(2, { message: "Location is required." }),
  roomType: z.string({ required_error: "Please select a room type." }).min(1, { message: "Please select a room type." }),
  department: z.string().optional(),
  equipment: z.array(z.string()).default([]),
});

type ClassroomFormValues = z.infer<typeof formSchema>;

interface Classroom { _id: string; name: string; capacity: number; equipment: string[]; location: string; roomType: string; department?: string; }
interface ClassroomFormProps { classroomToEdit?: Classroom | null; onSuccess: () => void; setOpen: (open: boolean) => void; }

export function ClassroomForm({ classroomToEdit, onSuccess, setOpen }: ClassroomFormProps) {
  const { toast } = useToast();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const form = useForm<ClassroomFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", capacity: "10", location: "", roomType: "", department: "", equipment: [] },
  });

  const { isSubmitting } = form.formState;

  useEffect(() => {
    if (classroomToEdit) {
      form.reset({
        name: classroomToEdit.name,
        capacity: String(classroomToEdit.capacity),
        location: classroomToEdit.location,
        roomType: classroomToEdit.roomType,
        department: classroomToEdit.department || "",
        equipment: classroomToEdit.equipment,
      });
    } else {
      form.reset({ name: "", capacity: "10", location: "", roomType: "", department: "", equipment: [] });
    }
  }, [classroomToEdit, form]);

  async function onSubmit(values: ClassroomFormValues) {
    try {
      const payload = { ...values, capacity: parseInt(values.capacity, 10) };
      if (classroomToEdit) {
        await axios.put(`${API_URL}/api/classrooms/${classroomToEdit._id}`, payload);
        toast({ title: "Success", description: "Classroom updated successfully." });
      } else {
        await axios.post(`${API_URL}/api/classrooms`, payload);
        toast({ title: "Success", description: "Classroom created successfully." });
      }
      onSuccess();
      setOpen(false);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: `Failed to ${classroomToEdit ? 'update' : 'create'} classroom.` });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="name" render={({ field }) => ( <FormItem> <FormLabel>Classroom Name</FormLabel> <FormControl><Input placeholder="e.g., Room 101" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="roomType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Room Type</FormLabel>
                {/* THE FIX: <FormControl> is removed from around the trigger */}
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger><SelectValue placeholder="Select a type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Lecture Hall">Lecture Hall</SelectItem>
                    <SelectItem value="Laboratory">Laboratory</SelectItem>
                    <SelectItem value="Seminar Room">Seminar Room</SelectItem>
                    <SelectItem value="Studio">Studio</SelectItem>
                    <SelectItem value="Computer Lab">Computer Lab</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField control={form.control} name="capacity" render={({ field }) => ( <FormItem> <FormLabel>Capacity</FormLabel> <FormControl><Input type="number" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
        </div>
        <FormField control={form.control} name="location" render={({ field }) => ( <FormItem> <FormLabel>Location</FormLabel> <FormControl><Input placeholder="e.g., Block A, 3rd Floor" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
        <FormField
          control={form.control}
          name="department"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Associated Department (Optional)</FormLabel>
              {/* THE FIX: <FormControl> is removed from around the trigger */}
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger><SelectValue placeholder="Select a department" /></SelectTrigger>
                <SelectContent>
                  {departmentOptions.map(dept => ( <SelectItem key={dept} value={dept}>{dept}</SelectItem> ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField control={form.control} name="equipment" render={({ field }) => ( <FormItem> <FormLabel>Equipment</FormLabel> <FormControl><EquipmentInput field={field} /></FormControl> <FormDescription>Select from the list or type to add new equipment.</FormDescription> <FormMessage /> </FormItem> )} />
        <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {classroomToEdit ? 'Saving...' : 'Submit'}
        </Button>
      </form>
    </Form>
  )
}