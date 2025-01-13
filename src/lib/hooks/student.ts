import { db } from "../../firebase/firebase-config";
import { addDoc,arrayRemove,arrayUnion,collection, deleteDoc, doc, getDoc, increment, runTransaction, setDoc, updateDoc, writeBatch } from "firebase/firestore"
import { getDownloadURL, ref, uploadBytes, uploadString } from "firebase/storage";
import { storage } from "@/firebase/firebase-config";
import { addWeeks, parse } from "date-fns";



export const addStudent = async (student: any) => {
  try {
    // Validate the input
    console.log('zakamo0 ',student);

    // Add the student document to Firestore
    const studentRef = await addDoc(collection(db, 'E-students'), student);
  
    console.log('zakamo ',student);
    
    // Return the student ID and name for use in the frontend
    return { studentId: studentRef.id, studentName: student.name };
  } catch (error) {
    console.error("Error adding Student:", error);
    throw error;
  }
};


  export const addStudentToGroup = async(studentId: string, studentName: string, groupName: string, id: string) =>{
    try {
      // Reference the group document within the sub-collection
      const groupRef = doc(db, 'E-groups', id, 'sub-groups', groupName);
  console.log('mino mino',groupRef);
  
      // Update the students array by adding the new student
      await updateDoc(groupRef, {
        students: arrayUnion({
          id: studentId,
          name: studentName
        })
      });
  
      console.log('Student added to group successfully');
    } catch (error) {
      console.error('Error adding student to group:', error);
      throw new Error('Failed to add student to group');
    }
  }
  
  
  