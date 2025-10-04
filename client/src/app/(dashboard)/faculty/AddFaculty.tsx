// client/src/app/(dashboard)/faculty/AddFaculty.tsx
"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FacultyForm } from "./FacultyForm";

export function AddFaculty({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Faculty</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Faculty Member</DialogTitle>
          <DialogDescription>
            Fill in the details for the new faculty member. Click submit when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <FacultyForm onSuccess={onSuccess} setOpen={setOpen} />
        </div>
      </DialogContent>
    </Dialog>
  );
}