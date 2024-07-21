import { db } from "@/firebase/firebase-config";
import { addDoc, collection, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { Teacher, TeacherSchema } from '@/validators/teacher';
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
         for (const group of collectiveGroups) {
            const groupRef= await addDoc(collection(db, "Groups"), group);
            groupUIDs.push(groupRef.id);
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