import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { useChildData } from "@/app/[locale]/(parent)/components/childDataProvider"
import { format } from 'date-fns';
import { Badge } from "@/components/ui/badge";
import React from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

interface FirestoreTimestamp {
  seconds: number;
  nanoseconds: number;
}

function formatFirestoreTimestamp(
  start: FirestoreTimestamp,
  end: FirestoreTimestamp
): string {
  const startDate = new Date(start.seconds * 1000 + start.nanoseconds / 1_000_000);
  const endDate = new Date(end.seconds * 1000 + end.nanoseconds / 1_000_000);

  const formattedStart = format(startDate, 'dd/MM/yyyy HH:mm');
  const formattedEnd = format(endDate, 'HH:mm');

  return `${formattedStart} - ${formattedEnd}`;
}

const AppointmentHistory=()=>{
  const {childData}=useChildData()
  const t=useTranslations()
  const getStatusColor = React.useCallback((status:string) => {
    switch (status) {
      case 'Going':
        return '#2ECC71'; // Green for accepted
      case 'Not going':
        return '#E74C3C'; // Yellow for pending
      // Default to white for unknown status
    }
  }, []);
  const sortedAppointments = [...childData.appointments].sort((a, b) => b.start.toDate().getTime() - a.start.toDate().getTime());
    return(
        <Card className='w-full md:w-2/4'>
        <CardHeader className="pb-3">
          <CardTitle>{t('appointment-history')}</CardTitle>
     
        </CardHeader>
        <CardContent className="grid gap-1 mt-10">
        <ScrollArea className="h-72 w-full px-5">
        <Table>
      <TableCaption>{t('a-list-of-your-recent-appoitnments')}</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead >{t('date')}</TableHead>
          <TableHead>{t('teacher')}</TableHead>
          <TableHead >{t('status')}</TableHead>
          <TableHead className="text-left">Link</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
    
        {sortedAppointments.map((appointment:any,index:number) => (
          <TableRow key={index}>
            <TableCell className="font-medium text-left">{formatFirestoreTimestamp(appointment.start, appointment.end)}</TableCell>
            <TableCell >{appointment.teacher}</TableCell>
            <TableCell className="text-right"> <Badge style={{backgroundColor:getStatusColor(appointment.status)}}>{t(appointment.status)}</Badge></TableCell>
            <TableCell > 
              <Button variant="link" onClick={()=>window.open(appointment.meetLink, '_blank', 'noopener,noreferrer')}>
                {appointment?.meetLink}
                </Button>
            </TableCell>
          </TableRow>
          
        ))}
                 
      </TableBody>
      {/* <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
      </TableFooter> */}
    </Table>
    </ScrollArea>
        </CardContent>
      </Card>
    )
}
export default AppointmentHistory