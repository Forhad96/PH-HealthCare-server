import { Router } from "express";
import { userController } from "./user.controller";

const router = Router()


router.post('/',userController.createAdminHandle)


export const UserRoutes = router