// client/src/app/(dashboard)/sections/EditSection.tsx
"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SectionForm } from "./SectionForm";

interface Section {
  _id: string;
  year: number;
  semester: number;
  department: string;
  sectionName: string;
  studentCount: number;
  numLabBatches: number;
  subjects: string[];
}

interface EditSectionProps {
  section: Section | null;
  onSuccess: () => void;
  onClose: () => void;
}

export function EditSection({ section, onSuccess, onClose }: EditSectionProps) {
  const isOpen = !!section;
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Section</DialogTitle>
          <DialogDescription>Update the details for this section.</DialogDescription>
        </DialogHeader>
        <div className="py-4"><SectionForm sectionToEdit={section} onSuccess={onSuccess} setOpen={onClose} /></div>
      </DialogContent>
    </Dialog>
  );
}