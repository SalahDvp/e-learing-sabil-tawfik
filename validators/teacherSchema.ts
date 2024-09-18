import { z } from 'zod';
import { parseISO, isBefore, startOfToday, startOfYear } from 'date-fns';

const GroupSchema = z.array(
  z.object({
    day: z.string(),
    end: z.string(),
    room: z.string(),
    start: z.string(),
  })
);
const ClassesUIDsSchema = z.array(z.object({
  id: z.string(),
  group: z.string(),
}));

export const SubjectsSchema = z.array(
  
  z.object({
    active: z.boolean().optional(),
    amount: z.number().min(1),
    group: z.string().min(1),
    groups: GroupSchema, // Referencing the GroupSchema
    name: z.string().min(1),
    numberOfSessions:z.number().min(0),
    paymentType:z.string().min(1),
    startDate:z.date().optional(),
    stream:z.array(z.string().min(1)),
    year:z.string().min(1),
  }),
);

const ActionTrackSchema = 
  z.object({
    action: z.string().optional(),
    additionalInfo: z.object({
      classId: z.string().optional(),
      studentID: z.string().optional(),
      studentName: z.string().optional(),
      resourceId: z.string().optional(),
      resourceType: z.string().optional(),
      birthdate: z.date().optional(),
      birthplace: z.string().optional(),
    }),
    timestamp: z.string().optional(),
    userId: z.string().optional(),
    userType: z.string().optional(),
  });

// Define the StudentSchema
export const teacherRegistrationSchema = z.object({
  actionTrack: z.array(ActionTrackSchema).optional(),// Referencing the ActionTrackSchema
  advancePayment: z.array().optional(),
  amount:z.number(),
  birthdate:z.date().refine((value: Date) => value < new Date(), {
    message: '',
  }), 
  classes: SubjectsSchema,
  [`educational-subject`]: z.string(),
  name: z.string().min(1),
  paymentType: z.string().min(1),
  phoneNumber: z.string().min(10).max(15),
  salaryDate:  z.date().optional(),
  totalAdvancePayment:z.number(),
  year: z.array(z.string().min(1)).min(1)
});

// Generate TypeScript type from the Zod schema
export type Teacher = z.infer<typeof teacherRegistrationSchema>;



/**
 * 
  debt: z.number( { message: 'Name is required' }),
 
  lastPaymentDate: z.date( { message: 'Name is required' }),
  monthlypayment: z.number( { message: 'Name is required' }),
  nextPaymentDate: z.date( { message: 'Name is required' }),
  totalAmount: z.number( { message: 'Name is required' }),
  newId:z.string().optional(),


classes

      nextPaymentDate: z.date(),

 */
