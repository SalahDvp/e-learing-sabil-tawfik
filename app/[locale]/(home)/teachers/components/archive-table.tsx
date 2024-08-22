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
import { useTranslations } from "next-intl";
import { addDays, endOfMonth, format, startOfMonth } from "date-fns";


export type studentAttandance = {
  id: string;
  name: string;
  status: string;
};
const getStatusIcon = (status: string) => {
 if(status === "present"){
  return <CheckIcon className="ml-5 w-5 h-5 text-green-500" />;
 }
 if(status === "Absent"){
  return <XIcon className="ml-5 w-5 h-5 text-red-500" />;
 }
 
};

// Generate date columns dynamically
const generateDateColumns = (dates: string[]) => {
  return dates.map(date => ({
    accessorKey: date,
    header: () => <div>{date}</div>,
    cell: ({ row }) => <div>{getStatusIcon(row.getValue(date))}</div>,
  }));
};
const getNextFourDates = (day: string, startTime: string, endTime: string) => {
  const daysOfWeek = { Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6 };
  const targetDay = daysOfWeek[day];
  const dates = [];
  let currentDate = startOfMonth(new Date());
  const lastDate = endOfMonth(new Date());

  while (currentDate <= lastDate && dates.length < 4) {
    if (currentDate.getDay() === targetDay) {
      const dateStr = format(currentDate, 'yyyy-MM-dd');
      dates.push(`${dateStr}-${startTime}-${endTime}`);
    }
    currentDate = addDays(currentDate, 1);
  }

  return dates;
};
const generateTableData = (classes: any[]) => {
  const tableData = [];

  classes.forEach(cls => {
    cls.groups.forEach(group => {
      // Generate the next 4 dates for the group
      const dates = getNextFourDates(group.day, group.start, group.end);

      cls.students.forEach(student => {
        if (student.group === group.group) {
          const row = {
            index: student.index,
            group: group.group,
            name:student.name,
            ...dates.reduce((acc, date) => {
              const [yearStrOnly,monthStr,dayStr] = date.split('-');
              const dateKey = `${yearStrOnly}-${monthStr}-${dayStr}-${group.group}`;
              const attendanceEntry = cls.Attendance?.[dateKey];
               
                
              if (attendanceEntry) {
                const isPresent = attendanceEntry.attendanceList.some(att => att.id === student.id);
                acc[date] = isPresent ? 'present' : 'Absent';
              } else {
                acc[date] = 'Absent'; // Mark as Absent if no attendance record exists for that date
              }

              return acc;
            }, {} as { [key: string]: string })
          };
          tableData.push(row);
        }
      });
    });
  });

  return tableData;
};
const generateColumns = (dates: string[]): ColumnDef<any>[] => {
  const baseColumns: ColumnDef<any>[] = [
    {
      accessorKey: "index",
      header: () => <div>Index</div>,
      cell: ({ row }) => <div>{row.getValue("index")}</div>,
    },
    {
      accessorKey: "name",
      header: () => <div>Student Name</div>,
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "group",
      header: () => <div>Group</div>,
      cell: ({ row }) => <div>{row.getValue("group")}</div>,
    },
    ...dates.map(date => ({
      accessorKey: date,
      header: () => <div>{date}</div>,
      cell: ({ row }) => <div>{getStatusIcon(row.getValue(date))}</div>,
    }))
  ];

  return baseColumns;
};
export const ArchiveDataTable = ({teacher}) => {
  const {classes,teachers}=useData()
  const teacherClasses = useMemo(() => classes.filter((cls) => cls.teacherUID === teacher.id), [classes, teacher.id]);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
console.log(teacherClasses);

  const dates = useMemo(() => {

    
    return     selectedGroup ?Array.from(new Set(
      teacherClasses.flatMap(cls => 
        cls.groups
          .filter(group => group.group === selectedGroup) // Show all if selectedGroup is null, otherwise filter
          .flatMap(group => getNextFourDates(group.day, group.start, group.end))
      )
    )):
    Array.from(new Set(
      teacherClasses.flatMap(cls => 
        cls.groups
          .flatMap(group => getNextFourDates(group.day, group.start, group.end)))))
  }, [teacherClasses, selectedGroup]);
  const data = useMemo(() => generateTableData(teacherClasses), [teacherClasses]);
  const columns = useMemo(() => generateColumns(dates), [dates,selectedGroup]);
  const filteredData = useMemo(() => 
    selectedGroup ? data.filter(item => item.group === selectedGroup) : data, 
    [data, selectedGroup]
  );


  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: filteredData,
    columns:columns,
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
  const headerGroups = useMemo(() => table.getHeaderGroups(), [table,selectedGroup]);

  // Memoize the rows
  const rows = useMemo(() => table.getRowModel().rows, [table,selectedGroup]);
  const t=useTranslations()
  const handleTabClick = (value: string | number) => {
    if (value === 'All') {
      setSelectedGroup(null); // Show all data if "All" is selected
    } else {
      setSelectedGroup(value as string); // Filter data based on the selected group
    }
    table.resetColumnFilters();
  };
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
      <Tabs defaultValue={"All"}>
              <div className="flex items-center">
                <TabsList>
                <TabsTrigger   value={"All"} onClick={() =>   handleTabClick('All')}>
                      Tout
                    </TabsTrigger>
                    {teacher.classes!= null &&(teacher.classes.map((group,index) => (
                    <TabsTrigger key={index} value={index} onClick={() =>  handleTabClick(group.group)  }>
                     {t(`${group.day}`)},{group.start}-{group.end}
                    </TabsTrigger>
                  )))}
                </TabsList>
              </div>
              {/*  */}
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
    <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} {t('row-s-selected')}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {t('previous')} </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {t('next')} </Button>
        </div>
      </div>
      </div>
      <div className="py-4">
  <div className="flex flex-col space-y-2">
  <div className="text-sm">
      <strong>payment type: </strong>
      {teacher.paymentType}
    </div>
    <div className="text-sm">
      <strong>{t('Amount')}: </strong>
      {teacher.amount}
    </div>
    <div className="text-sm">
      <strong>{t('Reimbursement')}: </strong>
      { teacherClasses.reimbursements?.length ? (
        <ul>
          { teacherClasses.reimbursements.map((item, index) => (
            <li key={index}>{JSON.stringify(item)}</li>
          ))}
        </ul>
      ) : (
        <span>{t('No reimbursement data')}</span>
      )}
    </div>
    <div className="text-sm">
      <strong>{t('Advance')}: </strong>
      {teacher.advancePayment?.length ? (
        <ul>
          {teacher.advancePayment.map((item, index) => (
            <li key={index}>{JSON.stringify(item)}</li>
          ))}
        </ul>
      ) : (
        <span>{t('No advance data')}</span>
      )}
    </div>
  </div>
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