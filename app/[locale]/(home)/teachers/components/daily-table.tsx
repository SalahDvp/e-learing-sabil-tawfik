"use client";

import { useState, useMemo } from "react";

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
import { Input } from "@/components/ui/input";
import { useData } from "@/context/admin/fetchDataContext";
import React from "react";
import { Tabs,TabsList,TabsTrigger } from '@/components/ui/tabs';



export const DailyAtandenceDataTable = ({teacher }: {teacher:any }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const { students, setStudents } = useData();

  const [filter,setFilter]=useState("All")

  const selectedStudents = useMemo(() => 
    students.filter((std) =>
      std.classes.some((cls) => teacher.groupUIDs.includes(cls.id))
    ), [students]);

  const columns = useMemo(() => [
    {
      accessorKey: "id",
      header: () => <div>Index</div>,
      cell: ({ row }) =>{
        const index=row.original.classes.find((cls:any) => teacher.groupUIDs.includes(cls.id)).index
       
        
        return(
        <div className="lowercase hidden sm:table-cell">{index}</div>
      ) },
    },
    {
      accessorKey: "name",
      header: () => <div className="">Student Name</div>,
      cell: ({ row }) => (
        <div className="capitalize">
          <div className="font-medium">{row.getValue("name")}</div>
        </div>
      ),
    },
    
    {
      accessorKey: "year",
      header: () => <div>year</div>,
      cell: ({ row }) => <div>{row.getValue("year")}</div>,
    },
    {
      accessorKey: "group",
      header: () => <div>group</div>,
      cell: ({ row }) =>{
        const index=row.original.classes.find((cls:any) => teacher.groupUIDs.includes(cls.id)).group
       
        
        return(
        <div className="lowercase hidden sm:table-cell">{index}</div>
      ) },
    },
    // Add any additional columns you might need here
  ], []);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: selectedStudents,
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



  // Ensure that the column you interact with exists
  

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">{teacher?.name}</h1>
            <p className="text-muted-foreground">{teacher[`educational-subject`]}</p>
          </div>
        </div>
        <Input
          placeholder="Search by Name or ID..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="max-w-sm"
        />
              <div className="text-muted-foreground">
        </div>
      </div>
      <Tabs defaultValue="all">
              <div className="flex items-center">
                <TabsList>
                <TabsTrigger value="all" onClick={() =>       table.resetColumnFilters()}>ooo</TabsTrigger>
                  {teacher.year.map((level) => (
                    <TabsTrigger key={level} value={level} onClick={() =>    table.getColumn("year")?.setFilterValue(level)}>
                      {level}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              {/*  */}
            </Tabs>
      <Table>
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
      </Table>
    </div>
  );
};
