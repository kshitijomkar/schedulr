// client/src/app/(dashboard)/subjects/AddSubject.tsx
"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SubjectForm } from "./SubjectForm";

export function AddSubject({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Subject</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Subject</DialogTitle>
          <DialogDescription>
            Fill in the details for the new subject. Click submit when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <SubjectForm onSuccess={onSuccess} setOpen={setOpen} />
        </div>
      </DialogContent>
    </Dialog>
  );
}