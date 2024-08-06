import { db } from "@/firebase/firebase-config";
import { addDoc, collection, updateDoc, doc, deleteDoc, arrayUnion, arrayRemove,setDoc, writeBatch, getDoc } from "firebase/firestore";
import { Teacher, TeacherSchema } from '@/validators/teacher';

import { format, startOfWeek, addWeeks, eachDayOfInterval, endOfWeek } from 'date-fns';
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

export const addTeacher = async (teacher: Teacher) => {
    try {
        // Add the teacher document to the "Teachers" collection
        const teacherRef = await addDoc(collection(db, "Teachers"), {...teacher,groupUIDs:[]});
        console.log("Teacher added successfully:", teacherRef.id);
        const classesByYear = groupClassesByYear(teacher.classes);

        const collectiveGroups = Object.entries(classesByYear).map(([year, classes]) => (
    {      year,
        students:[],
            teacherUID:teacherRef.id,
            teacherName:teacher.name,
            subject: teacher["educational-subject"],
            groups: classes.map((cls,index) => ({
              subject: teacher["educational-subject"],
              start: cls.start,
              end:cls.end,
              day:cls.day,
              stream: cls.stream,
              quota: cls.quota,
              room:cls.room,
              group:`G${index+1}`
            }))}


        ));
            const groupUIDs: string[] = [];
         for (const group of collectiveGroups) {
            const groupRef= await addDoc(collection(db, "Groups"), group);
            groupUIDs.push(groupRef.id);
        await updateDoc(doc(db, "Teachers", teacherRef.id), {
            groupUIDs: arrayUnion( groupRef.id),
        });
        console.log("Groups added successfully");
        console.log('1st groupUIDs',groupUIDs);
    }
        return {id:teacherRef.id,groupUIDs:groupUIDs};
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
export const deleteTeacher = async(teacherId:string)=>{
    try {
            await deleteDoc(doc(db, "Teachers",teacherId));
        console.log("Teacher deleted successfully:");
        return true; // Assuming you want to return the ID of the added Teacher
    } catch (error) {
        console.error("Error deleting Teacher:", error);
        // Handle the error here, such as displaying a message to the user or logging it for further investigation
        throw error; // Optionally re-throw the error to propagate it further if needed
    }
}
export const addGroup=async(added:any)=>{
        const batch = writeBatch(db); // Initialize the batch
    
        // Update Firestore documents in batch
        for (const clss of added) {
          const classDocRef = doc(db, 'Groups', clss.classId);
          const { classId, year,index, ...rest } = clss;
    
          batch.update(classDocRef, {
            groups: arrayUnion(rest)
          })   
        }
    
        // Commit the batch
        await batch.commit();    
}
export const removeGroupFromDoc = async (clss,studentArray) => {
    try {
        // Reference to the specific document in the Groups collection
        const docRef = doc(db, 'Groups', clss.classId);
        
        // Update the document to remove the specified group from the groups array
        await updateDoc(docRef, {
            groups: arrayRemove({day:clss.day,end:clss.end,group:clss.group,quota:clss.quota,room:clss.room,start:clss.start,stream:clss.stream,subject:clss.subject})
        });
        studentArray.map(async(std)=>{
            await updateDoc(doc(db,'Students',std.id),{
                classesUIDs:arrayRemove({id:clss.classId,group:std.group})
            })
        })
        console.log(`Group removed successfully from document ID: ${docId}`);
    } catch (error) {
    }}
    export async function updateClassGroup(groupId,group, updatedGroupDetails) {
        console.log("updated",updatedGroupDetails);
        
        // Reference to the document
        const userRef = doc(db, 'Groups',groupId);
      
        // Fetch the document
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          // Get the existing array
          const userData = userDoc.data();
          let tasks = userData.groups || [];
      
          // Find the index of the task you want to update
          const taskIndex = tasks.findIndex(task => task.group === group);
      
          if (taskIndex !== -1) {
            const { classId, year, ...filteredDetails } = updatedGroupDetails;
      
            // Update the specific task
            tasks[taskIndex] = {...filteredDetails };
      
            // Write back the updated array to Firestore
            await updateDoc(userRef, { groups: tasks });
            console.log('Task updated successfully!');
          } else {
            console.log('Task not found.');
          }
        } else {
          console.log('User not found.');
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