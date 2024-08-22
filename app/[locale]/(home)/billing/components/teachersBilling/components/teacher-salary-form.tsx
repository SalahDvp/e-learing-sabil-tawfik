
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {ResetIcon } from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";
import { useFieldArray, useForm } from "react-hook-form";
import { teacherPaymentRegistrationSchema } from "@/validators/teacherSalarySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useCallback, useState} from "react";
import { useToast } from "@/components/ui/use-toast";
import CalendarDatePicker from "@/app/[locale]/(home)/students/components/date-picker";
import { ScrollArea} from "@/components/ui/scroll-area";
import ImageUpload from "@/app/[locale]/(home)/students/components/uploadFile";
import Combobox from "@/components/ui/comboBox";
import { LoadingButton } from "@/components/ui/loadingButton";
import { z } from "zod";
import { useData } from "@/context/admin/fetchDataContext";
import { addTeacherSalary, getMonthInfo } from "@/lib/hooks/billing/teacherPayment";
import { uploadFilesAndLinkToCollection } from "@/context/admin/hooks/useUploadFiles";
import { useTranslations } from "next-intl";
import { Checkbox } from "@/components/ui/checkbox"
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { differenceInWeeks, endOfMonth, format, startOfMonth } from "date-fns";
import { downloadInvoice } from "./generateInvoice";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateDoc } from "firebase/firestore";

const fieldNames = [
    "teacher",
    "paymentType",
    "date",


];
type FormKeys = "salaryTitle" | "salaryAmount" | "salaryDate" | "typeofTransaction" | "monthOfSalary" | "fromWho"|"status";
 
type TeacherSalaryFormValues=z.infer<typeof teacherPaymentRegistrationSchema>;




  interface FileUploadProgress {
    file: File;
    name: string;
    source:any;
  }
  const getGroupsByTeacher = (classes, teacherId) => {
    return classes
      .filter(cls => cls.teacherUID === teacherId) // Filter classes by teacherId
      .flatMap(cls => // Flatten the array of groups
        cls.groups.map(group => {
          const studentCount = cls.students.filter(student => student.group === group.group).length;
          return {
            start: group.start,
            end: group.end,
            day: group.day,
            groupcode: group.group,
            amount: group.amount,
            students: studentCount
          };
        })
      )
  };
  const getReimbursementByTeacher = (classes, teacherId) => {
    const currentDate = new Date();
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
  
    let totalReimbursement = 0;
  
    // Filter classes by teacherId
    const filteredClasses = classes.filter(c => c.teacherUID === teacherId);
  
    filteredClasses.forEach(c => {
      if (c.reimbursements && Array.isArray(c.reimbursements)) {
        // Filter reimbursements by date
        c.reimbursements.forEach(reimbursement => {
          const reimbursementDate = reimbursement.date.toDate(); // Convert Firestore timestamp to JS Date
          if (reimbursementDate >= start && reimbursementDate <= end) {
            totalReimbursement += reimbursement.amount;
          }
        });
      }
    });
  
    return totalReimbursement;
  };
  const getAdvancedPaymentByTeacher = (teacher) => {
    const currentDate = new Date();
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
  
    let totalAdvance = 0;

      if (teacher.advancePayment&& Array.isArray(teacher.advancePayment)) {
        // Filter reimbursements by date
        teacher.advancePayment.forEach(advance => {
          const advanceDate = new Date(advance.date.toDate()); // Convert Firestore timestamp to JS Date
          if (advanceDate >= start && advanceDate <= end) {
            console.log(advance.amount);
            
            totalAdvance += advance.amount;
          }
        });
      }

      
    return totalAdvance;
  };
  const calculateSalary = (paymentType, teacher, expenses) => {
    switch (paymentType) {
      case "salaryAmount":
        return teacher.amount;

      case "hourly":
        const weeks = differenceInWeeks(new Date(), new Date(teacher.salaryDate.toDate()));
        return weeks * teacher.amount * expenses.length;

      case "percentage":       
        return expenses.reduce(
          (total, expense) => total + (expense.amount*expense.students) * teacher.amount/100,
          0
        );

      default:
        return 0;
    }
  };
