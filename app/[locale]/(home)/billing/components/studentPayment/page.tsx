
"use client"
import React from "react"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import StudentPaymentForm from "./components/studentPaymentForm"
import { StudentPaymentTable } from "./components/studentPaymentTable"

import StudentReimbursmentForm from "./components/reimbursements"
import {TransactionDataTableDemo} from './components/transactionTable'
 function Studentpayment() {

  return (
  
    <div className="flex flex-row min-h-screen w-full flex-col ">


      <div className="flex flex-col sm:gap-4 sm:py-4 ">
   
      <div className="grid flex items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-4 xl:grid-cols-4">
  <div className="flex grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">

    <StudentPaymentTable />
    <TransactionDataTableDemo />

  </div>

  <div className="lg:col-span-2 lg:mr-4 ml-8">
    <Tabs defaultValue="createPayment">
      <TabsList>
        <TabsTrigger value="createPayment">regular payment</TabsTrigger>
        <TabsTrigger value="createreimbursement">reimbursement</TabsTrigger>
      </TabsList>
      <TabsContent value="createPayment" className="space-y-4">
        <StudentPaymentForm />
      </TabsContent>
      <TabsContent value="createreimbursement" className="space-y-4">
        <StudentReimbursmentForm />
      </TabsContent>
    </Tabs>
  </div>
</div>




      </div>
    </div>

     


       
 
  )
}
export default Studentpayment


//
