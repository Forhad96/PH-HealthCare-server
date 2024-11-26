import { z } from 'zod';

const zCreateDoctorSchedule = z.object({
    body: z.object({
        scheduleIds: z.array(z.string()),
    }),
});

export const DoctorScheduleValidationSchemas = {
    zCreateDoctorSchedule,
};