"use client"
import React, { useMemo,useCallback } from 'react';
import {
  ChevronDownIcon,
} from "@radix-ui/react-icons"
import { useToast } from "@/components/ui/use-toast"
import { useTranslations } from "next-intl"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Step,
  Stepper,
  useStepper,
  type StepItem,
} from "@/components/stepper"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ChevronDown, Key, PlusCircle, Trash2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Teacher, TeacherSchema } from '@/validators/teacher';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import CalendarDatePicker from '../../students/components/date-picker';

import { addGroup, addNewClasses, addTeacher, removeGroupFromDoc, updateClassGroup, updateTeacher } from '@/lib/hooks/teachers';
import { LoadingButton } from '@/components/ui/loadingButton';

import { UseFormReturn } from 'react-hook-form';

import { useData } from "@/context/admin/fetchDataContext";

import { generateTimeOptions } from '../../settings/components/open-days-table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { parse, isBefore, isAfter, isEqual, startOfMinute } from 'date-fns';
import { Label } from '@/components/ui/label';
const parseTime = (timeString) => parse(timeString, 'HH:mm', new Date());
interface FooterProps {
  formData: Teacher;
  teacher:any;
  form: UseFormReturn<any>; // Use the specific form type if available
  isSubmitting: boolean;
  reset: UseFormReturn<any>['reset']; // Adding reset function from useForm
}




