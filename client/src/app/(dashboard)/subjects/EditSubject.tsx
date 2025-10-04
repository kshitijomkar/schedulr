// client/src/app/(dashboard)/subjects/EditSubject.tsx
"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SubjectForm } from "./SubjectForm";

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

interface EditSubjectProps {
  subject: Subject | null;
  onSuccess: () => void;
  onClose: () => void;
}

export function EditSubject({ subject, onSuccess, onClose }: EditSubjectProps) {
  const isOpen = !!subject;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Subject</DialogTitle>
          <DialogDescription>
            Update the details for the subject. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <SubjectForm
            subjectToEdit={subject}
            onSuccess={onSuccess}
            setOpen={onClose}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}