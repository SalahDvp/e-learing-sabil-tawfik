"use client";

import { useState } from "react";
import { DailyAtandenceDataTable } from './attendance-group';
import { ScrollArea } from "@/components/ui/scroll-area";


import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface openModelProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean; // Specify the type of setOpen
  teacher: any;
  selectedEvent: any; // Add selectedEvent prop
}

export const AttandenceDataModel: React.FC<openModelProps> = ({ setOpen, open, teacher, selectedEvent }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className=" sm:max-w-[1040px]">
        <ScrollArea className="h-screen pb-20">
          <SheetHeader>
            <SheetTitle>Attendance Report</SheetTitle>
            <SheetDescription>
              Check Out The Daily Attendance For Each Field
            </SheetDescription>
          </SheetHeader>

          <div className="bg-background text-foreground p-6 md:p-10">
            <DailyAtandenceDataTable selectedEvent={selectedEvent} /> {/* Pass selectedEvent to DailyAtandenceDataTable */}
          </div>

          <SheetFooter className="mt-5">
            <SheetClose asChild>
              {/* Any close button or action can be placed here */}
            </SheetClose>
          </SheetFooter>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};