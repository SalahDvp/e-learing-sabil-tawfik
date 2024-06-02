
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm } from "react-hook-form"
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

  } from "@/components/ui/sheet";

  import { ScrollArea } from "@/components/ui/scroll-area";
import classSchema from "@/validators/classSchema"
import { useToast } from "@/components/ui/use-toast"
import * as React from "react"
import { MultiSelect } from "./multiselect"
import { LoadingButton } from "@/components/ui/loadingButton"
import { useData } from "@/context/admin/fetchDataContext"
import { updateClass, updateStudents, updateTeachers } from "@/lib/hooks/classes"
import { useTranslations } from "next-intl"
import { fetchLessons, updateDocuments } from "@/lib/hooks/uploadLessons"
import FileUpload from "./upload-lessons"

interface FileUploadProgress {
  file: File;
  name: string;
  source:any;
  subject:string;
} 
type ClassFormValues = z.infer<typeof classSchema> & { [key: string]: string | Date | number | any;};
interface SheetDemoProps {
    cls: ClassFormValues;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    open: boolean; 
}
const EditClassForm: React.FC<SheetDemoProps> = ({ cls,setOpen,open }) => {
  const t=useTranslations()
  const form = useForm<any>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      "name": "Math Class",
      "level": "Elementary",
      "className": "Mathematics",
      "capacity": 30,
      "teachers": [
        {
          "name": "John Doe",
          "id": "123"
        },
        {
          "name": "Jane Smith",
          "id": "456"
        }
      ],
      "mainTeacher": {
        "name": "SALAH EDDINE  SAID",
        "id": "CY0m1u7BhHmgzxJLhC1W"
    },
      "students": [
        {
          "name": "Alice",
          "id": "001"
        },
        {
          "name": "Bob",
          "id": "002"
        }
      ]
    }
  })
const{levels,teachers,students,setClasses,setStudents,setTeachers,profile}=useData()
const allTeachers=teachers.map((teacher:any)=>({name:teacher.teacher,id:teacher.id}))
  const allStudents=students.map((student:any)=>({name:student.student,id:student.id}))
const {toast}=useToast()
const { reset,formState,watch} = form;
const {isSubmitting}=formState
const [filesToUpload, setFilesToUpload] = React.useState<FileUploadProgress[]>([]);

const [selectedTeachers, setSelectedTeachers] = React.useState<({ name: string; id: string; }|undefined)[]>(form.getValues('teachers'));
const selectedLevel = watch('level');
const selectedClass = watch('className');
console.log(selectedLevel);

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
}, [selectedLevelId, levels]);React.useEffect(() => {
  reset(cls)
}, [cls,reset])
React.useEffect(() => {
  const downloadFiles = async () => {
    if (cls && cls.documents) {
      const files=await fetchLessons(cls.documents)
      console.log("files",files);
      
      setFilesToUpload(files);
    }
  };

  if (cls) {

   
    reset(cls)

    downloadFiles();
  }
}, [cls,reset])
React.useEffect(() => {

  const subscription =  watch((value:any) => {setSelectedTeachers(value.teachers)});
  return () => subscription.unsubscribe();
}, [watch]);


async function onSubmit(values:ClassFormValues) {
  const { value, label, ...updatedData } = values;
 const levelData=levels.find((level:any)=>level.id===values.level.id)

  await updateClass(updatedData,cls.id)
  const updatedStudents= await updateStudents(cls.students,values.students,{...cls,level:levelData})
  const updatedTeachers= await updateTeachers(cls.teachers,values.teachers,cls)
    const documents= await updateDocuments(cls.documents && cls.documents> 0?cls.documents:[],filesToUpload,cls.level,cls.className,cls.id)

updatedStudents.added.map((student)=>{
  setStudents((prev:any[]) => {
    const updatedLevels = prev.map((std:any) =>
      std.id === student.id ? { ...std,
        class:values.className}: std
    );
    return updatedLevels;
  });
})
updatedStudents.deleted.map((student)=>{
  setStudents((prev:any[]) => {
    const updatedLevels = prev.map((std:any) =>
      std.id === student.id ? { ...std,
        class:null}: std
    );
    return updatedLevels;
  });
})
updatedTeachers.added.forEach((teacher) => {

  setTeachers((prev:any[]) => {
      const updatedLevels = prev.map((std:any) =>
        std.id === teacher.id ? { ...std,
          class: {
              name: values.className,
              id: values.id
          }
      }: std
      );
      return updatedLevels;
    });
  });
  updatedTeachers.deleted.forEach((teacher) => {

    setTeachers((prev:any[]) => {
        const updatedLevels = prev.map((std:any) =>
          std.id === teacher.id ? { ...std,
            class:null
        }: std
        );
        return updatedLevels;
      });
    });

    setClasses((prev:any[]) => {
      const updatedLevels = prev.map((std:any) =>
        std.id === values.id ? {...updatedData,documents}: std
      );
      return updatedLevels;
    });
  toast({
        title: t('changes-applied-0'),
        description: t('changes-applied-successfully'),
      });
      

  }
  return (
    <Sheet open={open} onOpenChange={setOpen}>


    <SheetContent className="sm:max-w-[850px]">
    <ScrollArea className="h-screen  ">

      <SheetHeader>
        <SheetTitle>{t('edit-class')}</SheetTitle>
        <SheetDescription>
          {t('enter-the-details-for-the-class-including-information-and-subjects-of-study')} </SheetDescription>
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
                          defaultValue={field.value.toString()}
                  onValueChange={(value) => {
                    const level=levels.find((lvl:any)=>lvl.level===value)
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
                              <SelectItem key={index} value={level.level}>
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

export default EditClassForm
