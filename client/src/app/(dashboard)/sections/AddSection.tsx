// client/src/app/(dashboard)/sections/AddSection.tsx
"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SectionForm } from "./SectionForm";

export function AddSection({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button>Add Section</Button></DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Section</DialogTitle>
          <DialogDescription>Define a class section and assign subjects.</DialogDescription>
        </DialogHeader>
        <div className="py-4"><SectionForm onSuccess={onSuccess} setOpen={setOpen} /></div>
      </DialogContent>
    </Dialog>
  );
}