
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
import { useForm } from "react-hook-form";
import { studentPaymentSchema } from "@/validators/studentPaymentSchema";
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
import { fetchFiles, updateDocuments } from "@/context/admin/hooks/useUploadFiles";
import { updateStudentInvoice } from "@/lib/hooks/billing/student-billing";
import { getMonthInfo } from "@/lib/hooks/billing/teacherPayment";
import { useTranslations } from "next-intl";
function addMonthsToDate(date: Date, monthsToAdd: number): Date {
  const newDate = new Date(date.getTime()); // Create a copy of the original date
  newDate.setMonth(newDate.getMonth() + monthsToAdd); // Add months to the date
  return newDate;
}

function parsePaymentPlan(paymentPlan: string, startDate: Date): Date | null {
  const match = paymentPlan.match(/(\d+)\s+months?/i); // Match the number of months in the string
  if (match) {
    const months = parseInt(match[1]); // Extract and parse the number of months
    return addMonthsToDate(startDate, months); // Add months to the startDate and return the new date
  }
  return null; // Return null if the paymentPlan string does not match the expected format
}
const fieldNames: string[] = [
  'student',
  'parent',
  'level',
  'class',
  'paymentPlan',
  'paymentTitle',
  'paymentAmount',
  'paymentDate',
  'fromWho',
  'typeofTransaction',
  'status',
  'description'
];


type FormKeys =
  | 'paymentTitle'
  | 'paymentAmount'
  | 'paymentDate'
  | 'typeofTransaction'
  | 'fromWho'
  | 'student'
  |'description'
  | 'parent'
  | 'level'
  | 'class'
  | 'paymentPlan'
  | 'status';

type StudentPaymentFormValues = z.infer<typeof studentPaymentSchema> & { [key: string]: string | Date | number | any;};




interface openModelProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean; // Specify the type of setOpen
  invoice:StudentPaymentFormValues
}
interface FileUploadProgress {
  file: File;
  name: string;
  source:any;

}

