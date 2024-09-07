"use client";
import { Button } from "@/components/ui/button";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDateRangePicker } from "@/app/[locale]/(home)/dashboard/components/date-range-picker";
import CardsRevenue from "@/app/[locale]/(home)/billing/components/analytics/CardRevenue";

import * as XLSX from 'xlsx';
import StudentsPerYear from "@/app/[locale]/(home)/billing/components/analytics/CardStudentsPerYear";

import { CardsMetric } from "@/app/[locale]/(home)/billing/components/analytics/CardMetric";
import { CircleExpenses } from "@/app/[locale]/(home)/billing/components/analytics/CardExpensesCircle";
import CardTransactions from "@/app/[locale]/(home)/billing/components/analytics/CardTransactions";
import CardIncome from "@/app/[locale]/(home)/billing/components/analytics/CardExpenses";
import Payouts from "./components/otherPayouts/page";
import TeacherSalaryDashBoard from "./components/teachersBilling/page";
import Studentpayment from "./components/studentPayment/page";
import { useTranslations } from "next-intl";
import { useData } from "@/context/admin/fetchDataContext";
import { useUser } from  "@/lib/auth";



export default function DashboardPage() {
  const t=useTranslations()
  const { role  } = useUser();
  return (
    <>
      <div className=" flex-col md:flex">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">{t('dashboard')}</h2>
            <div className="flex items-center space-x-2">
              <CalendarDateRangePicker />
              {/* <Button>{t('download')}</Button> */}
            </div>
          </div>
          <Tabs defaultValue="students" className="space-y-4">
         
            <TabsList>
            <TabsTrigger value="students">{t("Students")}</TabsTrigger>
            <TabsTrigger value="teachers" disabled={role}>{t('teachers')}</TabsTrigger>    
            <TabsTrigger value="payouts">{t('payouts')}</TabsTrigger>
            <TabsTrigger value="analytics" disabled={role}>{t('analytics')}</TabsTrigger>
            </TabsList>

            <TabsContent value="analytics" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <CardsRevenue />
               <CardIncome/>
                <StudentsPerYear />
                <CircleExpenses />
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <CardsMetric />
                <CardTransactions />
              </div>
            </TabsContent>
            <TabsContent value="payouts" className="space-y-4">
              <Payouts/>
            </TabsContent>
            <TabsContent value="teachers" className="space-y-4">
              <TeacherSalaryDashBoard/>
            </TabsContent>
            <TabsContent value="students" className="space-y-4">
          <Studentpayment/>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
