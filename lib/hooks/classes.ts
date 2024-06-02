import { db } from "@/firebase/firebase-config"
import { addDoc, collection, deleteDoc, doc, updateDoc, writeBatch,increment } from "firebase/firestore"
import classSchema from "@/validators/classSchema";
import { z } from "zod";
type ClassFormValue=z.infer<typeof classSchema> & {level?:any,documents?:any[]}
export const addClass = async (cls: ClassFormValue) => {
    try {
 
        const batch = writeBatch(db)
        const classRef = await addDoc(collection(db, "Classes"), {...cls,level:{level:cls.level,id:cls.levelId},levelName:cls.level});
        console.log("Class added successfully:", classRef.id);
        const levelRef=doc(db,"Levels",cls.levelId)
        // Loop through students and update fields using batch
        cls.students.forEach((student) => {
            const studentRef =doc(db,'Students',student.id)
            batch.update(studentRef, {
                class:cls.className,
            });
         
        });

        // Loop through teachers and add class information using batch
        cls.teachers.forEach((teacher) => {
            const teacherRef = doc(db,"Teachers",teacher.id)
            batch.update(teacherRef, {
                class: {
                    name: cls.className,
                    id: classRef.id
                }
            });
           
        });

        batch.update(levelRef, {
            studentsNumber:increment(cls.students.length)
        });

        // Commit the batch operation
        await batch.commit();

        return classRef.id;
    } catch (error) {
        console.error("Error adding class:", error);
        throw error;
    }
};
interface ElementWithId {
    id: string;
  }
  export async function updateStudents<T extends ElementWithId>(original: T[], updated: T[], cls: any): Promise<{ added: T[], deleted: T[] }> {
    const added: T[] = [];
    const deleted: T[] = [];
    const batch = writeBatch(db); 
    const originalMap = new Map(original.map(item => [item.id, item]));
    const levelRef = doc(db, 'Levels', cls.levelId);
  
    for (const item of updated) {
      if (!originalMap.has(item.id)) {
        added.push(item);
        const studentRef = doc(db, 'Students', item.id);
        batch.update(studentRef, {
          class:cls.className, 
        })
      }
    }
    batch.update(levelRef, {
      studentsNumber: increment(added.length)
    });
  
    for (const item of original) {
      if (!updated.some(updatedItem => updatedItem.id === item.id)) {
        deleted.push(item);
        const studentRef = doc(db, 'Students', item.id);
        batch.update(studentRef, {
          class: null,
        });
      }
    }
    batch.update(levelRef, {
      studentsNumber: increment(-added.length)
    });
  
    await batch.commit();
    console.log("students updated");
    
    return { added, deleted };
  }
  export async function updateTeachers<T extends ElementWithId>(original: T[], updated: T[], cls: any): Promise<{ added: T[], deleted: T[] }> {
    const added: T[] = [];
    const deleted: T[] = [];
    const batch = writeBatch(db); 
    const originalMap = new Map(original.map(item => [item.id, item]));  
   
   
   
    for (const item of updated) {
      if (!originalMap.has(item.id)) {
        added.push(item);
        const teacherRef = doc(db, 'Teachers', item.id);
        batch.update(teacherRef, {
          class: { name: cls.className, id: cls.id }
        });
      }
    }

  
    for (const item of original) {
      if (!updated.some(updatedItem => updatedItem.id === item.id)) {
        deleted.push(item);
        const teacherRef = doc(db, 'Teachers', item.id);
        batch.update(teacherRef, {
         class:null
        });
      }
    }  
    await batch.commit();
    console.log("teachers updated");
    return { added, deleted };
  }
export const updateClass = async(updatedclass:ClassFormValue,classId:string)=>{
    try {
            await updateDoc(doc(db, "Classes",classId), updatedclass);
        console.log("class updated successfully:");
        return true; // Assuming you want to return the ID of the added class
    } catch (error) {
        console.error("Error updating class:", error);
        // Handle the error here, such as displaying a message to the user or logging it for further investigation
        throw error; // Optionally re-throw the error to propagate it further if needed
    } 
}
export const deleteClass = async(classId:string)=>{
    try {
            await deleteDoc(doc(db, "Classes",classId));
        console.log("class deleted successfully:");
        return true; // Assuming you want to return the ID of the added class
    } catch (error) {
        console.error("Error deleting class:", error);
        // Handle the error here, such as displaying a message to the user or logging it for further investigation
        throw error; // Optionally re-throw the error to propagate it further if needed
    } 
}



