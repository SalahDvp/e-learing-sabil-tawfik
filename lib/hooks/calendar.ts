import { db } from "@/firebase/firebase-config";
import { updateDoc,doc,arrayRemove } from "firebase/firestore";


export const removeStudentFromAttendance = async (student,classId,attendanceId) => {
    try {
        // Reference to the specific document in the Groups collection
        const docRef = doc(db, 'Groups', classId,'Attendance',attendanceId);
        console.log("students",'Groups', classId,'Attendance',attendanceId);
        
        // Update the document to remove the specified group from the groups array
        await updateDoc(docRef, {
            attendanceList: arrayRemove(student)
        });

    } catch (error) {
    }

}