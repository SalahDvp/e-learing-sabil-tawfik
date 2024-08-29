import { db } from "@/firebase/firebase-config"
import { addDoc, collection, deleteDoc, doc, increment ,arrayUnion, updateDoc ,setDoc,getDoc} from "firebase/firestore"
import { studentPaymentSchema } from "@/validators/studentPaymentSchema";
import { z } from "zod";
function getMonthInfo(date:Date) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const monthIndex = date.getMonth(); // Get the month index (0-11)
    const monthName = months[monthIndex];
    const monthAbbreviation = monthName.slice(0, 3); // Get the first three characters for the abbreviation
    return { fullName: monthName, abbreviation: monthAbbreviation };
  }
type StudentPaymentFormValues = z.infer<any> & {documents?:any[]};
export const addPaymentTransaction = async (transaction: any, studentID: string) => {
    const month = getMonthInfo(transaction.paymentDate);
    try {
        // Validate studentID
        if (!studentID) {
            throw new Error("Student ID is required.");
        }

        // Reference to the specific student's invoice document
        const transactionRef = doc(db, "Billing", "payments", "Invoices", studentID);

        // Ensure transaction is not undefined
        if (!transaction || !transaction) {
            throw new Error("Transaction data is missing or malformed.");
        }

        // Update the document with arrayUnion
        await updateDoc(transactionRef, {
            transaction: arrayUnion(transaction), // Ensure transaction.transaction is an array
            // months: arrayUnion(...months) // Uncomment and modify if using months
        });

        const analyticsRef = doc(db, "Billing", "analytics");
    const analyticsDoc = await getDoc(analyticsRef);

    if (!analyticsDoc.exists()) {
      // Initialize the document with an array of month objects if it doesn't exist
      const data = {
        totalExpenses: 0,
        totalIncome: 0,
        data: months.map(month => ({
          month: month.fullName,
          expenses: 0,
          income: 0
        }))
      };
      await setDoc(analyticsRef, data);
    } else {
      // Retrieve the existing data array
      const existingData = analyticsDoc.data()?.data || [];

      // Find the index of the current month in the array
      const monthIndex = existingData.findIndex((m: any) => m.month === month.fullName);

      if (monthIndex !== -1) {
        // Update the specific month's income
        existingData[monthIndex].income += transaction.amount;
      } else {
        // Add a new entry if the month wasn't found
        existingData.push({
          month: month.fullName,
          expenses: 0,
          income: transaction.amount,
        });
      }
   
      // Update the totalIncome and the data array
      await updateDoc(analyticsRef, {
        totalIncome: increment(transaction.amount),
        data: existingData
      });
    }

    console.log("Transaction successfully added to Firestore!");

    return transactionRef.id; // Return the ID of the document
  } catch (error) {
    console.error("Error adding transaction:", error);
    throw error; // Optionally re-throw the error to propagate it further if needed
  }
}


export async function updatesessionsLeft(paymentDate,nextPaymentDate,debt,studentId){
  

        await updateDoc(doc(db,'Students',studentId),{
              debt:debt,
              lastPaymentDate:paymentDate,
              nextPaymentDate:nextPaymentDate
  
  
        });
    }
export const updateStudentInvoice = async(updatedtransaction:StudentPaymentFormValues,transactionID:string,oldSalary:number)=>{
    try {
        const month=getMonthInfo(updatedtransaction.paymentDate)
           await updateDoc(doc(db, "Billing","payments","Invoices",transactionID), updatedtransaction);

    if(oldSalary!=updatedtransaction.paymentAmount){
        await updateDoc(doc(db,"Students",updatedtransaction.student.id),{
            amountLeftToPay:increment(updatedtransaction.paymentAmount-oldSalary)
        })
        await updateDoc(doc(db,"Parents",updatedtransaction.parent.id),{
            totalPayment:increment(updatedtransaction.paymentAmount-oldSalary)
        })
        await updateDoc(doc(db, "Billing","analytics"), {

            [`data.${month.fullName}.income`]: increment(updatedtransaction.paymentAmount-oldSalary),
            totalIncome: increment(updatedtransaction.paymentAmount-oldSalary),
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
            await deleteDoc(doc(db,  "Billing","payments","Invoices",transactionID));
        console.log("Tracher Salary deleted successfully:");
        return true; // Assuming you want to return the ID of the added Tracher Salary
    } catch (error) {
        console.error("Error deleting Tracher Salary:", error);
        // Handle the error here, such as displaying a message to the user or logging it for further investigation
        throw error; // Optionally re-throw the error to propagate it further if needed
    } 
}