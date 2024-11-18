import { Request, Response } from "express";
import { userServices } from "./user.service";
import catchAsync from "../../../shared/catchAsync";
import httpStatus from 'http-status';
const createAdmin =catchAsync( async (req: Request, res: Response) => {

    const result = await userServices.createAdmin(req);
    res.status(httpStatus.OK).json({
      success: true,
      message: "Admin created successfully",
      data: result,
    });
})
const createDoctor =catchAsync( async (req: Request, res: Response) => {

    const result = await userServices.createDoctor(req);
    res.status(httpStatus.OK).json({
      success: true,
      message: "Doctor created successfully",
      data: result,
    });
})
const createPatient =catchAsync( async (req: Request, res: Response) => {

    const result = await userServices.createPatient(req);
    res.status(httpStatus.OK).json({
      success: true,
      message: "Patient created successfully",
      data: result,
    });
})

export const userController = {
  createAdmin,
  createDoctor,
  createPatient,
};
