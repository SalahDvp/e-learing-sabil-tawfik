

import { db } from "@/firebase/firebase-config"
import { addDoc, collection, deleteDoc, doc, updateDoc ,setDoc,increment, arrayUnion} from "firebase/firestore"
import { teacherPaymentRegistrationSchema } from "@/validators/teacherSalarySchema";
import { z } from "zod";





export function getMonthInfo(date:Date) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const monthIndex = date.getMonth(); // Get the month index (0-11)
    const monthName = months[monthIndex];
    const monthAbbreviation = monthName.slice(0, 3); // Get the first three characters for the abbreviation
    return { fullName: monthName, abbreviation: monthAbbreviation };
  }
  
type TeacherSalaryFormValues = z.infer<typeof  teacherPaymentRegistrationSchema> & {documents?:any[]};
export const addTeacherSalary = async (transaction:any) => {
    try {
        const month=getMonthInfo(transaction.date)
        const teacherTransRef = await addDoc(collection(db, "Billing","payouts","TeachersTransactions"), transaction);
        await setDoc(doc(db, "Teachers", transaction.teacher.id, "TeacherSalary", teacherTransRef.id), {ref: teacherTransRef.id, }); 
    
        // Reference to the added document
        console.log("Tracher Salary added successfully:",teacherTransRef.id );    
        await updateDoc(doc(db, "Billing", "payouts"), {
            teachersExpenses: increment(transaction.amount),
        });
        await updateDoc(doc(db, "Billing","analytics"), {
            totalExpenses:increment(transaction.amount),
            [`data.${month.abbreviation}.expenses`]: increment(transaction.amount)
        });
        if (transaction.paymentType==='advance') {
            await updateDoc(doc(db,"Teachers",transaction.teacher.id),{
                advancePayment:arrayUnion({date:transaction.date,amount:transaction.amount})
            })
            
        }
        return teacherTransRef.id;
        // Assuming you want to return the ID of the added Tracher Salary
    } catch (error) {
        console.error("Error adding Tracher Salary:", error);
        // Handle the error here, such as displaying a message to the user or logging it for further investigation
        throw error; // Optionally re-throw the error to propagate it further if needed
    }
    
};
export const updateTeacherSalary = async(updatedtransaction:TeacherSalaryFormValues,transactionID:string,oldSalary:number)=>{
    try {
        const month=getMonthInfo(updatedtransaction.salaryDate)
           await updateDoc(doc(db, "Billing","payouts","TeachersTransactions",transactionID), updatedtransaction);

    if(oldSalary!=updatedtransaction.salaryAmount){
        await updateDoc(doc(db, "Billing", "payouts"), {
            teachersExpenses: increment(updatedtransaction.salaryAmount-oldSalary),
            
        });
        await updateDoc(doc(db, "Billing","analytics"), {
            totalExpenses:increment(updatedtransaction.salaryAmount-oldSalary),
            [`data.${month.abbreviation}.expenses`]: increment(updatedtransaction.salaryAmount-oldSalary)

        });
    }
             
        console.log("Tracher Salary updated successfully:",transactionID);
        return true; // Assuming you want to return the ID of the added Tracher Salary
    } catch (error) {
        console.error("Error updating Teacher:", error);
        // Handle the error here, such as displaying a message to the user or logging it for further investigation
        throw error; // Optionally re-throw the error to propagate it further if needed
    } 
}
export const deleteTeacherSalary = async(transactionID:string)=>{
    try {
            await deleteDoc(doc(db, "Billing","payouts","TeachersTransactions",transactionID));
        console.log("Tracher Salary deleted successfully:");
        return true; // Assuming you want to return the ID of the added Tracher Salary
    } catch (error) {
        console.error("Error deleting Tracher Salary:", error);
        // Handle the error here, such as displaying a message to the user or logging it for further investigation
        throw error; // Optionally re-throw the error to propagate it further if needed
    } 
}

//function increment(salaryAmount: any) {
//    throw new Error("Function not implemented.");
//}