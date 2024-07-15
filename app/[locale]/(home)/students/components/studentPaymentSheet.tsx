

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {ResetIcon } from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { studentPaymentSchema } from "@/validators/studentPaymentSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState} from "react";
import { useToast } from "@/components/ui/use-toast";
import CalendarDatePicker from "@/app/[locale]/(home)/students/components/date-picker";
import { ScrollArea} from "@/components/ui/scroll-area";
import ImageUpload from "@/app/[locale]/(home)/students/components/uploadFile";
import Combobox from "@/components/ui/comboBox";
import { LoadingButton } from "@/components/ui/loadingButton";
import { date, z } from "zod";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger
  } from "@/components/ui/sheet";
import { useData } from "@/context/admin/fetchDataContext";
import { addPaymentTransaction } from "@/lib/hooks/billing/student-billing";
import { uploadFilesAndLinkToCollection } from "@/context/admin/hooks/useUploadFiles";
import { getMonthInfo } from "@/lib/hooks/billing/teacherPayment";
import { useTranslations } from "next-intl";
import { Checkbox } from "@/components/ui/checkbox"
import { format } from "date-fns";


const fieldNames: string[] = [
  'student',
  'parentFullName',
  'level',
  'class',
  'paymentType',
  "amountLeftToPay",
  //'paymentPlan',
  'paymentAmount',
  //'nextPaymentDate',
  //'paymentTitle',
  'paymentDate',
  'fromWho',
  'typeofTransaction',
  //'status',
  'description',

];


type FormKeys =
  //| 'paymentTitle'
  | 'paymentAmount'
  | 'paymentDate'
  | 'typeofTransaction'
  | 'fromWho'
  | 'student'
  |'description'
  | 'parentFullName'
  | 'level'
  | 'class'
  |'paymentType'
 // | 'paymentPlan'
  |  "amountLeftToPay"
  //|  'nextPaymentDate'
  //| 'status';

type StudentPaymentFormValues = z.infer<typeof studentPaymentSchema>;
function addMonthsToDate(date: Date, monthsToAdd: number): Date {
  const newDate = new Date(date.getTime()); // Create a copy of the original date
  newDate.setMonth(newDate.getMonth() + monthsToAdd); // Add months to the date
  return newDate;
}

interface FileUploadProgress {
  file: File;
  name: string;
  source:any;
}

function getMonthAbbreviation(date:Date) {
  const dateFormat:any = { month: 'short', year: '2-digit' };
  const currentDate = new Date(date);

      const monthYear = currentDate.toLocaleDateString('en-GB', dateFormat);
      const [monthAbbreviation, year] = monthYear.split(' ');
      const  monthYearAbbreviation= `${monthAbbreviation}${year}`;
      return monthYearAbbreviation;
}

