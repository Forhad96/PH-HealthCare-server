import {Router } from "express";
import { userController } from "./user.controller";

import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();



router.post(
  "/",
  auth(UserRole.ADMIN,UserRole.SUPER_ADMIN),
  userController.createAdminHandle
);

export const UserRoutes = router;
