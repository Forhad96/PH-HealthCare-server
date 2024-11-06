import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { AdminController } from "./admin.controller";

const prisma = new PrismaClient();

const router = Router();

router.get("/", AdminController.getAllFromDB);

router.get("/:id", AdminController.getByIdFromDB);

router.patch("/:id", AdminController.updateIntoDB);

router.delete("/:id",AdminController.deleteFromDB)

export const AdminRoutes = router;
