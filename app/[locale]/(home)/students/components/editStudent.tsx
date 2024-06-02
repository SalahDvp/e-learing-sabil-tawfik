
import React, { useState, useCallback, useEffect } from "react";
import { Input } from "@/components/ui/input";
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
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ImageUpload from "./uploadFile";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import studentRegistrationSchema from "@/validators/auth";
import CalendarDatePicker from "./date-picker";
import Combobox from "@/components/ui/comboBox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { LoadingButton } from "@/components/ui/loadingButton";
import { useData } from "@/context/admin/fetchDataContext";
import { z } from "zod";
import { fetchFiles, updateDocuments } from "@/context/admin/hooks/useUploadFiles";
import { updateStudent } from "@/lib/hooks/students";
import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
type FormKeys =
  | "firstName"
  | "lastName"
  | "dateOfBirth"
  | "gender"
  | "address"
  | "city"
  | "state"
  | "postalCode"
  | "country"
  | "parentFirstName"
  | "parentLastName"
  | "parentEmail"
  | "parentPhone"
    |"class"
    |"level"
    |"amountLeftToPay"
  | "emergencyContactName"
  | "emergencyContactPhone"
  | "medicalConditions"
  |"registrationAndInsuranceFee"
  |"feedingFee"
  |"class";
  type StudentFormValues = z.infer<typeof studentRegistrationSchema> & { [key: string]: string | Date | number | any;}

interface openModelProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean; // Specify the type of setOpen
  student:StudentFormValues
}

const fieldNames = [
  
  "firstName",
  "lastName",
  "dateOfBirth",
  "gender",
  "address",
  "city",
  "state",
  "postalCode",
  "country",
  "parentFirstName",
  "parentLastName",
  "parentEmail",
  "parentPhone",
  "level",
  "class",
  'registrationAndInsuranceFee',
  'feedingFee',
  "class",
  "amountLeftToPay",
  "emergencyContactName",
  "emergencyContactPhone",
  "medicalConditions",

];
const genders = [
  {
    value: "male",
    label: "Male",
  },
  {
    value: "female",
    label: "Female",
  },
];

