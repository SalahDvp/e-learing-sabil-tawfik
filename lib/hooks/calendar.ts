import { db } from "@/firebase/firebase-config";
import { updateDoc,doc,arrayRemove, arrayUnion, getDoc, setDoc } from "firebase/firestore";


export const removeStudentFromAttendance = async (student,classId,attendanceId,updatedStudents) => {
    try {
        // Reference to the specific document in the Groups collection
        const docRef = doc(db, 'Groups', classId,'Attendance',attendanceId);

        
        // Update the document to remove the specified group from the groups array
        await updateDoc(docRef, {
            attendanceList: arrayRemove(student)
        });
        if(updatedStudents){
            await updateDoc(doc(db,'Groups',classId),{
                students:updatedStudents
            })
        }
        
    } catch (error) {
    }

}
export const addStudentFromAttendance = async (
    student: any, 
    classId: string, 
    attendanceId: string, 
    updatedStudents: any[], 
    attendanceDoc: any
  ) => {
    try {
      // Reference to the specific document in the Groups collection
      const docRef = doc(db, 'Groups', classId, 'Attendance', attendanceId);
      console.log("Document reference:", docRef);
      
      // Check if the attendance document exists
      const attendanceSnap = await getDoc(docRef);
      const attendanceExist = attendanceSnap.exists();
      console.log("Attendance exists:", attendanceExist);
      
      if (attendanceExist) {
        console.log("Updating attendance with student:", student);
        await updateDoc(docRef, {
          attendanceList: arrayUnion(student),
        });
      } else {
        console.log("Creating new attendance document for student:", student);
        const att = { ...attendanceDoc, attendanceList: [student] };
        console.log("attenadnace",att);
        
        await setDoc(docRef, att);
      }
  
      // Update students in the group if updatedStudents is provided
      if (updatedStudents) {
        console.log("Updating students for classId:", classId, "with:", updatedStudents);
        await updateDoc(doc(db, 'Groups', classId), {
          students: updatedStudents,
        });
      }
  
      console.log("Student successfully added to attendance.");
    } catch (error) {
      console.error("Error in addStudentFromAttendance:", error);
    }
  };