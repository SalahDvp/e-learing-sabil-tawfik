"use client";

import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ColumnDef, flexRender, useReactTable } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
;



interface DailyAttandenceDataTableProps {
  selectedEvent?: any | null;
  selectedClasss?:any
}


export const DailyAttandenceDataTable: React.FC<DailyAttandenceDataTableProps> = ({ selectedEvent,selectedClasss }) => {

  const [selectedSubject, setSelectedSubject] = useState<string | null>(selectedClasss.subject ||   "Economics");
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    // Mock data for demonstration
    const mockStudents: any[] = [
     
    ];

    setStudents(mockStudents);
  }, [selectedSubject]);

  const columns: ColumnDef<any>[] = [
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
      return null; // Handle other cases if necessary
    }
  };

  const table = useReactTable({
    data: students,
    columns,
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 12,
      },
    },
  });

  const filteredData = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.id.includes(searchTerm)
  );



  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">{selectedClasss.teacherName}</h1>
            <p className="text-muted-foreground">{selectedClasss.year}</p>
          </div>
        </div>
        <Input
          placeholder="Search Student..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="max-w-sm"
        />
        <div className="text-muted-foreground">
         
        </div>
      </div>

      <div className="bg-card p-4 rounded-lg shadow-md transition-shadow hover:shadow-lg">
        {selectedEvent && (
          <>
            <h2 className="text-lg font-medium mb-4">{selectedClasss.subject}</h2>
            <p className="text-muted-foreground mb-4">{selectedEvent.extendedProps?.description}</p>
          </>
        )}
        <h2 className="text-lg font-medium mb-4">{selectedSubject}</h2>
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