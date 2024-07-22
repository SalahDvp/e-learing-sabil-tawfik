"use client";

import { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ColumnDef, flexRender, useReactTable } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { studnetRegistrationSchema } from "@/validators/studentinfo";

type StudentValues = z.infer<typeof studnetRegistrationSchema> & { id: string };

interface DailyAtandenceDataTableProps {
  selectedEvent?: EventInput | null;
}

export const DailyAtandenceDataTable: React.FC<DailyAtandenceDataTableProps> = ({ selectedEvent }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSubject, setSelectedSubject] = useState<string | null>("Economics"); // Default subject
  const [searchTerm, setSearchTerm] = useState("");

  // Example data for demonstration
  const filteredStudents: { [key: string]: StudentValues[] } = {
    Economics: [
      { id: "1", name: "John Smith", status: "Present" },
      { id: "2", name: "Jane Doe", status: "Absent" },
      { id: "3", name: "Mary Johnson", status: "Present" },
      { id: "4", name: "James Brown", status: "Absent" },
      { id: "5", name: "Patricia Davis", status: "Present" },
      { id: "6", name: "Robert Wilson", status: "Absent" },
      { id: "7", name: "Linda Martinez", status: "Present" },
      { id: "8", name: "Michael Garcia", status: "Absent" },
      { id: "9", name: "Elizabeth Lee", status: "Present" },
      { id: "10", name: "William Clark", status: "Present" },
      { id: "11", name: "Barbara Lewis", status: "Absent" },
      { id: "12", name: "Daniel Walker", status: "Present" },
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
    { time: "9:00 AM - 10:30 AM", subject: "Economics" },
    { time: "11:00 AM - 12:30 PM", subject: "Scientific Stream" },
    { time: "1:30 PM - 3:00 PM", subject: "Mathematics and Technology" },
    { time: "3:30 PM - 5:00 PM", subject: "Mathematics" },
  ];

  // Find the schedule for the selected subject
  const selectedSchedule = classSchedules.find(schedule => schedule.subject === selectedSubject) || { time: "", subject: "" };

  const columns: ColumnDef<StudentValues>[] = [
    {
      accessorKey: "id",
      header: () => <div>ID</div>,
      cell: ({ row }) => <div className="lowercase hidden sm:table-cell">{row.getValue("id")}</div>,
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
      accessorKey: "status",
      header: () => <div>Status</div>,
      cell: ({ row }) => <div>{getStatusIcon(row.getValue("status"))}</div>,
    },
  ];

  const getStatusIcon = (status) => {
    if (status === "Present") {
      return <CheckIcon className="ml-5 w-5 h-5 text-green-500" />;
    } else if (status === "Absent") {
      return <XIcon className="ml-5 w-5 h-5 text-red-500" />;
    } else {
      return null;
    }
  };

  const table = useReactTable({
    data: selectedSubject ? filteredStudents[selectedSubject].slice(0,selectedSubject) : [],
    columns,
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 12,
      },
    },
  });

  const filteredData = filteredStudents[selectedSubject || ""]
  .filter((student) => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    student.id.includes(searchTerm)
  );

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
      
      <div className="bg-card p-4 rounded-lg shadow-md transition-shadow hover:shadow-lg">
        {selectedEvent && (
          <>
            <h2 className="text-lg font-medium mb-4">{selectedEvent.title}</h2>
            <p className="text-muted-foreground mb-4">{selectedEvent.extendedProps?.description}</p>
          </>
        )}
        <h2 className="text-lg font-medium mb-4">{selectedSchedule.time}</h2>
        <p className="text-muted-foreground mb-4">{selectedSchedule.subject}</p>
        <Separator className="my-8" />
        <div className="overflow-auto" style={{ maxHeight: '400px' }}>
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
              {filteredData.map((student) => (
                <TableRow key={student.id}>
                  {columns.map((column) => (
                    <TableCell key={column.accessorKey}>
                      {column.cell({ row: { getValue: (key: string | number) => student[key] }, original: student })}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              {!filteredData.length && (
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
    <svg viewBox="0 0 24 24" {...props}>
      <path d="M9 16.2l-3.5-3.5 1.41-1.41L9 13.38l7.09-7.09L17.5 8.3z" />
    </svg>
  );
}

function XIcon(props) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
    </svg>
  );
}

export default DailyAtandenceDataTable;