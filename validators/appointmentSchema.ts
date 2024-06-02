import { z } from 'zod';

export const appointmentSchema = z.object({
  date: z.date(),
  duration: z.number(),
  slot: z.string(),
  slotEnd: z.date(),
  slotStart: z.date(),
  teacher: z.string(),
  teacherId: z.string(),
});
export type AppointmentSchemaType = z.infer<typeof appointmentSchema>;