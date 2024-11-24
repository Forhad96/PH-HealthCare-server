import { Router } from "express";
import auth from "../../middlewares/auth";
import { DoctorScheduleControllers } from "./doctorSchedule.controller";
import { UserRole } from "@prisma/client";

const router = Router();
router.post(
  "/",
  auth(UserRole.DOCTOR),
  // validateRequest(DoctorScheduleValidation.create),
  DoctorScheduleControllers.insertIntoDB
);

export const DoctorScheduleRoutes = router;
