"use client"
import React, { createContext, useState,useContext,useEffect} from 'react';
import { getDocs,collection,query,where,orderBy,getDoc, doc} from 'firebase/firestore';
import { db } from "@/firebase/firebase-config"
import {subDays} from "date-fns"

export const AppContext = createContext();

// Create the provider component
export const  FetchParentDataProvider = ({ children,user }) => {
  const [date, setDate] = useState({
    from: subDays(new Date(), 30), // 30 days ago
    to: new Date(), // Today's date
  });
const [parent,setParent]=useState()
const[transactions , setTransactions] = useState()
const formatter = new Intl.DateTimeFormat('en-GB', {
    year: '2-digit',
    month: 'short',
    day: '2-digit'
  });
  
const formatDate = (date) => date ? formatter.format(date).replace(/\./g, '') : null;
  useEffect(() => {
    const getParentData = async () => {
        try {
            const parentRef = await getDoc(doc(db, "Parents", "BlqHXj53EeNZwO9fodEh"));
            const parentData = { ...parentRef.data(), id: parentRef.id };
            console.log("parent", parentData);

            
            // Fetch data for each child if children array exists and is not empty
            if (parentData.children && parentData.children.length > 0) {
                const updatedChildren = await Promise.all(parentData.children.map(async (child) => {
                    const childDoc = await getDoc(doc(db, "Students", child.id));
                    const docData = childDoc.data();
                    const invoicesSnapshot = await getDocs(
                        query(
                          collection(db, 'Billing', "payments", "Invoices"),
                          where("student.id", "==", child.id),
                        )
                      );
                 const invoicesData = invoicesSnapshot.docs.map((doc) => ({
                        ...doc.data(),
                        id: doc.id,
                        value: doc.id,
                        label: doc.id,
                        invoice: doc.id,
                        paymentDate: formatDate(new Date(doc.data().paymentDate.toDate())),
                        nextPaymentDate:formatDate(new Date(doc.data().nextPaymentDate.toDate()))
                      }));
                      const appointmentsSnapshot = await getDocs(
                        query(
                          collection(db, "Appointments"),
                          where("studentId", "==", child.id),
                        )
                      );
                     const appointmentsData = appointmentsSnapshot.docs.map((doc) => ({
                        ...doc.data(),
                        id: doc.id,
                        value: doc.id,
                        label: doc.id,
                        status:doc.data().status?doc.data().status:"Going"
                      }));
              
                   
                    return {
                        ...docData,
                        id: childDoc.id,
                        dateOfBirth: docData.dateOfBirth ? formatDate(new Date(docData.dateOfBirth.toDate())): null,
                        joiningDate: docData.joiningDate ? formatDate(new Date(docData.joiningDate.toDate())) : null,
                        lastPaymentDate: docData.lastPaymentDate ?formatDate( new Date(docData.lastPaymentDate.toDate())) : null,
                        nextPaymentDate: docData.nextPaymentDate ? formatDate(new Date(docData.nextPaymentDate.toDate()) ): null,
                        startDate: docData.joiningDate ? formatDate(new Date(docData.joiningDate.toDate())) : null,
                        student: `${docData.firstName} ${docData.lastName}`,
                        value: `${docData.firstName} ${docData.lastName}`,
                        label: `${docData.firstName} ${docData.lastName}`,
                        name:`${docData.firstName} ${docData.lastName}`,
                        transactions:invoicesData,
                        appointments:appointmentsData?appointmentsData:[],
                    };
                }));
                setParent({
                    ...parentData,
                    children: updatedChildren,
                });
            }
        } catch (error) {
            console.error("Error fetching parent data:", error);
        }
    };

    getParentData();
}, []);
return (
    <AppContext.Provider value={{date,setDate,parent,setParent,transactions}}>
      {children}
    </AppContext.Provider>
  );
};
export const  useParentData =()=>{
    const value=useContext(AppContext)
    try{
    if(!value){
        throw new Error("Error not wrapped inside layout  ",)
    }   }catch(e){
        console.log(e);
    }
    return value
}
