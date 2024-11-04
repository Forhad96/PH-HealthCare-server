import { PrismaClient } from "@prisma/client";
import { Request, Response, Router } from "express";
import { AdminController } from "./admin.controller";

const prisma =  new PrismaClient()

const router = Router()

router.get('/',AdminController.getAllAdminHandler)

export const AdminRoutes = router;