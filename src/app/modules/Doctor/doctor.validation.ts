import { z } from 'zod';

const zCreateDoctor = z.object({
    body: z.object({
        email: z.string({
            required_error: 'Email is required',
        }),
        name: z.string({
            required_error: 'Name is required',
        }),
        profilePhoto: z.string({
            required_error: 'Profile Photo is required',
        }),
        contactNumber: z.string({
            required_error: 'Contact Number is required',
        }),
        registrationNumber: z.string({
            required_error: 'Registration Number is required',
        }),
        experience: z.number({
            required_error: 'Experience is required',
        }),
        gender: z.string({
            required_error: 'Gender is required',
        }),
        anointmentFee: z.number({
            required_error: 'Blood group is required',
        }),
        qualification: z.string({
            required_error: 'Anointment Fee is required',
        }),
        currentWorkingPlace: z.string({
            required_error: 'Current Working Place is required',
        }),
        designation: z.string({
            required_error: 'Designation is required',
        }),
    }),
});

const zUpdateDoctor = z.object({
    body: z.object({
        name: z.string().optional(),
        profilePhoto: z.string().optional(),
        contactNumber: z.string().optional(),
        registrationNumber: z.string().optional(),
        experience: z.number().optional(),
        gender: z.string().optional(),
        anointmentFee: z.number().optional(),
        qualification: z.string().optional(),
        currentWorkingPlace: z.string().optional(),
        designation: z.string().optional(),
    }),
});

export const DoctorValidationSchemas = {
    zCreateDoctor,
    zUpdateDoctor
};