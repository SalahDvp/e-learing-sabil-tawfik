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
import { useToast } from "@/components/ui/use-toast"
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
import { useData } from '@/context/admin/fetchDataContext';
import QrScanner from "qr-scanner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label";
interface FooterProps {
  formData: Student;
  form: UseFormReturn<any>; // Use the specific form type if available
  isSubmitting: boolean;
  reset: UseFormReturn<any>['reset']; // Adding reset function from useForm
}

const subjects =['Scientific Stream', 'Literature and Philosophy', 'Literature and Languages', 'Economics', 'Mathematics and Technology', 'Mathematics']
const classess = [
  "Select Option",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Geography",
  "History",
  "Philosophy",
  "Arabic",
  "French",
  "English",
  "Islamic Education",
  "Technology",
  "Computer Science",
  "Art",
  "Physical Education",
  "Economics",
  "German",
  "Spanish",
  "Law",
  "Business Studies",
  "Social Sciences",
  "Engineering",
  "Architecture",
  "Environmental Science"
];
const steps = [
  { label: "Step 1" },
  { label: "Step 2" },
  { label: "Step 3" },
  { label: "Step 4" },

] satisfies StepItem[]
const years=[
  "1AM",
  "2AM",
  "3AM",
  "4AM",
  "1AS",
  "2AS",
  "3AS"
]
const isFirestoreId = (id) => {
  // Check if id is a string and has a length of 20 characters
  if (typeof id !== 'string' || id.length !== 20) {
    return false;
  }

  // Regular expression to match Firestore-like IDs: 20 characters of a-z, A-Z, 0-9
  const firestoreIdRegex = /^[a-zA-Z0-9]{20}$/;

  // Test the id against the regular expression
  return firestoreIdRegex.test(id);
};
export default function StudentForm() {
  const camera = useRef<null | { takePhoto: () => string }>(null);
  const {setStudents,teachers,classes,students}=useData()
  const form = useForm<any>({
    // resolver: zodResolver(StudentSchema),
    defaultValues:{
      id:null,
      studentIndex: students.length + 1,
      classes:[],
      classesUIDs:[]
    }
  });

  const { reset,formState, setValue, getValues,control,watch} = form;
  const { isSubmitting } = formState;
  const { fields, append:appendClass,remove:removeClass, } = useFieldArray({
    control: form.control,
    name: "classes",

  });
  const getClassId = (subject:string, name:string,day:string,start:string,end:string)  => {
    const selectedClass = classes.find(cls => cls.subject === subject && cls.year=== watch('year') &&   cls.groups.some(group => group.stream.includes(watch('field'))) && cls.teacherName === name )
    const selectedGroup=selectedClass.groups.find( grp=> grp.day === day && grp.start === start && grp.end===end)
    console.log(end);
    
    return selectedClass ? {id:selectedClass.id,index:selectedClass.students?selectedClass.students.length+1:1,group:selectedGroup.group}: {id:"",index:0,group:""};
  };
  const handleGroupChange = (index: number, field: 'name' | 'id' | 'subject' | 'time', value: string | number) => {
    const classes = [...getValues('classes')];
    const classesUids=getValues('classesUIDs')?[...getValues('classesUIDs')]:[]
  
    if (field === 'subject') {
      const updatedClass = { id: '', name: '', subject: value, time: '' };
      classes[index] = updatedClass;
      setValue(`classes`, classes);
      console.log(value);
    } else if (field === 'name') {
      const updatedClass = { id: '', name: value, subject: classes[index].subject, time: '' };
      classes[index] = updatedClass;
      setValue(`classes`, classes);
    } else if (field === 'time') {
      const subject = classes[index].subject;
      const name = classes[index].name;
      const parsedString=JSON.parse(value)
      const [dayPart, timePart] = parsedString.split(',');
      const [start, end] = timePart.split('-');
  
      // Assuming getClassId is a synchronous function
      const selectedClassId = getClassId(subject, name, dayPart, start, end);
  
      const updatedClass = {
        ...classes[index],
        group: selectedClassId.group,
        time: value,
        start,
        end,
        day: dayPart,
        id: selectedClassId.id,
        index: selectedClassId.index,
      };
      const updatedClassUIDs = {
        ...classesUids[index],
        id:selectedClassId.id,
        group:selectedClassId.group
      };
  
      classes[index] = updatedClass;
      classesUids[index]=updatedClassUIDs
      setValue(`classes`, classes);
      setValue(`classesUIDs`, classesUids);
    } else {
      classes[index][field] = value;
      setValue(`classes.${index}`, classes[index]);
    }
  };
  const videoRef = useRef<HTMLVideoElement>(null);
  const highlightCodeOutlineRef = useRef<HTMLDivElement>(null);
  const qrScanner = useRef<QrScanner | null>(null);
  const [showingQrScanner, setShowingQrScanner] = useState(false);
  const [studentData, setStudentData] = useState<Student | null>(null);
  const [currentClass, setCurrentClass] = useState<String| any>();
  const [currentClasses, setCurrentClasses] = useState<String| any[]>();
  const audioRefSuccess = useRef(null);
  const audioRefError = useRef(null);
  const processedQrCodes = useRef(new Set<string>()); // Set to track processed QR codes
  const [openAlert,setOpenAlert]=useState(false)
  const[alertText,setAlertText]=useState('')
  const [open, setOpen] = React.useState(false)
  const handleQrScan = (result) => {
     
    if (!isFirestoreId(result.data)) {//less than 20
      setAlertText("Invalid Qr Code");
      setOpenAlert(true);
      audioRefError.current?.play();
      return;
    }
    
    const parsedData = students.find((student) =>  result.data === student.id || result.data=== student.newId);

    
    if (parsedData!=undefined) {
      setAlertText("Qr code already used");
      setOpenAlert(true);
      audioRefError.current?.play();
      return;
    }
    console.log("eqewqwe",parsedData)

    setValue("id",result.data)
    audioRefSuccess.current?.play();
    stopScanner();
  };

  const stopScanner = () => {
    qrScanner.current?.stop();
    qrScanner.current = null; // Reset the qrScanner to null
    videoRef.current!.hidden = true; // Hide the video element
    processedQrCodes.current.clear(); // Clear processed QR codes
    setShowingQrScanner(false); // Update state to hide QR scanner
    setStudentData(null); // Clear student data
    setCurrentClass(undefined)
    setCurrentClasses(undefined)


  };
  const handleButtonClick = async () => {
    videoRef.current!.hidden = false;
    qrScanner.current = new QrScanner(videoRef.current!, handleQrScan, {
      highlightScanRegion: true,
      overlay: highlightCodeOutlineRef.current!,
      maxScansPerSecond:0.5,
    });
    await qrScanner.current.start();
    setShowingQrScanner(true);
  };
  return (
    <Dialog >
      <DialogTrigger asChild>
        <Button onClick={()=>{       form.setValue('classes',[]);reset()}}>Create student</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
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
 

 <div className="bg-muted rounded-lg p-6 flex flex-col gap-4">
      <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Heads up!</AlertDialogTitle>
      <AlertDialogDescription>
 {alertText}
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
      <audio id="qr-scan-sound-success"  ref={audioRefSuccess}  src="/success.mp3" ></audio>
      <audio id="qr-scan-sound-error"  ref={audioRefError}  src="/error.mp3" ></audio>
   <div className="aspect-square bg-background rounded-md overflow-hidden relative h-[300px]">
     <video hidden={!showingQrScanner} ref={videoRef} className="absolute inset-0 w-full h-full object-cover"></video>

   </div>
   {showingQrScanner ? (
   
       <button
     onClick={stopScanner}
         className="mt-4 text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800"
       >
         Stop QR Scanner
       </button>

   ) : (
     <button
     onClick={handleButtonClick}
     type='button'
     className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
   >
     Start QR Scanner
   </button>
   )}
 </div>


) : index === 1 ? (
  <div className="grid gap-4 py-4">

    <FormField
                  
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4">
                      <FormLabel className="text-right">Name</FormLabel>
                      <FormControl><Input id="name"  className="col-span-3"  {...field}/></FormControl>

                      
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
                  
                </FormItem>
              )}
            />
 

 <FormField
  control={control}
  name="year"
  render={({ field }) => (
    <FormItem className="grid grid-cols-4 items-center gap-4">
      <FormLabel className="text-right">Year</FormLabel>
      <FormControl>
      <Select
   onValueChange={field.onChange}
   defaultValue={field.value}
              >
                                 <SelectTrigger
                              id={`year`}
                              aria-label={`Select year`}
                            >
                              <SelectValue placeholder={"select year"} />
                            </SelectTrigger>
            <SelectContent>
 
            {years.map((year) => (
                              <SelectItem key={year} value={year}   >
                                {year}
                              </SelectItem>
                            ))}
           
                          </SelectContent>
              </Select>
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>


<FormField
  control={control}
  name="field"
  render={({ field }) => (
    <FormItem className="grid grid-cols-4 items-center gap-4">
      <FormLabel className="text-right">field</FormLabel>
      <FormControl>
      <Select
   onValueChange={field.onChange}
   defaultValue={field.value}
              >
                                 <SelectTrigger
                              id={`subject`}
                              aria-label={`Select subject`}
                            >
                              <SelectValue placeholder={"select subject"} />
                            </SelectTrigger>
            <SelectContent>
 
            {subjects.map((subject) => (
                              <SelectItem key={subject} value={subject}   >
                                {subject}
                              </SelectItem>
                            ))}
           
                          </SelectContent>
              </Select>
      </FormControl>
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
                  
                </FormItem>
              )}
            />
    
  </div>

) : index === 2 ? (
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
          <TableHead>CS</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {fields.map((invoice,index) => (
          <TableRow key={invoice.id}>
                        <TableCell className="font-medium"> 
              <Select  value={invoice.subject} onValueChange={(value)=>handleGroupChange(index,'subject',value)}>
      <SelectTrigger className="">
        <SelectValue placeholder="Select a Subject" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
        <SelectLabel>Subjects</SelectLabel>
                    {classess.map(subject => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
        </SelectGroup>
      </SelectContent>
    </Select></TableCell>
            <TableCell className="font-medium"> 
              <Select  value={invoice.name} onValueChange={(value)=>handleGroupChange(index,'name',value)}>
      <SelectTrigger className="">
        <SelectValue placeholder="Select a Group" />
      </SelectTrigger>
      <SelectContent>
      {invoice.subject? ( <SelectGroup>
          <SelectLabel>Groups</SelectLabel>
          {Array.from(new Set(classes
                        .filter(cls => cls.subject === invoice.subject && cls.year=== watch('year') &&   cls.groups.some(group => group.stream.includes(watch('field'))))
                      )).map(cls => (
                        <SelectItem key={cls.teacherName} value={cls.teacherName}>
                          {cls.teacherName}
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
          {(classes.find(cls => cls.subject === invoice.subject && cls.year=== watch('year') &&   cls.groups.some(group => group.stream.includes(watch('field'))) && cls.teacherName === invoice.name ))?.groups?.map((cls,index) => (
                          <SelectItem key={index} value={JSON.stringify(`${cls.day},${cls.start}-${cls.end}`)}>
                            {cls.day},{cls.start}-{cls.end}
                          </SelectItem>
                        ))}
        </SelectGroup>):(<p className="text-sm text-muted-foreground">Select Subject and name first</p>)}
      </SelectContent>
    </Select></TableCell>
    <TableCell className="font-medium"> 
              <Select value={invoice.cs} onValueChange={(value)=>handleGroupChange(index,'cs',value)}>
      <SelectTrigger className="">
        <SelectValue placeholder="Select a cs" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
        <SelectLabel>cs</SelectLabel>
        <SelectItem  value={"true"}>
                        True
                      </SelectItem>
                      <SelectItem  value={"false"}>
                        False
                      </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select></TableCell>
    <TableCell>   
       <Button  type="button" variant="destructive" onClick={()=>removeClass(index)}>remove</Button></TableCell>

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
    currentStep
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
      form.setValue('classes',[])
      reset({  id:'0',
        studentIndex: students.length + 1,
        classes:[],
        classesUIDs:[]})

      setQr('')
     
  }
  const {setStudents,setClasses,students}=useData()
  const {toast}=useToast()
  const onSubmit = async(data:any) => {

      
    
    await addStudent({...data,studentIndex:students.length+1})
    generateQrCode(data.id);
    setStudents((prev: Student[]) => [...prev, {...data,id:data.id,student:data.name,studentIndex:prev.length+1}]);
    setClasses((prev: any[]) =>
      prev.map((cls) => {
        const matchingClass = data.classes.find((sls) => sls.id === cls.id);
        if (matchingClass) {
          return {
            ...cls,
            students: [
              ...cls.students,
              {
                id: data.id,
                name: data.name,
                index: matchingClass.index,
                year:data.year,group:cls.group
              },
            ],
          };
        }
        return cls;
      })
    );
  
    nextStep()
    toast({
      title: "Student Added!",
      description: `The student, ${data.name} added successfully`,
    });
    
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
              {/* <div className="text-sm text-muted-foreground">Born: {format(formData?.birthdate, 'MMMM d, yyyy')}</div> */}
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
            </LoadingButton>):(        <Button size="sm"   disabled={formData.id === null}        type={"button"}    onClick={nextStep}>
              {isLastStep ? "Finish" : isOptionalStep ? "Skip" : "Next"}
            </Button>)}
    
          </>
        )}
      </div>
    </>
  )
}
function QrCodeIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="5" height="5" x="3" y="3" rx="1" />
      <rect width="5" height="5" x="16" y="3" rx="1" />
      <rect width="5" height="5" x="3" y="16" rx="1" />
      <path d="M21 16h-3a2 2 0 0 0-2 2v3" />
      <path d="M21 21v.01" />
      <path d="M12 7v3a2 2 0 0 1-2 2H7" />
      <path d="M3 12h.01" />
      <path d="M12 3h.01" />
      <path d="M12 16v.01" />
      <path d="M16 12h1" />
      <path d="M21 12v.01" />
      <path d="M12 21v-1" />
    </svg>
  );
}