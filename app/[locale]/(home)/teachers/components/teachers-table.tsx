
import * as React from "react"
import {
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons"
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
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { File } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { teacherRegistrationSchema } from "@/validators/teacherSchema"
import { z } from "zod"
import { useData } from "@/context/admin/fetchDataContext"
import SheetDemo from "./edit-teacher-form"
import { useTranslations } from "next-intl"
import { exportTableToExcel } from "@/components/excelExport"


type Status = 'active' | 'suspended' | 'expelled';
export type TeacherSummary = {
    id: string;
    teacher: string;
    status: Status;
    Subject: string;
    joiningDate: string;
    salary: number;
 
  };
 

export type teacher = {
    id: string;
    teacher: string;
    status: "active" | "suspended" | "failed";
    Subject: string;
    joiningDate: string;
    salary: number;
    

  };

  type TeacherFormValues = z.infer<typeof teacherRegistrationSchema>  & {id:string };
  export const DataTableDemo = () => {
    const [open,setOpen]=React.useState(false)
    const {teachers}=useData()
    
    const t=useTranslations()
    const [teacher,setTeacher]=React.useState<TeacherFormValues>({  
      
      id: '1',
      year: '2024',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: new Date('1990-01-01'),
      gender: 'male',
      address: '123 Main Street',
      city: 'Example City',
      state: 'Example State',
      postalCode: '12345',
      country: 'Example Country',
      teacherEmail: 'john.doe@example.com',
      teacherPhone: '123-456-7890',
      teacherSubject: 'Math',
      joiningDate:new Date('2024-01-01'),
      emergencyContactName: 'Jane Doe',
      emergencyContactPhone: '987-654-3210',
      medicalConditions: 'None',
      salary: 50000,
      status:"active",
    officeHours:[{
      day:'Monday',
      start:"08:00",
      end:"09:00"
    }]})
    const getStatusColor = React.useCallback((status:Status) => {
      switch (status) {
        case 'active':
          return '#2ECC71'; // Green for accepted
        case 'suspended':
          return '#F1C40F'; // Yellow for pending
        case 'expelled':
          return '#E74C3C'; // Red for rejected
        default:
          return '#FFFFFF'; // Default to white for unknown status
      }
    }, []);
    
   const columns: ColumnDef<TeacherFormValues>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "teacher",
      header:() => <div>{t('teacher')}</div>, 
      cell: ({ row }) => (
        <div className="capitalize">
           <div className="font-medium">{row.getValue("teacher")}</div>
                              <div className="hidden text-sm text-muted-foreground md:inline">
                              {row.getValue("email")}
                              </div>
        </div>
      ),
    },
    {
      accessorKey: "teacherSubject",
      header:() => <div>{t('subject')}</div>, 
      cell: ({ row }) => <div className="lowercase hidden sm:table-cell">{t(row.getValue("teacherSubject"))}</div>,
    },
    {
      accessorKey: "status",
      header:() => <div>{t('status')}</div>, 
      cell: ({ row }) => (
        <Badge   className="capitalize hidden sm:table-cell"  style={{backgroundColor:getStatusColor(row.getValue("status"))}}>{t(row.getValue("status"))}</Badge>
      ),
    },
    {
      accessorKey: "joiningDate",
      header:() => <div>{t('joining-date')}</div>, 
      cell: ({ row }) => (
        <div className="lowercase hidden sm:table-cell">
{((row.getValue("joiningDate") as Date)).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
        </div>
      ),
    },
    {
      accessorKey: "salary",
      header: () => <div className="text-right">{t('salary')}</div>,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("salary"))
  
        // Format the amount as a dollar amount
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "DZD",
        }).format(amount)
  
        return <div className="text-right font-medium">{formatted}</div>
      },
    },

    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const teacher = row.original
  
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">{t('open-menu')}</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t('actions')}</DropdownMenuLabel>
             
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={()=>openEditSheet(teacher)}>
                {t('view-teacher')} </DropdownMenuItem>
              <DropdownMenuItem>{t('view-payment-details')}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
  const handleExport = () => {
    const exceldata=teachers.map((teacher:any)=>({[`${t('teacher')}`]:teacher.teacher,
    [`${t('transaction')}`]:teacher.typeofTransaction,
    [`${t('subject')}`]:t(teacher.teacherSubject),
    [`${t('status')}`]: t(teacher.status),
    [`${t('joining-date-0')}`]:teacher.joiningDate,
    [`${t('salary')}`]: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "DZD",
    }).format(teacher.salary),
    }))
    exportTableToExcel(t('teachers-table'),exceldata);
  };
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const openEditSheet = (teacher:TeacherFormValues) => {
        setTeacher(teacher)
        setOpen(true); // Open the sheet after setting the level
      };
    
  const table = useReactTable({
    data:teachers,
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
        pageSize: 3, //custom default page size
      },
    },
  })
 

  
  return (
    <>
<div className="flex items-center justify-between">
       

    <Input
          placeholder={t('filter-teacher')}
          value={(table.getColumn("teacher")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("teacher")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
          <div className="flex items-center ml-auto">
    <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              {t('columns')} <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {t(column.id)}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="outline" className="ml-2" onClick={handleExport}>
       {t('export')} <File className="ml-2 h-4 w-4" />
      </Button>
    </div>
    </div>
  
    <Card x-chunk="dashboard-05-chunk-3">
    <CardHeader className="px-7">
      <CardTitle>{t('your-teachers')}</CardTitle>
      <CardDescription>
      {t('introducing-our-dynamic-name-dashboard-for-seamless-management-and-insightful-analysis',{name:'teachers'})} </CardDescription>
    </CardHeader>
    <CardContent>     
    <div className="w-full">
 
      <div className="rounded-md border">
        <Table id="teachers-table">
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
    <SheetDemo open={open} setOpen={setOpen}  teacher={teacher}/>
    </CardContent>
  </Card>
  </>
  )
}