
import React,{useState,useCallback} from "react"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Form,FormField,FormItem,FormControl,FormLabel,FormMessage } from "@/components/ui/form"
import ImageUpload from "@/app/[locale]/(home)/students/components/uploadFile"
import {useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { teacherPaymentRegistrationSchema } from "@/validators/teacherSalarySchema"
import CalendarDatePicker from "@/app/[locale]/(home)/students/components/date-picker"
import Combobox from "@/components/ui/comboBox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"
import { LoadingButton } from "@/components/ui/loadingButton"
import { z } from "zod";
import { getMonthInfo, updateTeacherSalary } from "@/lib/hooks/billing/teacherPayment"
import { useData } from "@/context/admin/fetchDataContext"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { fetchFiles, updateDocuments } from "@/context/admin/hooks/useUploadFiles"
import { useTranslations } from "next-intl"
const fieldNames = [
    "teacher",
    "salaryTitle",
    "salaryAmount",
    "salaryDate",
    "typeofTransaction",
    "monthOfSalary",
    "fromWho",
    
];
type FormKeys = "salaryTitle" | "salaryAmount" | "salaryDate" | "typeofTransaction" | "monthOfSalary" | "fromWho";
 

  
type TeacherSalaryFormValues = z.infer<typeof teacherPaymentRegistrationSchema> & { [key: string]: string | Date | number |any ;}
interface openModelProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    open: boolean; // Specify the type of setOpen
    teacherSalary:TeacherSalaryFormValues
  }

  
  

  
 

  interface FileUploadProgress {
    file: File;
    name: string;
    source:any;
  }
const SheetDemo: React.FC<openModelProps> = ({ setOpen,open,teacherSalary }) => {
  const { toast } = useToast();
  const{setTeachersSalary}=useData()
  const {teachers,setAnalytics}= useData()
  const [status, setstatus] = useState(false);
  const [teacherModal,setTeacherModal]=useState(false)
  const [openTypeofpayment, setOpenTypeofpayment] = useState(false);
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
  const MonthOfYear =['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const Salarystatus =[
  
    {
      value:"paid"  ,
      label: t('paid'),
    },
    {
      value:"notPaid",
      label: t('not-paid'),
    },
  ]
    const form =useForm<TeacherSalaryFormValues>({
      resolver: zodResolver(teacherPaymentRegistrationSchema),
    });
    const {formState,setValue,getValues,reset } = form;
    const { isSubmitting } = formState;
    React.useEffect(() => {
      const downloadFiles = async () => {
        if (teacherSalary && teacherSalary.documents) {
          const files=await fetchFiles(teacherSalary.documents)
          console.log("files",files);
          
          setFilesToUpload(files);
        }
      };
    
      if (teacherSalary) {
        reset(teacherSalary)
        console.log("reset",teacherSalary);
        downloadFiles();
      }
    }, [teacherSalary,reset])

    const teacherNames = teachers.map((teacher_: { firstName: string; lastName: string; id:string}) => {
      // Combine and trim first and last name to remove leading/trailing spaces
      const combinedName = 'test zakamo';
    
      return {
        label: combinedName, // For use in UI components like dropdowns
        value: combinedName, // For use as a form value or ID
        id: teacher_.id,
      };
    });
    
    
    

    const renderInput = (fieldName:string, field:any) => {
        switch (fieldName) {
          case "salaryDate":
            return (
              <CalendarDatePicker
                {...field}
                date={getValues("salaryDate")}
                setDate={(selectedValue) => {
                  if (selectedValue === undefined) {
                    // Handle undefined case if needed
                  } else {
                    form.setValue(fieldName, selectedValue);
                  }
                }}
              />
            );
    
          case "monthOfSalary": 
          return (
            <Select
            onValueChange={field.onChange}
              value={field.value}
              >
                <FormControl>
                  <SelectTrigger
                    id={`monthOfSalary`}
                    aria-label={`Select month`}
                  >
                    <SelectValue placeholder={t('select-month')} />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  {MonthOfYear.map((cls:string) => (
                    <SelectItem key={cls} value={cls}>
                      {cls}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              options={teacherNames}
              value={getValues("teacher")?.name} 
              onSelected={(selectedValue) => {
                const selectedTeacher = teacherNames.find(
                    (teacher:any) => teacher.value === selectedValue
                  );
               {selectedTeacher && form.setValue("teacher", {name:selectedTeacher?.value,id:selectedTeacher?.id})}
              }}
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
            case "salaryAmount":
                return (<Input {...field} onChange={event => field.onChange(+event.target.value)}/>)
    
          default:
            return <Input {...field} />;
        }
      };

  
      const getChanges = (currentValues:  TeacherSalaryFormValues): string => {
        let changes = 'Changes:\n';
    
        for (const key in currentValues) {
          if (currentValues[key] !==teacherSalary[key]) {
            changes += `${key}: ${teacherSalary[key]} => ${currentValues[key]}\n`;
          }
        }
    
        return changes;
      };
      async function onSubmit(data: TeacherSalaryFormValues) {
        const changes = getChanges(data);
        const { value, label, ...updatedData } = data;
        const month=getMonthInfo(updatedData.salaryDate)
        await updateTeacherSalary(updatedData,teacherSalary.id,teacherSalary.salaryAmount)
        const documents= await updateDocuments(teacherSalary.documents && teacherSalary.documents> 0?teacherSalary.documents:[],filesToUpload,'Billing/payouts/TeachersTransactions',teacherSalary.id)
        setTeachersSalary((prev:any) => {
          const updatedTeachers = prev.map((teacherSalarys:TeacherSalaryFormValues) =>
          teacherSalarys.id === teacherSalary.id? {...data,teacherSalary:teacherSalary.id,documents:documents} : teacherSalarys
          );
          return updatedTeachers;
        });
        setAnalytics((prevState:any) => ({
          data: {
            ...prevState.data,
            [month.abbreviation]: {
              ...prevState.data[month.abbreviation],
              expenses:prevState.data[month.abbreviation].expenses + (teacherSalary.salaryAmount-updatedData.salaryAmount)
            }
          },
          totalExpenses: prevState.totalExpenses +  (teacherSalary.salaryAmount-updatedData.salaryAmount)
        }));  
        toast({
          title: t('changes-applied-1'),
          description: t(`changes-applied-Successfully`),
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
           
          {fieldNames.map((fieldName,index) => (
             <FormField
             key={index}
             control={form.control}
             name={fieldName as FormKeys} 
             
             render={({ field }) => (
              <FormItem style={{marginBottom:15}} >
                      <FormLabel>{fieldName}</FormLabel>
                      <FormControl  >
                      {renderInput( fieldName, field )}
                      </FormControl>
           
                      <FormMessage />
                    </FormItem>
                  )}
                />
             
              ))}
          
            </form>
          </Form>
          
          <ImageUpload  filesToUpload={filesToUpload} setFilesToUpload={setFilesToUpload}/> 

        <SheetFooter className="mt-5">
          <SheetClose asChild>
            
          <LoadingButton loading={isSubmitting} type="submit"    onClick={form.handleSubmit(onSubmit)}>
            {t('save-changes')} </LoadingButton>
          </SheetClose>
        </SheetFooter>
        </ScrollArea>
      </SheetContent>
      
    </Sheet>
  )
}
export default SheetDemo