import { Router } from "express";
import auth from "../../middlewares/auth";
import { DoctorScheduleControllers } from "./doctorSchedule.controller";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { DoctorScheduleValidationSchemas } from "./doctor.validation";

const router = Router();

router.get(
  "/my-schedule",
  auth(UserRole.DOCTOR),
  DoctorScheduleControllers.getMySchedule
);

router.post(
  "/",
  auth(UserRole.DOCTOR),
  validateRequest(DoctorScheduleValidationSchemas.zCreateDoctorSchedule),
  DoctorScheduleControllers.insertIntoDB
);

router.delete(
  "/:scheduleId",
  auth(UserRole.DOCTOR),
  DoctorScheduleControllers.deleteFromDB
);

export const DoctorScheduleRoutes = router;
