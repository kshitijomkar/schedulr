// client/src/app/(dashboard)/faculty/EditFaculty.tsx
"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FacultyForm } from "./FacultyForm";

interface Faculty {
  _id: string;
  name: string;
  employeeId: string;
  email: string;
  department: string;
  subjectsTaught: string[];
}

interface EditFacultyProps {
  faculty: Faculty | null;
  onSuccess: () => void;
  onClose: () => void;
}

export function EditFaculty({ faculty, onSuccess, onClose }: EditFacultyProps) {
  const isOpen = !!faculty;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Faculty Member</DialogTitle>
          <DialogDescription>
            Update the details for the faculty member. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <FacultyForm
            facultyToEdit={faculty}
            onSuccess={onSuccess}
            setOpen={onClose}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}