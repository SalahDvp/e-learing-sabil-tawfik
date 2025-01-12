import { db } from "@/firebase/firebase-config"
import { addDoc,arrayRemove,arrayUnion,collection, deleteDoc, doc, getDoc, increment, runTransaction, setDoc, updateDoc, writeBatch } from "firebase/firestore"
import { getDownloadURL, ref, uploadBytes, uploadString } from "firebase/storage";
import { storage } from "@/firebase/firebase-config";
import { addWeeks, parse } from "date-fns";



export const addStudent = async (student: any, user: any) => {
    try {
      const role = user.role === null ? 'admin' : user.role;
  
      // Add the student document outside of the transaction
      const studentRef = doc(db, "E-students", student.id);
      await setDoc(studentRef, student);
  
      // Upload the student's photo if it exists
    
  
      // Gather all necessary data before starting the transaction
      const classUpdates: { classID: string, newIndex: number, group: string, cs: string, sessionsLeft: number, amount: number, debt: number, active: boolean, nextPaymentDate?: any, sessionsToStudy: number, addedAt: any }[] = [];
     // const hasDiscount = student.classes.length >= 3 && eligibleYears.includes(student.year); ; // Check if the student has 3 or more classes
  
      for (const cls of student.classes) {
        const classRef = doc(db, 'E-groups', cls.id);
        const classDoc = await getDoc(classRef);
  
       
  
        // Return class updates for post-transaction processing
        return { studentId: student.id, classUpdates };
      };
  
      
    } catch (error) {
      console.error("Error adding Student:", error);
      throw error; // Optionally re-throw the error
    }
  };

  
  export const addStudentsToTeacherGroup = async (groupName: string, teacherId: string, students: any[]) => {
    try {
      // Get reference to the teacher's document in the group's subcollection
      const teacherRef = doc(db, "E-groups", groupName, teacherId);
  
      // Add the students to the teacher's "students" array
      await updateDoc(teacherRef, {
        students: arrayUnion(...students.map((student: any) => ({
          studentId: student.id,
          name: student.name,
          // You can add additional student details here if needed
        })))
      });
  
      return { teacherId, studentsAdded: students.length };
    } catch (error) {
      console.error("Error adding students to teacher group:", error);
      throw error; // Optionally re-throw the error
    }
  };
  