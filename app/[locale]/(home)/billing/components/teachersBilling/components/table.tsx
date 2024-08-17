
import { teacherPaymentRegistrationSchema } from "@/validators/teacherSalarySchema";
import * as React from "react"
import {
  CaretSortIcon,
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
import { z } from "zod"
import { File } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useData } from "@/context/admin/fetchDataContext"
import SheetDemo from "./edit-teacher-salary"
import { useTranslations } from "next-intl";
import { exportTableToExcel } from "@/components/excelExport";
import { downloadInvoice } from "./generateInvoice";
import { format } from "date-fns";

export type teacherSalary = {
  
  salaryDate: string;
  
  

};
export type TeacherSummary = {
  salaryDate: string;
}
type Status = 'paid' | 'not paid' 

type TeacherSalaryFormValues = z.infer<typeof teacherPaymentRegistrationSchema>  & {id:string };
  export const DataTableDemo = () => {
    const [open,setOpen]=React.useState(false)
    const{teachersSalary,setTeachersSalary}= useData()
    const t =useTranslations()
    const [teacherSalary,setTeacherSalary]=React.useState<any>({
      id:"qweqwe",
      salaryTitle: "Monthly Salary",
      salaryAmount: 5000,
      salaryDate: new Date('2024-01-01'),
      typeofTransaction:"Salary",
      monthOfSalary:"May",
      fromWho: "Company XYZ",
      status:"paid",
      teacher:{name:"joi",id:"2222"}
  })
    const getStatusColor = React.useCallback((status:Status) => {
      switch (status) {
        case 'paid':
          return '#2ECC71'; // Green for accepted
        case 'not paid':
          return '#E74C3C'; // Yellow for pending
        // Default to white for unknown status
      }
    }, []);
    
   const columns: ColumnDef<TeacherSalaryFormValues>[] = [
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
id:"teacher",
accessorFn: (row) => row.teacher.name,
header:() => <div>{t('teacher')}</div>, 
      cell: ({ row }) => (
        <div className="capitalize">
           <div className="font-medium">{row.original.teacher.teacher}</div>
        </div>
      ),
    },
    {
      accessorKey: "salaryDate",
      header:() => <div>{t('salary-date')}</div>, 
      cell: ({ row }) => (
       

        <div className="capitalize hidden sm:table-cell"> {((row.getValue("salaryDate") as Date)).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</div>
      ),
      
    },
    {
      accessorKey: "monthOfSalary",
      header:() => <div>{t('month-paid')}</div>, 
      cell: ({ row }) => (
        <div className="capitalize hidden sm:table-cell">{row.getValue("monthOfSalary")}</div>
      ),
    },


    {
      accessorKey: "salaryAmount",
      header: () => <div className="text-right">{t('amount')}</div>,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("salaryAmount"))
  
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
        const teacherSalary = row.original
  
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
              <DropdownMenuItem onClick={()=>openEditSheet(teacherSalary)}>
                {t('view-payment')} </DropdownMenuItem>
                <DropdownMenuItem onClick={()=>  downloadInvoice({
          toWho: teacherSalary.teacher.name,
          typeofPayment: teacherSalary.typeofTransaction,
          paymentAmount: teacherSalary.salaryAmount,
          salaryMonth:teacherSalary.monthOfSalary,
         paymentDate: format(teacherSalary.salaryDate, 'dd/MM/yyyy'),
          status: t(teacherSalary.status),
        
        },teacherSalary.id,[t('teacher'), t('method'), t('amount'), t("monthOfSalary"),t('paymentDate'), t('status')],
      {
        amount:t("Amount"), from:t('From:'), shippingAddress:t('shipping-address'), billedTo:t('billed-to'), subtotal:t('Subtotal:'), totalTax:t('total-tax-0'), totalAmount:t('total-amount-3'),invoice:t('payslip')
      })}>
                {t('print-bill')} </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
  const handleExport = () => {
    const exceldata=teachersSalary.map((teacher:any)=>({[`${t('teacher')}`]:teacher.teacher.name,
    [`${t('transaction')}`]:teacher.typeofTransaction,
   
    [`${t('salary-date')}`]:teacher.salaryDate,
    [`${t('month-paid')}`]:teacher.monthOfSalary,
    [`${t('status')}`]: t(teacher.status),
    [`${t('amount')}`]: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "DZD",
    }).format(teacher.salaryAmount),
    }))
    exportTableToExcel(t('teachers-salary-table'),exceldata);
  };
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const openEditSheet = (teacherSalary:TeacherSalaryFormValues) => {
    setTeacherSalary(teacherSalary)
        setOpen(true); // Open the sheet after setting the level
      };
    
  const table = useReactTable({
    data:teachersSalary,
    columns,
    filterFromLeafRows: true, // filter and search through sub-rows
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
  placeholder={t('filter-salaries')}
  value={(table.getColumn("teacher")?.getFilterValue() as string) ?? ""}
  onChange={(event) =>
    table.getColumn("teacher")?.setFilterValue(event.target.value)
  }
  className="max-w-sm"
/>
          <div className="flex items-center ml-auto">
          <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">
      {t('columns')} <ChevronDownIcon className="ml-2 h-4 w-4" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    {table.getAllColumns()
      .filter((column) => column.getCanHide())
      .map((column) => (
        <DropdownMenuCheckboxItem
          key={column.id}
          checked={column.getIsVisible()}
          onCheckedChange={() => column.toggleVisibility()}
        >
          {column.id} {/* Adjust to display appropriate name */}
        </DropdownMenuCheckboxItem>
      ))}
  </DropdownMenuContent>
</DropdownMenu>

        <Button variant="outline" className="ml-2" onClick={handleExport}>
       {t('export')} <File className="ml-2 h-4 w-4" />
      </Button>
    </div>
    </div>
  
    <Card x-chunk="dashboard-05-chunk-3">
    <CardHeader className="px-7">
      <CardTitle>{t('your-salary-roll')}</CardTitle>
      <CardDescription>
      {t('introducing-our-dynamic-teacgers-salary-dashboard-for-seamless-management-and-insightful-analysis')} </CardDescription>
    </CardHeader>
    <CardContent>     
    <div className="w-full">
 
      <div className="rounded-md border">
        <Table id="teachers-salary-table">
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

    <SheetDemo open={open} setOpen={setOpen}  teacherSalary={teacherSalary}/>
    </CardContent>
  </Card>
  </>
  )
}