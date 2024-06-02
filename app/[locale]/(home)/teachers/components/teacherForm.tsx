
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
import { teacherRegistrationSchema } from "@/validators/teacherSchema"
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useCallback, useState} from "react";
import { useToast } from "@/components/ui/use-toast";
import CalendarDatePicker from "../../students/components/date-picker";
import { ScrollArea} from "@/components/ui/scroll-area";
import ImageUpload from "../../students/components/uploadFile";
import Combobox from "@/components/ui/comboBox";
import { LoadingButton } from "@/components/ui/loadingButton";
import { z } from "zod";
import { useData } from "@/context/admin/fetchDataContext";
import { addTeacher } from "@/lib/hooks/teachers";
import { uploadFilesAndLinkToCollection } from "@/context/admin/hooks/useUploadFiles";
import { useTranslations } from "next-intl";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption
} from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
const fieldNames = [
  "firstName",
  "lastName",
  "teacherSubject",
  "dateOfBirth",
  "gender",
  "salary",
  "address",
  "city",
  "state",
  "postalCode",
  "country",
  "teacherEmail",
  "teacherPhone",
  "emergencyContactName",
  "emergencyContactPhone",
  "medicalConditions",
  "joiningDate",
  "status",
];



type FormKeys =
  | "firstName"
  | "lastName"
  | "dateOfBirth"
  | "gender"
  | "year"
  | "address"
  | "city"
  | "state"
  | "postalCode"
  | "country"
  | "salary"
  | "teacherSubject"
  |"teacherEmail"
  |"teacherPhone"
  |"emergencyContactName"
  |"emergencyContactPhone"
  |"medicalConditions"
  |"joiningDate"
  |"status"

type TeacherFormValues = z.infer<typeof teacherRegistrationSchema>;
interface FileUploadProgress {
  file: File;
  name: string;
  source:any;
}
const generateTimeOptions = (startTime: string, endTime: string, interval: number): string[] => {
  const timeOptions: string[] = [];
  let [startHour, startMinute] = startTime.split(':').map(Number);
  let [endHour, endMinute] = endTime.split(':').map(Number);

  while (startHour < endHour || (startHour === endHour && startMinute <= endMinute)) {
      const formattedHour = startHour.toString().padStart(2, '0'); // Ensure two digits for hours
      const formattedMinute = startMinute.toString().padStart(2, '0'); // Ensure two digits for minutes
      const time = `${formattedHour}:${formattedMinute}`;
      timeOptions.push(time);

      // Add interval minutes
      startMinute += interval;
      if (startMinute >= 60) {
          startHour++;
          startMinute -= 60;
      }
  }

  return timeOptions;
};

interface OpenDay {
  day: string;
  start: string;
  end: string;
  state: string;
  id:any,
}

