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
  open: boolean;
  teacher: any;
  selectedEvent: any;
  classSchedules: Array<{ time: string, subject: string }>;
  students: any[];
}


export const AttandenceDataModel: React.FC<openModelProps> = ({ setOpen, open, teacher, selectedEvent, classSchedules, students }) => {
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
            <DailyAtandenceDataTable selectedEvent={selectedEvent} classSchedules={classSchedules} students={students} />{/* Pass selectedEvent to DailyAtandenceDataTable */}
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