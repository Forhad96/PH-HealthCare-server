import { NextFunction, Request, Response, Router } from "express";
import { userController } from "./user.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { fileUploader } from "../../../helpers/fileUploader";
import { z } from "zod";
import { UserValidationSchemas } from "./user.validation";
import validateRequest from "../../middlewares/validateRequeast";
const router = Router();


router.get("/", auth(UserRole.ADMIN,UserRole.SUPER_ADMIN) ,userController.getAllFromDB);

router.post(
  "/create-admin",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
  
    req.body = UserValidationSchemas.zCreateAdmin.parse(
      JSON.parse(req.body.data)
    );
    return userController.createAdmin(req, res, next);
  }
);
router.post(
  "/create-doctor",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {

    req.body = UserValidationSchemas.zCreateDoctor.parse(
      JSON.parse(req.body.data)
    );
    return userController.createDoctor(req, res, next);
  }
);
router.post(
  "/create-patient",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {

    req.body = UserValidationSchemas.zCreatePatient.parse(
      JSON.parse(req.body.data)
    );
    return userController.createPatient(req, res, next);
  }
);
router.patch(
  '/:id/status',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(UserValidationSchemas.zUpdateStatus),
  userController.changeProfileStatus
)
export const UserRoutes = router;
