'use server'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/firebase/firebase-config'
const getTeachersData=async()=>{
  const getTeachersRef=await getDocs(collection(db,'Teachers'))
  const teachersData=getTeachersRef.docs.map((data)=>({
    ...data.data(),
    id:data.id,
    dateOfBirth:new Date(data.data().dateOfBirth.toDate()),
       joiningDate:new Date(data.data().joiningDate.toDate()),
       teacher: `${data.data().firstName} ${data.data().lastName}`,
       value: `${data.data().firstName} ${data.data().lastName}`,
       label: `${data.data().firstName} ${data.data().lastName}`,
  }))
  return teachersData;
}
export async function getTeachers() {
  const teachers=await getTeachersData()
  return teachers

  }