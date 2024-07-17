import { z } from 'zod';
export const SubjectsSchema = z.array(z.object({
  id:z.string(),
  subject: z.string().min(1, { message: "Subject is required" }),
  name: z.string().min(1, { message: "Group name is required" }),
  time: z.string().min(1, { message: "Time is required" }),
}));
// Define the Zod schema
export const StudentSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  birthdate: z.date(),
  birthplace: z.string().min(1, { message: "Birthplace is required" }),
  school: z.string().min(1, { message: "School is required" }),
  year: z.string().min(1, { message: "Year is required" }),
  field: z.string().min(1, { message: "Field is required" }),
  phoneNumber: z.string().min(1, { message: "Phone number is required" }),
  photo:z.string().nullable(),
  classes:SubjectsSchema,
});

// Generate TypeScript type from the Zod schema
export type Student = z.infer<typeof StudentSchema>;

