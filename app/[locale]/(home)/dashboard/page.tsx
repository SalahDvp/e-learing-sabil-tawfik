"use client";
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
const checkClassTime = (scanTime: Date, classes: any[]) => {
  const scanDay = scanTime.toLocaleString('en-US', { weekday: 'long' }); // Get the day of the week
  const scanHour = scanTime.getHours();
  const scanMinute = scanTime.getMinutes();

  for (const classObj of classes) {
    const [classDay, classStartTime] = classObj.time.split(' ');
    const [classStartHour, classStartMinute] = classStartTime.split(':').map(Number);

    if (scanDay.toLowerCase() === classDay.toLowerCase()) {
      const classStart = new Date(scanTime);
      classStart.setHours(classStartHour, classStartMinute, 0, 0);

      const classEnd = addMinutes(classStart, 60); // Assume classes are 1 hour long
      const startWindow = subMinutes(classStart, 30);
      const endWindow = addMinutes(classEnd, 30);

      if (isWithinInterval(scanTime, { start: startWindow, end: endWindow })) {
        return classObj;
      }
    }
  }

  return null;
};
export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const highlightCodeOutlineRef = useRef<HTMLDivElement>(null);
  const qrScanner = useRef<QrScanner | null>(null);
  const {students}=useData()
  const [showingQrScanner, setShowingQrScanner] = useState(false);
  const [studentData, setStudentData] = useState<Student | null>(null);
  const [currentClass, setCurrentClass] = useState(false);
  const audioRefSuccess = useRef(null);
  const audioRefError = useRef(null);
  const processedQrCodes = useRef(new Set<string>()); // Set to track processed QR codes
  const [openAlert,setOpenAlert]=useState(false)
  const[alertText,setAlertText]=useState('')
  const [scanTimeout, setScanTimeout] = useState(false);
  const handleQrScan = (result) => {
    setTimeout(() => {
      setScanTimeout(false);

      if (processedQrCodes.current.has(result.data)) {
        console.log("This student has already scanned their code in the past hour.");
        
        setAlertText("This student has already scanned their code in the past hour.");
        setOpenAlert(true);
  
        return;
      }
  
      processedQrCodes.current.add(result.data);
      setCurrentClass(false);
      const parsedData = students.find((student) => student.id === result.data);
  
      if (!parsedData) {
        setAlertText("Invalid QR code");
        setOpenAlert(true);
        audioRefError.current?.play();
        return;
      }
  
      setStudentData(parsedData);
      const scanTime = new Date();
      const classInfo = checkClassTime(scanTime, parsedData.classes);
  
      if (classInfo) {
        setAlertText(`Student came for class: ${classInfo.subject}`);
        setOpenAlert(true);
        audioRefSuccess.current?.play();
        setCurrentClass(true);
        // Optional: Add your attendance writing logic here if needed
      } else {
        setAlertText("No current class found for this student to attend.");
        setOpenAlert(true);
        audioRefError.current?.play();
      }
    }, 3000); // 3 seconds delay
  };
  const writeAttendance = (studentId) => {
    // Example function to write attendance to Firebase
    // Replace this with your actual Firebase request logic
    console.log(`Writing attendance for student ID: ${studentId}`);
    
  };
  const handleButtonClick = async () => {
    videoRef.current!.hidden = false;
    qrScanner.current = new QrScanner(videoRef.current!, handleQrScan, {
      highlightScanRegion: true,
      overlay: highlightCodeOutlineRef.current!,
    });
    await qrScanner.current.start();
    setShowingQrScanner(true);
  };

  const stopScanner = () => {
    qrScanner.current?.stop();
    qrScanner.current = null; // Reset the qrScanner to null
    videoRef.current!.hidden = true; // Hide the video element
    processedQrCodes.current.clear()
    setShowingQrScanner(false);
    setStudentData(null)
    setCurrentClass(false)
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
  </div>
  <Separator />
  <div className="grid gap-2">
    <span className="text-muted-foreground">Classes:</span>
    {studentData.classes.map((subject) => (
      <div key={subject.id} className="flex flex-col">
        <span className="font-semibold">{subject.subject}</span>
        <span>{subject.name}</span>
        <span>{subject.time}</span>
        {currentClass && (
          <span className="text-primary">Currently Attending</span>
        )}
      </div>
    ))}
  </div>
  {/* Reset Button */}
  <div className="mt-4 flex justify-end">
    <Button
      onClick={() => {setStudentData(null);setCurrentClass(false)}}
      variant='outline'
    >
      Reset
    </Button>
  </div>
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


