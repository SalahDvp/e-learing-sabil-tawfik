"use client"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { DataTableDemo } from "./components/table"
import { useState } from "react"
import {useTranslations} from "next-intl"
import { useData } from "@/context/admin/fetchDataContext";


import { PDFViewer } from "@react-pdf/renderer"
function Dashboard() {
  const [filter,setFilter]=useState("All")
  const t=useTranslations()
  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
<main className="flex flex-col lg:flex-row flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
  <div className="grid auto-rows-max items-start gap-4 md:gap-8  gridlg:w-8/12 w-full">

      <div className="flex items-center">

      </div>
       <DataTableDemo filter={filter}/> 

 
  </div>
</main>
      </div>


  )
}
export default Dashboard