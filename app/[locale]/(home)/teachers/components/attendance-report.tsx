"use client"

import { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ArchiveDataTable } from './archive-table';
import { DailyAtandenceDataTable } from './daily-table';

import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
}

export const AtandenceDataModel: React.FC<openModelProps> = ({ setOpen, open, teacher }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filter ,setFilter] = useState();
  const levels = [
  { level: '1AM' },
  { level: '2AM' },
  { level: '3AM' }
];

  const handleFilter = (classYear) => {
     // Debugging line
    setFilter(classYear);
  };


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
            <Tabs defaultValue="all">
              <div className="flex items-center">
                <TabsList>
                <TabsTrigger value="all" onClick={() => handleFilter("All")}>ooo</TabsTrigger>
                  {levels.map((level) => (
                    <TabsTrigger key={level.level} value={level.level} onClick={() => handleFilter(level.level)}>
                      {level.level}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              {/*  */}
            </Tabs>
            <DailyAtandenceDataTable  />
              <Separator className="my-8" />
              <ArchiveDataTable />
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