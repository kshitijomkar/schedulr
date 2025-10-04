// client/src/app/(dashboard)/classrooms/AddClassroom.tsx
"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ClassroomForm } from "./ClassroomForm";

export function AddClassroom({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Classroom</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Classroom</DialogTitle>
          <DialogDescription>
            Fill in the details for the new classroom. Click submit when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <ClassroomForm onSuccess={onSuccess} setOpen={setOpen} />
        </div>
      </DialogContent>
    </Dialog>
  );
}