import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { IAuthUser } from "../../interfaces/common";
import { AppointmentServices } from "./appointment.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";

const createAppointment = catchAsync(
  async (req: Request & { user?: IAuthUser }, res: Response) => {
    const { user } = req;
    const result = await AppointmentServices.createAppointment(
      user as IAuthUser,
      req.body
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Appointment created successfully",
      data: result,
    });
  }
);

export const AppointmentController = {
  createAppointment,
};
