import { ZodSchema, string, z } from 'zod';
import levelSchema from './level'
import classSchema from './classSchema'
import studentRegistrationSchema from './auth';
const today = new Date();
type LevelFormValues = z.infer<typeof levelSchema>
type ClassSchema = z.infer<typeof classSchema>
type StudentFormValues=z.infer<typeof studentRegistrationSchema>
export const studentPaymentSchema: ZodSchema<{
  nextPaymentDate:Date;
  amountLeftToPay:number;
  paymentTitle: string;
  paymentAmount: number;
  paymentDate: Date;
  fromWho: string;
  //student:string;
  //level:string;             
  class:string;
  status: string;
  description:string;
}> = z.object({
  nextPaymentDate:z.date(),
  amountLeftToPay:z.number(),
  paymentTitle: z.string().min(2, 'Please enter a value between 2 and 50 characters.').max(50, 'Please enter a value between 2 and 50 characters.'),
  paymentAmount: z.number().min(2, 'Please enter a value greater than 2.').max(50000000, 'Please enter a value less than or equal to 50000.'),
  paymentDate: z.date().refine((value: Date) => value < new Date(), { message: 'Please enter a valid date.' }),
  typeofTransaction: z.string(),
  fromWho: z.string(),
  //student:z.string(),  
  //level: z.string(),
  class: z.string(),
  status: z.string().min(2, 'Please enter a value between 2 and 50 characters.').max(50, 'Please enter a value between 2 and 50 characters.'), 
  description: z.string().min(2, 'Please enter a value between 2 and 50 characters.').max(50, 'Please enter a value between 2 and 50 characters.'), 

})