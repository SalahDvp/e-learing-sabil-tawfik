"use client"
import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Step,
  Stepper,
  useStepper,
  type StepItem,
} from "@/components/stepper"
import { Button } from "@/components/ui/button"
import {Camera} from "react-camera-pro";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PlusCircle } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Student, StudentSchema } from '@/validators/auth';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import CalendarDatePicker from './date-picker';
import { Separator } from '@/components/ui/separator';
import QRCode from 'qrcode'
import { addStudent } from '@/lib/hooks/students';
import { LoadingButton } from '@/components/ui/loadingButton';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { UseFormReturn } from 'react-hook-form';

interface FooterProps {
  formData: Student;
  form: UseFormReturn<any>; // Use the specific form type if available
  isSubmitting: boolean;
  reset: UseFormReturn<any>['reset']; // Adding reset function from useForm
}

const classes = [
  { id: "1", subject: 'Math', name: 'Nasri', time: '13:30' },
  { id: "2", subject: 'Physique', name: 'Mahdi', time: '15:30' },
  { id: "3", subject: 'Englais', name: 'Math', time: '17:30' },
  { id: "4", subject: 'Math', name: 'Mahdi', time: '14:30' },
  { id: "5", subject: 'Biology', name: 'Aisha', time: '10:00' },
  { id: "6", subject: 'Chemistry', name: 'Omar', time: '11:30' },
  { id: "7", subject: 'History', name: 'Fatima', time: '09:00' },
  { id: "8", subject: 'Geography', name: 'Ali', time: '08:30' },
  { id: "9", subject: 'Physics', name: 'Zahra', time: '12:00' },
  { id: "10", subject: 'Computer Science', name: 'Hassan', time: '16:00' },
];
const steps = [
  { label: "Step 1" },
  { label: "Step 2" },
  { label: "Step 3" },

] satisfies StepItem[]
interface openModelProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean; // Specify the type of setOpen
  student:Student
}
const EditStudent: React.FC<openModelProps> = ({ setOpen, open,student }) => {
  const camera = useRef<null | { takePhoto: () => string }>(null);

  const form = useForm<Student>({
    resolver: zodResolver(StudentSchema),
  });
  const { reset,formState, setValue, getValues,control,watch} = form;
  const { isSubmitting } = formState;
  const { fields, append:appendClass,remove:removeClass, } = useFieldArray({
    control: form.control,
    name: "classes",

  });
  const getClassId = (subject:string, name:string, time:string)  => {
    const selectedClass = classes.find(cls => cls.subject === subject && cls.name === name && cls.time === time);
    return selectedClass ? selectedClass.id : "undifined";
  };

  const handleGroupChange = (index:number, field:'name' | 'id' | 'subject' | 'time', value:string) => {
    const classes = [...getValues('classes')];
    classes[index][field] = value; 
    setValue('classes',classes); 
    if (classes[index].time && classes[index].subject && classes[index].name) {
      const subject = classes[index].subject 
      const name =classes[index].name
      const time = classes[index].time
      const selectedClassId = getClassId(subject, name, time);
      setValue(`classes.${index}.id`, selectedClassId);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen} >
      <DialogContent className="sm:max-w-[550px]">
      <Form {...form} >
      <form >
        <DialogHeader>
          <DialogTitle>Add Student</DialogTitle>
          <DialogDescription>
            Add your Student here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <div className="flex w-full flex-col gap-4">

      <Stepper initialStep={0} steps={steps} >

        {steps.map(({ label }, index) => {
          return (
            <Step key={label} label={label}>
              <div className="h-[450px] flex items-center justify-center my-4 border bg-secondary  rounded-md">
              {index === 0 ? (
 
  <div className="grid gap-4 py-4">

    <FormField
                  
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4">
                      <FormLabel className="text-right">Name</FormLabel>
                      <FormControl><Input id="name"  className="col-span-3"  {...field}/></FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />


    <FormField
              control={control}
              name="birthdate"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Birthdate</FormLabel>
                  <FormControl>  
                    <CalendarDatePicker
            {...field}
            date={getValues("birthdate")}
            className="col-span-3"
            setDate={(selectedValue) => {
              if (selectedValue === undefined) {
                // Handle undefined case if needed
              } else {
                form.setValue('birthdate', selectedValue);
              }
            }}
          /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


    <FormField
              control={control}
              name="birthplace"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Birthplace</FormLabel>
                  <FormControl><Input id="birthplace" className="col-span-3" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
   

    <FormField
              control={control}
              name="school"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">School</FormLabel>
                  <FormControl><Input id="school" className="col-span-3" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
 

    <FormField
              control={control}
              name="year"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Year</FormLabel>
                  <FormControl><Input id="year" className="col-span-3" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


    <FormField
              control={control}
              name="field"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Field</FormLabel>
                  <FormControl><Input id="field" className="col-span-3" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
  

    <FormField
              control={control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Phone Number</FormLabel>
                  <FormControl><Input id="phoneNumber" className="col-span-3" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
    
  </div>

) : index === 1 ? (
  <div className="flex flex-col items-center gap-4 py-4">

 {!watch('photo') ? (
        <div className="w-[300px] items-center justify-center flex flex-col">
          
          <Camera ref={camera} aspectRatio={16/9} errorMessages={{noCameraAccessible:"no Cemera"}} />
          <Button
            onClick={() => {
              if (camera.current) {
                setValue('photo',camera.current.takePhoto());
                console.log(camera.current.takePhoto());
                
              } else {
                console.error('Camera reference is null');
              }
            }}
            variant="link"
            type='button'
          >
            Take photo
          </Button>
        </div>
      ) : (
        <>
          <img src={watch('photo')?watch('photo'):null} alt="Taken photo"  className='w-[300px]'/>
          <Button onClick={() =>   setValue('photo',null)} variant="link" type='button'>
            Retake photo
          </Button>
        </>
      )}


</div>

) : (
  <div className="w-full h-full">
    <Table>
      <TableCaption>        <Button type='button' size="sm" variant="ghost" className="gap-1 w-full"  onClick={()=>appendClass({id:'',name:'',subject:'',time:''})}>
                      <PlusCircle className="h-3.5 w-3.5" />
                      add group</Button></TableCaption>
      <TableHeader>
        <TableRow>
        <TableHead>Subject</TableHead>
          <TableHead >Name</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {fields.map((invoice,index) => (
          <TableRow key={invoice.id}>
                        <TableCell className="font-medium"> 
              <Select value={invoice.subject} onValueChange={(value)=>handleGroupChange(index,'subject',value)}>
      <SelectTrigger className="">
        <SelectValue placeholder="Select a Subject" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
        <SelectLabel>Subjects</SelectLabel>
                    {Array.from(new Set(classes.map(cls => cls.subject))).map(subject => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
        </SelectGroup>
      </SelectContent>
    </Select></TableCell>
            <TableCell className="font-medium"> 
              <Select value={invoice.name} onValueChange={(value)=>handleGroupChange(index,'name',value)}>
      <SelectTrigger className="">
        <SelectValue placeholder="Select a Group" />
      </SelectTrigger>
      <SelectContent>
      {invoice.subject? ( <SelectGroup>
          <SelectLabel>Groups</SelectLabel>
          {Array.from(new Set(classes
                        .filter(cls => cls.subject === invoice.subject)
                      )).map(name => (
                        <SelectItem key={name.name} value={name.name}>
                          {name.name}
                        </SelectItem>
                      ))}
        </SelectGroup>):(<p className="text-sm text-muted-foreground">Select Subject first</p>)}
      </SelectContent>
    </Select></TableCell>
            <TableCell> <Select value={invoice.time} onValueChange={(value)=>handleGroupChange(index,'time',value)}>
      <SelectTrigger className="">
        <SelectValue placeholder="Select a time" />
      </SelectTrigger>
      <SelectContent>
      {invoice.subject && invoice.name? ( <SelectGroup>
          <SelectLabel>times</SelectLabel>
          {classes
                        .filter(cls => cls.subject === invoice.subject && cls.name === invoice.name)
                        .map(cls => (
                          <SelectItem key={cls.time} value={cls.time}>
                            {cls.time}
                          </SelectItem>
                        ))}
        </SelectGroup>):(<p className="text-sm text-muted-foreground">Select Subject and name first</p>)}
      </SelectContent>
    </Select></TableCell>
    <TableCell>    <Button  type="button" variant="destructive" onClick={()=>removeClass(index)}>remove</Button></TableCell>

          </TableRow>
        ))}
      </TableBody>
    </Table>

</div>
)}
              </div>
            </Step>
          )
        })}
        <Footer formData={getValues()} form={form} isSubmitting={isSubmitting} reset={reset}/>

      </Stepper>

    </div>
    </form>
    </Form>
      </DialogContent>
    </Dialog>
  )
}

const Footer: React.FC<FooterProps> = ({ formData, form, isSubmitting,reset}) => {
  const {
    nextStep,
    prevStep,
    resetSteps,
    isDisabledStep,
    hasCompletedAllSteps,
    isLastStep,
    isOptionalStep,
  } = useStepper()
  const [qr,setQr]=useState<string>()
  const generateQrCode=(data:string)=>{
      QRCode.toDataURL(data).then(setQr)

  }
  async function generateStudentCard() {
    
 
      const element = document.getElementById('printable-content');
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
    
      let position = 0;
    
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save('download.pdf');
      reset()
      setQr('')
     
  }
  const onSubmit = async(data:Student) => {
    const studentId=await addStudent(data)
    generateQrCode(studentId);
    nextStep()
  };

  return (
    <>
      {hasCompletedAllSteps && (
       <div className="h-[450px] flex items-center justify-center my-4 border bg-secondary  rounded-md flex-col" id='printable-content'>
        
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col items-center gap-4">
            <img src={formData.photo} width={100} height={100} alt="Student" className="rounded-full" />
            <div className="grid gap-1 text-center">
              <div className="text-xl font-semibold">{formData.name}</div>
              <div className="text-muted-foreground">{formData.year}</div>
              <div className="text-sm text-muted-foreground">Born: {format(formData.birthdate, 'MMMM d, yyyy')}</div>
              <div className="text-sm text-muted-foreground">School: {formData.school}</div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className="w-40 h-40 bg-muted rounded-md flex items-center justify-center">
            <img src={qr} className="w-24 h-24 text-muted-foreground" />
            </div>
          </div>
        </div>
        <Separator className="my-2" />
        
        <div className='w-full px-5'>
      <h3 className="text-lg font-semibold">Classes</h3>
      <div className="gap-3 mt-2 grid grid-cols-3 justify-center">
        {formData.classes.map((classItem:any, index:number) => (
          <div key={index} className="flex items-center justify-between">
            <div>
              <div className="font-medium">{classItem.subject}</div>
              <div className="text-sm text-muted-foreground">
                {classItem.name}, {classItem.time}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
       
        </div>
      )}
      <div className="w-full flex justify-end gap-2">
        {hasCompletedAllSteps ? (
                 <DialogFooter>
                     <DialogClose asChild>
          <Button size="sm"            type='button'  onClick={()=>generateStudentCard()}>
            Download
          </Button>
          
          </DialogClose>
               </DialogFooter>
        ) : (
          <>
            <Button
              disabled={isDisabledStep}
              onClick={prevStep}
              size="sm"
              variant="secondary"
              type='button'
            >
              Prev
            </Button>
            {isLastStep?(        <LoadingButton size="sm"    loading={isSubmitting}        type={'button'}   onClick={form.handleSubmit(onSubmit)}>
              Finish
            </LoadingButton>):(        <Button size="sm"            type={"button"}    onClick={nextStep}>
              {isLastStep ? "Finish" : isOptionalStep ? "Skip" : "Next"}
            </Button>)}
    
          </>
        )}
      </div>
    </>
  )
}
export default EditStudent;