const EditStudentPaymentForm: React.FC<openModelProps> = ({ setOpen,open,invoice }) => {
  const { toast } = useToast();
  const {students,levels,setInvoices,setStudents,setAnalytics}=useData()
const t=useTranslations()
  const [status, setstatus] = useState(false);
  const [openTypeofpayment, setOpenTypeofpayment] = useState(false);
  const [studentModal,setStudentModal]=React.useState(false)
  const [paymentPlanModal,setPaymentPlanModal]=React.useState(false)
  const [filesToUpload, setFilesToUpload] = useState<FileUploadProgress[]>([]);
  const typeofTransaction = [
    {
      value: "CreditCard",
      label: t('credit-card'),
    },
    {
    value: "Cash",
    label: t('cash'),
      },
   
  ];
  
  const studentPaymentStatus =[
    
    {
      value:"paid"  ,
      label: t('paid'),
    },
    {
      value:"notPaid"  ,
      label: t('not-paid'),
    },
  ]
  const form = useForm<StudentPaymentFormValues>({
    resolver: zodResolver(studentPaymentSchema),
    defaultValues:{
        "paymentTitle": "dwqdqwdqwd",
        "paymentAmount": 500,
        "paymentDate":new Date("2024-04-26"),
        "typeofTransaction": "CreditCard",
        "fromWho": "ddqwdqwd",
        "student": {
            "student": "Charlie Brown",
            "value": "Charlie Brown",
            "label": "Charlie Brown",
            "id": "4"
        },
        "parent": {
            "name": "Eleanor",
            "id": "4"
        },
        "level": "Kindergarten",
        "class": "6C",
        "paymentPlan": {
            "name": "Monthly Plan",
            "period": "1 month",
            "price": 500,
            "value": "Monthly Plan",
            "label": "Monthly Plan"
        },
        "status": "paid",
        "description": "eeee"
    }
  });
  const { reset, formState, setValue, getValues,watch } = form;
  const { isSubmitting } = formState;


  React.useEffect(() => {
    const downloadFiles = async () => {
      if (invoice && invoice.documents) {
        const files=await fetchFiles(invoice.documents)
        console.log("files",files);
        
        setFilesToUpload(files);
      }
    };
  
    if (invoice) {
      console.log("studwnt loaded");
      
      reset(invoice)
      downloadFiles();
    }
  }, [invoice,reset])
  const watchlevel=watch('level')
  const paymentPlans = React.useMemo(() => {
    const studentValue = form.getValues("level");
  
    
    if (studentValue) {
      const selectedLevel = levels.find((level:any) => level.level === studentValue);
  
      if (selectedLevel) {
  
        return selectedLevel.prices.map((price:any)=>({...price,label:price.name,value:price.name}));
      }
    }
    return [];
  }, [form,levels]);
  const onSelected=(selectedStudent:any)=>{
    form.setValue("class",selectedStudent.class.name)
    form.setValue("parent",selectedStudent.parent)
    form.setValue("level",selectedStudent.level)
    form.setValue("amountLeftToPay",selectedStudent.amountLeftToPay)
  }
const renderInput = (fieldName:string, field:any) => {
  switch (fieldName) {
    case "paymentDate":
      return (
        <CalendarDatePicker
          {...field}
          date={getValues("paymentDate")}
          setDate={(selectedValue) => {
            if (selectedValue === undefined) {
              // Handle undefined case if needed
            } else {
              form.setValue(fieldName, selectedValue);
            }
          }}
        />
      );
      case "nextPaymentDate":
        return (
          <CalendarDatePicker
            {...field}
            date={getValues("nextPaymentDate")}
            setDate={(selectedValue) => {
              if (selectedValue === undefined) {
                // Handle undefined case if needed
              } else {
                form.setValue(fieldName, selectedValue);
              }
            }}
          />
        );
      case "student":
        return (
          <Combobox
            {...field}
            open={studentModal}
            setOpen={setStudentModal}
            placeHolder={t('student')}
            options={students}
            value={getValues("student")?.student}
            onSelected={(selectedValue) => {
              const selectedStudent = students.find((student:any) => student.value === selectedValue);
              if (selectedStudent) {
                const { value, label, ...rest } = selectedStudent; 
                const updatedStudent:any = { ...rest };
                onSelected(updatedStudent); 
                form.setValue(fieldName, {value:selectedStudent.value,label:selectedStudent.label,id:selectedStudent.id,student:selectedStudent.student,nextPaymentDate:selectedStudent.nextPaymentDate}); 
              }
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
          options={studentPaymentStatus}
          value={getValues("status")}
          onSelected={(selectedValue) => {
            form.setValue(fieldName, selectedValue);
          }} // Set the value based on the form's current value for the field
        />
      );
    case "typeofTransaction":
      return (
        <Combobox
          {...field}
          open={openTypeofpayment}
          setOpen={setOpenTypeofpayment}
          placeHolder={t("typeofTransaction")}
          options={typeofTransaction}
          value={getValues("typeofTransaction")}
          onSelected={(selectedValue) => {

            form.setValue(fieldName, selectedValue);
          }}
        />
      );
      
      case "paymentAmount":
          return (<Input {...field} onChange={event => field.onChange(+event.target.value)}/>)

      case "parent" :
        return (<Input {...field}  value={getValues("parent")?.name} readOnly/>)
        
      case "level" :
        return (<Input {...field}  value={getValues("level")} readOnly/>)

      case "paymentPlan":
        return (
          <Combobox
          {...field}
          open={paymentPlanModal}
          setOpen={setPaymentPlanModal}
          placeHolder={t('payment-plan')}
          options={paymentPlans}
          value={getValues("paymentPlan")?.name}
          onSelected={(selectedValue) => {
            const paymentPlan = paymentPlans?.find(
              (plan:any) => plan?.value === selectedValue
            );
            if (paymentPlan) {
              form.setValue(fieldName, paymentPlan)
              form.setValue("paymentAmount",paymentPlan.price)
              
              const newDate = parsePaymentPlan(paymentPlan.period, getValues("student").nextPaymentDate);
              if(newDate){
                form.setValue("nextPaymentDate",newDate)

              }
            }
          }}
        />

        )
        case "nextPaymentDate":
          return (<Input {...field} value={field.value?.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })} readOnly/>)
                    default:
      return <Input {...field} />;
  }
};

async function onSubmit(data: StudentPaymentFormValues) {
  const { value, label, ...updatedData } = data;
const month=getMonthInfo(updatedData.paymentDate)
  await updateStudentInvoice(updatedData,invoice.id,invoice.paymentAmount)
  const documents= await updateDocuments(invoice.documents && invoice.documents> 0?invoice.documents:[],filesToUpload,'Billing/payments/Invoices',invoice.id)
  setInvoices((prev:any) => {
    const updatedTeachers = prev.map((teacherSalarys:StudentPaymentFormValues) =>
    teacherSalarys.id === invoice.id? {...data,teacherSalary:invoice.id,documents:documents} : teacherSalarys
    );
    return updatedTeachers;
  });
  setStudents((prev:any) => {
    const updatedLevels = prev.map((student:any) =>
      student.id === data.student.id ? { ...data,nextPaymentDate:updatedData.nextPaymentDate,
        amountLeftToPay:updatedData.amountLeftToPay-updatedData.paymentAmount }: student
    );
    return updatedLevels;
  });
  setAnalytics((prevState:any) => ({
    data: {
      ...prevState.data,
      [month.abbreviation]: {
        ...prevState.data[month.abbreviation],
        income:prevState.data[month.abbreviation].income + (invoice.paymentAmount-updatedData.paymentAmount)
      }
    },
    totalIncome: prevState.totalIncome +   (invoice.paymentAmount-updatedData.paymentAmount)
  }));  
  toast({
    title: t('changes-applied-0'),
    description: t('changes-applied-successfully'),
  });
  
      setOpen(false)

} 

  return (
 
    <Sheet open={open}  onOpenChange={setOpen}  >
   
<SheetContent className=" sm:max-w-[650px]">
   <ScrollArea className="h-screen pb-20 "> 
     <SheetHeader>
       <SheetTitle>{t('edit-payment')}</SheetTitle>
       <SheetDescription>
         {t('make-changes-to-your-payment-here')} </SheetDescription>
     </SheetHeader>
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
            </form>
          </Form>

  <ImageUpload filesToUpload={filesToUpload} setFilesToUpload={setFilesToUpload}/>


     <SheetFooter className="mt-5">
       <SheetClose asChild>
         
       <LoadingButton loading={isSubmitting} type="submit"    onClick={form.handleSubmit(onSubmit)}>
         {t('save-changes')} </LoadingButton>
       </SheetClose>
     </SheetFooter>
     </ScrollArea>
   </SheetContent>
   
 </Sheet>
       
  );
}


export default EditStudentPaymentForm

       
      
