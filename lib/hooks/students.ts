import { db } from "@/firebase/firebase-config"
import { addDoc,arrayRemove,arrayUnion,collection, deleteDoc, doc, getDoc, increment, runTransaction, setDoc, updateDoc, writeBatch } from "firebase/firestore"
import { getDownloadURL, ref, uploadBytes, uploadString } from "firebase/storage";
import { storage } from "@/firebase/firebase-config";
import { StudentSchema,Student } from "@/validators/auth";
import { parse } from "date-fns";
function dataURLtoFile(dataurl:string, filename:string) {
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[arr.length - 1]), 
        n = bstr.length, 
        u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
}

//Usage example:


export async function uploadAndLinkToCollection(
    image: string | null, // Changed to File type for actual file upload
    folder: string,
    cls: string,
    name: string,
  ): Promise<string> {
    const folderRef = ref(storage, `${folder}/${cls}`);
    const fileRef = ref(folderRef, name);
    var file = dataURLtoFile(image ?image:'null','photo.jpeg');
    await uploadBytes(fileRef, file);

    const downloadUrl = await getDownloadURL(fileRef);
    await updateDoc(doc(db,folder,cls), {
        photo: downloadUrl,
      });
    // Assuming you want to return an array of objects with metadata
    return downloadUrl
  }
  export const addStudent = async (student: Student) => {
    try {
      // Add the student document outside of the transaction
      const studentRef = doc(db, "Students", student.id);
      await setDoc(studentRef, student);
  
      // Upload the student's photo if it exists
      if (student.photo) {
        await uploadAndLinkToCollection(student.photo, 'Students', student.id, 'photo');
      }
  
      // Gather all necessary data before starting the transaction
      const classUpdates: { classID: string, newIndex: number, group: string,cs:string }[] = [];
      
      for (const cls of student.classes) {
        const classRef = doc(db, 'Groups', cls.id);
        const classDoc = await getDoc(classRef);
        
        if (classDoc.exists()) {
          const classData = classDoc.data();
          const students = classData.students || [];
          const highestIndex = students.reduce((max, student) => Math.max(max, student.index || 0), 0);
          const newIndex = highestIndex + 1;
  
          // Collect data for use in the transaction
          classUpdates.push({ classID: cls.id, newIndex, group: cls.group ,cs:cls.cs});
        } else {
          console.log('No such document for class ID:', cls.id);
          // Handle missing class documents if necessary
        }
      }
  
      // Use a transaction to ensure atomic updates to class documents
      const result = await runTransaction(db, async (transaction) => {
        for (const update of classUpdates) {
          const classRef = doc(db, 'Groups', update.classID);
          transaction.update(classRef, {
            students: arrayUnion({
              id: student.id,
              name: student.name,
              index: update.newIndex,
              year: student.year,
              group: update.group ,
              cs:update.cs// Use group from the collected data
            })
          });
        }
  
        // Return class updates for post-transaction processing
        return { studentId: student.id, classUpdates };
      });
  
      return result;
    } catch (error) {
      console.error("Error adding Student:", error);
      // Handle the error here
      throw error; // Optionally re-throw the error
    }
  };
  
export const updateStudent = async(updatedstudent: any,studnetId:string)=>{
  try {
          await updateDoc(doc(db, "Students",studnetId), updatedstudent);
      console.log("Teacher updated successfully:");
      return true; // Assuming you want to return the ID of the added Teacher
  } catch (error) {
      console.error("Error updating Teacher:", error);
      // Handle the error here, such as displaying a message to the user or logging it for further investigation
      throw error; // Optionally re-throw the error to propagate it further if needed
  }
}
export const deleteStudent = async (student, classes) => {
  try {
    // Create an array of promises for each class update
    const updatePromises = student.classesUIDs.map(async (cls) => {
      // Find the specific class and student details
      const classData = classes.find(clss => clss.id === cls.id);
      if (!classData) {
        throw new Error(`Class with ID ${cls.id} not found`);
      }

      const studentDetails = classData.students.find(std => std.id === student.id);
      if (!studentDetails) {
        throw new Error(`Student with ID ${student.id} not found in class ${cls.id}`);
      }

      const indx = studentDetails.index;
console.log('fdskwdkfkfkffkfkfkfkf',cls.group,student.id,indx,student.name,student.year,studentDetails.cs);

      // Reference to the class document
      const classDocRef = doc(db, 'Groups', cls.id);

      // Update the class document
      await updateDoc(classDocRef, {
        students: arrayRemove({
          group: cls.group,
          id: student.id,
          index: indx,
          name: student.name,
          year: student.year,
          cs: studentDetails.cs
        })
      });
    });

    // Wait for all update operations to complete
    await Promise.all(updatePromises);

    // Delete the student from the Students collection
    const studentDocRef = doc(db, 'Students', student.id);
    await deleteDoc(studentDocRef);

    console.log('Student removed from all classes and deleted from Students collection successfully');
  } catch (error) {
    console.error('Error deleting student:', error);
  }
};
const parseAndFormatDate = (dateString: string, formatString: string): Date => {
    return parse(dateString, formatString, new Date());
  };
