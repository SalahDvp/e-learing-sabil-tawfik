"use client";

import { useState, useEffect, useMemo } from "react";
import { Separator } from "@/components/ui/separator";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Input } from "@/components/ui/input";
import { useData } from "@/context/admin/fetchDataContext";
import { useTranslations } from "next-intl";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button, buttonVariants } from "@/components/ui/button"
import { removeStudentFromAttendance } from "@/lib/hooks/calendar";
import React from "react";




interface DailyAttandenceDataTableProps {
  selectedEvent?: any | null;
  selectedClasss?:any
}


export const DailyAttandenceDataTable: React.FC<DailyAttandenceDataTableProps> = ({ selectedEvent}) => {
 const t =useTranslations()
const {students,classes,setClasses}=useData()
const [attendance,setAttendance]=useState(selectedEvent.attendanceList)


const removeStudent= async (student,classId,attendanceId) => {
  try {
    await removeStudentFromAttendance(student,classId,attendanceId)
    console.log("wdqwddqw",attendanceId);
    
    setClasses((prevClasses) => prevClasses.map((cls) => {
      // Check if this is the class we want to update
      if (cls.id === selectedEvent.classId) {
        // Find the attendance record for the selected event
        const attendance = cls.Attendance?.[selectedEvent.attendanceId];
          console.log("dwqqwqqqqweerrdqwd",attendance);
          
        // Remove the student from the attendance list
        if (attendance) {
          attendance.attendanceList = attendance.attendanceList.filter((std) => std.id !== student.id);
        }
    
        // Return the updated class with the modified attendanceList
        return {
          ...cls,
          attendanceList: attendance ? attendance.attendanceList : cls.attendanceList
        };
      }
    
      // Return the class as is if it's not the one we want to update
      return cls;
    }));
    setAttendance((prevClasses) => prevClasses.filter((std) => std.id !== student.id))
  } catch (error) {
  }

}
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "index",
      header: () => <div>Index</div>,
      cell: ({ row }) => <div className="lowercase hidden sm:table-cell">{row.getValue("index")}</div>,
    },
    {
      accessorKey: "name",
      header: () => <div>Student Name</div>,
      cell: ({ row }) => (
        <div className="capitalize">
          <div className="font-medium">{row.getValue("name")}</div>
        </div>
      ),
    },
    {
      accessorKey: "group",
      header: () => <div>group</div>,
      cell: ({ row }) =>{
      
const group=row.getValue("group")
       
const groupDetails=selectedEvent.groups?.find(cls=>cls.group===group)

  
        return(
        <div className="hidden sm:table-cell">{row.getValue("group")}:{t(`${groupDetails.day}`)},{groupDetails.start}-{groupDetails.end}</div>
      ) },
      
    },
    {
      accessorKey: "status",
      header: () => <div>Status</div>,
      cell: ({ row }) => <div>{getStatusIcon(row.getValue("status"))}</div>,
    },
    {
      id: "remove",
      enableHiding: false,
      cell: ({ row }) => {
        const student = row.original
        return (
          <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="link" className="text-red-500">retirer</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently reove the student form attednace list.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction className={buttonVariants({ variant: "destructive" })} onClick={()=>removeStudent(student,selectedEvent.classId,selectedEvent.attendanceId)}>Remove</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        );
      },
    },

  ];
  const getStatusIcon = (status) => {
    if (status === "present") {
      return <CheckIcon className="ml-5 w-5 h-5 text-green-500" />;
    } else if (status === "Absent") {
      return <XIcon className="ml-5 w-5 h-5 text-red-500" />;
    } else {
      return null; // Handle other cases if necessary
    }
  };
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const table = useReactTable({
    data:attendance,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageIndex: 0, //custom initial page index
        pageSize: 25, //custom default page size
      },
      sorting: [{ id: 'index', desc:true }], // Sort by 'index' column in ascending order by default
    },
  })

  


  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">{selectedEvent.teacher}</h1>
            <p className="text-muted-foreground">{selectedEvent.year}</p>
            <p className="text-muted-foreground">{selectedEvent.subject}</p>
          </div>
        </div>
        {/* <Input
          placeholder="Search Student..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="max-w-sm"
        /> */}
        <div className="text-muted-foreground">
         
        </div>
      </div>

      <div className="bg-card p-4 rounded-lg shadow-md transition-shadow hover:shadow-lg">
        <Separator className="my-8" />
        <div className="overflow-auto" style={{ maxHeight: '400px' }}>
        <Table id="students-table">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {t('no-results')} </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        </div>
      </div>
    </div>
  );
};

function CalendarDaysIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path d="M8 4V3h2v1h4V3h2v1h5v18H3V4h5zM7 8h10v2H7V8zm0 4h10v2H7v-2zm0 4h10v2H7v-2z" />
    </svg>
  );
}


function CheckIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}


function XIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

export default DailyAttandenceDataTable;