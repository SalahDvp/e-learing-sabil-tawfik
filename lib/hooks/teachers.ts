import { db } from "@/firebase/firebase-config";
import { addDoc, collection, updateDoc, doc, deleteDoc, arrayUnion, arrayRemove,setDoc } from "firebase/firestore";
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
        const teacherRef = await addDoc(collection(db, "Teachers"), teacher);
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
            const currentDate = new Date();
         for (const group of collectiveGroups) {
            const groupRef= await addDoc(collection(db, "Groups"), group);
            groupUIDs.push(groupRef.id);
            const attendanceRef = collection(groupRef, "Attendance");

            for (const cls of group.groups) {
                const thisWeekStartDate = startOfWeek(currentDate, { weekStartsOn: 0 });
                const nextWeekStartDate = addWeeks(thisWeekStartDate, 1);

                // Create attendance for this week
                const thisWeekDate = getNextDayOfWeek(cls.day, thisWeekStartDate);
                const formattedDateThisWeek = format(thisWeekDate, 'yyyy-MM-dd');
                const dateTimeUIDThisWeek = `${formattedDateThisWeek}-${cls.group}`;

                // Add attendance document for this week
                await setDoc(doc(attendanceRef, dateTimeUIDThisWeek), {
                    id: dateTimeUIDThisWeek,
                    start: cls.start,
                    end: cls.end,
                    group: cls.group,
                    attendanceList: []
                });

                // Create attendance for next week
                const nextWeekDate = getNextDayOfWeek(cls.day, nextWeekStartDate);
                const formattedDateNextWeek = format(nextWeekDate, 'yyyy-MM-dd');
                const dateTimeUIDNextWeek = `${formattedDateNextWeek}-${cls.group}`;

                // Add attendance document for next week
                await setDoc(doc(attendanceRef, dateTimeUIDNextWeek), {
                    id: dateTimeUIDNextWeek,
                    start: cls.start,
                    end: cls.end,
                    group: cls.group,
                    attendanceList: []
                });
            }
        }
        await updateDoc(doc(db, "Teachers", teacherRef.id), {
            groupUIDs: groupUIDs,
        });
        console.log("Groups added successfully");
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
export const addGroup=async(cls:any)=>{


    const classDocRef = doc(db, 'Groups', cls.classId);
    await updateDoc(classDocRef, {
      groups: arrayUnion(cls)
    });

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