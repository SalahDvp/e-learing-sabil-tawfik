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
export const addStudentFromAttendance = async (student,classId,attendanceId,updatedStudents,attendanceDoc) => {
    try {
        // Reference to the specific document in the Groups collection
        const docRef = doc(db, 'Groups', classId,'Attendance',attendanceId);
        const attendanceExist=(await getDoc(docRef)).exists()
     if(attendanceExist){
        await updateDoc(docRef, {
            attendanceList: arrayUnion(student)
        });
     }else{
        const att={...attendanceDoc,attendanceList:[student]}
        await setDoc(docRef,att)
     }
    if(updatedStudents){
    await updateDoc(doc(db,'Groups',classId),{
        students:updatedStudents
    })
}

    } catch (error) {
    }

}