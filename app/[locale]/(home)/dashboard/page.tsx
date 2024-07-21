"use client";
import { formatDateToYYYYMMDD } from "@/lib/hooks/students";
import Image from "next/image";
import QrScanner from "qr-scanner";
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useData } from "@/context/admin/fetchDataContext";
import { Student } from "@/validators/auth";
import { parse, isWithinInterval, addMinutes, subMinutes } from 'date-fns';
import { Button } from "@/components/ui/button";
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
import { RadioGroup,RadioGroupItem } from "@/components/ui/radio-group";
import { writeAttendance } from "@/lib/hooks/students";
const checkClassTime = (scanTime: Date, student: any, groupClasses: any[]): any[] | null => {
  const scanDay = scanTime.toLocaleString('en-US', { weekday: 'long' });


  // Extract IDs from student classes into a Set
  const studentClassIds = new Set(student.classes.map(cls => cls.id));

  // Filter group classes to get only those that match the student class IDs
  const relevantGroupClasses = groupClasses.filter(groupClass =>
    studentClassIds.has(groupClass.id)
  );
  // Array to store matching class objects with group class information
  const matchingClassesWithGroup: any[] = [];

  // Loop through each relevant group class
  for (const groupClass of relevantGroupClasses) {
    for (const groupElement of groupClass.groups) {
      const groupDay = groupElement.day;
      const groupStartTime = groupElement.start;
      const groupEndTime = groupElement.end;
      const [groupStartHour, groupStartMinute] = groupStartTime.split(':').map(Number);
      const [groupEndHour, groupEndMinute] = groupEndTime.split(':').map(Number);

      if (scanDay.toLowerCase() === groupDay.toLowerCase()) {
        const groupStart = new Date(scanTime);
        groupStart.setHours(groupStartHour, groupStartMinute, 0, 0);

        const groupEnd = new Date(scanTime);
        groupEnd.setHours(groupEndHour, groupEndMinute, 0, 0);

        const startWindow = subMinutes(groupStart, 30);
        const endWindow = addMinutes(groupEnd, 30);

        if (isWithinInterval(scanTime, { start: startWindow, end: endWindow })) {
          // Find matching student classes for this group
          const matchingClasses = student.classes.find(cls => cls.id === groupClass.id);

          if (matchingClasses) {
            matchingClassesWithGroup.push({...groupElement,subject:matchingClasses.subject,id:matchingClasses.id,studentIndex:matchingClasses.index,studentGroup:matchingClasses.group,name:groupClass.teacherName
            });
          }
        }
      }
    }
  }

  // Return array of matching classes with group information if any are found
  if (matchingClassesWithGroup.length > 0) {
    return matchingClassesWithGroup;
  } else {
    return null;
  }
};
export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const highlightCodeOutlineRef = useRef<HTMLDivElement>(null);
  const qrScanner = useRef<QrScanner | null>(null);
  const {students,classes,setClasses}=useData()
  const [showingQrScanner, setShowingQrScanner] = useState(false);
  const [studentData, setStudentData] = useState<Student | null>(null);
  const [currentClass, setCurrentClass] = useState<String| any>();
  const [currentClasses, setCurrentClasses] = useState<String| any[]>();
  const audioRefSuccess = useRef(null);
  const audioRefError = useRef(null);
  const processedQrCodes = useRef(new Set<string>()); // Set to track processed QR codes
  const [openAlert,setOpenAlert]=useState(false)
  const[alertText,setAlertText]=useState('')
  console.log(currentClass);
  
  const handleQrScan = (result) => {
    if (processedQrCodes.current.has(result.data)) {
      console.log("This student has already scanned their code in the past hour.");
      
      setAlertText("This student has already scanned their code in the past hour.");
      setOpenAlert(true);

      return;
    }

    processedQrCodes.current.add(result.data);

    const parsedData = students.find((student) => student.id === result.data);

    if (!parsedData) {
      setAlertText("Invalid QR code");
      setOpenAlert(true);
      audioRefError.current?.play();
      return;
    }

    setStudentData(parsedData);
    const scanTime = new Date();
    const classInfo =checkClassTime(scanTime,parsedData,classes);
    
    if (classInfo) {
      audioRefSuccess.current?.play();
    
      setCurrentClasses(classInfo)
      
    } else {
      setAlertText("No current class found for this student to attend.");
      setOpenAlert(true);
      audioRefError.current?.play();
    }
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

  const onConfirm =async() => {
 await writeAttendance(currentClass)
 const formattedDate = formatDateToYYYYMMDD(new Date()); // Format the date

 setClasses(prevClasses => {
   // Find the index of the class to update
   const classIndex = prevClasses.findIndex(cls => cls.id === currentClass.id);

   // If class is found, update its attendanceList
   if (classIndex !== -1) {
     // Create a copy of the previous classes
     const updatedClasses = [...prevClasses];
     const classToUpdate = updatedClasses[classIndex];

     // Ensure attendanceList for the date exists
     const attendanceList = classToUpdate.attendanceList || {};
     const dateAttendance = attendanceList[formattedDate] || { attendanceList: [] };

     // Update the attendanceList for the specific date
     dateAttendance.attendanceList = [
       ...dateAttendance.attendanceList,
       {
         index: currentClass.studentIndex,
         group: currentClass.studentGroup,
         name: currentClass.name,
         status: 'present'
       }
     ];

     // Update the class with the new attendance list
     updatedClasses[classIndex] = {
       ...classToUpdate,
       attendanceList: {
         ...attendanceList,
         [formattedDate]: dateAttendance
       }
     };

     return updatedClasses;
   }
   
   return prevClasses; // Return unchanged state if class not found
 });
 audioRefSuccess.current?.play();
    
 setCurrentClass(undefined)
 setCurrentClasses(undefined)
 setStudentData(null)

    
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
    <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto p-4 md:p-8">
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">QR Code Scanner</h1>
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
      <div className="bg-muted rounded-lg p-6 flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <QrCodeIcon className="w-8 h-8 text-primary" />
          <h2 className="text-xl font-semibold">Scan a QR Code</h2>
        </div>
        <p className="text-muted-foreground">
          Point your camera at a QR code to view the associated details.
        </p>
        <div className="aspect-square bg-background rounded-md overflow-hidden relative">
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
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Start QR Scanner
        </button>
        )}
      </div>
    </div>
{studentData ? ( <div className="bg-muted rounded-lg p-6 flex flex-col gap-4">
  <div className="flex items-center gap-4">
    <Avatar className="w-24 h-24 border">
      <AvatarImage src={studentData.photo || "/placeholder-user.jpg"} />
      <AvatarFallback>{studentData.name.charAt(0)}</AvatarFallback>
    </Avatar>
    <div>
      <h2 className="text-xl font-semibold">{studentData.name}</h2>
      <p className="text-muted-foreground">{studentData.field}</p>
    </div>
  </div>
  <Separator />
  <div className="grid gap-2">
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">Phone:</span>
      <a href={`tel:${studentData.phoneNumber}`} className="text-primary">
        {studentData.phoneNumber}
      </a>
    </div>
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">Birthdate:</span>
      <span>{new Date(studentData.birthdate).toLocaleDateString()}</span>
    </div>
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">Birthplace:</span>
      <span>{studentData.birthplace}</span>
    </div>
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">School:</span>
      <span>{studentData.school}</span>
    </div>
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">Year:</span>
      <span>{studentData.year}</span>
    </div>
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">CS:</span>
      <span>{studentData.year}</span>
    </div>
  </div>
  <Separator />
  <div className="grid gap-2">
    <span className="text-muted-foreground">Classes:</span>
    {studentData.classes.map((subject) => (
      <div key={subject.id} className="flex flex-col">
        <span className="font-semibold">{subject.subject}</span>
        <span>prof:{subject.name}</span>
        <span>time:{subject.time}</span>
        <span>CS:{subject.cs}</span>
      </div>
    ))}
  </div>
  <Separator />
  {Array.isArray(currentClasses) && currentClasses.length > 0 && (
  <RadioGroup defaultValue="card" className="grid grid-cols-3 gap-4">
    {currentClasses.map((classObj,index) => (
      <div key={index}>
        <RadioGroupItem value={classObj.id} onClick={()=>setCurrentClass(classObj)
        } id={classObj.id} className="peer sr-only" />
        <Label
          htmlFor={classObj.id}
          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
        >
          <span className="font-semibold">{classObj.subject}</span>
          <span>{classObj.name}</span>
          <span>{classObj.day},{classObj.start}-{classObj.end}</span>
        </Label>
      </div>
    ))}
  </RadioGroup>
)}
{currentClass &&(  <div className="mt-4 flex justify-end">
    <Button
      onClick={() => {setStudentData(null);setCurrentClass(undefined);setCurrentClasses(undefined)}}
      variant='outline'
    >
      Reset
    </Button>
    <Button
      onClick={() => onConfirm()}
      variant='default'
    >
      Confirm
    </Button>
  </div>)}
</div>) :(<div className="bg-muted rounded-lg p-6 flex flex-col gap-4">
                <div className="flex items-center gap-4">
          <Avatar className="w-12 h-12 border">
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div>
                    <h2 className="text-xl font-semibold"></h2>
                    <p className="text-muted-foreground"></p>
                  </div>
                </div>
                <Separator />
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Phone:</span>
                    <a  className="text-primary">
             
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Birthdate:</span>
                    <span></span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Birthplace:</span>
                    <span></span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">School:</span>
                    <span></span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Year:</span>
                    <span></span>
                  </div>
                </div>
                <Separator />
                <div className="grid gap-2">
                  <span className="text-muted-foreground">Classes:</span>
             
                </div>
              </div> ) }
  </div>
  );
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

function XIcon(props) {
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
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}


