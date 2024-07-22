import { useMemo, useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
import { useData } from "@/context/admin/fetchDataContext";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";


export type studentAttandance = {
  id: string;
  name: string;
  status: string;
};

const algebraData = 
{
  id: "1",
  name: "John Doe",
  attendance: {
     "2023-06-01":{attendanceList:[{name:"youcef",status:"present"}]},
     "2023-06-02":{attendanceList:[{name:"youcef",status:"present"}]},
     "2023-06-03":{attendanceList:[{name:"youcef",status:"present"}]},
     "2023-06-04":{attendanceList:[{name:"youcef",status:"present"}]},
     "2023-06-05":{attendanceList:[{name:"youcef",status:"present"}]},
     "2023-06-06":{attendanceList:[{name:"youcef",status:"present"}]},
     "2023-06-07":{attendanceList:[{name:"youcef",status:"present"}]},
     "2023-06-08":{attendanceList:[{name:"youcef",status:"present"}]},
     "2023-06-09":{attendanceList:[{name:"youcef",status:"present"}]},
     "2023-06-10":{attendanceList:[{name:"youcef",status:"present"}]},
     "2023-06-11":{attendanceList:[{name:"youcef",status:"present"}]},
     "2023-06-12":{attendanceList:[{name:"youcef",status:"present"}]},
     "2023-06-13":{attendanceList:[{name:"youcef",status:"present"}]},
     "2023-06-14":{attendanceList:[{name:"youcef",status:"present"}]},
     "2023-06-15":{attendanceList:[{name:"youcef",status:"present"}]},
     "2023-06-16":{attendanceList:[{name:"youcef",status:"present"}]},
     "2023-06-17":{attendanceList:[{name:"youcef",status:"present"}]},
     "2023-06-18":{attendanceList:[{name:"youcef",status:"present"}]},
     "2023-06-19":{attendanceList:[{name:"youcef",status:"present"}]},
     "2023-06-20":{attendanceList:[{name:"youcef",status:"present"}]},
     "2023-06-21":{attendanceList:[{name:"youcef",status:"present"}]},
     "2023-06-22":{attendanceList:[{name:"youcef",status:"present"}]},
     "2023-06-23":{attendanceList:[{name:"youcef",status:"present"}]},
     "2023-06-24":{attendanceList:[{name:"youcef",status:"present"}]},
     "2023-06-25":{attendanceList:[{name:"youcef",status:"present"}]},
     "2023-06-26":{attendanceList:[{name:"youcef",status:"present"}]},
     "2023-06-27":{attendanceList:[{name:"youcef",status:"present"}]},
     "2023-06-28":{attendanceList:[{name:"youcef",status:"present"}]},
     "2023-06-29":{attendanceList:[{name:"youcef",status:"present"}]},
     "2023-06-30":{attendanceList:[{name:"youcef",status:"present"}]},
  },
}
const getStatusIcon = (status: string) => {
  // Define how you want to render the status icon
  return status === "present" ? "✔️" : "❌";
};

// Generate date columns dynamically
const generateDateColumns = (dates: string[]) => {
  return dates.map(date => ({
    accessorKey: date,
    header: () => <div>{date}</div>,
    cell: ({ row }) => <div>{getStatusIcon(row.getValue(date))}</div>,
  }));
};
const transformData = (data: any) => {
  if(data){
    const { id, name, attendance } = data;
    // Create a map to store the attendance statuses by name and date
    const attendanceMap: { [key: string]: { [key: string]: string } } = {};
  
    // Initialize the map with all dates
    for (const [date, { attendanceList }] of Object.entries(attendance)) {
      attendanceList.forEach(({ name, status,index,group}) => {
        if (!attendanceMap[name]) {
          attendanceMap[name] = {};
        }
        attendanceMap[name][date] = status;
        attendanceMap[name].index = index;
        attendanceMap[name].group= group;
      });
    }
  
    // Convert the map to an array of objects
    const rowData = Object.keys(attendanceMap).map(name => ({
      id,
      name,
      ...attendanceMap[name]
    }));
  
    return rowData;
  }
  
};
export const ArchiveDataTable = ({teacher}) => {
  const {classes}=useData()

    const [filter,setFilter]=useState('1AS')
    const transformedData = useMemo(() => transformData(classes.find((cls)=>cls.teacherUID===teacher.id &&cls.subject===teacher.subject && cls.year===filter)), [classes,filter]);
    const tabsList=classes.filter((cls)=>cls.teacherUID===teacher.id &&cls.subject===teacher.subject )
      console.log(transformedData);
      
    const datesKeys=useMemo(() => classes.find((cls)=>cls.teacherUID===teacher.id &&cls.subject===teacher.subject && cls.year===filter), [classes,filter]);


    
    const dates = datesKeys?Object.keys(datesKeys.attendance):null;
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

// Conditionally add date columns
  const dateColumns = dates ? generateDateColumns(dates) : [];

// Combine columns
const columns: ColumnDef<any>[] = [...baseColumns, ...dateColumns];


  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: transformedData,
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
            <PopoverTrigger asChild></PopoverTrigger>
            <PopoverContent className="p-0"></PopoverContent>
          </Popover>
        </div>
      </div>
      <Separator className="my-8" />
      <div>
      <Tabs defaultValue={tabsList[0]?.year}>
              <div className="flex items-center">
                <TabsList>
                  {tabsList.map((level) => (
                    <TabsTrigger key={level.year} value={level.year} onClick={() =>setFilter(level.year)}>
                      {level.year}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
    
            </Tabs>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">List</h2>
          <Input
          placeholder="filter"
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm "
        />
          <Button variant="outline" className="flex items-center gap-2 hover:bg-muted/50 transition-colors">
            <DownloadIcon className="w-5 h-5" />
            Export
          </Button>
        </div>
      {dates?  (<Table>
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map(row => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map(cell => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>):(
        <div>
          no attendance available yet 
          </div>
      )}
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