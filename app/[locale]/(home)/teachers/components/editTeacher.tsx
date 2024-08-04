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
import { Key, PlusCircle } from 'lucide-react';
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
  

];
const years=[
  "1AM",
  "2AM",
  "3AM",
  "4AM",
  "1AS",
  "2AS",
  "3AS"
]
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

         


    
  </div>

) : (

  <div className="w-full h-full">
      <ScrollArea className="h-[400px]">
   <Table>
  <TableCaption>
  <Button type='button' size="sm" variant="ghost" className="gap-1 w-full" onClick={() => appendClass({ day: '', start: '', end: '', quota: 0, stream: [] })}>
      <PlusCircle className="h-3.5 w-3.5" />
      {t('add-group')}
    </Button>
  </TableCaption>
  <TableHeader>
    <TableRow>
    <TableHead>{t('day')}</TableHead>
      <TableHead>{t('start-time')}</TableHead>
      <TableHead>{t('end-time')}</TableHead>
      <TableHead>{t('room')}</TableHead>
      <TableHead>{t('field')}</TableHead>
      <TableHead>{t('year')}</TableHead>
      <TableHead>{t('action')}</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {fields.map((group, index) => (
      <TableRow key={group.id}>
        <TableCell className="font-medium">
        <FormField
                    control={form.control}
                    key={group.id}
                    name={`classes.${index}.day`}
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger
                              id={`end-${index}`}
                              aria-label={`Select day`}
                            >
                              <SelectValue placeholder={t('select-day')} />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent>
                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                              <SelectItem key={day} value={day}>
                                {t(`${day}`)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
        </TableCell>
        <TableCell className="font-medium">
        <FormField
                    control={form.control}
                    key={group.id}
                    name={`classes.${index}.start`}
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger
                              id={`end-${index}`}
                              aria-label={`Select end time`}
                            >
                              <SelectValue placeholder={t('select-end-time')} />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent>
                            {timeOptions.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
        </TableCell>
        <TableCell className="font-medium">
        <FormField
                    control={form.control}
                    key={group.id}
                    name={`classes.${index}.end`}
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger
                              id={`end-${index}`}
                              aria-label={`Select end time`}
                            >
                              <SelectValue placeholder={t('select-end-time')}/>
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent>
                            {timeOptions.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
        </TableCell>
       
        <TableCell className="font-big">
        <FormField
                    control={form.control}
                    key={group.id}
                    name={`classes.${index}.room`}
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        
                        >
                          <FormControl>
                            <SelectTrigger
                              id={`room-${index}`}
                              aria-label={`Select room`}
                            >
                              <SelectValue placeholder={t('select-room')}/>
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent>
                          {['room 1','room 2','room 3','room 4','room 5','room 6','room 7','room 8'].map((room) => (
                              <SelectItem key={room} value={room}>
                                {room}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
        </TableCell>
        <TableCell className="font-medium">
        <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline" className="ml-auto">
      {t('select-field')}<ChevronDownIcon className="ml-2 h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      {['متوسط','علوم تجريبية', 'تقني رياضي', 'رياضيات', 'تسيير واقتصاد ', 'لغات اجنبية ', 'اداب وفلسفة'].map(e => (
        <DropdownMenuItem
          key={e}
          value={e}
          className={`flex items-center ${group.stream.includes(e) ? 'selected' : ''}`}
          onClick={() => handleGroupChange(index, 'stream', e) } 
          
        >
          <span className="mr-2">{e}</span>
          {group.stream.includes(e) && <CheckIcon className="h-4 w-4 text-green-500" />}
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
</TableCell>
<TableCell>
<FormField
                    control={form.control}
                    key={group.id}
                    name={`classes.${index}.year`}
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger
                              id={`year-${index}`}
                              aria-label={`Select year`}
                            >
                              <SelectValue placeholder={t('select-year')}  />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent>
                            {watch("year").map((year:string) => (
                              <SelectItem key={year} value={year}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  </TableCell>
        <TableCell>
          <Button type="button" variant="destructive" onClick={() => removeClass(index)}>{t('remove')}</Button>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
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
// Helper function to generate a unique key for a class
function getClassKey(cls) {
  // Use a combination of properties to create a unique key
  return `${cls.classId}-${cls.group}`;
}
  function compareClasses(dataClasses: Class[], teacherClasses: Class[]): UpdateResult {
  const result: UpdateResult = {
    added: [],
    removed: [],
    updated: [],
    newAdded:[]
  };

  const dataClassMap = new Map(dataClasses.map((cls, index) => [index, { ...cls, index }]));
  const teacherClassMap = new Map(teacherClasses.map((cls, index) => [index, { ...cls, index }]));

  // Collect all existing groups to find the highest group number
  const existingGroups = new Set<string>();
  teacherClasses.forEach(cls => {

    if (cls.group && cls.group.startsWith('G')) {
      existingGroups.add(cls.group);
    }
  });

  dataClasses.forEach(cls => {
    if (cls.group && cls.group.startsWith('G')) {
      existingGroups.add(cls.group);
    }
  });

  // Determine the highest group number in use
  let highestGroupNumber = 0;
  existingGroups.forEach(group => {
    const groupNumber = parseInt(group.slice(1), 10);
    if (groupNumber > highestGroupNumber) {
      highestGroupNumber = groupNumber;
    }
  });



  // Find added and updated classes
  for (const [key, dataClass] of dataClassMap) {
     
      
    if (!('group' in dataClass)) {
      const classId = classes.find(cls => cls.teacherName === teacher.name && cls.year === dataClass.year);
    
      if (classId) {
        highestGroupNumber++;
        result.added.push({
          ...dataClass,
          classId: classId.id,
          group: `G${highestGroupNumber}`,
          subject: classId.subject
        });
        
        // Ensure that newAdded is not updated with the same dataClass
        const yearExistsInAdded = result.added.some(item => item.year === dataClass.year);
        if (!yearExistsInAdded) {
          result.newAdded.push(dataClass);
        }
      } else {
        // If no classId is found, only add to newAdded
        const yearExists = result.newAdded.some(item => item.year === dataClass.year);
        if (!yearExists) {
          result.newAdded.push(dataClass);
        }
      }
    }
    else  {
      const teacherClass = teacherClasses.find(cls => cls.group === dataClass.group && cls.year === dataClass.year);

      
      if (teacherClass) {
        const hasChanges = (
          teacherClass.start !== dataClass.start ||
          teacherClass.end !== dataClass.end ||
          teacherClass.day !== dataClass.day ||
          teacherClass.room !== dataClass.room
        );
  
        if (hasChanges) {
          // Update the database with the new values
          result.updated.push({
            ...dataClass,
            start: dataClass.start,
            end: dataClass.end,
            day: dataClass.day,
            room: dataClass.room
          });
          
        }
      }
    }
  }

  // Find removed classes
  for (const [id, teacherClass] of teacherClassMap) {
    if (!dataClassMap.has(id)) {
      // Class is in teacherClasses but not in dataClasses (removed)
      result.removed.push(teacherClass);
    }
  }

  return result;
}

  async function processStudentChanges(result,data) {
    const { added, removed, updated,newAdded } = result;
  
    // Add students to classes
    if (added && Array.isArray(added)) {
      await addGroup(added)
      for (const clss of added) {
        

        setClasses(prevClasses => 
          prevClasses.map(cls =>
            cls.id === clss.classId ? {
              ...cls,
              groups: [...cls.groups, clss] // Create a new array with the existing items plus the new one
            } : cls
          )
        );
  
  setTeachers(prevTeachers => 
    prevTeachers.map(tchr =>
  tchr.id === teacher.id ? {
  ...tchr,
  classes: [...tchr.classes, {...clss}]
  } : tchr
  )
  );
      }
    }
  
  //   // Remove students from classes
    if (removed && Array.isArray(removed)) {
      for (const clss of removed) {
        const studentsToRemove = classes
        .find(cls => cls.id === clss.classId)
        ?.students
        .filter(std => std.group === clss.group) || [];
        await removeGroupFromDoc(clss,studentsToRemove)
          
       setClasses(prevClasses => 
          prevClasses.map(cls =>
      cls.id === clss.id ? {
        ...cls,
        students: cls.students.filter(std => std.group !== clss.group),
        groups:cls.groups.filter(grp=>grp.group===clss.group)
      } : cls
    )
  );
  setTeachers(prevTeachers =>
    prevTeachers.map(tchr =>
      tchr.id === teacher.id
        ? {
           ...formData
          }
        : tchr
    )
  );


  setStudents(prevStudents =>
    prevStudents.map(std => {
      if (studentsToRemove.some(st => st.id === std.id)) {
        // If the student is in studentsToRemove, update their classes
        return {
          ...std,
          classes: std.classes.filter(cls => cls.day !== clss.day &&  cls.start !== clss.start  && cls.end !== clss.end)
        };
      }
      return std; // Return the student as is if not in studentsToRemove
    })
  );

  
        }
      }
  
      if (updated && Array.isArray(updated)) {
        for (const classupdate of updated) {        

            await updateClassGroup(classupdate.classId,classupdate.group,classupdate);
          
            setClasses(prevClasses =>
              prevClasses.map(cls => {
                if (cls.id === classupdate.classId) {
                  return {
                    ...cls,
                    groups: cls.groups.map(group =>
                      group.group === classupdate.group ? {...classupdate } : group
                    )
                  };
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
                      cls.classId === classupdate.classId && cls.group === classupdate.group ? {...classupdate } : cls
                    )
                  };
                }
                return cls;
              })
            );
            const studentsToRemove = classes
            .find(cls => cls.id === classupdate.classId)
            ?.students
            .filter(std => std.group === classupdate.group) || [];
            setStudents(prevStudents =>
              prevStudents.map(std => {
                if (studentsToRemove.some(st => st.id === std.id)) {
                  // If the student is in studentsToRemove, update their classes
                  return {
                    ...std,
                    classes: std.classes.map(cls =>
                      cls.id === classupdate.classId && cls.group === classupdate.group ? {...classupdate } : cls
                    )
                  };
                }
                return std; // Return the student as is if not in studentsToRemove
              })
            );
        }
    }
    if (newAdded && Array.isArray(newAdded)) {
      const finalResult=[]
      const groupedClasses = newAdded.reduce((acc, current) => {
        if (!acc[current.year]) {
          acc[current.year] = [];
        }
        // Add the `group` field with the value 'G' followed by the index + 1
        const index = acc[current.year].length;
        acc[current.year].push({
          ...current,
          group: `G${index + 1}`,
          quota:0,
          subject:formData['educational-subject']
        });
        return acc;
      }, {});
      for (const [year, classesArray] of Object.entries(groupedClasses)) {
        try {
//addtodatabase
 const classesReturned=await addNewClasses({groups:classesArray,students:[],subject:formData['educational-subject'],teacherName:formData.name,teacherUID:teacher.id,year:year},teacher.id)

 setClasses((prevClasses:any[])=>[...prevClasses,classesReturned])
 setTeachers(prevTeachers =>
  prevTeachers.map(tchr =>
    tchr.id === teacher.id
      ? {
          ...tchr,
          classes: [
            ...tchr.classes,
            ...classesReturned.groups.map((item, index) => ({
              ...item,
              classId: classesReturned.classId  // Add classId to each item
            }))
          ],
          groupUIDs: [
            ...tchr.groupUIDs,
            ...classesReturned.classId  // Append ids to groupUIDs
          ]
        }
      : tchr
  )
);

        } catch (error) {
          console.error(`Error writing document for year ${year}:`, error);
        }
      }
     
    }
  }
  const {toast}=useToast()
  const onSubmit = async(data:Teacher) => {
const result=compareClasses(data.classes,teacher.classes)
console.log(result);

  await processStudentChanges(result,data)
  const { classes, ...teacherData } = data;

  // Ensure only name, year, birthdate, and phone number are updated
  const teacherInfoToUpdate = {
    name: teacherData.name,
    year: teacherData.year,
    birthdate: teacherData.birthdate,
    phoneNumber: teacherData.phoneNumber,
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
        
