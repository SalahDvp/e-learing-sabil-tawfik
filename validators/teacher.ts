import { z } from 'zod';
const TimeSchema = z.object({
    day: z.string().min(1, { message: "Day is required" }), // e.g., Monday, Tuesday
    start: z.string().regex(/^([01]\d|2[0-3]):?([0-5]\d)$/, { message: "Invalid start time format" }), // e.g., 14:00
    end: z.string().regex(/^([01]\d|2[0-3]):?([0-5]\d)$/, { message: "Invalid end time format" }) // e.g., 16:00
  });
  
  export const SubjectsSchema = z.array(z.object({
    room: z.string(),
    year: z.string().min(1, { message: "Year is required" }),
    subject: z.string().min(1, { message: "Subject is required" }),
    name: z.string().min(1, { message: "Group name is required" }),
    time: TimeSchema,
    stream: z.array(z.string().min(1, { message: "Field is required" })),
    quota: z.number().min(1, { message: "Quota is required" })
  }));
// Define the Zod schema
export const TeacherSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  birthdate: z.date(),
  year: z.string().min(1, { message: "Year is required" }),
  phoneNumber: z.string().min(1, { message: "Phone number is required" }),
  classes:SubjectsSchema,
  [`educational-subject`]:z.string()
});

// Generate TypeScript type from the Zod schema
export type Teacher = z.infer<typeof TeacherSchema>;