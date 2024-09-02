import { db } from "@/firebase/firebase-config";
import { addDoc, collection, updateDoc, doc, deleteDoc, arrayUnion, arrayRemove,setDoc, writeBatch, getDoc } from "firebase/firestore";
import { Teacher, TeacherSchema } from '@/validators/teacher';

import { format, startOfWeek, addWeeks, eachDayOfInterval, endOfWeek, getDay, setHours, setMinutes, addHours } from 'date-fns';
interface Time {
    day: string;
    start: string;
    end: string;
  }
interface Class {
    year: string;
    subject: string;
    day: string;
    start: string;
    end: string;
    stream: string[];
    quota: number;
    room:string;
  }
  function getDatesForWeek(startDate: Date): Date[] {
    const start = startOfWeek(startDate, { weekStartsOn: 0 }); // Adjust if week starts on a different day
    const end = endOfWeek(start);
    return eachDayOfInterval({ start, end });
}

// Function to get the next occurrence of a specific day of the week
function getNextDayOfWeek(dayOfWeek: string, startDate: Date): Date {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const targetDay = daysOfWeek.indexOf(dayOfWeek);

    if (targetDay === -1) {
        throw new Error(`Invalid day of the week: ${dayOfWeek}`);
    }

    const weekDates = getDatesForWeek(startDate);
    const nextDayDate = weekDates.find(date => date.getDay() === targetDay);

    if (!nextDayDate) {
        throw new Error(`No date found for day of the week: ${dayOfWeek}`);
    }

    return nextDayDate;
}
  export const groupClassesByYear = (classes: Class[]) => {
    return classes.reduce((acc, curr) => {
      (acc[curr.year] = acc[curr.year] || []).push(curr);
      return acc;
    }, {} as Record<string, Class[]>);
  };
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  function getNextPaymentDate(sessions: Session[], classStartDate: Date): Date {
    // Step 1: Find the last session of the week
    const lastSession = sessions.reduce((last, current) => {
      return daysOfWeek.indexOf(current.day) > daysOfWeek.indexOf(last.day) ? current : last;
    });
  
    // Step 2: Calculate the date of the last session in the first week
    const classStartWeekStart = startOfWeek(classStartDate);
    const classStartWeekEnd = endOfWeek(classStartDate);
  
    // Find the date for the last session in the first week
    let lastSessionDate = new Date(classStartWeekStart);
    while (getDay(lastSessionDate) !== daysOfWeek.indexOf(lastSession.day)) {
      lastSessionDate.setDate(lastSessionDate.getDate() + 1);
    }
  
    // Set the start time for the session
    const [startHours, startMinutes] = lastSession.end.split(':').map(Number);
    lastSessionDate.setHours(startHours, startMinutes);
  
    // Step 3: Calculate the same session date on the 4th week
    const nextPaymentDate = addWeeks(lastSessionDate, 3); // Move to the 4th week
  
    return nextPaymentDate;
  }
  function adjustStartDateToFirstSession(startDate: Date, sessions: Session[]): Date {
    // Step 1: Find the first session of the week
    const firstSession = sessions.reduce((first, current) => {
      return daysOfWeek.indexOf(current.day) < daysOfWeek.indexOf(first.day) ? current : first;
    });
  
    // Step 2: Get the start time of the first session
    const [sessionHours, sessionMinutes] = firstSession.start.split(':').map(Number);
  
    // Step 3: Adjust only the hours and minutes of the start date
    let adjustedDate = new Date(startDate);
    adjustedDate = setHours(adjustedDate, sessionHours);
    adjustedDate = setMinutes(adjustedDate, sessionMinutes);
  
    // Step 4: Add one hour to the adjusted time
    adjustedDate = addHours(adjustedDate, 1);
  
    return adjustedDate;
  }
