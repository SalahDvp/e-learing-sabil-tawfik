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
import { Button } from "@/components/ui/button"
import { CircleAlertIcon, CircleCheckIcon, PlusCircle } from 'lucide-react';
import QrScanner from "qr-scanner";

import { useTranslations } from 'next-intl';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/firebase/firebase-config';


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
const VerifyStudent= () => {
const t=useTranslations()
  const videoRef = useRef<HTMLVideoElement>(null);
  const highlightCodeOutlineRef = useRef<HTMLDivElement>(null);
  const qrScanner = useRef<QrScanner | null>(null);
  const [showingQrScanner, setShowingQrScanner] = useState(false);
  const[student,setStudent]=useState(undefined)
  const audioRefSuccess = useRef(null);
  const audioRefError = useRef(null);
  const processedQrCodes = useRef(new Set<string>()); // Set to track processed QR codes
  const handleQrScan = async (result) => {
    try {
      if (!isFirestoreId(result.data)) {
        // If the result.data is not a valid Firestore ID
        setStudent(null);
        audioRefError.current?.play();
        return;
      }
  
      const studentsRef = collection(db, 'Students');
  
      // Queries to find documents where `id` or `newid` matches `result.data`
      const queryById = query(studentsRef, where('id', '==', result.data));
      const queryByNewId = query(studentsRef, where('newId', '==', result.data));
  
      // Perform the queries
      const [idSnapshot, newidSnapshot] = await Promise.all([
        getDocs(queryById),
        getDocs(queryByNewId),
      ]);
  
      // Determine which query has results and get the student data
      let studentData = null;
  
      if (!idSnapshot.empty) {
        // If there are results in the id query
        studentData = idSnapshot.docs[0].data();
      } else if (!newidSnapshot.empty) {
        // If there are results in the newid query
        studentData = newidSnapshot.docs[0].data();
      }
  
      if (studentData) {
        // Set student data and play success audio
        setStudent(studentData);
        audioRefSuccess.current?.play();
      } else {
        // If no student data found, set student to null and play error audio
        setStudent(null);
        audioRefError.current?.play();
      }
    } catch (error) {
      console.error('Error handling QR scan:', error);
      setStudent(null);
      audioRefError.current?.play();
    } finally {
      stopScanner();
    }
  };

  const stopScanner = () => {
    qrScanner.current?.stop();
    qrScanner.current = null; // Reset the qrScanner to null
    videoRef.current!.hidden = true; // Hide the video element
    processedQrCodes.current.clear(); // Clear processed QR codes
    setShowingQrScanner(false); // Update state to hide QR scanner

  };
  const handleButtonClick = async () => {
    videoRef.current!.hidden = false;
    qrScanner.current = new QrScanner(videoRef.current!, handleQrScan, {
      highlightScanRegion: true,
      overlay: highlightCodeOutlineRef.current!,
      maxScansPerSecond:1,
      preferredCamera:'user',
    });
    await qrScanner.current.start();
    setShowingQrScanner(true);
  };

  return (
    <Dialog >
      <DialogTrigger asChild className='mr-3'>
        <Button variant="outline">Verify Student</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">

        <DialogHeader>
          <DialogTitle>Scan Student QR Code</DialogTitle>

        </DialogHeader>
        <audio id="qr-scan-sound-success"  ref={audioRefSuccess}  src="/success.mp3" ></audio>
        <audio id="qr-scan-sound-error"  ref={audioRefError}  src="/error.mp3" ></audio>
        <div className="grid gap-6 py-6">
        <div className="aspect-square bg-background rounded-md overflow-hidden relative h-[300px] w-full flex items-center justify-center">
          <video hidden={!showingQrScanner} ref={videoRef} className="absolute inset-0 w-full h-full object-cover"></video>
          </div>
          {showingQrScanner ? (
   
   <button
 onClick={stopScanner}
     className="mt-4 text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800"
   >
     {t('Stop QR Scanner')}
   </button>

) : (
 <button
 onClick={handleButtonClick}
 type='button'
 className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
>
 {t('Start QR Scanner')}
</button>
)}
         {student &&(
               <div className="flex items-center justify-center">
               <div className="rounded-md bg-green-50 p-6 w-full max-w-md">
                 <div className="flex items-center">
                   <div className="flex-shrink-0">
                     <CircleCheckIcon className="h-7 w-7 text-green-400" />
                   </div>
                   <div className="ml-4">
                     <h3 className="text-lg font-medium text-green-800">{`Student Found: ${student.name}`}</h3>
                   
                   </div>
                 </div>
               </div>
             </div>)}
            {student===undefined &&( <div className="grid gap-4">
            
            </div>)}
            {student===null &&(
                   <div className="flex items-center justify-center">
                   <div className="rounded-md bg-red-50 p-6 w-full max-w-md">
                     <div className="flex items-center">
                       <div className="flex-shrink-0">
                         <CircleAlertIcon className="h-7 w-7 text-red-400" />
                       </div>
                       <div className="ml-4">
                         <h3 className="text-lg font-medium text-red-800">{`Student Not Found`}</h3>
                       
                       </div>
                     </div>
                   </div>
                 </div>)}
     </div>
     <DialogFooter className="">
          <DialogClose asChild>
            <Button type="button" onClick={()=>{stopScanner();setStudent(undefined)}}>
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default VerifyStudent;