export default function PaymentForm() {
  const { toast } = useToast();
  const {setTeachersSalary} = useData()
  const {teachers,setAnalytics,classes,setTeachers}= useData()
  const[printBill,setPrintBill]=useState(false)

  const [filesToUpload, setFilesToUpload] = useState<FileUploadProgress[]>([]);
  const t=useTranslations()
  const Typeofpayments = [
    {
      value: "Salary",
      label: t('salary'),
    },
    {
      value: "Other",
      label: t("other"),
    },
    
  ];

  const MonthOfYear = [
    {
      value: "January",
      label: t('january'),
    },
    {
      value: "February",
      label: t('february'),
    },
    {
      value: "March",
      label: t('march'),
    },
    {
      value: "April",
      label: t('april'),
    },
    {
      value: "May",
      label: t('may'),
    },
    {
      value: "June",
      label: "June",
    },
    {
      value: "July",
      label: t('july'),
    },
    {
      value: "August",
      label: t('august'),
    },
    {
      value: "September",
      label: t('september'),
    },
    {
      value: "October",
      label: t('october'),
    },
    {
      value: "November",
      label: t('november'),
    },
    {
      value: "December",
      label: t('december'),
    },
  ];
    
  const Salarystatus =[
    
    {
      value:"paid"  ,
      label: t('paid'),
    },
    {
      value:"notPaid"  ,
      label: t('not-paid'),
    },
  ]
  const [status, setstatus] = useState(false);
const [monthModal,setMonthModal]=useState(false)
const [teacherModal,setTeacherModal]=useState(false)

  const [openTypeofpayment, setOpenTypeofpayment] = useState(false);
  const form = useForm<any>({

    defaultValues:{expenses:[]}
  });
  const { reset, formState, setValue, getValues,control,register,watch } = form;
  const { isSubmitting } = formState;
  const { fields:expenses, append:appendExpense,remove:removeExpense, } = useFieldArray({
    control: form.control,
    name: "expenses",

  });

  const renderInput = (fieldName:string, field:any) => {
    switch (fieldName) {
      case "date":
        return (
          <CalendarDatePicker
            {...field}
            date={getValues("date")}
            setDate={(selectedValue) => {
              if (selectedValue === undefined) {
                // Handle undefined case if needed
              } else {
                form.setValue(fieldName, selectedValue);
              }
            }}
          />
        );

      case "month": 
      return (
        <Combobox
        {...field}
        open={monthModal}
        setOpen={setMonthModal}
        placeHolder={t('month')}
        options={MonthOfYear}
        value={getValues("month")}
        onSelected={(selectedValue) => {
          form.setValue(fieldName, selectedValue);
        }} 
      />
      );

      case "status":
        return (
          <Combobox
            {...field}
            open={status}
            setOpen={setstatus}
            placeHolder={t("status")}
            options={Salarystatus}
            value={getValues("status")}
            onSelected={(selectedValue) => {
              form.setValue(fieldName, selectedValue);
            }} // Set the value based on the form's current value for the field
          />
        );
        case "teacher":
          return (
            <Combobox
              {...field}
                open={teacherModal}
                setOpen={setTeacherModal}
              placeHolder={t('teacher')}
              options={teachers}
              value={getValues("teacher")?.name}
              onSelected={(selectedValue) => {
                const selectedTeacher = teachers.find(
                    (teacher:any) => teacher.id === selectedValue
                  );
               if(selectedTeacher){
                const result = getGroupsByTeacher(classes, selectedValue);
                console.log(result);
            
               
                const reimbursement=getReimbursementByTeacher(classes,selectedValue)
                const advancePayment=getAdvancedPaymentByTeacher(selectedTeacher)
                form.setValue('advancePayment',advancePayment)
                form.setValue('reimbursement',reimbursement)
                form.setValue('expenses',result)
                form.setValue(fieldName, {...selectedTeacher,name:selectedTeacher?.value,id:selectedTeacher?.id,})
                const amount=calculateSalary(selectedTeacher?.paymentType,selectedTeacher,result)
                form.setValue("grossSalary",amount)
                const netSalary=amount-advancePayment-reimbursement
                form.setValue("netSalary",netSalary)
                form.setValue("amount",netSalary)
 
            }
          
              }} // Set the value based on the form's current value for the field
            />
          );
        
      case "typeofTransaction":
        return (
          <Combobox
            {...field}
            open={openTypeofpayment}
            setOpen={setOpenTypeofpayment}
            placeHolder={t('typeofpayment')}
            options={Typeofpayments}
            value={getValues("typeofTransaction")}
            onSelected={(selectedValue) => {
              form.setValue(fieldName, selectedValue);
            }}
          />
        );
        case "paymentType":
          return(
          
              <Select
              onValueChange={field.onChange}
              value={field.value}
              >
                <SelectTrigger
                  id={`schoolType`}
                  aria-label={`Select School Type`}
                >
                  <SelectValue placeholder={t('select-school-type')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="salary">Salaire</SelectItem>
                  <SelectItem value="advance">Avance</SelectItem>
                </SelectContent>
              </Select>
 
          )
        case "grossSalary":
            return (<Input {...field} readOnly />);
          case "reimbursement":
                return (<Input {...field} readOnly/>);
                case "advancePayment":
                  return (<Input {...field} readOnly/>);
                  case "amount":
                    return (<Input {...field} onChange={event => field.onChange(+event.target.value)}/>)
      default:
        return <Input {...field} />;
    }
  };

  async function onSubmit(data:any) {
   // const month=getMonthInfo(data.salaryDate)

      // setAnalytics((prevState:any) => ({
      //   data: {
      //     ...prevState.data,
      //     [month.abbreviation]: {
      //       ...prevState.data[month.abbreviation],
      //       expenses:prevState.data[month.abbreviation].expenses + data.salaryAmount
      //     }
      //   },
      //   totalExpenses: prevState.totalExpenses +  data.salaryAmount
      // }));
  
      const teacherId= await addTeacherSalary({...data,documents:[]})
      const uploaded = await uploadFilesAndLinkToCollection("Billing/payouts/TeachersTransactions", teacherId, filesToUpload);
      setTeachersSalary((prev:TeacherSalaryFormValues[])=>[{...data,id:teacherId,teacher:data.teacher,documents:[],    value:teacherId,
        label:teacherId,},...prev])
  
        if(printBill){
          
        //   downloadInvoice({
        //     toWho: data.teacher.name,
        //     typeofPayment: data.typeofTransaction,
        //     paymentAmount: data.salaryAmount,
        //     salaryMonth:data.monthOfSalary,
        //    paymentDate: format(data.salaryDate, 'dd/MM/yyyy'),
        //     status: t(data.status),
          
        //   },teacherId,[t('teacher'), t('method'), t('amount'), t("monthOfSalary"),t('paymentDate'), t('status')],
        // {
        //   amount:t("Amount"), from:t('From:'), shippingAddress:t('shipping-address'), billedTo:t('billed-to'), subtotal:t('Subtotal:'), totalTax:t('total-tax-0'), totalAmount:t('total-amount-3'),invoice:t('payslip')
        // })
        } 
if(data.paymentType==='advance'){
  setTeachers((prevTeachers) =>
    prevTeachers.map((teacher) => {
      if (teacher.id === teacherId) {
        return {
          ...teacher,
          advancePayment: [
            ...(teacher.advancePayment || []), // Ensure the array exists
            { amount:data.amount, date: data.date} // Add the new payment
          ]
        };
      }
      return teacher;
    })
  );
}
 
toast({
              title: t('teacher-salary-added'),
              description: t('teacher-salary-added-successfully'),
            });
            reset({paymentType:"",expenses:[]});
          
          }

  return (
    <Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
      <CardHeader className="flex flex-row items-start bg-muted/50">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg">
            {t('create-teacher-bill')} </CardTitle>
          <CardDescription></CardDescription>
        </div>

        <div className="ml-auto flex items-center gap-1">
          <Button
            size="sm"
            variant="outline"
            className="h-8 gap-1"
            onClick={() => reset({paymentType:"",expenses:[]})}
          >
            <ResetIcon className="h-3.5 w-3.5" />
            <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
              {t('reset-details')} </span>
          </Button>
        </div>
      </CardHeader>
      <ScrollArea
        className="overflow-auto pt-6 text-sm"
        style={{ maxHeight: "600px" }}
      >
        <CardContent>
          <Form {...form}>
            <form>
              {fieldNames.map((fieldName, index) => (
                <FormField
                  key={index}
                  control={form.control}
                  name={fieldName as FormKeys}
                  render={({ field }) => (
                    <FormItem style={{ marginBottom: 15 }}>
                      <FormLabel>{t(fieldName)}</FormLabel>
                      <FormControl>{renderInput(fieldName, field)}</FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
                  {watch('paymentType')==='salary'&&(
<>
<FormField
        
        control={form.control}
        name={"month"}
        render={({ field }) => (
          <FormItem style={{ marginBottom: 15 }}>
            <FormLabel>{t("monthOfSalary")}</FormLabel>
            <FormControl>{renderInput("month", field)}</FormControl>

            <FormMessage />
          </FormItem>
        )}
      />
        <FormField
        
        control={form.control}
        name={"grossSalary" as FormKeys}
        render={({ field }) => (
          <FormItem style={{ marginBottom: 15 }}>
            <FormLabel>grossSalary</FormLabel>
            <FormControl>{renderInput("grossSalary", field)}</FormControl>

            <FormMessage />
          </FormItem>
        )}
      />
              <FormField
        
        control={form.control}
        name={"reimbursement" as FormKeys}
        render={({ field }) => (
          <FormItem style={{ marginBottom: 15 }}>
            <FormLabel>reimbursement</FormLabel>
            <FormControl>{renderInput("reimbursement", field)}</FormControl>

            <FormMessage />
          </FormItem>
        )}
      />
                  <FormField
        
        control={form.control}
        name={"advancePayment" as FormKeys}
        render={({ field }) => (
          <FormItem style={{ marginBottom: 15 }}>
            <FormLabel>les Avances</FormLabel>
            <FormControl>{renderInput("advancePayment", field)}</FormControl>

            <FormMessage />
          </FormItem>
        )}
      />
                      <FormField
        
        control={form.control}
        name={"netSalary" as FormKeys}
        render={({ field }) => (
          <FormItem style={{ marginBottom: 15 }}>
            <FormLabel>salaire Net</FormLabel>
            <FormControl>{renderInput("netSalary", field)}</FormControl>

            <FormMessage />
          </FormItem>
        )}
      />
</>
                  )}    
                   {watch('paymentType')==='advance'&&(
<>
<FormField
        
        control={form.control}
        name={"month"}
        render={({ field }) => (
          <FormItem style={{ marginBottom: 15 }}>
            <FormLabel>{t("monthOfSalary")}</FormLabel>
            <FormControl>{renderInput("month", field)}</FormControl>

            <FormMessage />
          </FormItem>
        )}
      />
        <FormField
        control={form.control}
        name={"amount" as FormKeys}
        render={({ field }) => (
          <FormItem style={{ marginBottom: 15 }}>
            <FormLabel>Avance</FormLabel>
            <FormControl>{renderInput("amount", field)}</FormControl>

            <FormMessage />
          </FormItem>
        )}
      />
</>
)}   

        <FormField
            control={control}
            name="expenses"
            render={({ field }) => (
              <FormItem>
                <FormLabel>les classes</FormLabel>

                <Table>
  <TableHeader>
    <TableRow>
      <TableHead>group</TableHead>
      <TableHead>number of student</TableHead>
      <TableHead>Amount per student</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>

                {expenses.map((option,index) => (
        
        
                    <TableRow key={index}>
                    <TableCell className="font-semibold">
                 
              <Input

                defaultValue={`${option.day},${option.start}-${option.end}`}
                readOnly
              />
 
            </TableCell>
            <TableCell>
      
      <Input
       placeholder={t('enter-price')}
       type="number"
       value={option.students}
      readOnly
      />

    </TableCell>
            <TableCell>
      
              <Input
               placeholder={t('enter-price')}
               type="number"
               value={option.amount}
              readOnly
              />
  
            </TableCell>
            <TableCell>


    </TableCell>
      </TableRow>
    

                ))}
         
         </TableBody>
         <TableFooter>
        {/* <TableRow>
          <TableCell >Total</TableCell>
          <TableCell colSpan={3}>DZD{totalAmount}</TableCell>
        </TableRow> */}
      </TableFooter>
</Table>
                <FormMessage />
              </FormItem>
            )}
          />
            </form>
          </Form>
          <div className="flex items-center space-x-2 mb-3">
      <Checkbox id="terms" checked={printBill} onClick={()=>setPrintBill(!printBill)}/>
      <label
        htmlFor="terms"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
       {t('print-paiment-bill')} 
       </label>
    </div>
          <ImageUpload filesToUpload={filesToUpload} setFilesToUpload={setFilesToUpload}/>

        </CardContent>
      </ScrollArea>
      <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
        <div className="flex gap-2">
          <LoadingButton
            loading={isSubmitting}
            type="submit"
            onClick={form.handleSubmit(onSubmit)}
          >
            {t('submit')} </LoadingButton>
        </div>
      </CardFooter>
    </Card>
  );
}