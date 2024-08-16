import { z } from 'zod';
import { parseISO, isBefore, startOfToday, startOfYear } from 'date-fns';
export const SubjectsSchema = z.array(z.object({
  id:z.string(),
  subject: z.string().min(1, { message: "Subject is required" }),
  name: z.string().min(1, { message: "Group name is required" }),
  time: z.string().min(1, { message: "Time is required" }),
  cs:z.string(),
  index:z.number(),
  group:z.string(),
  day: z.string().min(1, { message: "Day is required" }), // e.g., Monday, Tuesday
  start: z.string().regex(/^([01]\d|2[0-3]):?([0-5]\d)$/, { message: "Invalid start time format" }), // e.g., 14:00
  end: z.string().regex(/^([01]\d|2[0-3]):?([0-5]\d)$/, { message: "Invalid end time format" }) // e.g., 16:00
}));
// Define the Zod schema
export const StudentSchema = z.object({
  id:z.string(),
  name: z.string().min(1, { message: "Name is required" }),
  birthdate: z.date().refine((value:Date) => value < new Date(), { message: 'Please enter a valid date of birth.' }),
  birthplace: z.string().min(1, { message: "Birthplace is required" }),
  school: z.string().min(1, { message: "School is required" }),
  year: z.string().min(1, { message: "Year is required" }),
  field: z.string().min(1, { message: "Field is required" }),
  phoneNumber:z.string().min(10, "Please enter a value between 10 and 15 characters.").max(15, "Please enter a value between 10 and 15 characters."),
  photo:z.string().nullable(),
  classes:SubjectsSchema,
  studentIndex:z.number(),
  classesUIDs:z.array(z.object({id:z.string(),group:z.string()}))
});

// Generate TypeScript type from the Zod schema
export type Student = z.infer<typeof StudentSchema>;

