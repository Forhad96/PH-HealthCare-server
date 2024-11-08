import { Router } from "express";
import { AdminController } from "./admin.controller";
import validateRequest from "../../middlewares/validateRequeast";
import { adminValidationSchemas } from "./admin.validation";

const router = Router();

router.get("/", AdminController.getAllFromDB);

router.get("/:id", AdminController.getByIdFromDB);

router.patch(
  "/:id",
  validateRequest(adminValidationSchemas.zUpdateSchema),
  AdminController.updateIntoDB
);

router.delete("/:id", AdminController.deleteFromDB);

router.delete("/soft/:id", AdminController.softDeleteFromDB);

export const AdminRoutes = router;
