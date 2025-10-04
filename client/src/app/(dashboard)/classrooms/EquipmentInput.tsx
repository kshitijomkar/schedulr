// client/src/app/(dashboard)/classrooms/EquipmentInput.tsx
"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { Command as CommandPrimitive } from "cmdk"
import { ControllerRenderProps } from "react-hook-form"

const SUGGESTIONS = ["Projector", "Whiteboard", "Smartboard", "Computers", "Video Conferencing"];

interface EquipmentInputProps {
  field: ControllerRenderProps<any, "equipment">;
}

export function EquipmentInput({ field }: EquipmentInputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  
  // Directly use field.value which is the array of selected equipment
  const selected = Array.isArray(field.value) ? field.value : [];

  const handleSelect = (value: string) => {
    setInputValue("");
    if (value && !selected.includes(value)) {
      // Call onChange with the new, updated array
      field.onChange([...selected, value]);
    }
  };

  const handleUnselect = (value: string) => {
    // Call onChange with the filtered array
    field.onChange(selected.filter(s => s !== value));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const input = inputRef.current;
    if (input) {
      if ((e.key === "Delete" || e.key === "Backspace") && input.value === "") {
        const newSelected = [...selected];
        const lastValue = newSelected.pop();
        if (lastValue) {
          handleUnselect(lastValue);
        }
      }
      if (e.key === "Escape") {
        input.blur();
      }
      if (e.key === "Enter" && input.value.trim() !== "") {
        e.preventDefault();
        handleSelect(input.value.trim());
      }
    }
  };

  const filteredSuggestions = SUGGESTIONS.filter(item => !selected.includes(item));

  return (
    <Command onKeyDown={handleKeyDown} className="overflow-visible bg-transparent">
      <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex flex-wrap gap-1">
          {selected.map(item => (
            <Badge key={item} variant="secondary">
              {item}
              <button
                type="button"
                className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onClick={() => handleUnselect(item)}
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
            placeholder="Select or add equipment..."
            className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>
      
      <div className="mt-2 w-full">
        {isOpen && (filteredSuggestions.length > 0 || inputValue.trim()) ? (
          <div className="w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95">
            <CommandList className="max-h-[150px] overflow-y-auto">
              {filteredSuggestions.length > 0 && (
                <CommandGroup heading="Suggestions">
                  {filteredSuggestions.map(item => (
                    <CommandItem
                      key={item}
                      onMouseDown={e => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onSelect={() => handleSelect(item)}
                      className="cursor-pointer"
                    >
                      {item}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              {inputValue.trim() && !SUGGESTIONS.includes(inputValue.trim()) && !selected.includes(inputValue.trim()) && (
                <CommandGroup heading="Add New">
                   <CommandItem onSelect={() => handleSelect(inputValue.trim())} className="cursor-pointer">
                    Add "{inputValue.trim()}"
                   </CommandItem>
                </CommandGroup>
              )}
            </CommandList>
          </div>
        ) : null}
      </div>
    </Command>
  );
}