interface DashboardProps {
  openDays: OpenDay[];
  form:any
}
export default function TeacherForm() {
  const { toast } = useToast();
  const {setTeachers} = useData()
  const [filesToUpload, setFilesToUpload] = useState<FileUploadProgress[]>([]);
  const t=useTranslations()
  const [open, setOpen] = useState(false);
  const [openGender, setOpenGender] = useState(false);
  const [openSubject, setOpenSubject] = useState(false);
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const timeOptions = generateTimeOptions("07:00","18:00", 30);
  const form = useForm<TeacherFormValues>({
    resolver: zodResolver(teacherRegistrationSchema),
    defaultValues: {
      id: '1',
      year: '2024',
      officeHours:[]
    },
  });
  const { reset, formState, setValue, getValues } = form;
  const { isSubmitting } = formState;
  const status =[
    {
      value:"active",
      label:t("Active"),
    },
    {
      value:"suspended",
      label:t("Suspended"),
    },{
      value:"expelled",
      label:t("Expelled"),
    }
  ]
  const genders = [
    {
      value: "male",
      label: t("Male"),
    },
    {
      value: "female",
      label: t("Female"),
    },
  ];
  
  
  const subjects = [
    
    
    {
      value: "arabic",
      label: t("Arabic"),
    },
    {
      value: "french",
      label: t("French"),
    },
    {
      value: "english",
      label: t("English"),
    },
  ];
  const { fields: fields, append: append,remove:removeClass } = useFieldArray({
    control: form.control,
    name: "officeHours",
  });
  const renderInput = (fieldName:string, field:any) => {
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
      case "gender":
        return (
          <Combobox
            {...field}
            open={openGender}
            setOpen={setOpenGender}
            placeHolder={t('gender')}
            options={genders}
            value={getValues("gender")}
            onSelected={(selectedValue) => {
              form.setValue(fieldName, selectedValue);
            }}
          />
        );
        case "status":
        return (
          <Combobox
            {...field}
            open={open}
            setOpen={setOpen}
            placeHolder={t('status')}
            options={status}
            value={getValues("status")}
            onSelected={(selectedValue) => {
              form.setValue(fieldName, selectedValue);
            }}
          />
        );


        
        case "teacherSubject":
          return (
            <Combobox
              {...field}
              open={openSubject}
              setOpen={setOpenSubject}
              placeHolder={t('a-subject')}
              options={subjects}
              value={getValues("teacherSubject")}
              onSelected={(selectedValue) => {
       
                form.setValue(fieldName, selectedValue);
              }}
            />
          );
          case "salary":
            return (<Input {...field} onChange={event => field.onChange(+event.target.value)}/>)
       
      default:
        return <Input {...field}  />;
    }
  };


 async function onSubmit(data:TeacherFormValues) {
  const teacherId= await addTeacher({...data,documents:[]})
  const uploaded=await uploadFilesAndLinkToCollection("Teachers",teacherId,filesToUpload)
  setTeachers((prev:TeacherFormValues[])=>[{...data,id:teacherId,teacher: `${data.firstName} ${data.lastName}`,
  value:`${data.firstName} ${data.lastName}`,
  label:`${data.firstName} ${data.lastName}`,
documents:uploaded},...prev])
        toast({
            title: t('teacher-added'),
            description: t('teacher-added-successfully'),
          });
  console.log(data);
          reset(); 
        
        }
   

  return (
    <Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
      <CardHeader className="flex flex-row items-start bg-muted/50">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg">
            {t('create-teacher')} </CardTitle>
          <CardDescription/>
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
           <FormLabel>Office Hours</FormLabel>    
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Day</TableHead>
              <TableHead>Start</TableHead>
              <TableHead>end</TableHead>
              <TableHead className="w-[100px]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.map((field, index) => (
              <TableRow key={index}>
                <TableCell>
                  <FormField
                    control={form.control}
                    key={field.id}
                    name={`officeHours.${index}.day`}
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger
                              id={`day-${index}`}
                              aria-label={`Select day`}
                            >
                              <SelectValue placeholder="Select day" />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent>
                            {daysOfWeek.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </TableCell>
                <TableCell>
                  <FormField
                    control={form.control}
                    key={field.id}
                    name={`officeHours.${index}.start`}
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger
                              id={`start-${index}`}
                              aria-label={`Select start time`}
                            >
                              <SelectValue placeholder="Select start time" />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent>
                            {timeOptions.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </TableCell>
                <TableCell>
                  <FormField
                    control={form.control}
                    key={field.id}
                    name={`officeHours.${index}.end`}
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger
                              id={`end-${index}`}
                              aria-label={`Select end time`}
                            >
                              <SelectValue placeholder="Select End time" />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent>
                            {timeOptions.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </TableCell>
                <TableCell>
                <Button  type="button" variant="destructive" onClick={()=>removeClass(index)}>{t('remove')}</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableCaption> <Button
            type="button"
            variant="outline"
            size="sm"
            className="mb-2"
            onClick={() => append({day:"",start:"",end:""})}
          >
            Add Office hour </Button></TableCaption>
       
        </Table>
       
            </form>
          </Form>

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