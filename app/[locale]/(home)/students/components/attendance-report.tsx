"use client"

//import { DailyAtandenceDataTable } from './daily-table';

import { ScrollArea } from "@/components/ui/scroll-area";
import StudentAttendance from './attandance'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useData } from "@/context/admin/fetchDataContext";
//import { ArchiveDataTable } from './archive-table';

interface openModelProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean; // Specify the type of setOpen
  student: any;
}

export const AtandenceDataModel: React.FC<openModelProps> = ({ setOpen, open, student ,classes}) => {

   
    



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
         <StudentAttendance  student={student} classes ={classes}/>
      
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
