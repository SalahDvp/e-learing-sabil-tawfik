

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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import {exportTableToExcel} from '@/components/excelExport'
import SheetDemo from "./editStudent"
import  studentRegistrationSchema  from "@/validators/auth";
import { useData } from "@/context/admin/fetchDataContext";
import { z } from "zod"
import { useTranslations } from "next-intl"
import { deleteStudent } from "@/lib/hooks/students"
import StudentForm from "./studentForm"
import StudentPaymentSheet from "./studentPaymentSheet"
type Status = 'accepted' | 'pending' | 'rejected';
export type StudentSummary = {
  id: string;
  teacher: string;
  status: Status;
  Subject: string;
  joiningDate: string;
  salary: number;

};
interface DataTableDemoProps {
  filter: string;
}
  type StudentFormValues = z.infer<typeof studentRegistrationSchema>  & {id:string };
  export const DataTableDemo: React.FC<DataTableDemoProps> = ({ filter }) => {
    const [open,setOpen]=React.useState(false)
    const [openPayment,setOpenPayment]=React.useState(false)
    const t=useTranslations()
    const {students,setStudents}=useData()
    const [student,setStudent]=React.useState<StudentFormValues>({  
      id: '123456',
      level: 'Intermediate',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: new Date('1990-01-01'),
      gender: 'male',
      address: '123 Main St',
      city: 'Anytown',
      state: 'State',
      postalCode: '12345',
      country: 'Country',
      parentFullName: 'Jane Doe',
      parentFirstName: 'Jane',
      parentLastName: 'Doe',
      parentEmail: 'jane.doe@example.com',
      parentPhone: '123-456-7890',
      parentId: '654321',
      emergencyContactName: 'Emergency Contact',
      emergencyContactPhone: '987-654-3210',
      medicalConditions: null,
      status: 'Active',
      joiningDate: new Date(),
      registrationStatus: 'Registered',
      startDate: new Date(),
      lastPaymentDate: new Date(),
      nextPaymentDate: new Date(),
      totalAmount: 1000,
      amountLeftToPay: 500,
      class: "S",
      registrationAndInsuranceFee:"Paid",
      feedingFee:"Paid"
    })
      // Define your table and set up filtering
  React.useEffect(() => {
         
    if (filter === "All") {
      table.resetColumnFilters()
    } else {
      table.getColumn("level")?.setFilterValue(filter);
    } 
  }, [filter]); 
    const openEditSheet = (student:StudentFormValues) => {
      setStudent(student)
      setOpen(true); // Open the sheet after setting the level
    };
    const openPaymentSheet = (student:StudentFormValues) => {
      setStudent(student)
      setOpenPayment(true); // Open the sheet after setting the level
    };
    const getMonthAbbreviation = (monthIndex: number) => {
      const startDate = new Date(2024, 8); // September 2023 (month index 8)
      const date = new Date(startDate.getFullYear(), startDate.getMonth() + monthIndex);
      const monthAbbreviation = date.toLocaleString('en-GB', { month: "short" });
      const yearAbbreviation = date.getFullYear().toString().substr(-2);
      return `${monthAbbreviation}${yearAbbreviation}`;
    };
    // Updated generateMonthlyPaymentColumns function
    const generateMonthlyPaymentColumns = (
      getMonthAbbreviation: (index: number) => string
    ): ColumnDef<any>[] => {
      return Array.from({ length: 11 }, (_, i) => {
        const monthAbbreviation = getMonthAbbreviation(i);
        return {
          accessorKey: `monthlyPayments.${monthAbbreviation}`,
          header: () => <div>{monthAbbreviation}</div>,
          cell: ({ row }: { row: any }) => {
            const isPaid = parseFloat('16000' )
         
            // row.original.monthly_payments[monthAbbreviation]?.paymentAmount
            // Format the amount as a dollar amount
            const formatted = new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "DZD",
            }).format(isPaid)
            
            return (
              <div className=" font-medium">{formatted}</div>
            );
          },
        };
      });
    };
    const columns: ColumnDef<any>[] = [
      {
        accessorKey: "student",
        header: () => <div >{t('student')}</div>,
  
        cell: ({ row }) => (
          <div className="capitalize">
             <div className="font-medium">{row.getValue("student")}</div>
                                <div className="hidden text-sm text-muted-foreground md:inline">
                                {row.getValue("email")}
                                </div>
          </div>
        ),
      },
      {
        accessorKey: "level",
        header: () => <div style={{ whiteSpace: 'pre-wrap' }}>{t('level')}</div>,
        cell: ({ row }) => <div>{row.original.level}</div>,
      },
      {
        accessorKey: "class",
        header: () => <div >{t('class')}</div>,
        cell: ({ row }) => <div>{row.original.class}</div>,
      },
      ...generateMonthlyPaymentColumns(getMonthAbbreviation),
      {
        accessorKey: "amountLeftToPay",
        header:() => <div style={{ whiteSpace: 'pre-wrap', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t('amount-left-to-pay-0')}</div>, 
  
        cell: ({ row }) => {
          const amount = parseFloat(row.getValue("amountLeftToPay"))
    
          // Format the amount as a dollar amount
          const formatted = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "DZD",
          }).format(amount)
    
          return <div className=" font-medium">{formatted}</div>
        },
      },
      {
        accessorKey: `registrationAndInsuranceFee`,
        header: () =>  <div style={{ whiteSpace: 'pre-wrap', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {t('registrationAndInsuranceFee')}
      </div>,
        cell: ({ row }: { row: any }) => {
          const amount = parseFloat(row.getValue("registrationAndInsuranceFee"))
    
          // Format the amount as a dollar amount
          const formatted = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "DZD",
          }).format(amount)
   
          
          return (
            <Badge
              style={{ backgroundColor:"#4CAF50" }}
            >
     {formatted}
          
            </Badge>
          );
        },
      },
      {
        accessorKey: `feedingFee`,
        header: () => <div style={{ whiteSpace: 'pre-wrap' }}>{t('feedingFee')}</div>,
        cell: ({ row }: { row: any }) => {
          const amount = parseFloat(row.getValue("feedingFee"))
    
          // Format the amount as a dollar amount
          const formatted = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "DZD",
          }).format(amount)
   
          
          return (
            <Badge
              style={{ backgroundColor:"#4CAF50" }}
            >
     {formatted}
          
            </Badge>
          );
        },
      },
      {
        id: "addPayment",
        enableHiding: false,
        cell: ({ row }) => {
          const student = row.original;
    
          return (
          <StudentPaymentSheet student={student}/>
          );
        },
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const student = row.original;
    
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <DotsHorizontalIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => openEditSheet(student)}>
                  {t('edit')} </DropdownMenuItem>
                  <DropdownMenuItem >
                  {t('payment')} </DropdownMenuItem>
                <DropdownMenuItem onClick={() =>{deleteStudent(student.id), setStudents((prevStudents:any) =>
      prevStudents.filter((std:any) => std.id !== student.id)
    )}}>
          {t('delete')} </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ];
    const data = {
      studentName: 'John Doe',
      level: 'Grade 5',
      class: '5A',
      parentName: 'Jane Doe',
      address: '123 Main St, City, Country',
      phoneNumber: '123-456-7890',
      restaurantPaymentPaid: 500,
      restaurantPaymentLeft: 200,
      insurancePaymentPaid: 300,
      insurancePaymentLeft: 150,
      schoolPaymentPaid: 1000,
      schoolPaymentLeft: 0,
    }


  const handleExport = () => {
  

    
const orderedMonths = [
  'Sept23', 'Oct23', 'Nov23', 'Dec23',
  'Jan24', 'Feb24', 'Mar24', 'Apr24',
  'May24', 'Jun24', 'Jul24','Aug24'
];
    const exceldata=students.map((student:any)=>({[`${t('Name')}`]:student.student,
    [`${t('level')}`]:student.level,
    [`${t('class')}`]:student.class,
    [`${t('status')}`]:t(student.status),
    [`${t('joining-date-0')}`]:student.joiningDate,
    ...orderedMonths.reduce((acc: Record<string, string>, month: string) => {
      const monthStatus = student.monthlyPayments23_24[month]?.status;
      acc[`${month}`] = t(monthStatus);
      return acc;
    }, {}),
    [t('registrationAndInsuranceFee')]:t(student.registrationAndInsuranceFee),
    [t('feedingFee')]:t(student.feedingFee),
    [`${t('amount-left')}`]: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "DZD",
    }).format(student.amountLeftToPay),
    [`${t('total-amount-0')}`]: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "DZD",
    }).format(student.totalAmount),

    }))
    exportTableToExcel(t('students-table'),exceldata);
  };
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
    
  const table = useReactTable({
    data:students,
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
        pageSize: 10, //custom default page size
      },
    },
  })

  return (
    <>



    <Card x-chunk="dashboard-05-chunk-3" className="mt-2 ">
    <CardHeader className="px-7">
      <CardTitle>{t('your-students')}</CardTitle>
      <CardDescription>
      {t('introducing-our-dynamic-student-dashboard-for-seamless-management-and-insightful-analysis')} 
      
      <div className="flex items-center justify-between">
       
    
    <Input
          placeholder={t('filter-student')}
          value={(table.getColumn("student")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("student")?.setFilterValue(event.target.value)
          }
          className="max-w-sm mt-4"
        />
          <div className=" ml-auto space-y-4 ">
            <StudentForm/>
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
        <Button variant="outline" className="ml-2"  
        
    onClick={handleExport}>
       {t('export')} <File className="ml-2 h-4 w-4" />
      </Button>
    </div>
 
    </div>
      </CardDescription>
    </CardHeader>
    <CardContent>     

 
    <ScrollArea style={{ width: 'calc(100vw - 170px)'}}>
        <Table id="students-table">
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
        <ScrollBar orientation="horizontal" />
        </ScrollArea>
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
      <SheetDemo open={open} setOpen={setOpen}  student={student}/>
    </CardContent>
  </Card>


  </>
  )
}