import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { DoctorScheduleServices } from "./doctorSchedule.service";
import pick from "../../../shared/pick";
import { IAuthUser } from "../../interfaces/common";
import httpStatus from 'http-status'
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
const getMySchedule = catchAsync(async (req: Request & { user?: IAuthUser }, res: Response) => {
  const filters = pick(req.query, ['startDate', 'endDate','isBooked']);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

  const user = req.user;
  const result = await DoctorScheduleServices.getMySchedule(filters, options, user as IAuthUser);

  sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "My schedule retrieves successfully!",
      data: result
  });
});
const deleteFromDB = catchAsync(async (req: Request & { user?: IAuthUser }, res: Response) => {

const {scheduleId} = req.params
  const user = req.user;
  const result = await DoctorScheduleServices.deleteFromDB(user as IAuthUser ,scheduleId);

  sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "My Schedule deleted successfully!",
      data: result
  });
});

export const DoctorScheduleControllers= {
    insertIntoDB,
    getMySchedule,
    deleteFromDB,
}