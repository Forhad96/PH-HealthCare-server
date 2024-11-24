import { Router } from "express";
import { ScheduleControllers } from "./schedule.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router()

router.get("/",auth(UserRole.ADMIN,UserRole.SUPER_ADMIN,UserRole.DOCTOR,UserRole.PATIENT),ScheduleControllers.getAllFromDB)
router.post('/',ScheduleControllers.createSchedule)

export const ScheduleRoutes = router