export const addTeacher = async (teacher: Teacher) => {
    try {
        // Add the teacher document to the "Teachers" collection
        const teacherRef = await addDoc(collection(db, "Teachers"), {...teacher,groupUIDs:[]});
        console.log("Teacher added successfully:", teacherRef.id);
        

        const collectiveGroups = teacher.classes.map((cls) => ({
          ...cls,
          year:cls.year,
          students:[],
          reimbursements:[],
          teacherUID:teacherRef.id,
          teacherName:teacher.name,
          subject: teacher["educational-subject"],
          startDate:adjustStartDateToFirstSession(cls.startDate, cls.groups),
          nextPaymentDate:getNextPaymentDate(cls.groups, cls.startDate)
          }


        ));
            const groupUIDs: string[] = [];
            const classesgrouped:any[]=[]
         for (const group of collectiveGroups) {
            const groupRef= await addDoc(collection(db, "Groups"), group);
            groupUIDs.push(groupRef.id);
            const classesgroupeds = {...group,id: groupRef.id,index: 0,quota: 0}
            classesgrouped.push(classesgroupeds);
            
        await updateDoc(doc(db, "Teachers", teacherRef.id), {
            groupUIDs: arrayUnion(groupRef.id),
        });
    }
        return {id:teacherRef.id,groupUIDs:groupUIDs,classesgrouped};
    } catch (error) {
        console.error("Error adding Teacher:", error);
        throw error; // Optionally re-throw the error to propagate it further if needed
    }

};

export const updateTeacher = async(updatedteacher: Teacher,teacherId:string)=>{
    try {
        await updateDoc(doc(db, "Teachers",teacherId), updatedteacher);
        console.log("Teacher updated successfully:");
        return true; // Assuming you want to return the ID of the added Teacher
    } catch (error) {
        console.error("Error updating Teacher:", error);
        // Handle the error here, such as displaying a message to the user or logging it for further investigation
        throw error; // Optionally re-throw the error to propagate it further if needed
    }
}
export const deleteTeacher = async(teacherId:string,classes:any)=>{
  try {
    for (const classData of classes) {
    
          await deleteDoc(doc(db, "Groups", classData.id)); // Delete the class document

  }

          await deleteDoc(doc(db, "Teachers",teacherId));
      console.log("Teacher deleted successfully:");
      return true; // Assuming you want to return the ID of the added Teacher
  } catch (error) {
      console.error("Error deleting Teacher:", error);
      // Handle the error here, such as displaying a message to the user or logging it for further investigation
      throw error; // Optionally re-throw the error to propagate it further if needed
  }
}
export const addGroup=async(added:any,teacherId)=>{
const classDocRef = collection(db, 'Groups');
 const id=await addDoc(classDocRef,added)  
 await updateDoc(doc(db,'Teachers',teacherId),{
    groupUIDs:arrayUnion(id.id)
 })
return  id.id

}
export const removeGroupFromDoc = async (clss,studentArray) => {
    try {
        // Reference to the specific document in the Groups collection
        const docRef = doc(db, 'Groups', clss.id);
        
        studentArray.map(async(std)=>{
            await updateDoc(doc(db,'Students',std.id),{
                classesUIDs:arrayRemove({id:clss.id,group:clss.group})
            })
        })
        await updateDoc(doc(db,'Teachers',clss.teacherUID),{
            groupUIDs:arrayRemove(clss.id)
        })
        await deleteDoc(docRef);

    } catch (error) {
    }}
    export async function updateClassGroup(groupId,updatedGroupDetails) {

        const userRef = doc(db, 'Groups',groupId);
      
        // Fetch the document
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
      
            await updateDoc(userRef, {...updatedGroupDetails});
            console.log('Task updated successfully!');
          } else {
            console.log('Task not found.');
          }
      }
      export const addNewClasses = async (clss:any,teacherId:string) => {
        try {
    
                const groupUIDs: string[] = [];
    
                const groupRef= await addDoc(collection(db, "Groups"), clss);
                groupUIDs.push(groupRef.id);
    
            await updateDoc(doc(db, "Teachers", teacherId), {
                groupUIDs: arrayUnion(groupRef.id),
                
            });
            return {...clss,classId:groupRef.id};
        } catch (error) {
            console.error("Error adding Teacher:", error);
            throw error; // Optionally re-throw the error to propagate it further if needed
        }
    };