interface openModelProps {
    student:any
  }
  const StudentPaymentSheet: React.FC<openModelProps> = ({student }) => {
  const { toast } = useToast();
  const {setInvoices,setStudents,setAnalytics}=useData()
  const [openTypeofpayment, setOpenTypeofpayment] = useState(false);
  const [studentModal,setStudentModal]=React.useState(false)
const [paymentPlanModal,setPaymentPlanModal]=React.useState(false)
  const[printBill,setPrintBill]=useState(false)
const {students}=useData()
  const [filesToUpload, setFilesToUpload] = useState<FileUploadProgress[]>([]);
  const form = useForm<StudentPaymentFormValues>({
    resolver: zodResolver(studentPaymentSchema),
    defaultValues:student
  });
  const { reset, formState, setValue, getValues,watch } = form;
  const { isSubmitting } = formState;
const t=useTranslations()
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
  const paymentTypes =[
    
    {
      value:"registrationAndInsuranceFee"  ,
      label: t('registrationAndInsuranceFee'),

    },
    {
      value:"feedingFee"  ,
      label: t('feedingFee'),

    },
    {
      value:"amountLeftToPay",
      label: t('schoolFee'),

    },
  ]
const onSelected=(selectedStudent:any)=>{
  form.setValue("class",selectedStudent.class)
  form.setValue("parentFullName",selectedStudent.parentFullName)
  form.setValue("parentId",selectedStudent.parentId)
  form.setValue("level",selectedStudent.level)
  form.setValue("parentPhone",selectedStudent.parentPhone)
  form.setValue("address",selectedStudent.address)
  form.setValue("id",selectedStudent.id)

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

      case "student":
        return (
          <Input {...field} value={getValues("student")} readOnly/>
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

      case "parentFullName" :
        return (<Input {...field}  value={getValues("parentFullName")} readOnly/>)
        
      case "level" :
        return (<Input {...field}  value={getValues("level")} readOnly/>)

      case "paymentType":
        return (
          <Combobox
          {...field}
          open={paymentPlanModal}
          setOpen={setPaymentPlanModal}
          placeHolder={t('payment-type')}
          options={paymentTypes}
          value={getValues("paymentType")}
          onSelected={(selectedValue) => {
         
            
            const paymentPlan = paymentTypes?.find(
              (plan:any) => plan.value === selectedValue
            );
       
            if (paymentPlan) {
              form.setValue(fieldName, selectedValue)
              const selectedStudent = students.find((student:any) => student.id === getValues("id"));
              form.setValue("amountLeftToPay",selectedStudent[paymentPlan.value])
            
            }
          }}
        />

        )
          case "class":
            return <Input {...field}  value={getValues("class")}/>;
                    default:
      return <Input {...field} />;
  }
};
  function generateBillIfNeeded(data: StudentPaymentFormValues,student:any) {
    if (printBill) {
      const initialData = {
        studentName: data.student,
        level: data.level,
        class: data.class,
        parentName: data.parentFullName,
        address: data.address,
        phoneNumber: data.parentPhone,
        paymentDate: format(data.paymentDate, 'yyyy-MM-dd'),
        paymentType:data.paymentType,
        amount:data.paymentAmount.toString(),
        amountLeft:  (student[data.paymentType]- data.paymentAmount).toString()
      };

      const link = document.createElement('a');
      document.body.appendChild(link);
    }
  }
  async function onSubmit(data: StudentPaymentFormValues) {
    // const monthAbbreviations = getMonthAbbreviationsInRange(
    //   getValues("student").nextPaymentDate,
    //   data.nextPaymentDate
    // );
    const month = getMonthInfo(data.paymentDate);
    const PaymentMonth=getMonthAbbreviation(data.paymentDate)
    let billGenerated = false;
    const transactionId = await addPaymentTransaction(
      { ...data, documents: [] },PaymentMonth
    );
    const uploaded = await uploadFilesAndLinkToCollection(
      "Billing/payments/Invoices",
      transactionId,
      filesToUpload
    );
    setInvoices((prev: StudentPaymentFormValues[]) => [
      {
        ...data,
        id: transactionId,
        invoice: transactionId,
        value: transactionId,
        label: transactionId,
        documents: uploaded,
      },
      ...prev,
    ]);
  
    setStudents((prevStudents: any) => {
      const updatedStudents = prevStudents.map((student: any) => {
        if (student.id === data.id) {
          const updatedStudent = {
            ...student,
            //nextPaymentDate: data.nextPaymentDate,
            amountLeftToPay: data.amountLeftToPay - data.paymentAmount,
            monthly_payments: {
              ...student.monthly_payments,
              [PaymentMonth]: {
                status: 'Paid',
                paymentAmount:data.paymentAmount
              }
            } // Ensure a new object is created for immutability
          };
          if (!billGenerated) {
            generateBillIfNeeded(data,student);
            billGenerated = true; // Update variable
          }
          return updatedStudent;
        }
        return student;
      });  
      return updatedStudents;
    });
    setAnalytics((prevState: any) => ({
      data: {
        ...prevState.data,
        [month.abbreviation]: {
          ...prevState.data[month.abbreviation],
          income: prevState.data[month.abbreviation].income + data.paymentAmount,
        },
      },
      totalIncome: prevState.totalIncome + data.paymentAmount,
    }));

  toast({
    title: t('changes-applied-0'),
    description: t('changes-applied-successfully'),
  });
          reset(); 
}

  return (

<Sheet  >
<SheetTrigger asChild>
        <Button className="mr-2" variant='link'> {t('add-payment')}</Button>
      </SheetTrigger>
         <SheetContent className=" sm:max-w-[650px]">
         <ScrollArea className="h-screen pb-20 ">
         <SheetHeader>
      <div className="grid gap-0.5">
      <SheetTitle className="group flex items-center gap-2 text-lg">
      {t('reset-details')} </SheetTitle>
      </div>

      <div className="ml-auto flex items-center gap-1">
        <Button
          size="sm"
          variant="outline"
          className="h-8 gap-1"
          onClick={() => reset()}
        >
          <ResetIcon className="h-3.5 w-3.5" />
          <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
            {t('reset-details')} </span>
        </Button>
      </div>
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

          <SheetFooter className="mt-5">
            <SheetClose asChild>
              <LoadingButton
                loading={isSubmitting}
                type="submit"
                onClick={form.handleSubmit(onSubmit)}
              >
                {t('save-changes')} </LoadingButton>
            </SheetClose>
          </SheetFooter>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
export default StudentPaymentSheet