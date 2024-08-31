"use client";
import { markAttendance } from "@/lib/hooks/students";
import Image from "next/image";
import StudentPayment from './components/transaction'
import QrScanner from "qr-scanner";
import {  useRef, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useData } from "@/context/admin/fetchDataContext";
import { Student } from "@/validators/auth";
import { addDays, addMinutes, format, isAfter, isBefore, setHours, setMinutes } from 'date-fns';
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
import { useTranslations } from 'next-intl';
import * as React from "react"
import { Check, ChevronsUpDown, ScanIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { pdf } from "@react-pdf/renderer";
import StudentInvoice from'../students/components/studentInvoice'
import { doc, getDoc, setDoc, updateDoc, arrayUnion, increment } from "firebase/firestore";
import { db } from "@/firebase/firebase-config";
import { AutoComplete } from "@/components/ui/autocomplete";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PDFDownloadLink, PDFViewer, Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer'
import ReactToPrint from 'react-to-print';
import { differenceInCalendarDays } from 'date-fns';
import { PrinterIcon } from "lucide-react"
import { Table, TableBody, TableCell, TableRow,TableHeader,TableHead } from "@/components/ui/table";
function parseDateTimeRange(dateTimeRange) {
    // Split the string into components
    const parts = dateTimeRange.split('-');
  
    // Ensure we have the correct number of parts

    
    const [year, month, day, startTime, endTime] = parts;
    
    // Create a date string in the format YYYY-MM-DD
    const date = `${year}-${month}-${day}`;
    
    // Create Date objects for the start and end times
    const startDateTime = new Date(`${date}T${startTime}:00`);
    const endDateTime = new Date(`${date}T${endTime}:00`);
  return {
    startDateTime,
    endDateTime
  };
}
const checkClassTime = (scanTime: Date, student: any, groupClasses: any[]): any[] | null => {
  // Get the day of the week for the scan time
  const scanDay = format(scanTime, 'EEEE');

  // Extract IDs from student classes into a Set
  const studentClassIds = new Set(student.classesUIDs.map((cls: any) => cls.id));

  // Filter group classes to get only those that match the student class IDs
  const relevantGroupClasses = groupClasses.filter((groupClass: any) =>
    studentClassIds.has(groupClass.id)
  );

  // Array to store matching class objects with group class information
  const matchingClassesWithGroup: any[] = [];

  // Helper function to get the date of the current week for a given weekday
  const getDateForCurrentWeek = (targetDay: string): Date => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const targetIndex = daysOfWeek.indexOf(targetDay);

    const currentDayIndex = scanTime.getDay();
    const diff = targetIndex - currentDayIndex;

    return addMinutes(scanTime, diff * 1440); // Multiplying by 1440 converts days to minutes
  };

  // Loop through each relevant group class
  for (const groupClass of relevantGroupClasses) {
    for (const groupElement of groupClass.groups) {
      const groupDay = groupElement.day;

      if (scanDay.toLowerCase() === groupDay.toLowerCase()) {
        const matchingClasses = student.classes.find((cls: any) => cls.id === groupClass.id);

        if (matchingClasses) {
          // Calculate the real date for the groupDay in the current week
          const classStartTime = getDateForCurrentWeek(groupDay);

          // Parse the class start time and set it to the classStartTime date
          const [hours, minutes] = groupElement.start.split(':');
          const classStartDateTime = setMinutes(setHours(classStartTime, parseInt(hours, 10)), parseInt(minutes, 10));

          // Calculate the time range (30 min before and after the class start time)
          const startTimeRange = addMinutes(classStartDateTime, -30); // 30 minutes before
          const endTimeRange = addMinutes(classStartDateTime, 60); // 30 minutes after

          // Check if scanTime falls within the 30 min before or after the class start time
          if (isAfter(scanTime, startTimeRange) && isBefore(scanTime, endTimeRange)) {
            // Add matching class with group information to the result array
            matchingClassesWithGroup.push({
              ...groupElement,
              subject: matchingClasses.subject,
              id: matchingClasses.id,
              studentIndex: matchingClasses.index,
              studentGroup: matchingClasses.group,
              name: groupClass.teacherName,
              sessionsLeft:matchingClasses.sessionsLeft
            });
          }
        }
      }
    }
  }

  return matchingClassesWithGroup.length > 0 ? matchingClassesWithGroup : null;
};

