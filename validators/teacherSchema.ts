import { ZodSchema, z } from 'zod';

export const teacherRegistrationSchema: ZodSchema<{
  id:string;
  year: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  joiningDate:Date;
  gender: 'male' | 'female' | 'other' | string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  teacherEmail: string;
  teacherPhone: string;
  teacherSubject: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  medicalConditions: string | null;
  salary: number| null;
  status:string;
  officeHours:{day:string;start:string;end:string}[]

}> = z.object({
  id: z.string(),
  year: z.string().min(2, 'Please enter a value between 2 and 10 characters.').max(10, 'Please enter a value between 2 and 10 characters.'),
  firstName: z.string().min(2, 'Please enter a value between 2 and 50 characters.').max(50, 'Please enter a value between 2 and 50 characters.'),
  lastName: z.string().min(2, 'Please enter a value between 2 and 50 characters.').max(50, 'Please enter a value between 2 and 50 characters.'),
  dateOfBirth: z.date().refine((value:Date) => value < new Date(), { message: 'Please enter a valid date of birth.' }),
  joiningDate: z.date().refine((valuee:Date) => valuee < new Date(), { message: 'Please enter a valid date of birth.' }),
  gender: z.enum(['male', 'female', 'other'])||z.string(),
  salary: z.number().min(0, 'Enter a valid value for salary').nullable(),
  address: z.string().min(5, 'Please enter a value between 5 and 255 characters.').max(255, 'Please enter a value between 5 and 255 characters.'),
  city: z.string().min(2, 'Please enter a value between 2 and 50 characters.').max(50, 'Please enter a value between 2 and 50 characters.'),
  state: z.string().min(2, 'Please enter a value between 2 and 50 characters.').max(50, 'Please enter a value between 2 and 50 characters.'),
  postalCode: z.string().length(5, 'Please enter a 5-character postal code.'),
  country: z.string().min(2, 'Please enter a value between 2 and 50 characters.').max(50, 'Please enter a value between 2 and 50 characters.'),
  teacherSubject: z.string().min(2, 'Please enter a value between 2 and 50 characters.').max(50, 'Please enter a value between 2 and 50 characters.'),
  teacherEmail: z.string().email('Please enter a valid email address.'),
  teacherPhone: z.string().min(10, 'Please enter a value between 10 and 15 characters.').max(15, 'Please enter a value between 10 and 15 characters.'),
  emergencyContactName: z.string().min(2, 'Please enter a value between 2 and 50 characters.').max(50, 'Please enter a value between 2 and 50 characters.'),
  emergencyContactPhone: z.string().min(10, 'Please enter a value between 10 and 15 characters.').max(15, 'Please enter a value between 10 and 15 characters.'),
  medicalConditions: z.string().max(255).nullable(),
  status: z.enum(['active', 'suspended', 'expelled'])||z.string(),
  officeHours:z.array(z.object({day:z.string(),start:z.string(),end:z.string()}))
});