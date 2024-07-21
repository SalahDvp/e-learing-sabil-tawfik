"use client";

import { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator"
import { Calendar } from "@/components/ui/calendar";
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
} from "@tanstack/react-table";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { studnetRegistrationSchema } from "@/validators/studentinfo";

export type studentAttandance = {
  id: string;
  name: string;
  status: string;
};

type StudentValues = z.infer<typeof studnetRegistrationSchema> & { id: string };

export const DailyAtandenceDataTable = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
  const startDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).getDay();
  const [searchTerm, setSearchTerm] = useState("");


  const [student, setStudent] = useState<StudentValues>({
    id: "1",
    name: "John Smith",
    status: "Present",
  });


 
  
  const filteredStudents: { [key: string]: studentAttandance[] } = {
    Economics: [
      { id: "1", name: "John Smith", status: "Present" },
      { id: "2", name: "Jane Doe", status: "Absent" },
      { id: "3", name: "Mary Johnson", status: "Present" },
    ],
    "Scientific Stream": [
      { id: "1", name: "James Brown", status: "Absent" },
      { id: "2", name: "Patricia Davis", status: "Present" },
      { id: "3", name: "Robert Wilson", status: "Absent" },
    ],
    "Mathematics and Technology": [
      { id: "1", name: "Linda Martinez", status: "Present" },
      { id: "2", name: "Michael Garcia", status: "Absent" },
      { id: "3", name: "Elizabeth Lee", status: "Present" },
     
    ],
    Mathematics: [
      { id: "1", name: "William Clark", status: "Present" },
      { id: "2", name: "Barbara Lewis", status: "Absent" },
      { id: "3", name: "Daniel Walker", status: "Present" },
    ],
    
  };

  const classSchedules = [
    { time: "9:00 AM - 10:30 AM", subject: "Economics", students: "3/3" },
    { time: "11:00 AM - 12:30 PM", subject: "Scientific Stream", students: "3/3" },
    { time: "1:30 PM - 3:00 PM", subject: "Mathematics and Technology", students: "3/3" },
    { time: "3:30 PM - 5:00 PM", subject: "Mathematics", students: "3/3" },
    
  ];

  const columns: ColumnDef<StudentValues>[] = [
    {
      accessorKey: "id",
      header: () => <div>ID</div>,
      cell: ({ row }) => <div className="lowercase hidden sm:table-cell">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "name",
      header: () => <div className="">Student name</div>,
      cell: ({ row }) => (
        <div className="capitalize">
          <div className="font-medium">{row.getValue("name")}</div>
        </div>
      ),
    },
    {
        accessorKey: "status",
        header: () => <div>Status</div>,
        cell: ({ row }) => (
          <div>
            {getStatusIcon(row.getValue("status"))}
          </div>
        )
        },
      
  ];

  const getStatusIcon = (status) => {
    if (status === "Present") {
      return <CheckIcon className="ml-5 w-5 h-5 text-green-500"/>;
    } else if (status === "Absent") {
      return <XIcon className="ml-5 w-5 h-5 text-red-500"/>;
    } else {
      return null; // Handle other cases if necessary
    }
  };
  
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: filteredStudents[classSchedules[0].subject],
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
        pageIndex: 0,
        pageSize: 3,
      },
    },
  });

  const getAttendanceStatistics = (subject) => {
    const students = filteredStudents[subject];
    const presentCount = students.filter(student => student.status === "Present").length;
    const absentCount = students.filter(student => student.status === "Absent").length;
    return { totalStudents: students.length, presentCount, absentCount };
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          
          <div>
            <h1 className="text-2xl font-bold">SAID YOUCEF</h1>
            <p className="text-muted-foreground">Math Teacher</p>
          </div>
        </div>
        <Input
          placeholder="Search Student..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="max-w-sm"
        />
        <div className="text-muted-foreground">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 hover:bg-muted/50 transition-colors">
                <CalendarDaysIcon className="w-5 h-5" />
                {selectedDate.toLocaleDateString()}
              </Button>
            </PopoverTrigger>
         
            <PopoverContent className="p-0">
              <Calendar value={selectedDate} onChange={setSelectedDate} className="p-4" />
            </PopoverContent>
          </Popover>
        </div>
        
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {classSchedules.map((schedule, index) => (
    <div key={index} className="bg-card p-4 rounded-lg shadow-md transition-shadow hover:shadow-lg">
      <h2 className="text-lg font-medium mb-4">{schedule.time}</h2>
      <p className="text-muted-foreground mb-4">{`${schedule.subject} (${schedule.students})`}</p>
      <div className="max-h-[350px] overflow-y-auto">
      <div className="flex justify-between mb-4">
  <div className="flex items-center">
    <span className="mr-2 font-medium">Total Students:</span>
    <span className="font-bold">{getAttendanceStatistics(schedule.subject).totalStudents}</span>
  </div>
  <div className="flex items-center">
    <CheckIcon className="w-5 h-5 text-green-500 mr-1" />
    <span className="text-green-500 font-bold">{getAttendanceStatistics(schedule.subject).presentCount}</span>
  </div>
  <div className="flex items-center">
    <XIcon className="w-5 h-5 text-red-500 mr-1" />
    <span className="text-red-500 font-bold">{getAttendanceStatistics(schedule.subject).absentCount}</span>
  </div>
</div>

       
         <Separator className="my-8" />
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
              {filteredStudents[schedule.subject]
                .filter((student) => student.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((student) => (
                  <TableRow key={student.id}>
                    {columns.map((column) => (
                      <TableCell key={column.accessorKey}>
                        {column.cell({ row: { getValue: (key: string | number) => student[key] }, original: student })}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              {!filteredStudents[schedule.subject].some((student) =>
                student.name.toLowerCase().includes(searchTerm.toLowerCase())
              ) && (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
        </Table>
      </div>
    </div>
  ))}
</div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6"></div>
    </div>
  );
}

function CalendarDaysIcon2(props) {
    return (
      <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 2v4" />
        <path d="M16 2v4" />
        <rect width="18" height="18" x="3" y="4" rx="2" />
        <path d="M3 10h18" />
        <path d="M8 14h.01" />
        <path d="M12 14h.01" />
        <path d="M16 14h.01" />
        <path d="M8 18h.01" />
        <path d="M12 18h.01" />
        <path d="M16 18h.01" />
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
    )
  }
  
  function DownloadIcon(props) {
    return (
      <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" x2="12" y1="15" y2="3" />
      </svg>
    );
  }
  
 
  
  function CalendarDaysIcon(props) {
    return (
      <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 2v4" />
        <path d="M16 2v4" />
        <rect width="18" height="18" x="3" y="4" rx="2" />
        <path d="M3 10h18" />
        <path d="M8 14h.01" />
        <path d="M12 14h.01" />
        <path d="M16 14h.01" />
        <path d="M8 18h.01" />
        <path d="M12 18h.01" />
        <path d="M16 18h.01" />
      </svg>
    );
  }
  function XIcon(props) {
    return (
      <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </svg>
    );
  }