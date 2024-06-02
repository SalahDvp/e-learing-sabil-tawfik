
"use client"
import { CardTitle, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useChildData } from '@/app/[locale]/(parent)/components/childDataProvider';
import React from 'react';
import { useTranslations } from "next-intl"

function FamilyPage() {

const t=useTranslations()
const {childData}=useChildData()

const rows = [];
for (let i = 0; i < childData.transactions.length; i++) {
  const transaction = childData.transactions[i];
  rows.push(
    <tr key={i} className="bg-white dark:bg-gray-800">
      <td className="px-4 py-3">{transaction.paymentDate}</td>
      <td className="px-4 py-3">{transaction.description}</td>
      <td className="px-4 py-3 text-right">{transaction.paymentAmount}</td>
      <td className="px-4 py-3 text-right">{transaction.amountLeftToPay}</td>
    </tr>
  );
}
return (
        <div className="space-y-6">
        <div>
        <h3 className="text-lg font-medium">{t('general-information')}</h3>
        <p className="text-sm text-muted-foreground">
          {t('this_is_how_others_will_see_your_school')} </p>
      </div>
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 flex flex-row gap-6">
            <div className="w-1/3">

           
        <Card>
          <CardHeader>
            <CardTitle>Student Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-gray-600 font-medium">Current Balance</p>
              <p className="text-2xl font-bold text-primary">{childData.totalAmount} DZD</p>
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-gray-600 font-medium">Amount Left to Pay</p>
              <p className="text-2xl font-bold text-red-500">{childData.amountLeftToPay} DZD</p>
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex items-center space-x-4">
              <Button >Make Payment</Button>
              <Button variant="secondary">Print Statement</Button>
            </div>
          </CardFooter>
        </Card>
        <Card className="mt-5">
          <CardHeader>
            <CardTitle>Bank Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="account-number">Account Number</Label>
                <Input defaultValue="12345678" id="account-number" />
              </div>
              <div>
                <Label htmlFor="routing-number">Routing Number</Label>
                <Input defaultValue="987654321" id="routing-number" />
              </div>
              <div>
                <Label htmlFor="bank-name">Bank Name</Label>
                <Input defaultValue="Acme Bank" id="bank-name" />
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
        <Card className="md:grid-cols-1 w-2/3">
      <CardHeader>
        <CardTitle>Transactions</CardTitle>
      </CardHeader>
      <CardContent>
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-x-auto">
                <table className="w-full table-auto">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium">
              <tr>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Description</th>
                <th className="px-4 py-3 text-right">Amount Paid</th>
                <th className="px-4 py-3 text-right">left to pay</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
      {rows}
    </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
      </div>
      </div>
    );
}

  


export default FamilyPage
