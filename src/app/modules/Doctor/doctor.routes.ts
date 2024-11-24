import express from 'express'

import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import { DoctorController } from './doctor.controller';
import validateRequest from '../../middlewares/validateRequest';
import { DoctorValidationSchemas } from './doctor.validation';


const router = express.Router();

// task 3
router.get('/', DoctorController.getAllFromDB);

//task 4
router.get('/:id', DoctorController.getByIdFromDB);

router.patch(
    '/:id',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR),
    validateRequest(DoctorValidationSchemas.zUpdateDoctor),
    DoctorController.updateIntoDB
);

//task 5
router.delete(
    '/:id',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    DoctorController.deleteFromDB
);

// task 6
router.delete(
    '/soft/:id',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    DoctorController.softDelete);

export const DoctorRoutes = router