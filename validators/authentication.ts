import { ZodSchema, z } from 'zod';

export const authenticationschema: ZodSchema<{
    email: string;
    password: string;
}> = z.object({
    email: z.string({ required_error: "Please enter a valid email address." }).email(),
    password: z.string().min(8, 'Password must be at least 8 characters long.'),
});
