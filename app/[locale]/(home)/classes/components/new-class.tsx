
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import {PlusCircle } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet";

  import { ScrollArea } from "@/components/ui/scroll-area";
import classSchema from "@/validators/classSchema"
import { useToast } from "@/components/ui/use-toast"
import * as React from "react"
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"

import { MultiSelect } from "./multiselect"
import { LoadingButton } from "@/components/ui/loadingButton"
import { useData } from "@/context/admin/fetchDataContext"
import { addClass } from "@/lib/hooks/classes"
import { useTranslations } from "next-intl"
import FileUpload from "./upload-lessons"
import { uploadLessonsAndLinkToCollection } from "@/lib/hooks/uploadLessons"



interface FileUploadProgress {
  file: File;
  name: string;
  source:any;
  subject:string;
} 
export type ClassFormValues = z.infer<typeof classSchema>;
export function ClassForm() {
  const{levels,teachers,students,setClasses,setStudents,setTeachers,profile}=useData()
  const allTeachers=teachers.map((teacher:any)=>({name:teacher.teacher,id:teacher.id}))

  const form = useForm<ClassFormValues>({
    resolver: zodResolver(classSchema),
    defaultValues: {
        teachers: [],
        students: [],
  
},
  })
const t=useTranslations()
const {toast}=useToast()
const { reset, formState,watch} = form;
const {isSubmitting}=formState
const [selectedTeachers, setSelectedTeachers] = React.useState<({ name: string; id: string; }|undefined)[]>(form.getValues('teachers'));
const [filesToUpload, setFilesToUpload] = React.useState<FileUploadProgress[]>([]);

React.useEffect(() => {

  const subscription =  watch((value:any) => {console.log(value);
   setSelectedTeachers(value.teachers)});
  return () => subscription.unsubscribe();
}, [watch]);

const selectedLevel = watch('level');
const selectedClass = watch('className');

// Memoize the filtered students based on the selected level and class
const filteredStudents = React.useMemo(() => {
  return students
      .filter((student:any) => 
        student.level === selectedLevel && student.class === selectedClass
      )
      .map((student:any) => ({
        id: student.id,
        name: student.student
      }));
  }, [selectedLevel, selectedClass]);


// Update the students field whenever the selected level or class changes
React.useEffect(() => {
  form.setValue('students', filteredStudents);
}, [selectedLevel,selectedClass]);
const selectedLevelId = watch('levelId');

// Memoize the classes array for the selected level
const classes = React.useMemo(() => {
  const level = levels.find((level:any) => level.id === selectedLevelId);
  return level ? level.classes : [];
}, [selectedLevelId, levels]);

async function onSubmit(values:ClassFormValues) {
  const classRef:any=await addClass({...values,documents:[]})
  const uploaded = await uploadLessonsAndLinkToCollection(values.level, values.className,classRef,filesToUpload);
  setClasses((prev:ClassFormValues[])=>[{...values,id:classRef,
    value:values.className,
    label:values.className,
    level:{level:values.level.level,id:values.level.id},
    levelName:values.level.level,documents:uploaded},...prev])
    values.students.forEach((student) => {

    setStudents((prev:any[]) => {
                const updatedLevels = prev.map((std:any) =>
                  std.id === student.id ? { ...std,
                    class:{name:values.className,id:classRef}}: std
                );
                return updatedLevels;
              });
            });
            values.teachers.forEach((teacher) => {

            setTeachers((prev:any[]) => {
                const updatedLevels = prev.map((std:any) =>
                  std.id === teacher.id ? { ...std,
                    class: {
                        name: values.className,
                        id: classRef
                    }
                }: std
                );
                return updatedLevels;
              });
            });
    toast({
        title: t('changes-applied-1'),
        description: t(`changes-applied-successfully`),
      });
        reset()

  }
  return (
    <Sheet>
    <SheetTrigger asChild>
      <Button className="gap-1">
        
      <PlusCircle className="h-3.5 w-3.5" /> {t('add-class')}</Button>
    </SheetTrigger>
    <SheetContent className="sm:max-w-[850px]">
    <ScrollArea className="h-screen  ">

      <SheetHeader>
        <SheetTitle>{t('add-new-class')}</SheetTitle>
        <SheetDescription>
          {t('enter-the-details-for-the-new-class-including-information-and-subjects-of-study')} </SheetDescription>
      </SheetHeader>
    <Form {...form}>
      <form  onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Name')}</FormLabel>
                  <FormControl>
                    <Input  placeholder="username" {...field} />
                  </FormControl>
                  <FormDescription>
                    
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
                              <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('class-level')}</FormLabel>
                  <FormControl>
                  <Select
      
                  onValueChange={(value) => {
                   console.log(JSON.parse(value));
                   
                    const parsedValue = JSON.parse(value);
                    const level=parsedValue
                    field.onChange(level.level);
                    form.setValue('levelId',level.id)
                  }}
          
                        >
                          <FormControl>
                            <SelectTrigger
                              id={`level`}
                              aria-label={`Select level`}
                            >
                              <SelectValue placeholder={t('select-level')} />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent>
                            {levels.map((level:any,index:number) => (
                              <SelectItem key={index} value={JSON.stringify(level)}>
                                {level.level}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                  </FormControl>
                  <FormDescription>
                    
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
                      <FormField
              control={form.control}
              name="className"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('class')} </FormLabel>
                  <FormControl>
                  <Select
                      onValueChange={field.onChange}
                        value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger
                              id={`className`}
                              aria-label={`Select class`}
                            >
                              <SelectValue placeholder={t('select-class')} />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent>
                            {classes.map((cls:string) => (
                              <SelectItem key={cls} value={cls}>
                                {cls}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                  </FormControl>
                  <FormDescription>
                    
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('capacity')}</FormLabel>
                  <FormControl>
                  <Input {...field} placeholder={t('enter-capacity-of-class')}  type="number"  onChange={event => field.onChange(+event.target.value)}/>
                  </FormControl>
                  <FormDescription>
                    
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
<FormField
    control={form.control}
    name="teachers"
    render={({ field }) => (
        <FormItem>
            <FormLabel>{t('select-teachers')}</FormLabel>
                <MultiSelect
                    selected={field.value}
                 options={allTeachers}
                    {...field}
                    className="sm:w-[510px]"
                />
            <FormMessage />
        </FormItem>
    )}
 />
                         <FormField
              control={form.control}
              name="mainTeacher"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('main-teacher')}</FormLabel>
                  <FormControl>
                  <Select
      
                  onValueChange={(value) => {
                   console.log(value);
                   
                    const parsedValue = JSON.parse(value);
                    const mainteacher={name:parsedValue.name,id:parsedValue.id}
                    field.onChange(mainteacher);
                  }}
     
                        >
                          <FormControl>
                            <SelectTrigger
                              id={`mainTeacher`}
                              aria-label={`Select Main Teacher`}
                            >
                              <SelectValue placeholder={t('select-main-teacher')} />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent>
                            {selectedTeachers.map((teacher,index) => (
                              <SelectItem key={index} value={JSON.stringify(teacher)}>
                                {teacher && teacher.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                  </FormControl>
                  <FormDescription>
                    
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
    control={form.control}
    name="students"
    render={({ field }) => (
        <FormItem>
            <FormLabel>{t('add-students')}</FormLabel>
                <MultiSelect
                    selected={field.value}
                 options={filteredStudents}
                    {...field}
                    className="sm:w-[510px]"
                />
            <FormMessage />
        </FormItem>
    )}
 />
    <FileUpload filesToUpload={filesToUpload} setFilesToUpload={setFilesToUpload}/>
         
<SheetFooter className=" pb-20">
            <SheetClose asChild>
              
              <LoadingButton
                loading={isSubmitting}
                type="submit"
    
              >
                  {t('save-changes')} </LoadingButton>
              </SheetClose>
              </SheetFooter>
      </form>
    </Form>

    </ScrollArea>
    </SheetContent>
  </Sheet>
  )
}
