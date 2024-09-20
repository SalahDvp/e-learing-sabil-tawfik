"use client";
import * as React from "react";
import { useState,useMemo, useEffect } from "react";
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { File } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useData } from "@/context/admin/fetchDataContext";
import EditStudentPaymentForm from "./editStudentPaymentForm";
import { useTranslations } from "next-intl";
import { exportTableToExcel } from "@/components/excelExport";
import { format } from "date-fns";
import { downloadInvoice } from "./generateInvoice";

type Status = "paid" | "not paid" | "rejected";
export const TransactionDataTableDemo = () => {
  const { students, invoices } = useData();
  const [invoice, setInvoice] = React.useState<any>(null);
  const t = useTranslations();
  const [open, setOpen] = React.useState(false);
console.log('ffff',invoices );

  const openEditSheet = (student: any) => {
    setInvoice(student);
    setOpen(true);
  };

  const getStatusColor = React.useCallback((status: Status) => {
    switch (status) {
      case "paid":
        return "#2ECC71"; // Green for accepted
      case "not paid":
        return "#F1C40F"; // Yellow for pending
      case "rejected":
        return "#E74C3C"; // Red for rejected
      default:
        return "#FFFFFF"; // Default to white for unknown status
    }
  }, []);

  const handleExport = () => {
    const exceldata = invoices?.flatMap((invoice: any) =>
      invoice.transaction.map((trans: any) => ({
        [`${t("transaction-id")}`]: invoice.id,
        [`${t("student")}`]: invoice.student.student,
        [`${t("amount")}`]: new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "DZD",
        }).format(trans.amount),
        [`${t("payment-date")}`]: format(trans.paymentDate.toDate(), "dd/MM/yyyy"),
        [`${t("status")}`]: t(trans.status),
        [`${t("from")}`]: trans.fromWho,
      }))
    );
    exportTableToExcel(t("students-payments-transactions-table"), exceldata);
  };

  

  



  const transactionsData = useMemo(() => {
    if (!Array.isArray(invoices)) {
      return [];
    }

    return invoices.flatMap((invoice: any) =>
      (Array.isArray(invoice?.transaction) ? invoice.transaction : []).map((trans: any) => ({
        ...invoice,
        ...trans,
      }))
    ).sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime());
  }, [invoices]);
  

  // Define hooks outside of conditional blocks
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const columns: ColumnDef<any>[] = [
    {
      id:"student",
      header: "Student",
      accessorFn: (row) => row?.student?.student,
      cell: ({ getValue }) => <div className="font-medium">{getValue()}</div>,
    },
    {
      header: "Payment Day",
      accessorFn: (row) => row?.paymentDate,
      cell: ({ getValue }) => (
        <div className="capitalize hidden sm:table-cell">
          {(getValue() as Date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
        </div>
      ),
    },
    
    {
      header: "Amount Paid",
      accessorFn: (row) => row?.amount,
      cell: ({ getValue }) => {
        const formattedAmount = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "DZD",
        }).format(getValue());
        return <div className="font-medium">{formattedAmount}</div>;
      },
    },
   
   
    {
      id: "actions",
      header: "action",
      enableHiding: false,
      cell: ({ row }) => {
        const invoice = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">{t("open-menu")}</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
            
           
              <DropdownMenuItem
                onClick={() =>
                  downloadInvoice(
                    {
                      student: invoice.student,
                      level: invoice.level,
                      amount: invoice.amount,
                      paymentDate: format(invoice.paymentDate, "dd/MM/yyyy"),
                      status: t(invoice.status),
                      fromWho: invoice.fromWho,
                    },
                    invoice.id,
                    [
                      t("student"),
                      t("level"),
                      t("parent"),
                      t("amount"),
                      t("paymentDate"),
                      t("status"),
                      t("fromWho"),
                    ],
                    {
                      amount: t("Amount"),
                      from: t("From:"),
                      shippingAddress: t("shipping-address"),
                      billedTo: t("billed-to"),
                      subtotal: t("Subtotal:"),
                      totalTax: t("total-tax-0"),
                      totalAmount: t("total-amount-3"),
                      invoice: t("invoice"),
                    }
                  )
                }
              >
                {t("print-bill")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  
  const table = useReactTable({
    data: transactionsData,
    columns,
    state: {
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    enableRowSelection: true,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId: React.useCallback((row) => row?.id, []),
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
    },
  });

 
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("students-payments-transactions-table")}</CardTitle>
        <CardDescription>
          {t("students-payments-transactions-table-description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="flex items-center py-4">
          <Input
            placeholder={t('filter-by-student')}
            value={(table.getColumn("student")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("student")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
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
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" className="ml-2" onClick={handleExport}>
            {t('export')} <File className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <ScrollArea className="h-96">
          <Table>
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
                    );
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
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    {t("no-results-found")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
 
     
      
    
      <div className="flex items-center justify-between py-4">
  <div className="flex-1 text-sm text-muted-foreground">
    {table.getFilteredSelectedRowModel().rows.length} of{" "}
    {table.getFilteredRowModel().rows.length} {t('row-s-selected')}
  </div>
  <div className="flex space-x-2">
    <Button
      variant="outline"
      size="sm"
      onClick={() => table.previousPage()}
      disabled={!table.getCanPreviousPage()}
    >
      {t('previous')}
    </Button>
    <Button
      variant="outline"
      size="sm"
      onClick={() => table.nextPage()}
      disabled={!table.getCanNextPage()}
    >
      {t('next')}
    </Button>
  </div>
</div>


</CardContent>
    </Card>
  );
};
