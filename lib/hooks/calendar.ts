import { db } from "@/firebase/firebase-config";
import { updateDoc,doc,arrayRemove, arrayUnion } from "firebase/firestore";


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
export const addStudentFromAttendance = async (student,classId,attendanceId,updatedStudents) => {
    try {
        // Reference to the specific document in the Groups collection
        const docRef = doc(db, 'Groups', classId,'Attendance',attendanceId);

        
        
        // Update the document to remove the specified group from the groups array
        await updateDoc(docRef, {
            attendanceList: arrayUnion(student)
        });
if(updatedStudents){
    await updateDoc(doc(db,'Groups',classId),{
        students:updatedStudents
    })
}

    } catch (error) {
    }

}