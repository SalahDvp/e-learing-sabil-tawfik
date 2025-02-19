import { db } from "../../firebase/firebase-config";
import { addDoc,arrayRemove,arrayUnion,collection, deleteDoc, doc, getDoc, increment, runTransaction, setDoc, updateDoc, writeBatch } from "firebase/firestore"
import { getDownloadURL, ref, uploadBytes, uploadString } from "firebase/storage";
import { storage } from "@/firebase/firebase-config";
import { addWeeks, parse } from "date-fns";



export const addStudent = async (student: any) => {
  try {
    // Add the student document and get the generated ID
    const studentRef = await addDoc(collection(db, "E-students"), student);
    const studentId = studentRef.id;


    await updateDoc(studentRef, {
      password: studentId.substring(0, 8)
    });

    // Return the generated ID
    return studentId;
  } catch (error) {
    console.error("Error adding Student:", error);
    throw error;
  }
};

  
  export const addStudentsToTeacherGroup = async (groupName: string, teacherId: string, students: any[]) => {
    try {
      // Get reference to the teacher's document in the group's subcollection
      const teacherRef = doc(db, "E-groups", groupName,'sub-groups', teacherId);
  
      // Add the students to the teacher's "students" array
      await updateDoc(teacherRef, {
        students: arrayUnion(
          students
          // You can add additional student details here if needed
       )
      });
  
      return { teacherId, studentsAdded: students.length };
    } catch (error) {
      console.error("Error adding students to teacher group:", error);
      throw error; // Optionally re-throw the error
    }
  };
  
  export const updateStudent = async (studentId: string, studentData: any) => {
    try {
      const studentRef = doc(db, "E-students", studentId);
      await updateDoc(studentRef, studentData);
      return studentId;
    } catch (error) {
      console.error("Error updating student:", error);
      throw error;
    }
  };
  