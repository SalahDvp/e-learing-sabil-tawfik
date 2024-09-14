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

async function logAction(userId: string, userType: string, resourceType: string, resourceId: string, action: string, additionalInfo: object = {}) {
  const actionLog = {
    userId,
    userType,
    resourceType,
    resourceId,
    action,
    timestamp: new Date().toISOString(),
    additionalInfo
  };

  // Save the action log in Firestore
  const log = await doc(db, resourceType, resourceId)
  await updateDoc(log,{
    actionTrack: arrayUnion(actionLog)
  });
  return log;
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

  function getNextPaymentDate(sessions: Session[], classStartDate: Date, numberOfSessions: number): Date {
    // Step 1: Find the last session of the week
    const lastSession = sessions.reduce((last, current) => {
      return daysOfWeek.indexOf(current.day) > daysOfWeek.indexOf(last.day) ? current : last;
    });
  
    // Step 2: Calculate the date of the last session in the first week
    const classStartWeekStart = startOfWeek(classStartDate);
  
    // Find the date for the last session in the first week
    let lastSessionDate = new Date(classStartWeekStart);
    while (getDay(lastSessionDate) !== daysOfWeek.indexOf(lastSession.day)) {
      lastSessionDate.setDate(lastSessionDate.getDate() + 1);
    }
  
    // Set the start time for the session
    const [startHours, startMinutes] = lastSession.end.split(':').map(Number);
    lastSessionDate.setHours(startHours, startMinutes);
  
    // Step 3: Calculate the sessions to move forward based on numberOfSessions and sessions.length
    const weeksToAdd = Math.floor((numberOfSessions / sessions.length) - 1);
  
    // Step 4: Move forward the calculated number of weeks
    const nextPaymentDate = addWeeks(lastSessionDate, weeksToAdd);
  
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
  export const addTeacher = async (teacher: Teacher,user) => {
    try {
      const role = user.role === null ? 'admin' : user.role;

      const teacherData = { ...teacher, groupUIDs: [] };
      const teacherRef = await addDoc(collection(db, "Teachers"), teacherData);

  
      await logAction(user.uid, role, 'Teachers', teacherRef.id, 'add new teacher', { teacherName: teacherData.name ,teacherid: teacherRef.id});

      // Function to prepare group data, excluding undefined fields
      const prepareGroupData = (cls) => {
        const groupData: any = {
          ...cls,
          year: cls.year,
          students: [],
          reimbursements: [],
          teacherUID: teacherRef.id,
          teacherName: teacher.name,
          subject: teacher["educational-subject"],
        };
        if (cls.active) {
          if(teacher["educational-subject"] != "تحضيري"){
          const day=adjustStartDateToFirstSession(cls.startDate, cls.groups);
          groupData.startDate = adjustStartDateToFirstSession(cls.startDate, cls.groups);
          groupData.nextPaymentDate = getNextPaymentDate(cls.groups, day,cls.numberOfSessions);
          }
        }
  
        return groupData;
      };
  
      const collectiveGroups = teacher.classes.map(prepareGroupData);
      const groupUIDs: string[] = [];
      const classesgrouped: any[] = [];
  
      // Loop through and add groups
      for (const group of collectiveGroups) {
        const groupRef = await addDoc(collection(db, "Groups"), group);
        groupUIDs.push(groupRef.id);
  
        const classGrouped = { ...group, id: groupRef.id, index: 0, quota: 0 };
        classesgrouped.push(classGrouped);
  
        await updateDoc(doc(db, "Teachers", teacherRef.id), {
          groupUIDs: arrayUnion(groupRef.id),
        });
      }
  

      return { id: teacherRef.id, groupUIDs, classesgrouped };
    } catch (error) {
      console.error("Error adding Teacher:", error);
      throw error;
    }
  };

export const updateTeacher = async(updatedteacher: Teacher,teacherId:string,user)=>{
    try {
      const role = user.role === null ? 'admin' : user.role;

        await updateDoc(doc(db, "Teachers",teacherId), updatedteacher);
        console.log("Teacher updated successfully:");
       await logAction(user.uid, role, 'Teachers', teacherId, 'Edit teacher', { teacherId: teacherId });

        return true; // Assuming you want to return the ID of the added Teacher


        
    } catch (error) {
        console.error("Error updating Teacher:", error);
        // Handle the error here, such as displaying a message to the user or logging it for further investigation
        throw error; // Optionally re-throw the error to propagate it further if needed
    }
    
}
export const deleteTeacher = async(teacherId:string,classes:any,user)=>{
  try {
    for (const classData of classes) {
    
          await deleteDoc(doc(db, "Groups", classData.id)); // Delete the class document


  }

        const role = user.role === null ? 'admin' : user.role;

        await deleteDoc(doc(db, "Teachers",teacherId));
     //    await logAction(user.uid, role, 'Teachers', teacherId, 'Delete Teacher', { teacherId: teacherId });

      console.log("Teacher deleted successfully:");
      return true; // Assuming you want to return the ID of the added Teacher
  } catch (error) {
      console.error("Error deleting Teacher:", error);
      // Handle the error here, such as displaying a message to the user or logging it for further investigation
      throw error; // Optionally re-throw the error to propagate it further if needed
  }
}
export const addGroup=async(added:any,teacherId,user)=>{
const role = user.role === null ? 'admin' : user.role;
const classDocRef = collection(db, 'Groups');
 const id=await addDoc(classDocRef,added)  
 await updateDoc(doc(db,'Teachers',teacherId),{
    groupUIDs:arrayUnion(id.id)
 })
 await logAction(user.uid, role, 'Teachers', teacherId, 'Add new group/groups', { teacherId: teacherId ,groupName:added.name});

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
      
        
        if (userRef) {
      
            await updateDoc(userRef, {...updatedGroupDetails});

            console.log('Task updated successfully!');
          } else {
            console.log('Task not found.');
          }
      }
 export async function activateStudents(groupId,students) {

        const userRef = doc(db, 'Groups',groupId);
      
        
        if (userRef) {
      
            await updateDoc(userRef, {students:students});
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
      //    await logAction(user.uid, role, 'Teachers', teacherId, 'Add new Class/Classes to the teacher ', { teacherId: teacherId ,groupID:clss});

            return {...clss,classId:groupRef.id};
        } catch (error) {
            console.error("Error adding Teacher:", error);
            throw error; // Optionally re-throw the error to propagate it further if needed
        }
    };