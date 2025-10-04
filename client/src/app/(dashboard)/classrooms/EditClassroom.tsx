// client/src/app/(dashboard)/classrooms/EditClassroom.tsx
"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ClassroomForm } from "./ClassroomForm";

interface Classroom {
  _id: string;
  name: string;
  capacity: number;
  equipment: string[];
  location: string;
  roomType: string;
  department?: string;
}

interface EditClassroomProps {
  classroom: Classroom | null;
  onSuccess: () => void;
  onClose: () => void;
}

export function EditClassroom({ classroom, onSuccess, onClose }: EditClassroomProps) {
  const isOpen = !!classroom;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Classroom</DialogTitle>
          <DialogDescription>
            Update the details for the classroom. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <ClassroomForm
            classroomToEdit={classroom}
            onSuccess={onSuccess}
            setOpen={onClose}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}