export const formatDateToYYYYMMDD = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  };
  export const writeAttendance = async (std:any) => {
    try {
      const date = new Date(); // Current date and time
      const formattedDate = formatDateToYYYYMMDD(date)
      const docRef = doc(db, 'Groups', std.id, 'Attendance', formattedDate);
      const attendanceData = {
        cs:std.cs,
        index:std.studentIndex,
        group:std.studentGroup,
        name:std.name,
        status:'present'
      };
  
      // Use setDoc with merge: true to create or update the document
      await updateDoc(docRef,{
        attendanceList:arrayUnion(attendanceData)
      })
    } catch (error) {
      console.error("Error writing attendance: ", error);
    }
  };
  export async function addStudentToClass(student,classId,studentId) {
    const { group, id, index, name, year,cs,studentName,studentID } = student;
  
    const classDocRef = doc(db, 'Groups', classId);
    await updateDoc(classDocRef, {
      students: arrayUnion({ group, id:studentID, index, name:studentName, year,cs })
    });
  
    const studentDocRef = doc(db, 'Students', studentId);
    await updateDoc(studentDocRef, {
      classesUIDs: arrayUnion({ id: id, group: group })
    });
  
  }
  export async function removeStudentFromClass(student,studentId,studentName) {
    const { id, group,index,name,year,cs } = student;
  
    const studentDocRef = doc(db, 'Students', studentId);  
  console.log("dqwdqdwqwdqwd", group, studentId, index, name, year,cs );
  
      await updateDoc(studentDocRef, {
        classesUIDs: arrayRemove({ id, group })
      });
  
      const classDocRef = doc(db, 'Groups', id);
      await updateDoc(classDocRef, {
        students: arrayRemove({ group:student.group, id:studentId, index:student.index, name:studentName, year:student.year,cs:student.cs })
      });
     }
    
     export  async function changeStudentGroup(classId,studentId,students,classesUIDs) {
    

        const studentDocRef = doc(db, 'Students', studentId);  
  
        await updateDoc(studentDocRef, {
         classesUIDs
        });
    
        const classDocRef = doc(db, 'Groups',classId);
        await updateDoc(classDocRef, {
          students
        }); 

      }
  
export async function markAttendance(classId,attendanceId,student){

    await updateDoc(doc(db,'Groups',classId,'Attendance',attendanceId),{
      attendanceList:arrayUnion({index:student.index,group:student.group,name:student.name,status:student.status})
    })
  }

  export async function changeStudentCard(studentId:string,newId:string){

    await updateDoc(doc(db,'Students',studentId),{
      newId:newId
    })
  }
  export async function getStudentCount(classId: string): Promise<number> {
    const classRef = doc(db, 'Groups', classId);
  
    try {
      // Run a transaction to ensure atomicity
      const newStudentIndex = await runTransaction(db, async (transaction) => {
        const classDoc = await transaction.get(classRef);
        if (!classDoc.exists()) {
          throw new Error('Class not found');
        }
  
        const classData = classDoc.data();
        const students = classData.students;
        let highestIndex = 0;
        
        for (const student of students) {
          if (typeof student.index === 'number') {
            highestIndex = Math.max(highestIndex, student.index);
          }
        }
        console.log("highest",highestIndex);
        
        const currentStudentCount = highestIndex + 1;
  
        return currentStudentCount;
      });
  
      return newStudentIndex; // Adding 1 to get the new index
    } catch (error) {
      console.error('Error fetching student count:', error);
      throw error;
    }
  }