export default function Home() {
  const t=useTranslations()
  const videoRef = useRef<HTMLVideoElement>(null);
  const highlightCodeOutlineRef = useRef<HTMLDivElement>(null);
  const qrScanner = useRef<QrScanner | null>(null);
  const {students,classes,setClasses,setStudents,invoices}=useData()
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
  function generateBillIfNeeded(data: any) {
   
      const initialData = {
        name: data.name,
        subject: data.subject,
        year: data.year,
        date: format(new Date(), 'yyyy-MM-dd'),
      };

      const link = document.createElement('a');
      document.body.appendChild(link);

      pdf(<StudentInvoice data={initialData} />).toBlob().then(blob => {
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.download = 'invoice.pdf';
        link.click();
        URL.revokeObjectURL(url);
        link.parentNode.removeChild(link);
      });
    
  }
  const onpressed=(id)=>{
    const parsedData = students.find((student) => student.value === id || student.newId===id);

    
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
      const classInfoObject = classInfo.reduce((acc: any, classObj: any) => {
        acc[classObj.id] = { ...classObj, group: classObj.studentGroup };
        return acc;
      }, {});
      console.log(classInfoObject);
      
      onConfirm(classInfoObject,parsedData)
      setCurrentClasses(classInfo)
      

      
      
    } else {
      setAlertText("No current class found for this student to attend.");
      setOpenAlert(true);

    }
    
  }
  const handleQrScan = (result) => {
    if (processedQrCodes.current.has(result.data)) {

      
      setAlertText("This student has already scanned their code in the past hour.");
      setOpenAlert(true);

      return;
    }

    processedQrCodes.current.add(result.data);

    const parsedData = students.find((student) => student.id === result.data || student.newId===result.data);

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
      const classInfoObject = classInfo.reduce((acc: any, classObj: any) => {
        acc[classObj.id] = { ...classObj, group: classObj.group };
        return acc;
      }, {});
      onConfirm(classInfoObject)
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
  const onConfirm = async (selectedClasses:any,studentData:any) => {
    try {
      const updatedClasses = [...classes];
      const updatedStudents = [...students];
  
      const processAttendance = async (selectedClass: any, classIndex: number) => {
        const clsid = updatedClasses[classIndex].id;
  
        // Get the current date for UID
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const dateTimeUID = `${year}-${month}-${day}`; // Use the selected class group
  
  
        const currentAttendanceList = updatedClasses[classIndex]?.Attendance?.[dateTimeUID] || {
          start: '',
          end: '',
          attendanceList: [],
          group: selectedClass.group,
          id: dateTimeUID
        };
  
        // Check if student already exists
        const studentExists = currentAttendanceList.attendanceList.some(
          attendance => attendance.index === selectedClass.studentIndex
        );
        if (studentExists) {
          setAlertText("This student has already scanned their code.");
          setOpenAlert(true);
          return;
        }
 
  
        // Update attendance list
        currentAttendanceList.attendanceList.push({
          index: selectedClass.studentIndex,
          group: selectedClass.studentGroup,
          name: studentData?.name,
          status: 'present',
          id: studentData?.id
        });
  
        updatedClasses[classIndex] = {
          ...updatedClasses[classIndex],
          students: updatedClasses[classIndex].students.map(std => std.id === studentData?.id
            ? { ...std, sessionsLeft: std.sessionsLeft>0 ? std.sessionsLeft - 1:std.sessionsLeft }
            : std
          ),
          Attendance: {
            ...updatedClasses[classIndex].Attendance,
            [dateTimeUID]: currentAttendanceList
          }
        };
  
        updatedStudents.forEach(std => {
          if (std.id === studentData?.id) {
            std.classes = std.classes.map(cls => cls.id === clsid
              ? { ...cls, sessionsLeft: cls.sessionsLeft>0 ? cls.sessionsLeft - 1:cls.sessionsLeft}
              : cls
            );
          }
        });
  
        const attendanceDocRef = doc(db, 'Groups', clsid, 'Attendance', dateTimeUID);
        const docSnapshot = await getDoc(attendanceDocRef);
  
        if (selectedClass.sessionsLeft <= 0) {
          const debtToRemove = updatedClasses[classIndex].amount / updatedClasses[classIndex].numberOfSessions;
          await updateDoc(doc(db, 'Students', studentData.id), {
            debt: increment(debtToRemove)
          });
        }
  
        if (docSnapshot.exists()) {
          await updateDoc(attendanceDocRef, {
            attendanceList: arrayUnion({
              name: studentData?.name,
              group: selectedClass.studentGroup,
              index: selectedClass.studentIndex,
              status: 'present',
              id: studentData?.id
            })
          });
        } else {
          const date = parseDateTimeRange(`${year}-${month}-${day}-${selectedClass.start}-${selectedClass.end}`);
          const jj={  group: selectedClass.studentGroup,
            end: date.endDateTime,
            id: dateTimeUID,
            start: date.startDateTime,
            attendanceList: [{
              name: studentData?.name,
              group: selectedClass.studentGroup,
              index: selectedClass.studentIndex,
              status: 'present',
              id: studentData?.id
            }]}
          console.log("date",jj);
          
          await setDoc(attendanceDocRef, {
            group: selectedClass.studentGroup,
            end: date.endDateTime,
            id: dateTimeUID,
            start: date.startDateTime,
            attendanceList: [{
              name: studentData?.name,
              group: selectedClass.studentGroup,
              index: selectedClass.studentIndex,
              status: 'present',
              id: studentData?.id
            }]
          });
        }
  
        await updateDoc(doc(db, 'Groups', clsid), { students: updatedClasses[classIndex].students });
  
        generateBillIfNeeded({
          name: studentData?.name,
          subject: selectedClass.subject,
          year: selectedClass.year
        });
      };
  
      // Process each selected class
      await Promise.all(Object.entries(selectedClasses).map(([subject, selectedClass]) => {
        const classIndex = updatedClasses.findIndex(cls => cls.id === selectedClass.id);
        if (classIndex === -1) {
          console.error(`Class not found for subject: ${subject}`);
          return Promise.resolve(); // Skip this entry
        }
        return processAttendance(selectedClass, classIndex);
      }));
  
      // Update state
      setClasses(updatedClasses);
      setStudents(updatedStudents);
  
      // Play success audio
      audioRefSuccess.current?.play();
  
      // // Clear state
      // setCurrentClass(undefined);
      // setCurrentClasses(undefined);
      // setStudentData(null);
      // setSelectedClasses({});
    } catch (error) {
      console.error('Error updating attendance:', error.message);
      alert('An error occurred while updating attendance. Please try again.');
    }
  };


  const handleButtonClick = async () => {
    videoRef.current!.hidden = false;
    qrScanner.current = new QrScanner(videoRef.current!, handleQrScan, {
      highlightScanRegion: true,
      overlay: highlightCodeOutlineRef.current!,
      maxScansPerSecond:10,
      calculateScanRegion(video) {
          return{
            x:0,
            y:0,
            height:video.height,
            width:video.width
          }
      },
    });
    await qrScanner.current.start();
    setShowingQrScanner(true);
  };

  const [selectedClasses, setSelectedClasses] = useState({});

  const handleSelection = (classObj, group) => {
    setSelectedClasses((prev) => {
      // Check if the classObj already exists in the current state
      if (prev[classObj.id]) {
        // If it exists, remove it from the selected classes
        const { [classObj.id]: _, ...rest } = prev;
        return rest;
      } else {
        // If it doesn't exist, add it to the selected classes
        return {
          ...prev,
          [classObj.id]: { ...classObj, group }, //store the selected class and group by ID
        };
      }
    });
  };
  const [scannedCode, setScannedCode] = useState<string>('');



  React.useEffect(() => {
    if (scannedCode) {
      console.log("qr scanned",scannedCode);
      
      onQrScannedInput(scannedCode);
    
    }
  }, [scannedCode]);
  const onQrScannedInput=(id)=>{
    const parsedData = students.find((student) => student.id === id || student.newId===id);


    
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

    
      setCurrentClasses(classInfo)

    } else {
      setAlertText("No current class found for this student to attend.");
      setOpenAlert(true);

    }
    
  }
  const transactionsData = React.useMemo(() => {
    if (!Array.isArray(invoices)) {
      return []; // Return an empty array if invoices is not an array or is undefined
    }

    return invoices.flatMap((invoice) =>
      (Array.isArray(invoice.transaction) ? invoice.transaction : []).map((trans) => ({
        ...invoice.student, // Include other invoice details
        ...trans, // Include transaction details as separate fields
      }))
    ).sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime()); // Sort by latest paymentDate
  }, [invoices]);
  

  const calculateDaysUntilNextPayment = (nextPaymentDate: Date): number => {
    const today = new Date();
    return differenceInCalendarDays(nextPaymentDate, today);
  };
  return (
    <div className="grid md:grid-cols-3 gap-8 max-w-8xl mx-auto p-4 md:p-8">
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">{t('qr-code-scanner')}</h1>
      <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>{t('heads-up')}</AlertDialogTitle>
      <AlertDialogDescription>
 {alertText}
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
      <AlertDialogAction>{t('Continue')}</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
      <audio id="qr-scan-sound-success"  ref={audioRefSuccess}  src="/success.mp3" ></audio>
      <audio id="qr-scan-sound-error"  ref={audioRefError}  src="/error.mp3" ></audio>
      <div className="bg-muted rounded-lg p-6 flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <QrCodeIcon className="w-8 h-8 text-primary" />
          <h2 className="text-xl font-semibold">{t('scan-a-qr-code')}</h2>
        </div>
        <p className="text-muted-foreground">
          {t('point-your-camera-at-qr-code')}
        </p>
        

<div className="bg-muted rounded-lg p-6 flex flex-col items-center justify-center gap-4">
      <Card className="w-full max-w-md mx-auto">
 <CardHeader>
   <CardTitle className="text-2xl font-bold text-center">QR Code Scanner</CardTitle>
 </CardHeader>
 <CardContent className="space-y-4">
   <div className="relative">
   <Input
     type="text"
     value={scannedCode}
     onChange={(e) => {setScannedCode(e.target.value)}}
     placeholder="Scan QR code here"
     autoFocus
   />
     <ScanIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
   </div>

   <div className="flex justify-center">
     
   </div>
   
 </CardContent>
</Card>
  
 </div>
 
    </div>
    </div>
    {studentData ? (
            <div className="bg-muted rounded-lg p-6 flex flex-col gap-6">

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
                <span className="text-muted-foreground">{t('phone')}:</span>
                <a href={`tel:${studentData.phoneNumber}`} className="text-primary">
                  {studentData.phoneNumber}
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t('birth-date')}:</span>
                <span>{new Date(studentData.birthdate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t('birth-place')}:</span>
                <span>{studentData.birthplace}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t('school')}:</span>
                <span>{studentData.school}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t('year')}:</span>
                <span>{studentData.year}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t('next-payment-day')}:</span>
                <span>{new Date(studentData.nextPaymentDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between">
            <span className="text-muted-foreground">{t('days-left-to-pay')}:</span>
            <span
            className={`flex items-center p-2 rounded-lg shadow-md transition-colors duration-300 ${
              calculateDaysUntilNextPayment(studentData.nextPaymentDate) < 0 
                ? "text-red-600 dark:text-red-300" 
                : "text-green-600 dark:text-green-300"
            }`}
          >
            {calculateDaysUntilNextPayment(studentData.nextPaymentDate) < 0 
              ? `${Math.abs(calculateDaysUntilNextPayment(studentData.nextPaymentDate))} Days Overdue`
              : `${calculateDaysUntilNextPayment(studentData.nextPaymentDate)} Days Remaining`}
          </span>
          </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t('debt')}:</span>
                <span>{studentData.debt}</span>
              </div>
              {/*<div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t('cs')}:</span>
                <span>{studentData.cs}</span>
                  </div>*/}
            </div>
            <Separator />
            {/*<div className="grid gap-2">
              <span className="text-muted-foreground">Classes:</span>
              {studentData.classes.map((subject) => (
                <div key={subject.id} className="flex flex-col">
                  <span className="font-semibold">{subject.subject}</span>
                  <span>prof:{subject.name}</span>
                  <span>time:{subject.time}</span>
                  <span>CS:{subject.cs}</span>
                </div>
              ))}
              </div> */}
            <Separator />
            <div className="grid gap-2">
            <span className="text-muted-foreground">{t('avaliable-classes')}:</span>
            {Array.isArray(currentClasses) && currentClasses.length > 0 && (
            <RadioGroup className="grid grid-cols-2 gap-4">
              {currentClasses.map((classObj, index) => (
                <div key={index}>
                  {classObj.studentGroup.split(',').map((group) => (
                    <div key={`${classObj.id}-${group}`}>
                      <RadioGroupItem
                        value={`${classObj.id}-${group}`}
                        onClick={() =>{ if (classObj.sessionsLeft <= 0) {
                          setAlertText("L’étudiant a terminé toutes ses séances. En confirmant, cela sera ajouté à sa dette.");
                          setOpenAlert(true);
                          audioRefError.current?.play();
                        };
                        handleSelection(classObj, group)}}
                        id={`${classObj.id}-${group}`}
                        className="peer sr-only"
                        checked={
                          selectedClasses[classObj.id]?.id === classObj.id &&
                          selectedClasses[classObj.id]?.group === group
                        } // check if the current group is selected for this class
                      />
                      <Label
                        htmlFor={`${classObj.id}-${group}`}
              
                        className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary
                        ${classObj.sessionsLeft <= 0? 'bg-red-500 text-white' : ''}
                        ${
                          selectedClasses[classObj.id]?.id === classObj.id &&
                          selectedClasses[classObj.id]?.group === group
                            ? 'border-primary'
                            : ''
                        }`}
                      >
                        <span className="font-semibold">{classObj.subject}</span>
                        <span>{classObj.name}</span>
                        <span>{`Group: ${group}`}</span>
                        <span>{`Séances restantes: ${classObj.sessionsLeft}`}</span>
                        <span>{`${classObj.day}, ${classObj.start} - ${classObj.end}`}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              ))}
            </RadioGroup>
          )}
          </div>

          {Object.keys(selectedClasses).length > 0 ? (
            <div className="mt-4 flex justify-end">
              <Button
                onClick={() => { setStudentData(null); setCurrentClass(undefined); setCurrentClasses(undefined); setSelectedClasses({})}}
                variant='outline'
              >
                {t('reset')}
              </Button>
              <Button
                onClick={() => onConfirm()}
                variant='default'
              >
                {t('confirm')}
              </Button>
            </div>
          ) : (
            <div className="mt-4 flex justify-end">
              <Button
                onClick={() => { setStudentData(null); setCurrentClass(undefined); setCurrentClasses(undefined);setSelectedClasses({}) }}
                variant='outline'
              >
                {t('reset')}
              </Button>
            </div>
          )}

        </div> 
        ) :(<div className="bg-muted rounded-lg p-6 flex flex-col gap-4">
          <AutoComplete
        options={students}
        emptyMessage="No resulsts."
        placeholder="Find something"

        onpressed={onpressed}
        value={studentData?.name}

      />

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
                    <span className="text-muted-foreground">{t('phone')}:</span>
                    <a  className="text-primary">
             
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{t('birth-date')}:</span>
                    <span></span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{t('birth-place')}:</span>
                    <span></span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{t('school')}:</span>
                    <span></span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{t('year')}:</span>
                    <span></span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{t('next-payment-day')}:</span>
                    <span></span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{t('days-left-to-pay')}:</span>
                    <span></span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{t('debt')}:</span>
                    <span></span>
                  </div>
                </div>
                <Separator />
                <div className="grid gap-2">
                  <span className="text-muted-foreground">{t('classes')}:</span>

                </div>
                <div className="mt-4 flex justify-end">
    <Button
      onClick={() => {setStudentData(null);setCurrentClass(undefined);setCurrentClasses(undefined)}}
      variant='outline'
    >
      {t('reset')}
    </Button>

    </div>



               </div> )
                }
      
      {studentData ? (<div className="bg-muted rounded-lg p-6 flex flex-col gap-6 "> 

    {transactionsData.length > 0 ? (
      transactionsData.map((transaction) => (
        <StudentPayment
          key={transaction.id} // Add a key for each mapped element
          transaction={transaction} // Pass transaction data as a prop
          studentid={studentData?.id}
        />
      ))
    ) : (
      null
    )}

</div>  ) :  null}


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

export function ComboboxDemo({open,setOpen,array,onpressed,value}) {

 
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? array.find((framework) => framework.value === value)?.label
            : "Select Student..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search student..." />
          <CommandEmpty>No student found.</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {array.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue) => {
                    onpressed(currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === framework.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {framework.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
         </Command>
      </PopoverContent>
    </Popover>
)}