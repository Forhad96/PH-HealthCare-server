import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { DoctorScheduleServices } from "./doctorSchedule.service";

const insertIntoDB  = catchAsync(async (req: Request & {user?:any}, res: Response) => {
    const user = req?.user
  const result = await DoctorScheduleServices.insertIntoDB(user,req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Schedule created successfully",
    data: result,
  });
});


export const DoctorScheduleControllers= {
    insertIntoDB
}