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

export const ArchiveDataTable = () => {
    

    
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [searchTerm, setSearchTerm] = useState("");
    const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
    const startDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).getDay();
    const algebraData = [
      {
        name: "John Doe",
        attendance: [
          { date: "2023-06-01", present: true },
          { date: "2023-06-02", present: false },
          { date: "2023-06-03", present: true },
          { date: "2023-06-04", present: true },
          { date: "2023-06-05", present: false },
          { date: "2023-06-06", present: true },
          { date: "2023-06-07", present: true },
          { date: "2023-06-08", present: true },
          { date: "2023-06-09", present: true },
          { date: "2023-06-10", present: false },
          { date: "2023-06-11", present: true },
          { date: "2023-06-12", present: true },
          { date: "2023-06-13", present: true },
          { date: "2023-06-14", present: false },
          { date: "2023-06-15", present: true },
          { date: "2023-06-16", present: true },
          { date: "2023-06-17", present: true },
          { date: "2023-06-18", present: true },
          { date: "2023-06-19", present: false },
          { date: "2023-06-20", present: true },
          { date: "2023-06-21", present: true },
          { date: "2023-06-22", present: true },
          { date: "2023-06-23", present: true },
          { date: "2023-06-24", present: false },
          { date: "2023-06-25", present: true },
          { date: "2023-06-26", present: true },
          { date: "2023-06-27", present: true },
          { date: "2023-06-28", present: true },
          { date: "2023-06-29", present: false },
          { date: "2023-06-30", present: true },
        ],
      },
      {
        name: "Jane Smith",
        attendance: [
          { date: "2023-06-01", present: true },
          { date: "2023-06-02", present: false },
          { date: "2023-06-03", present: true },
          { date: "2023-06-04", present: true },
          { date: "2023-06-05", present: true },
          { date: "2023-06-06", present: false },
          { date: "2023-06-07", present: true },
          { date: "2023-06-08", present: true },
          { date: "2023-06-09", present: true },
          { date: "2023-06-10", present: true },
          { date: "2023-06-11", present: false },
          { date: "2023-06-12", present: true },
          { date: "2023-06-13", present: true },
          { date: "2023-06-14", present: true },
          { date: "2023-06-15", present: true },
          { date: "2023-06-16", present: false },
          { date: "2023-06-17", present: true },
          { date: "2023-06-18", present: true },
          { date: "2023-06-19", present: true },
          { date: "2023-06-20", present: true },
          { date: "2023-06-21", present: false },
          { date: "2023-06-22", present: true },
          { date: "2023-06-23", present: true },
          { date: "2023-06-24", present: true },
          { date: "2023-06-25", present: true },
          { date: "2023-06-26", present: false },
          { date: "2023-06-27", present: true },
          { date: "2023-06-28", present: true },
          { date: "2023-06-29", present: true },
          { date: "2023-06-30", present: true },
        ],
      },
      {
        "name": "Mary Johnson",
        "attendance": [
          { "date": "2023-06-01", "present": true },
          { "date": "2023-06-02", "present": false },
          { "date": "2023-06-03", "present": true },
          { "date": "2023-06-04", "present": true },
          { "date": "2023-06-05", "present": true },
          { "date": "2023-06-06", "present": false },
          { "date": "2023-06-07", "present": true },
          { "date": "2023-06-08", "present": true },
          { "date": "2023-06-09", "present": true },
          { "date": "2023-06-10", "present": true },
          { "date": "2023-06-11", "present": false },
          { "date": "2023-06-12", "present": true },
          { "date": "2023-06-13", "present": true },
          { "date": "2023-06-14", "present": true },
          { "date": "2023-06-15", "present": true },
          { "date": "2023-06-16", "present": false },
          { "date": "2023-06-17", "present": true },
          { "date": "2023-06-18", "present": true },
          { "date": "2023-06-19", "present": true },
          { "date": "2023-06-20", "present": true },
          { "date": "2023-06-21", "present": false },
          { "date": "2023-06-22", "present": true },
          { "date": "2023-06-23", "present": true },
          { "date": "2023-06-24", "present": true },
          { "date": "2023-06-25", "present": true },
          { "date": "2023-06-26", "present": false },
          { "date": "2023-06-27", "present": true },
          { "date": "2023-06-28", "present": true },
          { "date": "2023-06-29", "present": true },
          { "date": "2023-06-30", "present": true }
        ]
      },
      {
        "name": "James Brown",
        "attendance": [
          { "date": "2023-06-01", "present": true },
          { "date": "2023-06-02", "present": false },
          { "date": "2023-06-03", "present": true },
          { "date": "2023-06-04", "present": true },
          { "date": "2023-06-05", "present": true },
          { "date": "2023-06-06", "present": false },
          { "date": "2023-06-07", "present": true },
          { "date": "2023-06-08", "present": true },
          { "date": "2023-06-09", "present": true },
          { "date": "2023-06-10", "present": true },
          { "date": "2023-06-11", "present": false },
          { "date": "2023-06-12", "present": true },
          { "date": "2023-06-13", "present": true },
          { "date": "2023-06-14", "present": true },
          { "date": "2023-06-15", "present": true },
          { "date": "2023-06-16", "present": false },
          { "date": "2023-06-17", "present": true },
          { "date": "2023-06-18", "present": true },
          { "date": "2023-06-19", "present": true },
          { "date": "2023-06-20", "present": true },
          { "date": "2023-06-21", "present": false },
          { "date": "2023-06-22", "present": true },
          { "date": "2023-06-23", "present": true },
          { "date": "2023-06-24", "present": true },
          { "date": "2023-06-25", "present": true },
          { "date": "2023-06-26", "present": false },
          { "date": "2023-06-27", "present": true },
          { "date": "2023-06-28", "present": true },
          { "date": "2023-06-29", "present": true },
          { "date": "2023-06-30", "present": true }
        ]
      },
      {
        "name": "Patricia Davis",
        "attendance": [
          { "date": "2023-06-01", "present": true },
          { "date": "2023-06-02", "present": false },
          { "date": "2023-06-03", "present": true },
          { "date": "2023-06-04", "present": true },
          { "date": "2023-06-05", "present": true },
          { "date": "2023-06-06", "present": false },
          { "date": "2023-06-07", "present": true },
          { "date": "2023-06-08", "present": true },
          { "date": "2023-06-09", "present": true },
          { "date": "2023-06-10", "present": true },
          { "date": "2023-06-11", "present": false },
          { "date": "2023-06-12", "present": true },
          { "date": "2023-06-13", "present": true },
          { "date": "2023-06-14", "present": true },
          { "date": "2023-06-15", "present": true },
          { "date": "2023-06-16", "present": false },
          { "date": "2023-06-17", "present": true },
          { "date": "2023-06-18", "present": true },
          { "date": "2023-06-19", "present": true },
          { "date": "2023-06-20", "present": true },
          { "date": "2023-06-21", "present": false },
          { "date": "2023-06-22", "present": true },
          { "date": "2023-06-23", "present": true },
          { "date": "2023-06-24", "present": true },
          { "date": "2023-06-25", "present": true },
          { "date": "2023-06-26", "present": false },
          { "date": "2023-06-27", "present": true },
          { "date": "2023-06-28", "present": true },
          { "date": "2023-06-29", "present": true },
          { "date": "2023-06-30", "present": true }
        ]
      },
      {
        "name": "Robert Wilson",
        "attendance": [
          { "date": "2023-06-01", "present": true },
          { "date": "2023-06-02", "present": false },
          { "date": "2023-06-03", "present": true },
          { "date": "2023-06-04", "present": true },
          { "date": "2023-06-05", "present": true },
          { "date": "2023-06-06", "present": false },
          { "date": "2023-06-07", "present": true },
          { "date": "2023-06-08", "present": true },
          { "date": "2023-06-09", "present": true },
          { "date": "2023-06-10", "present": true },
          { "date": "2023-06-11", "present": false },
          { "date": "2023-06-12", "present": true },
          { "date": "2023-06-13", "present": true },
          { "date": "2023-06-14", "present": true },
          { "date": "2023-06-15", "present": true },
          { "date": "2023-06-16", "present": false },
          { "date": "2023-06-17", "present": true },
          { "date": "2023-06-18", "present": true },
          { "date": "2023-06-19", "present": true },
          { "date": "2023-06-20", "present": true },
          { "date": "2023-06-21", "present": false },
          { "date": "2023-06-22", "present": true },
          { "date": "2023-06-23", "present": true },
          { "date": "2023-06-24", "present": true },
          { "date": "2023-06-25", "present": true },
          { "date": "2023-06-26", "present": false },
          { "date": "2023-06-27", "present": true },
          { "date": "2023-06-28", "present": true },
          { "date": "2023-06-29", "present": true },
          { "date": "2023-06-30", "present": true }
        ]
      },
      {
        "name": "Linda Martinez",
        "attendance": [
          { "date": "2023-06-01", "present": true },
          { "date": "2023-06-02", "present": false },
          { "date": "2023-06-03", "present": true },
          { "date": "2023-06-04", "present": true },
          { "date": "2023-06-05", "present": true },
          { "date": "2023-06-06", "present": false },
          { "date": "2023-06-07", "present": true },
          { "date": "2023-06-08", "present": true },
          { "date": "2023-06-09", "present": true },
          { "date": "2023-06-10", "present": true },
          { "date": "2023-06-11", "present": false },
          { "date": "2023-06-12", "present": true },
          { "date": "2023-06-13", "present": true },
          { "date": "2023-06-14", "present": true },
          { "date": "2023-06-15", "present": true },
          { "date": "2023-06-16", "present": false },
          { "date": "2023-06-17", "present": true },
          { "date": "2023-06-18", "present": true },
          { "date": "2023-06-19", "present": true },
          { "date": "2023-06-20", "present": true },
          { "date": "2023-06-21", "present": false },
          { "date": "2023-06-22", "present": true },
          { "date": "2023-06-23", "present": true },
          { "date": "2023-06-24", "present": true },
          { "date": "2023-06-25", "present": true },
          { "date": "2023-06-26", "present": false },
          { "date": "2023-06-27", "present": true },
          { "date": "2023-06-28", "present": true },
          { "date": "2023-06-29", "present": true },
          { "date": "2023-06-30", "present": true }
        ]
      },
      {
        "name": "Michael Garcia",
        "attendance": [
          { "date": "2023-06-01", "present": true },
          { "date": "2023-06-02", "present": false },
          { "date": "2023-06-03", "present": true },
          { "date": "2023-06-04", "present": true },
          { "date": "2023-06-05", "present": true },
          { "date": "2023-06-06", "present": false },
          { "date": "2023-06-07", "present": true },
          { "date": "2023-06-08", "present": true },
          { "date": "2023-06-09", "present": true },
          { "date": "2023-06-10", "present": true },
          { "date": "2023-06-11", "present": false },
          { "date": "2023-06-12", "present": true },
          { "date": "2023-06-13", "present": true },
          { "date": "2023-06-14", "present": true },
          { "date": "2023-06-15", "present": true },
          { "date": "2023-06-16", "present": false },
          { "date": "2023-06-17", "present": true },
          { "date": "2023-06-18", "present": true },
          { "date": "2023-06-19", "present": true },
          { "date": "2023-06-20", "present": true },
          { "date": "2023-06-21", "present": false },
          { "date": "2023-06-22", "present": true },
          { "date": "2023-06-23", "present": true },
          { "date": "2023-06-24", "present": true },
          { "date": "2023-06-25", "present": true },
          { "date": "2023-06-26", "present": false },
          { "date": "2023-06-27", "present": true },
          { "date": "2023-06-28", "present": true },
          { "date": "2023-06-29", "present": true },
          { "date": "2023-06-30", "present": true }
        ]
      },
      {
        "name": "Elizabeth Lee",
        "attendance": [
          { "date": "2023-06-01", "present": true },
          { "date": "2023-06-02", "present": false },
          { "date": "2023-06-03", "present": true },
          { "date": "2023-06-04", "present": true },
          { "date": "2023-06-05", "present": true },
          { "date": "2023-06-06", "present": false },
          { "date": "2023-06-07", "present": true },
          { "date": "2023-06-08", "present": true },
          { "date": "2023-06-09", "present": true },
          { "date": "2023-06-10", "present": true },
          { "date": "2023-06-11", "present": false },
          { "date": "2023-06-12", "present": true },
          { "date": "2023-06-13", "present": true },
          { "date": "2023-06-14", "present": true },
          { "date": "2023-06-15", "present": true },
          { "date": "2023-06-16", "present": false },
          { "date": "2023-06-17", "present": true },
          { "date": "2023-06-18", "present": true },
          { "date": "2023-06-19", "present": true },
          { "date": "2023-06-20", "present": true },
          { "date": "2023-06-21", "present": false },
          { "date": "2023-06-22", "present": true },
          { "date": "2023-06-23", "present": true },
          { "date": "2023-06-24", "present": true },
          { "date": "2023-06-25", "present": true },
          { "date": "2023-06-26", "present": false },
          { "date": "2023-06-27", "present": true },
          { "date": "2023-06-28", "present": true },
          { "date": "2023-06-29", "present": true },
          { "date": "2023-06-30", "present": true }
        ]
      },
      {
        "name": "William Clark",
        "attendance": [
          { "date": "2023-06-01", "present": true },
          { "date": "2023-06-02", "present": false },
          { "date": "2023-06-03", "present": true },
          { "date": "2023-06-04", "present": true },
          { "date": "2023-06-05", "present": true },
          { "date": "2023-06-06", "present": false },
          { "date": "2023-06-07", "present": true },
          { "date": "2023-06-08", "present": true },
          { "date": "2023-06-09", "present": true },
          { "date": "2023-06-10", "present": true },
          { "date": "2023-06-11", "present": false },
          { "date": "2023-06-12", "present": true },
          { "date": "2023-06-13", "present": true },
          { "date": "2023-06-14", "present": true },
          { "date": "2023-06-15", "present": true },
          { "date": "2023-06-16", "present": false },
          { "date": "2023-06-17", "present": true },
          { "date": "2023-06-18", "present": true },
          { "date": "2023-06-19", "present": true },
          { "date": "2023-06-20", "present": true },
          { "date": "2023-06-21", "present": false },
          { "date": "2023-06-22", "present": true },
          { "date": "2023-06-23", "present": true },
          { "date": "2023-06-24", "present": true },
          { "date": "2023-06-25", "present": true },
          { "date": "2023-06-26", "present": false },
          { "date": "2023-06-27", "present": true },
          { "date": "2023-06-28", "present": true },
          { "date": "2023-06-29", "present": true },
          { "date": "2023-06-30", "present": true }
        ]
      },
      {
        "name": "Barbara Lewis",
        "attendance": [
          { "date": "2023-06-01", "present": true },
          { "date": "2023-06-02", "present": false },
          { "date": "2023-06-03", "present": true },
          { "date": "2023-06-04", "present": true },
          { "date": "2023-06-05", "present": true },
          { "date": "2023-06-06", "present": false },
          { "date": "2023-06-07", "present": true },
          { "date": "2023-06-08", "present": true },
          { "date": "2023-06-09", "present": true },
          { "date": "2023-06-10", "present": true },
          { "date": "2023-06-11", "present": false },
          { "date": "2023-06-12", "present": true },
          { "date": "2023-06-13", "present": true },
          { "date": "2023-06-14", "present": true },
          { "date": "2023-06-15", "present": true },
          { "date": "2023-06-16", "present": false },
          { "date": "2023-06-17", "present": true },
          { "date": "2023-06-18", "present": true },
          { "date": "2023-06-19", "present": true },
          { "date": "2023-06-20", "present": true },
          { "date": "2023-06-21", "present": false },
          { "date": "2023-06-22", "present": true },
          { "date": "2023-06-23", "present": true },
          { "date": "2023-06-24", "present": true },
          { "date": "2023-06-25", "present": true },
          { "date": "2023-06-26", "present": false },
          { "date": "2023-06-27", "present": true },
          { "date": "2023-06-28", "present": true },
          { "date": "2023-06-29", "present": true },
          { "date": "2023-06-30", "present": true }
        ]
      },
      {
        "name": "Daniel Walker",
        "attendance": [
          { "date": "2023-06-01", "present": true },
          { "date": "2023-06-02", "present": false },
          { "date": "2023-06-03", "present": true },
          { "date": "2023-06-04", "present": true },
          { "date": "2023-06-05", "present": true },
          { "date": "2023-06-06", "present": false },
          { "date": "2023-06-07", "present": true },
          { "date": "2023-06-08", "present": true },
          { "date": "2023-06-09", "present": true },
          { "date": "2023-06-10", "present": true },
          { "date": "2023-06-11", "present": false },
          { "date": "2023-06-12", "present": true },
          { "date": "2023-06-13", "present": true },
          { "date": "2023-06-14", "present": true },
          { "date": "2023-06-15", "present": true },
          { "date": "2023-06-16", "present": false },
          { "date": "2023-06-17", "present": true },
          { "date": "2023-06-18", "present": true },
          { "date": "2023-06-19", "present": true },
          { "date": "2023-06-20", "present": true },
          { "date": "2023-06-21", "present": false },
          { "date": "2023-06-22", "present": true },
          { "date": "2023-06-23", "present": true },
          { "date": "2023-06-24", "present": true },
          { "date": "2023-06-25", "present": true },
          { "date": "2023-06-26", "present": false },
          { "date": "2023-06-27", "present": true },
          { "date": "2023-06-28", "present": true },
          { "date": "2023-06-29", "present": true },
          { "date": "2023-06-30", "present": true }
        ]
      }
      
    ]
   


    const filteredAlgebraData = algebraData.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const columns: ColumnDef<StudentValues>[] = [
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
      ),
    },
    ...Array.from({ length: daysInMonth }, (_, i) => ({
      accessorKey: `day${i + 1}`,
      header: () => <div>{i + 1}</div>,
      cell: ({ row }: { row: any }) => {
        const record = row.original.attendance[i];
        return <div>{getStatusIcon(row.getValue("status"))}</div>;
      },
    })),
  ];

  const getStatusIcon = (status) => {
    if (status === "Present") {
      return <CheckIcon className="ml-5 w-5 h-5 text-green-500" />;
    } else if (status === "Absent") {
      return <XIcon className="ml-5 w-5 h-5 text-red-500" />;
    } else {
      return null; // Handle other cases if necessary
    }
  };

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: filteredAlgebraData,
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

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Archive Attendance</h1>
        </div>
        <div className="flex items-center gap-4 text-muted-foreground">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 hover:bg-muted/50 transition-colors">
                <CalendarDaysIcon className="w-5 h-5" />
                {selectedDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <Calendar value={selectedDate} onChange={setSelectedDate} className="p-4" />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <Separator className="my-8" />
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">List</h2>
          <Input
            placeholder="Search Student..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="max-w-sm"
          />
          <Button variant="outline" className="flex items-center gap-2 hover:bg-muted/50 transition-colors">
            <DownloadIcon className="w-5 h-5" />
            Export
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="sticky left-0 bg-background w-[200px]">Student</TableHead>
              {Array.from({ length: daysInMonth }, (_, i) => (
                <TableHead key={i} className="w-[50px] text-center">
                  {i + 1}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAlgebraData.map((student) => (
              <TableRow key={student.name}>
                <TableCell className="sticky left-0 bg-background font-medium">{student.name}</TableCell>
                {student.attendance.map((record, i) => (
                  <TableCell key={i} className={`text-center ${record.present ? "text-green-500" : "text-red-500"}`}>
                    {record.present ? <CheckIcon className="w-5 h-5" /> : <XIcon className="w-5 h-5" />}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
     
    </div>
  );
};
  
  function CalendarDaysIcon(props) {
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
    )
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
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" x2="12" y1="15" y2="3" />
      </svg>
    )
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
    )
  }