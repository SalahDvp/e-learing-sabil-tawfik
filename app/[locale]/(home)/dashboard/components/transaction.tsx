import React from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { format, differenceInCalendarDays } from "date-fns";
import { Timestamp } from "firebase/firestore"; // If you're using Firestore

// Interfaces
interface Transaction {
  amount: number;
  debt: number;
  monthlyPayment: number;
  nextPaymentDate: Timestamp;
  paymentDate: Timestamp;
  year: string;
}

interface Invoice {
  monthlyPayment: number;
  registrationAndInsuranceFee: string;
  school: string;
  student: {
    id: string;
    name: string;
  };
  nextPaymentDate: Timestamp;
  transactions: Transaction[];
}

interface StudentPaymentProps {
  invoice: any;

}


const StudentPayment: React.FC<any> =  ({ transaction ,studentid}) => {
console.log('sdf',transaction);

if (transaction.id !== studentid) {
    return  null; // Return null to render nothing if the IDs don't match
  }
  return (
    <div
      className={"flex flex-col p-4 rounded-lg shadow-md"}>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none dark:text-gray-100">{transaction.student}</p>
        </div>
        <div className="ml-auto text-right">
    
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm font-medium leading-none dark:text-gray-100">Transaction:</p>

          <ul className="mt-2 space-y-2">
           
              <li className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
            Day:{new Date(transaction.paymentDate).toLocaleDateString()} - Amount:{transaction.amount} DA
                </span>
              </li>
      
          </ul>
  
    
     
      </div>
    </div>
  );
};

export default StudentPayment;