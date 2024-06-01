import { db } from "@/firebase/firebase-config";
import { collection,addDoc } from "firebase/firestore";

export interface Appointment {
    date: Date;
    duration: number;
    parent: string;
    parentId: string;
    slot: string;
    end: Date;
    start: Date;
    student: string;
    studentId: string;
    teacher: string;
    teacherId: string;
    meetLink: string | null
  }

export const addAppointment = async (appointment: Appointment): Promise<string | null> => {
    try {
      const appointmentsCol = collection(db, 'Appointments');
      const docRef = await addDoc(appointmentsCol, appointment);
      console.log('Appointment added with ID: ', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error adding appointment: ', error);
      return null;
    }
  };