interface FileUploadProgress {
  file: File;
  name: string;
  source:any;
}
const SheetDemo: React.FC<openModelProps> = ({ setOpen, open,student }) => {
  const { toast } = useToast();
  const [openParent, setOpenParent] = useState(false);
  const [openGender, setOpenGender] = useState(false);
  const {parents,setStudents,levels}=useData()
  const [filesToUpload, setFilesToUpload] = useState<FileUploadProgress[]>([]);
  const[openFeedingFee,setOpenFeedingFee]=useState(false)
  const [classes,setClasses]=useState([])

  const [openRegistrationAndInsuranceFee,setOpenRegistrationAndInsuranceFee]=useState(false)
const t=useTranslations()
  const form = useForm<StudentFormValues>({
    //resolver: zodResolver(studentRegistrationSchema),
    defaultValues: {
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
      class: "lol",
    }
  });
  const { formState, setValue, getValues,reset} = form;
  const { isSubmitting } = formState;
  const studentPaymentStatus =[
    
    {
      value:"Paid"  ,
      label: t('paid'),
    },
    {
      value:"notPaid"  ,
      label: t('not-paid'),
    },
  ]
  const createMonthlyPaymentsData = (level: any) => {

    const monthlyPaymentsKey = `monthly_payments`;
    const monthlyPaymentsObj: Record<string, { status: string; month: string }> = {};
    const startDateMonth = level.start.getMonth(); // Month index from 0 to 11
    const endDateMonth = level.end.getMonth(); // Month index from 0 to 11
  
    const startDate = new Date(level.start.getFullYear(), startDateMonth, 1); // First day of the start month
    const endDate = new Date(level.end.getFullYear(), endDateMonth + 1, 0); // Last day of the end month
  
    let currentDate = new Date(startDate);
  
    while (currentDate <= endDate) {
      const monthAbbreviation = currentDate.toLocaleString('en-GB', { month: 'short' });
      const yearAbbreviation = currentDate.getFullYear().toString().substr(-2);
      const monthKey = `${monthAbbreviation}${yearAbbreviation}`;
      const monthStatus =  'Not Paid';
      monthlyPaymentsObj[monthKey] = {status:monthStatus,month:monthKey};
      
      // Move to the next month
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
  
    return { monthlyPaymentsKey, monthlyPaymentsObj };
  };
useEffect(() => {
    const downloadFiles = async () => {
      if (student && student.documents) {
        const files=await fetchFiles(student.documents)
        console.log("files",files);
        
        setFilesToUpload(files);
      }
    };
  
    if (student) {
      console.log("studwnt loaded");
     
      reset(student)
      const level =levels.find((lvl:any)=>lvl.level===student.level)
      setClasses(level?.classes)
      console.log("classes",level?.classes);
      
      downloadFiles();
    }
  }, [student,reset,levels])
  const renderInput = (fieldName: string, field:any) => {
    switch (fieldName) {
      case "dateOfBirth":
        return (
          <CalendarDatePicker
            {...field}
          
            date={getValues("dateOfBirth")}
            setDate={(selectedValue) => {
              if (selectedValue === undefined) {
                // Handle undefined case if needed
              } else {
                form.setValue(fieldName, selectedValue);
              }
            }}
          />
        );
        case "joiningDate":
          return (
            <CalendarDatePicker
              {...field}
              
              date={getValues("joiningDate")}
              setDate={(selectedValue) => {
                if (selectedValue === undefined) {
                  // Handle undefined case if needed
                } else {
                  form.setValue(fieldName, selectedValue);
                }
              }}
            />
          );
      case "parentFullName":
        return (
          <Combobox
            {...field}
            open={openParent}
            setOpen={setOpenParent}
            placeHolder={t("parents")}
            options={parents}
            value={getValues("parentFullName")}
            onSelected={(selectedValue) => {
              const selectedParent = parents.find(
                (parent:any) => parent.parent === selectedValue
              );
              if (selectedParent) {

                  
                form.setValue(fieldName, selectedValue);
                setValue("parentLastName", selectedParent.lastName);
                setValue("parentFirstName", selectedParent.firstName);
                setValue("parentEmail", selectedParent.parentEmail);
                setValue("parentPhone", selectedParent.parentPhone);
                setValue("parentId", selectedParent.id);
              }
     
              
            
            }} 
          />
        );
      case "gender":
        return (
          <Combobox
            {...field}
            open={openGender}
            setOpen={setOpenGender}
            placeHolder={t("gender")}
            options={genders}
            value={getValues("gender")}
            onSelected={(selectedValue) => {
              const gender: "male" | "female" | "other" = selectedValue as "male" | "female" | "other";

              form.setValue(fieldName, gender);
            }}
          />
        );
          case "feedingFee":
            return (
              <Combobox
              {...field}
              open={openFeedingFee}
              setOpen={setOpenFeedingFee}
              placeHolder={t("status")}
              options={studentPaymentStatus}
              value={getValues("feedingFee")}
              onSelected={(selectedValue) => {
                form.setValue(fieldName, selectedValue);
              }}
            />
            )
            case "registrationAndInsuranceFee":
              return (
                <Combobox
                {...field}
                open={openRegistrationAndInsuranceFee}
                setOpen={setOpenRegistrationAndInsuranceFee}
                placeHolder={t("status")}
                options={studentPaymentStatus}
                value={getValues("registrationAndInsuranceFee")}
                onSelected={(selectedValue) => {
                  form.setValue(fieldName, selectedValue);
                }}
              />
              )
              case "level":
                return(   <Select
                  defaultValue={levels.find((lvl:any)=>lvl.level===getValues("level")).level}
                  onValueChange={(value) => {
                    const level =levels.find((lvl:any)=>lvl.level===value)
                    form.setValue("totalAmount", level.fee);
                    form.setValue("amountLeftToPay", level.fee);
                    form.setValue("startDate", level.start);
                    form.setValue("nextPaymentDate", level.start);
                    form.setValue("lastPaymentDate", level.start);
                    form.setValue("level", level.level);
                    form.setValue("levelId", level.id);
                    form.setValue("registrationAndInsuranceFee", "notPaid");
                    form.setValue("feedingFee", "notPaid");
                    form.setValue("level", level.level);
                    const data=createMonthlyPaymentsData(level)
                    form.setValue(data.monthlyPaymentsKey,data.monthlyPaymentsObj)
                    setClasses(level.classes)

                  }}
          
                        >
                          <FormControl>
                            <SelectTrigger
                              id={`level`}
                              aria-label={`Select level`}
                            >
                              <SelectValue placeholder={t('select-level')} />
                            </SelectTrigger>
                          </FormControl>
      
                          <SelectContent>
                            {levels.map((level:any,index:number) => (
                              <SelectItem key={index} value={level.level}>
                                {level.level}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>)
                                           case "class":
                                            return(   <Select
                                              defaultValue={form.getValues("class")}
                                              onValueChange={(value) => {
                                               
                                                form.setValue("class", value);
                                  
                                              }}
                                      
                                                    >
                                                      <FormControl>
                                                        <SelectTrigger
                                                          id={`class`}
                                                          aria-label={`Select class`}
                                                        >
                                                          <SelectValue placeholder={t('select-a-class')} />
                                                        </SelectTrigger>
                                                      </FormControl>
                                  
                                                      <SelectContent>
                                                        {classes.map((cls:any,index:number) => (
                                                          <SelectItem key={index} value={cls}>
                                                            {cls}
                                                          </SelectItem>
                                                        ))}
                                                      </SelectContent>
                                                    </Select>)
          
      default:
        return <Input {...field} />;
    }
  };

 const getChanges = (currentValues: StudentFormValues): string => {
    let changes = "Changes:\n";

    for (const key in currentValues) {
      if (currentValues[key] !== student[key]) {
        changes += `${key}: ${student[key]} => ${currentValues[key]}\n`;
      }
    }

    return changes;
  };
  async function onSubmit(data: StudentFormValues) {
    const level=levels.find((level:any)=>level.level===data.level)
    const { value, label, ...updatedData } = data;
    await updateStudent(updatedData,student.id,student,level)
    console.log(data);
    
    const documents= await updateDocuments(student.documents && student.documents> 0?student.documents:[],filesToUpload,'Students',student.id)
setStudents((prev:StudentFormValues[]) => {
  const updatedLevels = prev.map((student:StudentFormValues) =>
    student.id === data.id ? { ...data, id: data.id, student: `${data.firstName} ${data.lastName}`, documents: documents }: student
  );
  return updatedLevels;
});
toast({
  title: t('changes-applied-1'),
  description: t(`changes-applied-Successfully`),
});


  }
  

  return (
    <Sheet open={open} onOpenChange={setOpen} >
   <SheetContent className=" sm:max-w-[650px]">
        <ScrollArea className="h-screen pb-20 ">
          <SheetHeader>
            <SheetTitle>{t('edit-student')}</SheetTitle>
            <SheetDescription>
              {t('make-changes-to-your-student')} </SheetDescription>
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
                      <FormControl>
                        {renderInput(fieldName,field)}
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
};
export default SheetDemo;
