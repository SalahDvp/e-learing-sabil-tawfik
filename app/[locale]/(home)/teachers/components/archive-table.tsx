import { useCallback, useMemo, useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
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
} from "@tanstack/react-table";
import { useData } from "@/context/admin/fetchDataContext";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";


export type studentAttandance = {
  id: string;
  name: string;
  status: string;
};
const getStatusIcon = (status: string) => {
  // Define how you want to render the status icon
  return status === "present" ? <CheckIcon className="ml-5 w-5 h-5 text-green-500" />:
  <XIcon className="ml-5 w-5 h-5 text-red-500" />;
};

// Generate date columns dynamically
const generateDateColumns = (dates: string[]) => {
  return dates.map(date => ({
    accessorKey: date,
    header: () => <div>{date}</div>,
    cell: ({ row }) => <div>{getStatusIcon(row.getValue(date))}</div>,
  }));
};

export const ArchiveDataTable = ({teacher}) => {
  const {classes,teachers}=useData()
  const [filter,setFilter]=useState(teacher.year[0])
  const transformData = useCallback((data: any) => {
    if (data) {
      const { id, Attendance, students } = data;
  
      // Create a map to store the attendance statuses by name, ID, and date
      const attendanceMap: { [key: string]: { [key: string]: string; index?: number; group?: string } } = {};
  
      // Initialize the map with all dates
      for (const [date, { attendanceList }] of Object.entries(Attendance)) {
        // Create a set of student IDs for fast lookup
        const studentIdsSet = new Set(students.map((student: any) => student.id));
  
        // For each student, set their status based on whether they appear in attendanceList
        students.forEach(student => {
          const { id: studentId, name } = student;
          const studentKey = `${name}-${studentId}`; // Unique key for each student by name and ID
          
          if (!attendanceMap[studentKey]) {
            attendanceMap[studentKey] = {};
          }
  
          // Check if the student is in the attendance list
          const studentInAttendance = attendanceList.find(({ id }) => id === studentId);
  
          if (studentInAttendance) {
            const { status, index, group } = studentInAttendance;
            attendanceMap[studentKey][date] = status;
            attendanceMap[studentKey].index = index;
            attendanceMap[studentKey].group = group;
          } else {
            // Mark the student as absent if not found in the attendance list
            attendanceMap[studentKey][date] = 'Absent';
            attendanceMap[studentKey].index = student.index;
            attendanceMap[studentKey].group = student.group;
          }
        });
      }
  
      // Convert the map to an array of objects
      const rowData = students.map(student => {
        const studentKey = `${student.name}-${student.id}`; // Unique key for each student by name and ID
        return {
          id: student.id,
          name: student.name,
          ...attendanceMap[studentKey], // Use the unique key to get the data
        };
      });
  
      return rowData;
    }
  }, []); // Add dependencies if necessary
  const transformedData = useMemo(() => {
    const classData = classes.find((cls) => cls.teacherUID === teacher.id && cls.subject === teacher['educational-subject'] && cls.year === filter);
    return transformData(classData);
  }, [classes, filter, teacher, transformData]); // Ensure dependencies are correctly set
  
  const tabsList = useMemo(() => {
      return teacher.year
    }, [classes, teacher.id, teacher['educational-subject']]);
     
    const datesKeys=useMemo(() => classes.find((cls)=>cls.teacherUID===teacher.id &&cls.subject===teacher[`educational-subject`] && cls.year===filter), [classes,filter]);



   const dates = datesKeys?Object.keys(datesKeys.Attendance):null;

    const baseColumns: ColumnDef<any>[] = [
  {
    accessorKey: "index",
    header: () => <div>index</div>,
    cell: ({ row }) => <div>{row.getValue("index")}</div>,
  },
  {
    accessorKey: "group",
    header: () => <div>group</div>,
    cell: ({ row }) => <div>{row.getValue("group")}</div>,
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
];

// // Conditionally add date columns
  const dateColumns = dates ? generateDateColumns(dates) : [];

// // Combine columns
const columns: ColumnDef<any>[] = [...baseColumns, ...dateColumns];


  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: transformedData?transformedData:[],
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
  const headerGroups = useMemo(() => table.getHeaderGroups(), [table]);

  // Memoize the rows
  const rows = useMemo(() => table.getRowModel().rows, [table]);
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Archive Attendance</h1>
        </div>
        <div className="flex items-center gap-4 text-muted-foreground">
          <Popover>
            <PopoverTrigger asChild></PopoverTrigger>
            <PopoverContent className="p-0"></PopoverContent>
          </Popover>
        </div>
      </div>
      <Separator className="my-8" />
      <div>
      <Tabs defaultValue={tabsList[0]}>
              <div className="flex items-center">
                <TabsList>
                  {tabsList.map((level) => (
                    <TabsTrigger key={level} value={level} onClick={() =>setFilter(level)}>
                      {level}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </Tabs>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">List</h2>
          {/* <Input
          placeholder="filter"
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm "
        /> */}
          <Button variant="outline" className="flex items-center gap-2 hover:bg-muted/50 transition-colors">
            <DownloadIcon className="w-5 h-5" />
            Export
          </Button>
        </div>
        <Table>
      <TableHeader>
        {headerGroups.map(headerGroup => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <TableHead key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {rows.map(row => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map(cell => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
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