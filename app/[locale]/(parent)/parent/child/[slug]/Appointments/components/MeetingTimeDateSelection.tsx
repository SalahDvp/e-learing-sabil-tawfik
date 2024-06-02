import { Button } from '@/components/ui/button'
import { getDay, parse, format, addMinutes, eachMinuteOfInterval, isEqual, setMilliseconds } from 'date-fns';
import React, { useEffect, useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select } from "@/components/ui/select"
import { BellIcon, EyeNoneIcon, PersonIcon } from "@radix-ui/react-icons"
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/firebase/firebase-config'
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoadingButton } from '@/components/ui/loadingButton';
import { useTranslations } from 'next-intl';
import { useToast } from '@/components/ui/use-toast';
import { useParentData } from '@/context/parent/fetchDataContext';
import { useChildData } from '@/app/[locale]/(parent)/components/childDataProvider';
import { addAppointment } from '@/lib/hooks/parent/appointment';
import { Appointment } from '@/lib/hooks/parent/appointment';
import { appointmentSchema ,AppointmentSchemaType} from '@/validators/appointmentSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import AppointmentHistory from './AppointmentsHistory';
import { functions } from '@/firebase/firebase-config';
import {HttpsCallableResult, httpsCallable } from 'firebase/functions';
import { formatInTimeZone, fromZonedTime } from 'date-fns-tz'
const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
interface GoogleMeetLinkResponse {
  meetLink: string;
}
const generateTimeSlots = (officeHours:{day:string,start:string,end:string}[], selectedDate:Date, interval:number, appointments:Appointment[]) => {
  const selectedDay = daysOfWeek[getDay(selectedDate)];
  const dayHours = officeHours.find(hours => hours.day === selectedDay);

  if (!dayHours) return [];

  const slots = [];
  const start = parse(dayHours.start, 'HH:mm', selectedDate);
  const end = parse(dayHours.end, 'HH:mm', selectedDate);

  const allSlots = eachMinuteOfInterval(
    { start, end },
    { step: interval }
  ).map(time => format(time, 'HH:mm'));

  for (const slot of allSlots) {
    const slotStart = parse(slot, 'HH:mm', selectedDate);
    const slotEnd = addMinutes(slotStart, interval);

    const isOverlapping = appointments.some((appointment:Appointment) => {
      const appointmentStart = appointment.start;
      // Set milliseconds to 0 for both dates before comparison
      const slotStartWithoutMs = setMilliseconds(slotStart, 0);
      const appointmentStartWithoutMs = setMilliseconds(appointmentStart, 0);

      // Check if the slot start time matches the appointment start time
      return isEqual(slotStartWithoutMs, appointmentStartWithoutMs);
    });

    if (!isOverlapping) {
      slots.push({ slot, slotStart, slotEnd });
    }
  }

  return slots;
};
function MeetingTimeDateSelection() {
    const [teachers, setTeachers] = useState<any>([])
    const [loading, setLoading] = useState(true)
    const {parent,setParent}=useParentData()
    const {childData}=useChildData()
    const t=useTranslations()
    const {toast}=useToast()
    const form = useForm<AppointmentSchemaType>({
      resolver: zodResolver(appointmentSchema),
      defaultValues:{
        duration:20,
        date:new Date()
      }
    });

    
    const { reset, formState, setValue, getValues,watch } = form;

    const { isSubmitting } = formState;
    useEffect(() => {
      const fetchTeachers = async () => {
        try {
          const getTeachersRef = await getDocs(collection(db, 'Teachers'));
          const teachersData = [];
      
          for (const data of getTeachersRef.docs) {
            const reservationsRef = await getDocs(query(
              collection(db, 'Appointments'),
              where('start', '>=', new Date()),where('teacherId', "==",data.id)
            ));
            const appointments = reservationsRef.docs.map(doc => ({
              ...doc.data(),
              start:new Date(doc.data().start.toDate()),
              end:new Date(doc.data().end.toDate()),
              id: doc.id,
            }));
            
            teachersData.push({
              ...data.data(),
              id: data.id,
              dateOfBirth: new Date(data.data().dateOfBirth.toDate()),
              joiningDate: new Date(data.data().joiningDate.toDate()),
              teacher: `${data.data().firstName} ${data.data().lastName}`,
              value: `${data.data().firstName} ${data.data().lastName}`,
              label: `${data.data().firstName} ${data.data().lastName}`,
              appointments, // Updated to match the key used in the appointments array
            });
          }
      
          setTeachers(teachersData);
        } catch (error) {
          console.error('Error fetching teachers:', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchTeachers()
    }, [])
  
    const selectedTeacher = watch('teacher')
    const selectedDate = watch('date')
    const timeSlots = React.useMemo(() => {
      const teacher = teachers.find((t:any) => t.teacher === getValues("teacher"));
      if (!teacher || !teacher.officeHours) return [];
      console.log("slots",teacher.appointments);
      
      return generateTimeSlots(teacher.officeHours, getValues("date"), 20, teacher.appointments)
    
    }, [selectedTeacher, teachers,selectedDate,getValues])
    const officeHoursDayIndex = React.useMemo(() => {
      const allIndexes = [0, 1, 2, 3, 4, 5, 6];
      const teacher = teachers.find(
        (t: any) => t.teacher ===selectedTeacher 
      );
      if (!teacher || !teacher.officeHours) return allIndexes;

      const array=teacher.officeHours.map((day:{day:string,start:string,end:string})=>(
        daysOfWeek.indexOf(day.day)
      ))
  
      const remainingIndexes = allIndexes.filter(index => !array.includes(index));
      return  remainingIndexes;
    }, [selectedTeacher, teachers]);

    async function onSubmit(data: any) {
      const timeZoneAlgeria = 'Africa/Algiers';
      const startTimeUTC = fromZonedTime(data.slotStart, timeZoneAlgeria)
      const endTimeUTC = fromZonedTime(data.slotEnd, timeZoneAlgeria)      
      const createGoogleMeetLink = httpsCallable<{ emails: string[]; startTime: Date; endTime: Date;},GoogleMeetLinkResponse>(functions, 'createGoogleMeetLink');
      const result: HttpsCallableResult<GoogleMeetLinkResponse> = await createGoogleMeetLink({
        emails: ["youcefmilk@gmail.com"],
        startTime: startTimeUTC,
        endTime: endTimeUTC,
      });
  
      const meetLink = result.data.meetLink;
      const appointmentData={teacher:data.teacher,teacherId:data.teacherId,duration:data.duration,date:data.date,slot:data.slot,student:childData.student,studentId:childData.id,parent:`${parent.firstName} ${parent.lastName}`,parentId:parent.id,start:data.slotStart,end:data.slotEnd,meetLink:meetLink}
      const appointmentId=addAppointment(appointmentData);
      setTeachers((prevTeachers:any) =>
        prevTeachers.map((teacher:any) =>
          teacher.id === data.teacherId
            ? {
                ...teacher,
                appointments: [
                  ...teacher.appointments,
                  { ...appointmentData, id: appointmentId },
                ],
              }
            : teacher
        )
      );
      setParent((prevParent:any) => ({
        ...prevParent,
        childrendata: prevParent.children.map((child:any) =>
          child.id === childData.id
            ? {
                ...child,
                appointments: [
                  ...child.appointments,
                  { ...appointmentData, id: appointmentId },
                ],
              }
            : child
        ),
      }));
      reset({
        duration:20,
        date:new Date(),
        teacher:""
      });
    toast({
      title: t('changes-applied-0'),
      description: t('changes-applied-successfully'),
    });
        
  }
    if (loading) {
      return <div>Loading...</div>
    }

  return  (
  <div className='md:flex md:flex-row'>
<Card className='w-full md:w-2/3 mr-2'>
  <CardHeader className='flex flex-col items-center justify-center text-center'>
    <CardTitle>{t('schedule-an-appointment')}</CardTitle>
    <CardDescription>
      {t('pick-a-time-that-works-best-for-you')} </CardDescription>
  </CardHeader>
  <Form {...form}>
            <form>
  <CardContent className="grid gap-6 md:grid-cols-3 items-center justify-center">

    <div className="grid gap-2 w-full">
      <div className="space-y-2">
      <FormField
          control={form.control}
          name="teacher"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('teacher')}</FormLabel>
              <FormControl>
         <Select required value={field.value} onValueChange={(value)=>{
          const selectedTeacher=teachers.find((t:any)=>t.teacher===value)
          if(selectedTeacher){
            form.setValue("teacher",value)
            form.setValue('teacherId',selectedTeacher.id)
          }
       
          
          }}>
 <SelectTrigger>
  
            <SelectValue placeholder={t('select-a-teacher')} />
          </SelectTrigger>
            <SelectContent>
 
            {teachers.map((teacher:any,index:number)=>(
  <SelectItem key={index} value={teacher.teacher}>{teacher.teacher}</SelectItem>
            ))}
                          </SelectContent>
              </Select>
    
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="space-y-2">
        
        <Label htmlFor="date">{t('duration')}</Label>
        <Button className="w-full flex-col h-auto items-start" variant="outline" type='button'>
          <span className="font-normal">{t('20-min')}</span>
        </Button>
      </div>
      <div className="space-y-2">
      <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
            <FormLabel>{t('date')}</FormLabel>
            <FormControl>
        <Button className="w-full flex-col h-auto items-start" variant="outline" type='button'>
          <span className="font-normal">{timeSlots.length>0?format(field.value,'d/M/yyyy'):t('select-teacher-or-date')}</span>
        </Button>
        </FormControl>
        </FormItem>
        )}
      />
      </div>
      <LoadingButton
            loading={isSubmitting}
            type="submit"
            onClick={form.handleSubmit(onSubmit)}
          >
          {t('book-meeting')} </LoadingButton>
    </div>
    <div className="grid gap-2 items-center justify-center md:justify-items-center w-full md:w-auto">
    <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormControl>
       <Calendar
            {...field}
            mode="single"
            disabled={[
               { before: new Date() },
              { dayOfWeek: officeHoursDayIndex }
            ]}
            className="rounded-md border"
            selected={timeSlots.length>0?field.value:undefined}
            onDayClick={field.onChange}
          />
             </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

    </div>
    <div className="grid gap-2  w-full">
  <ScrollArea className="h-72 w-full px-5">

    {timeSlots?.map((time, index) => (
      <FormField
        control={form.control}
        name="slot"
        key={index}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Button
                onClick={() => {form.setValue("slot", time.slot);form.setValue("slotStart", time.slotStart);form.setValue("slotEnd", time.slotEnd)}}
                className={`border-primary w-full  mb-2 text-primary ${
                  time.slot === getValues("slot") ? 'bg-primary text-white' : ''
                }`}
                variant="outline"
                type="button"
              >
                {time.slot}
              </Button>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    ))}
  </ScrollArea>

    </div>
  </CardContent>
  </form>
  </Form>
</Card>
<AppointmentHistory/>
 </div>
 
  );
}

export default MeetingTimeDateSelection