const steps = [
  { label: "Step 1" },
  { label: "Step 2" },

] satisfies StepItem[]
interface openModelProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean; // Specify the type of setOpen
  teacher:any
}
const paymentTypeOptions = {
  monthly: "salaryAmount",
  percentage: "percentage",
  hourly: "hourly"
};
const EditTeacher: React.FC<openModelProps> = ({ setOpen, open,teacher }) => {
  const t=useTranslations()
  const timeOptions = generateTimeOptions("07:00","22:00", 30);
  const form = useForm<any>({
    defaultValues:{
      year:[]
    }
   
  });
  const { reset,formState, setValue, getValues,control,watch} = form;
  const { isSubmitting } = formState;
  const { fields, append:appendClass,remove:removeClass, } = useFieldArray({
    control: form.control,
    name: "classes",

  });
  React.useEffect(() => {
    // you can do async server request and fill up form

      reset(teacher);

      
  }, [reset,teacher]); 

  
  const handleGroupChange = (
    index: number, 
    field: 'day' | 'name' | 'id' | 'subject' | 'time' | 'quota' | 'start' | 'end' | 'stream', 
    value: string | number
  ) => {
    const classes = [...getValues('classes')]; 
  
  
    if (field === 'stream') {
      if (Array.isArray(classes[index].stream)) {
        if (classes[index].stream.includes(value)) {
          classes[index].stream = classes[index].stream.filter((item: string | number) => item !== value);
        } else {
          classes[index].stream.push(value);
        }
      } else {
        classes[index].stream = [value];
      }
    } else {
      classes[index][field] = value;
    }
  
    setValue('classes', classes);
  
  };

  

const handleYearToggle = (field:string) => {
  const years=[...getValues('year')]
  if (years.includes(field)) {
    const aa=years.filter(year=>year !== field)
    setValue("year",aa)    
  } else {
    setValue("year",[...years,field])
  }
};

const truncateToMinutes = (date: Date) => startOfMinute(date);

const {classes}=useData()
// const checkRoomAvailability = useCallback((newGroup: Group, allRooms: string[]): string[] => {
//   const { day, start, end, classId, room: newGroupRoom } = newGroup;
//   // Check if any of the required fields are missing
//   if (!day || !start || !end) {
//     return [];
//   }

//   const newGroupStart = truncateToMinutes(parseTime(start));
//   const newGroupEnd = truncateToMinutes(parseTime(end));

//   // Filter rooms based on time availability
//   const availableRooms = allRooms.filter((room) => {
//     return !classes.some((classItem) =>
//       classItem.groups.some((group) => {
//         const groupStart = truncateToMinutes(parseTime(group.start));
//         const groupEnd = truncateToMinutes(parseTime(group.end));

//         const isOverlapping = group.day === day &&
//           group.room === room &&
//           ((isBefore(newGroupStart, groupEnd) && isAfter(newGroupEnd, groupStart)) ||
//            isEqual(newGroupStart, groupStart) || 
//            isEqual(newGroupEnd, groupEnd) ||
//            (isBefore(newGroupStart, groupEnd) && isEqual(newGroupEnd, groupEnd))
//           );

//         // Exclude the room if it is overlapping
//         return isOverlapping;
//       })
//     );
//   });

//   // Include the specified room if classId exists
//   if (classId && allRooms.includes(newGroupRoom)) {
//     return [...availableRooms, newGroupRoom];
//   }

//   // Return only the available rooms
//   return availableRooms;
// }, [watch("classes")]);

const subjects = [
  "Select Option",
  "رياضيات",
  "علوم",
  "فيزياء",
  "فلسفة",
  "العربية",
  "الإنجليزية",
  "الفرنسية",
  "اسبانية",
  "المانية",
  "ايطالية",
  "محاسبة",
  "هندسة مدنية",
  "هندسة ميكانيكية",
  "هندسة الطرائق",
  "الهندسة الكهربائية",
  "قانون",
  "اقتصاد",
  "العلوم الاسلامية",
  "تاريخ وجغرافيا",
  "Math",
  "Algebre",
  "Analyse",
  "Physique",
  "Chimie",
  "Gestion",
  "Informatique"
  

];
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const addSession = (groupIndex: number) => {
    const newGroups = [...getValues('classes')]
    newGroups[groupIndex].groups.push({
      day: '',
      start: '',
      end: '',
      room: '',
    })
    form.setValue(`classes`,newGroups)
  }

  const updateSessionField = (groupIndex: number, sessionIndex: number, field: keyof Session, value: any) => {
    const newGroups = [...getValues('classes')]
    newGroups[groupIndex].groups[sessionIndex] = {
      ...newGroups[groupIndex].groups[sessionIndex],
      [field]: value
    }
   form.setValue('classes',newGroups) }

  const toggleField = (groupIndex: number,field: string,) => {
    const newGroups = [...getValues('classes')]
    
    const currentFields = newGroups[groupIndex].stream
    const updatedFields = currentFields.includes(field)
      ? currentFields.filter(f => f !== field)
      : [...currentFields, field]
    newGroups[groupIndex].stream = updatedFields
    console.log(newGroups);
    
   form.setValue(`classes`,newGroups)
  }
  const removeSession = (groupIndex: number, sessionIndex: number) => {
    const newGroups = [...getValues('classes')]
    newGroups[groupIndex].groups.splice(sessionIndex, 1)
    form.setValue('classes',newGroups)
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[1400px]">
      <Form {...form} >
      <form >
        <DialogHeader>
          <DialogTitle>{t('edit-teacher')}</DialogTitle>
          <DialogDescription>
          {t('edit-your-teacher-here-click-save-when-youre-done')}
          </DialogDescription>
        </DialogHeader>

        <div className="flex w-full flex-col gap-4">

      <Stepper initialStep={0} steps={steps} >

        {steps.map(({ label }, index) => {
          return (
            <Step key={label} label={label}>
              <div className="h-[450px] flex items-center justify-center my-4 border bg-secondary  rounded-md">
              {index === 0 ? (
 
  <div className="grid gap-4 py-4">

    <FormField
                  
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4">
                      <FormLabel className="text-right">{t('name')}</FormLabel>
                      <FormControl><Input id="name"  className="col-span-3"  {...field}/></FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />


    <FormField
              control={control}
              name="birthdate"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">{t('birth-date')}</FormLabel>
                  <FormControl>  
                    <CalendarDatePicker
            {...field}
            date={getValues("birthdate")}
            className="col-span-3"
            setDate={(selectedValue:any) => {
              if (selectedValue === undefined) {
                // Handle undefined case if needed
              } else {
                form.setValue('birthdate', selectedValue);
              }
            }}
          /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


    
   





<FormField
  control={control}
  name="educational-subject"
  render={({ field }) => (
    <FormItem className="grid grid-cols-4 items-center gap-4">
    <FormLabel className="text-right">{t('educational-subject')}</FormLabel>
      <FormControl>
      <Select
   onValueChange={field.onChange}
   defaultValue={field.value}
              >
                                 <SelectTrigger
                              id={`subject`}
                              aria-label={`Select subject`}
                            >
                              <SelectValue placeholder={t('select-subject')} />
                            </SelectTrigger>
            <SelectContent>
 
            {subjects.map((subject) => (
                              <SelectItem key={subject} value={subject}   >
                                {subject}
                              </SelectItem>
                            ))}
           
                          </SelectContent>
              </Select>
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
    


  

    <FormField
              control={control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">{t('phone-number')}</FormLabel>
                  <FormControl><Input id="phoneNumber" className="col-span-3" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

<FormField
        control={control}
        name="paymentType"
        render={({ field }) => (
          <FormItem className="grid grid-cols-4 items-center gap-4">
            <FormLabel className="text-right">payment Type</FormLabel>
            <FormControl>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <SelectTrigger
                  id={`paymentType`}
                  aria-label={`Select payment Type`}
                >
                  <SelectValue placeholder='payment Type' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="hourly">Hourly</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      /> 


<FormField
  control={control}
  name={'amount'}
  render={({ field }) => {
    const paymentType:any=watch("paymentType");

    const label = paymentTypeOptions[paymentType] ;

    return (
      <FormItem className="grid grid-cols-4 items-center gap-4">
        <FormLabel className="text-right">{label}</FormLabel>
        <FormControl>
          <Input
            {...field}
            onChange={event => field.onChange(+event.target.value)}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    );
  }}
/>;
  </div>

) : (

<div className="w-full h-full">
  <ScrollArea className="h-[400px] w-full pr-4">
    {fields.map((group, groupIndex) => (
      <div key={groupIndex} className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <h3 className="text-xl font-bold">{group.name}</h3>
          <div>
            <FormField
              control={form.control}
              key={groupIndex}
              name={`classes.${groupIndex}.group`} // Use groupIndex to map fields correctly
              render={({ field }) => (
                <FormItem className="w-32">
                  <FormLabel htmlFor={`group-code-${groupIndex}`} className="text-sm font-medium">Group Code:</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <FormField
    control={form.control}
    name={`classes.${groupIndex}.numberOfSessions`}
    render={({ field }) => (
      <FormItem className="w-24">
        <FormLabel htmlFor={`group-code-${groupIndex}`} className="text-sm font-medium">Number of Sessions:</FormLabel>
        <FormControl>
          <Input
            {...field}
            type="number"
            placeholder="Sessions"
            onChange={event => field.onChange(+event.target.value)}
          />
        </FormControl>
      </FormItem>
    )}
  />
                  <div>
                  <FormField
    control={form.control}
    name={`classes.${groupIndex}.paymentType`}
    render={({ field }) => (
      <FormItem className="w-[120px]">
        <FormLabel htmlFor={`group-code-${groupIndex}`} className="text-sm font-medium">Payment Type:</FormLabel>
        <FormControl>
          <Select
   onValueChange={field.onChange}
   defaultValue={field.value}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Payment type" />
            </SelectTrigger>
            <SelectContent>
              {['monthly','session'].map((type) => (
                <SelectItem key={type} value={type}>{t(type)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormControl>
      </FormItem>
    )}
  />
                  </div>
                  <div>
                  <FormField
    control={form.control}
    name={`classes.${groupIndex}.amount`}
    render={({ field }) => (
      <FormItem className="w-24">
        <FormLabel htmlFor={`group-code-${groupIndex}`} className="text-sm font-medium">Amount:</FormLabel>
        <FormControl>
          <Input
            {...field}
            type="number"
            placeholder="Amount"
            onChange={event => field.onChange(+event.target.value)}
          />
        </FormControl>
      </FormItem>
    )}
  />
                  </div>
                  <div className="flex flex-col">

                  <Label htmlFor={`group-code-${groupIndex}`} className="text-sm font-medium">fields:</Label>
                  <DropdownMenu >
                            <DropdownMenuTrigger asChild       className="w-24">
                            <Button variant="outline" className="w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
  {/* {group.stream.length > 0 ? group.stream.join(', ') : 'Select Field'} */}
  <ChevronDown className="ml-2 h-4 w-4" />
</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                            {["جامعي",'متوسط','علوم تجريبية', 'تقني رياضي', 'رياضيات', 'تسيير واقتصاد ', 'لغات اجنبية ', 'اداب وفلسفة'].map((field) => (
                                       <DropdownMenuItem
                                       key={field}
                                       value={field}
                                       className={`flex items-center ${group.stream?.includes(field) ? 'selected' : ''}`}
                                       onClick={() =>toggleField(groupIndex,field) } 
                                       
                                     >
                                       <span className="mr-2"> { t(`${field}`)}</span>
                                       {group.stream?.includes(field) && <CheckIcon className="h-4 w-4 text-green-500" />}
                                     </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                  </div>
                  <div>
                  <FormField
    control={form.control}
    name={`classes.${groupIndex}.year`}
    render={({ field }) => (
      <FormItem className="w-[100px]">
        <FormLabel htmlFor={`group-code-${groupIndex}`} className="text-sm font-medium">Year:</FormLabel>
        <FormControl>
          <Select
      onValueChange={field.onChange}
      defaultValue={field.value}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {watch("year").map((yearOption) => (
                <SelectItem key={yearOption} value={yearOption}>{yearOption}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormControl>
      </FormItem>
    )}
  />

                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeClass(groupIndex)}
                    className="ml-auto"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove Group
                  </Button>
        </div>
        <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Day</TableHead>
                      <TableHead>Start Time</TableHead>
                      <TableHead>End Time</TableHead>
                      <TableHead>Room</TableHead>
             
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {group.groups.map((session, sessionIndex) => (
                      <TableRow key={`${groupIndex}-${sessionIndex}`}>
                        <TableCell>
                          <Select
                            value={session.day}
                            onValueChange={(value) => updateSessionField(groupIndex, sessionIndex, 'day', value)}
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue placeholder="Select day" />
                            </SelectTrigger>
                            <SelectContent>
                              {days.map((day) => (
                                <SelectItem key={day} value={day}>{t(day)}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                        <Select
                          onValueChange={(e)=>updateSessionField(groupIndex, sessionIndex, 'start', e)}
                          value={session.start}
                        >
            
                            <SelectTrigger
                              id={`start-${index}`}
                              aria-label={`Select start time`}
                            >
                              <SelectValue placeholder={t('select-end-time')} />
                            </SelectTrigger>

                          <SelectContent>
                            {timeOptions.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        </TableCell>
                        <TableCell>
                        <Select
                          onValueChange={(e)=>updateSessionField(groupIndex, sessionIndex, 'end', e)}
                          value={session.end}
                        >
            
                            <SelectTrigger
                              id={`end-${index}`}
                              aria-label={`Select end time`}
                            >
                              <SelectValue placeholder={t('select-end-time')} />
                            </SelectTrigger>

                          <SelectContent>
                            {timeOptions.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={session.room}
                            onValueChange={(value) => updateSessionField(groupIndex, sessionIndex, 'room', value)}
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue placeholder="Select room" />
                            </SelectTrigger>
                            <SelectContent>
                            {['room 1','room 2','room 3','room 4','room 5','room 6','room 7','room 8'].map((room) => (
                                <SelectItem key={room} value={room}>{room}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeSession(groupIndex, sessionIndex)}
                          >
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))} 
                  </TableBody>
                </Table>
                 <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="mt-2 w-full"
                  onClick={() => addSession(groupIndex)}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Session
                </Button> 
      </div>
    ))}
    <Button
      type="button"
      variant="outline"
      className="mt-4 w-full"
      onClick={() => {
        appendClass({
          name: `Group ${fields.length + 1}`,
          group: '',
          groups:[],
          numberOfSessions: 0,
          amount: 0,
          stream: [],
          year: '',
          paymentType: ''
        });
      }}
    >
      <PlusCircle className="h-4 w-4 mr-2" />
      Add New Group
    </Button>
  </ScrollArea>
</div>

)}
              </div>
            </Step>
          )
        })}
        <Footer formData={getValues()} form={form} isSubmitting={isSubmitting} reset={reset} teacher={teacher}/>

      </Stepper>

    </div>
    </form>
    </Form>
      </DialogContent>
    </Dialog>
  )
}
export default EditTeacher;
const Footer: React.FC<FooterProps> = ({ formData, form, isSubmitting,reset,teacher}) => {
  const t=useTranslations()
  const {
    nextStep,
    prevStep,
    resetSteps,
    isDisabledStep,
    hasCompletedAllSteps,
    isLastStep,
    isOptionalStep,
  } = useStepper()
  
  const  {setTeachers,classes,setClasses,setStudents}= useData()





  function compareClasses(oldClasses,newClasses): UpdateResult {
    const updated=[]
    const oldClassIds = oldClasses.map(cls => cls.id);
    const newClassIds = newClasses.map(cls => cls.id);
  
    // Find added classes
    const addedClasses = newClasses.filter(cls => !oldClassIds.includes(cls.id));
  
    // Find removed classes
    const removedClasses = oldClasses.filter(cls => !newClassIds.includes(cls.id));
    
    newClasses.forEach(newCls => {
      if (oldClassIds.includes(newCls.id)) {
        updated.push(newCls);
      }
    });
  
    return { addedClasses, removedClasses, updatedClasses: updated };

}

  async function processStudentChanges(result) {
    const { addedClasses, removedClasses, updatedClasses } = result;
  
    // Add students to classes
    if (addedClasses && Array.isArray(addedClasses)) {
      for (const clss of addedClasses) {
        console.log(clss);
    
        const clssId = await addGroup({
          ...clss,
          year: clss.year,
          students: [],
          reimbursements: [],
          teacherUID: formData.id,
          teacherName: formData.name,
          subject: formData["educational-subject"],
        }, formData.id);
    
        setClasses(prevClasses => [
          ...prevClasses,
          {
            ...clss,
            id: clssId,
            Attendance: {},
            students: [],
            reimbursements: [],
            subject: formData['educational-subject'],
            teacherName: formData.name,
            teacherUID: formData.id
          }
        ]);
    
        setTeachers(prevTeachers =>
          prevTeachers.map(tchr =>
            tchr.id === formData.id
              ? {
                  ...tchr,
                  classes: [
                    ...tchr.classes,
                    {
                      ...clss,
                      id: clssId,
                      Attendance: {},
                      students: [],
                      reimbursements: [],
                      subject: formData['educational-subject'],
                      teacherName: formData.name,
                      teacherUID: formData.id
                    }
                  ],
                  groupUIDs: [...tchr.groupUIDs, clssId]  // Correctly add the new group UID
                }
              : tchr
          )
        );
      }
    }
  
  //   // Remove students from classes
    if (removedClasses && Array.isArray(removedClasses)) {
      for (const clss of removedClasses) {
        await removeGroupFromDoc(clss,clss.students)
          
       setClasses(prevClasses => prevClasses.filter(cls => cls.id === clss.id));
       setTeachers(prevTeachers =>
    prevTeachers.map(tchr =>
      tchr.id === teacher.id
        ? {
           ...formData,classes:tchr.classes.filter((cls)=>cls.id!=clss.id),groupUIDs:tchr.groupUIDs.filter((grp)=>grp!=clss.id)
          }
        : tchr
    )
  );


  setStudents(prevStudents =>
    prevStudents.map(std => {
      if (clss.students.some(st => st.id === std.id)) {
        // If the student is in studentsToRemove, update their classes
        return {
          ...std,
          classes: std.classes.filter(cls => cls.id !=clss.id),
          classesUIDs:std.classesUIDs.filter(cls => cls.id !=clss.id),
        };
      }
      return std; // Return the student as is if not in studentsToRemove
    })
  );

  
        }
      }
  
      if (updatedClasses && Array.isArray(updatedClasses)) {
        for (const classupdate of updatedClasses) {        
          console.log("Dwdqwqw",classupdate);
          
            await updateClassGroup(classupdate.id,classupdate);
          
            setClasses(prevClasses =>
              prevClasses.map(cls => {
                if (cls.id === classupdate.id) {
                  return {...classupdate};
                }
                return cls;
              })
            );
            setTeachers(prevTeachers =>
              prevTeachers.map(cls => {
                if (cls.id === teacher.id) {
                  return {
                    ...cls,
                    classes: cls.classes.map(cls =>
                      cls.id === classupdate.id ? {...classupdate } : cls
                    )
                  };
                }
                return cls;
              })
            );
            setStudents(prevStudents =>
              prevStudents.map(std => {
                if (classupdate.students.some(st => st.id === std.id)) {
                  // If the student is in studentsToRemove, update their classes
                  return {
                    ...std,
                    classes: std.classes.map(cls =>
                      cls.id === classupdate.id? {...classupdate } : cls
                    )
                  };
                }
                return std; // Return the student as is if not in studentsToRemove
              })
            );
        }
    }
  }
  const {toast}=useToast()
  const onSubmit = async(data:Teacher) => {
  const result=compareClasses(teacher.classes,data.classes)
 
  console.log(result);
  
  await processStudentChanges(result)
    const { classes, ...teacherData } = data;

  // Ensure only name, year, birthdate, and phone number are updated
  const teacherInfoToUpdate = {
    name: teacherData.name,
    year: teacherData.year,
    birthdate: teacherData.birthdate,
    phoneNumber: teacherData.phoneNumber,
    paymentType:teacherData.paymentType
  };

  toast({
    title: "Teacher Updated!",
    description: `The Teacher, ${data.name} info are updated `,
  });
  // Update the teacher in Firestore
  await updateTeacher(teacherInfoToUpdate,teacher.id);
  setTeachers((prev: Teacher[]) => 
  prev.map(t => t.id === teacher.id ? { ...t, ...teacherInfoToUpdate } : t)
);
  nextStep()
    
  };


  return (
    <>
      {hasCompletedAllSteps && (
      <div className="flex items-center justify-center">
      <div className="rounded-md bg-green-50 p-6 w-full max-w-md">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <CircleCheckIcon className="h-7 w-7 text-green-400" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-green-800">{t('teacher-edited-successfully')}</h3>
          
          </div>
        </div>
      </div>
    </div>
    
      )}
      <div className="w-full flex justify-end gap-2">
        {hasCompletedAllSteps ? (
                 <DialogFooter>
                     <DialogClose asChild>
         
          
          </DialogClose>
               </DialogFooter>
        ) : (
          <>
            <Button
              disabled={isDisabledStep}
              onClick={prevStep}
              size="sm"
              variant="secondary"
              type='button'
            >
              {t('prev')}
            </Button>
            {isLastStep?(        <LoadingButton size="sm"    loading={isSubmitting}        type={'submit'}   onClick={form.handleSubmit(onSubmit)}>
            {t('finish')}
            </LoadingButton>):(        <Button size="sm"            type={"button"}    onClick={nextStep}>
              {isLastStep ? "Finish" : isOptionalStep ? "Skip" : "Next"}
            </Button>)}
    
          </>
        )}
      </div>
    </>
  )

        }

function CheckIcon(props:any) {
          return (
            <svg
              {...props}
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          )
        }


        function CircleCheckIcon(props:any) {
          return (
            <svg
              {...props}
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          )
        }
        