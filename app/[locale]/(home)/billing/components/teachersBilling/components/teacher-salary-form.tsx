
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
import { Timestamp, updateDoc } from "firebase/firestore";
import ReactToPrint from "react-to-print";

const fieldNames = [
    "teacher",
    "paymentType",
    "date",



];
type FormKeys = "salaryTitle" | "salaryAmount" | "salaryDate" | "typeofTransaction" | "monthOfSalary" | "fromWho"|"status";
 
const applyPayment = (totalAdvancePayment, paymentAmount) => {
  if (totalAdvancePayment > 0) {
    // If payment exceeds totalAdvancePayment
    if (paymentAmount >= totalAdvancePayment) {
      paymentAmount -= totalAdvancePayment; // Reduce paymentAmount by totalAdvancePayment
      totalAdvancePayment = 0; // Set totalAdvancePayment to 0
    } else {
      totalAdvancePayment -= paymentAmount; // Reduce totalAdvancePayment by paymentAmount
      paymentAmount = 0; // Set paymentAmount to 0 as it's fully consumed
    }
  }

  return { totalAdvancePayment, paymentAmount };
};



  interface FileUploadProgress {
    file: File;
    name: string;
    source:any;
  }
const getGroupsByTeacher = (classes, teacherId) => {
  return classes
    .filter(cls => 
      cls.teacherUID === teacherId 
     //  && new Date(cls.nextPaymentDate) < new Date() // Check if nextPaymentDate is before the current date
    )
    .map(cls => {
      const totalAmount = cls.students.reduce((acc, std) => {
        const studiedLessons = cls.numberOfSessions - std.sessionsLeft;
        const studentAmount = studiedLessons * (cls.amount / cls.numberOfSessions);
        return acc + studentAmount;
      }, 0);
      
      return {
        ...cls,
        groupcode: cls.group,
        amount: cls.amount,
        totalAmount: totalAmount,
        students:cls.students.length,

      };
    });
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
          (total, expense) => total + (expense.totalAmount) * teacher.amount/100,
          0
        );

      default:
        return 0;
    }
  };
  const ReceiptPrint = React.forwardRef((props, ref) => {
    const { receipt } = props;
  
    if (receipt.teacher) {
      return (
        <Card className="mb-6" ref={ref}>
          <CardHeader>
            <CardTitle>Modèle de Reçu de Salaire</CardTitle>
          </CardHeader>
          <CardContent id="print-section">
            <h3 className="text-lg font-semibold mb-2">Informations de l'Employé :</h3>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Nom de l'Employé :</TableCell>
                  <TableCell>{receipt.teacher.teacherName}</TableCell>
                  <TableCell className="font-medium">Département :</TableCell>
                  <TableCell>{receipt.teacher.year.join(', ')}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">ID de l'Employé :</TableCell>
                  <TableCell>{receipt.teacher.name}</TableCell>
                  <TableCell className="font-medium">Date d'Émission :</TableCell>
                  <TableCell>{format(receipt.date,"dd-MM-yyyy")}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Niveau de l'Employé :</TableCell>
                  <TableCell>{receipt.teacher.year.join(', ')}</TableCell>
                  <TableCell className="font-medium">Mois de Paiement :</TableCell>
                  <TableCell>{receipt.month}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
  
            <h3 className="text-lg font-semibold mt-4 mb-2">Informations de l'Employeur :</h3>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Nom de l'Employeur :</TableCell>
                  <TableCell>{"Smart School"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Adresse :</TableCell>
                  <TableCell>{"address"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Informations de Contact :</TableCell>
                  <TableCell>{"055555555"}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
  
            <h3 className="text-lg font-semibold mt-4 mb-2">Gains et Déductions :</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Nombre d'Étudiants</TableHead>
                  <TableHead>Taux</TableHead>
                  <TableHead>Montant</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {receipt.expenses.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.groupcode}</TableCell>
                    <TableCell>{item.students}</TableCell>
                    <TableCell>{receipt.teacher.amount}%</TableCell>
                    <TableCell>DZD{item.students * item.amount * receipt.teacher.amount / 100}</TableCell>
                  </TableRow>
                ))}
  
                <TableRow>
                  <TableCell colSpan={3}>Salaire Brut :</TableCell>
                  <TableCell>DZD{receipt.grossSalary}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={3} className="font-bold">Les Avances :</TableCell>
                  <TableCell className="font-bold">DZD{receipt.advancePayment.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={3} className="font-bold">Salaire Net :</TableCell>
                  <TableCell className="font-bold">DZD{receipt.netSalary.toFixed(2)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      );
    } else {
      return null;
    }
  });
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

    defaultValues:{expenses:[],date:new Date(),month:format(new Date(), 'MMMM')}
  });
  const { reset, formState, setValue, getValues,control,register,watch, } = form;
  const { isSubmitting,} = formState;
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
                form.setValue(fieldName, {...selectedTeacher,name:selectedTeacher?.value,id:selectedTeacher?.id,teacherName:selectedTeacher.name})
                const amount=calculateSalary(selectedTeacher?.paymentType,selectedTeacher,result)
                const resultsalary = applyPayment(selectedTeacher.totalAdvancePayment,amount);
                form.setValue("grossSalary",amount)
                form.setValue("netSalary",resultsalary.paymentAmount)
                form.setValue("amount",resultsalary.paymentAmount)
 
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
  const getTotalForCurrentMonth = (classData) => {
    const startOfCurrentMonth = startOfMonth(new Date());
    const endOfCurrentMonth = endOfMonth(new Date());
  
    let totalAmount = 0;
  
    // Loop through each class in the array
    classData.forEach(classObj => {
      const { amount, numberOfSessions, Attendance } = classObj;
  
      // Calculate the ratio
      const ratio = amount / numberOfSessions;
  
      // Loop through each attendance record within the class
      Object.keys(Attendance).forEach(dateKey => {
        const attendanceRecord = Attendance[dateKey];
        const date = parseISO(dateKey);
  
        // Check if the date falls within the current month
        if (date >= startOfCurrentMonth && date <= endOfCurrentMonth) {
          const attendanceCount = attendanceRecord.attendanceList.length;
          totalAmount += attendanceCount * ratio;
        }
      });
    });
  
    // Multiply the total amount by teacher's amount divided by 100
    const finalAmount = totalAmount * (teacherAmount / 100);
  
    return finalAmount;
  };
  const reactToPrintRef = React.useRef();
  async function onSubmit(data:any) {
   const month=getMonthInfo(data.date)

  //  setAnalytics((prevState: any) => ({
  //   data: {
  //     ...prevState.data,
  //     [month.fullName]: {
  //       ...prevState.data[month.fullName],
  //       expenses: (prevState.data[month.fullName]?.expenses || 0) + data.amount
  //     }
  //   },
  //   totalExpenses: prevState.totalExpenses + data.amount
  // }));
      const teacherId= await addTeacherSalary({...data,documents:[]})
      const uploaded = await uploadFilesAndLinkToCollection("Billing/payouts/TeachersTransactions", teacherId, filesToUpload);
      setTeachersSalary((prev:TeacherSalaryFormValues[])=>[{...data,id:teacherId,teacher:data.teacher,documents:[],    value:teacherId,
        label:teacherId,},...prev])
        if(data.paymentType==='advance'){
          setTeachers((prevTeachers) =>
            prevTeachers.map((teacher) => {
              if (teacher.id === teacher.name) {
                return {
                  ...teacher,
                  advancePayment: [
                    ...(teacher.advancePayment || []), // Ensure the array exists
                    { amount:data.amount, date: data.date} // Add the new payment
                  ],
                  totalAdvancePayment:teacher.totalAdvancePayment+data.amount
                };
              }
              return teacher;
            })
          );
        }else{
          setTeachers((prevTeach) =>
            prevTeach.map((tch) =>
              tch.id === data.teacher.name
                ? {
                    ...tch,
                   totalAdvancePayment:tch.totalAdvancePayment-data.amount
                  }
                : tch
            )
          );
          if(printBill && data.paymentType==='salary'){
            
            if (reactToPrintRef.current) {
              reactToPrintRef.current.handlePrint();
            }
          } 
        }



toast({
              title: t('teacher-salary-added'),
              description: t('teacher-salary-added-successfully'),
            });
            reset({paymentType:"",expenses:[],date:new Date(),month:format(new Date(), 'MMMM')});
          
          }
          const componentRef = React.useRef(null);

          const onBeforeGetContentResolve = React.useRef(null);
        
          const [text, setText] = React.useState("old boring text")
        
          React.useEffect(() => {
            if (
              text === "New, Updated Text!" &&
              typeof onBeforeGetContentResolve.current === "function"
            ) {
              onBeforeGetContentResolve.current();
            }
          }, [onBeforeGetContentResolve.current, text]);
        
          const reactToPrintContent = React.useCallback(() => {
            return componentRef.current;
          }, [componentRef.current]);
        
          const reactToPrintTrigger = React.useCallback(() => {
            // NOTE: could just as easily return <SomeComponent />. Do NOT pass an `onClick` prop
            // to the root node of the returned component as it will be overwritten.
        
            // Bad: the `onClick` here will be overwritten by `react-to-print`
            // return <button onClick={() => alert('This will not work')}>Print this out!</button>;
        
            // Good
            return <button>Print using a Functional Component</button>;
          }, []);
        
        
          const [receipt, setReceipt] = React.useState({
            employeeName: "John Doe",
            employeeId: "T12345",
            position: "Senior Teacher",
            department: "Education",
            dateOfIssue: "May 31, 2023",
            payPeriod: "May 1, 2023 to May 31, 2023",
            schoolName: "Evergreen Academy",
            schoolAddress: "123 Learning Lane, Education City, EC 12345",
            schoolContact: "Phone: (555) 123-4567, Email: info@evergreenacademy.edu",
            earnings: [
              { description: "Mathematics 101", hours: 16, rate: 50, amount: 800 },
              { description: "Physics 202", hours: 16, rate: 60, amount: 960 },
              { description: "Chemistry 301", hours: 16, rate: 55, amount: 880 },
            ],
            deductions: [
              { description: "Health Insurance", amount: -100 },
            ],
            taxRate: 0.15,
            paymentMethod: "Bank Transfer",
            bankDetails: "National Bank, Account No. 1234567890",
            transactionId: "TRN123456789",
          });
  return (
    <Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
            <div>
            <ReactToPrint
        ref={reactToPrintRef}
        content={reactToPrintContent}
        documentTitle="AwesomeFileName"
        removeAfterPrint
      />
      <div style={{display:'none'}}>
        <ReceiptPrint ref={componentRef} receipt={getValues()}/>
        </div>
    </div>
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
            onClick={() =>      reset({paymentType:"",expenses:[],date:new Date(),month:format(new Date(), 'MMMM')})}
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
     <TableHead>Type de salaire</TableHead>
      {getValues("teacher")?.paymentType==='percentage' && (<TableHead>percentage</TableHead>)}
      {getValues("teacher")?.paymentType==='percentage' && (<TableHead>Amount per group</TableHead>)}
    </TableRow>
  </TableHeader>
  <TableBody>

                {expenses.map((option,index) => (
        
        
                    <TableRow key={index}>
                    <TableCell className="font-semibold">
                 
              <Input

                value={option.group}
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
    <TableCell className="font-semibold">
                 
                 <Input
   
                   value={getValues("teacher")?.paymentType}
                   readOnly
                 />
    
               </TableCell>
            <TableCell>
            {getValues("teacher")?.paymentType==='percentage' && (   
      <Input
       placeholder={t('enter-price')}
       type="number"
       value={getValues("teacher")?.amount}
      readOnly
      />)}

    </TableCell>
    <TableCell>
            {getValues("teacher")?.paymentType==='percentage' && (   
      <Input
       placeholder={t('enter-price')}
       type="number"
       value={option.totalAmount*getValues("teacher")?.amount/100}
      readOnly
      />)}

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
            <FormLabel>Salaire Brute</FormLabel>
            <FormControl>{renderInput("grossSalary", field)}</FormControl>

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
