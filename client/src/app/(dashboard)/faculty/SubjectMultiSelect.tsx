// client/src/app/(dashboard)/faculty/SubjectMultiSelect.tsx
"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { Command as CommandPrimitive } from "cmdk"
import { ControllerRenderProps } from "react-hook-form"
import axios from "axios"
import { useToast } from "@/hooks/use-toast"

interface Subject {
  _id: string;
  name: string;
  code: string;
}

interface SubjectMultiSelectProps {
  field: ControllerRenderProps<any, "subjectsTaught">;
}

export function SubjectMultiSelect({ field }: SubjectMultiSelectProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [allSubjects, setAllSubjects] = React.useState<Subject[]>([]);
  const [inputValue, setInputValue] = React.useState("");
  const { toast } = useToast();
  
  const selectedIds = new Set(field.value || []);

  React.useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/subjects`);
        setAllSubjects(response.data.data);
      } catch (error) {
        toast({ variant: "destructive", title: "Error", description: "Failed to fetch subjects for selection." });
      }
    };
    fetchSubjects();
  }, [toast]);
  
  const handleUnselect = (subjectId: string) => {
    const newSelectedIds = new Set(selectedIds);
    newSelectedIds.delete(subjectId);
    field.onChange(Array.from(newSelectedIds));
  };
  
  const handleSelect = (subjectId: string) => {
    setInputValue("");
    const newSelectedIds = new Set(selectedIds);
    newSelectedIds.add(subjectId);
    field.onChange(Array.from(newSelectedIds));
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const input = inputRef.current;
    if (input && (e.key === "Delete" || e.key === "Backspace") && input.value === "") {
        const allSelected = Array.from(selectedIds);
        if (allSelected.length > 0) {
            handleUnselect(allSelected[allSelected.length - 1]);
        }
    }
  };

  const selectedSubjects = allSubjects.filter(subject => selectedIds.has(subject._id));
  const availableSubjects = allSubjects.filter(subject => !selectedIds.has(subject._id));

  return (
    <Command onKeyDown={handleKeyDown} className="overflow-visible bg-transparent">
      <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex flex-wrap gap-1">
          {selectedSubjects.map(subject => (
            <Badge key={subject._id} variant="secondary">
              {subject.name}
              <button
                type="button"
                className="ml-1 rounded-full outline-none"
                onClick={() => handleUnselect(subject._id)}
              >
                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
              </button>
            </Badge>
          ))}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setIsOpen(false)}
            onFocus={() => setIsOpen(true)}
            placeholder="Select subjects..."
            className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="mt-2 w-full">
        {isOpen && availableSubjects.length > 0 ? (
          <div className="w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95">
            <CommandList className="max-h-[150px] overflow-y-auto">
              <CommandGroup heading="Suggestions">
                {availableSubjects.map(subject => (
                    <CommandItem
                      key={subject._id}
                      // THE FIX: This onMouseDown handler prevents the input's onBlur event
                      // from firing before the onSelect event can.
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onSelect={() => handleSelect(subject._id)}
                      className="cursor-pointer"
                    >
                      {subject.name} ({subject.code})
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </div>
        ) : null}
      </div>
    </Command>
  )
}