import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { ScheduleServices } from "./schedule.service";
import httpStatus from 'http-status';
import pick from "../../../shared/pick";
import { IAuthUser } from "../../interfaces/common";
const createSchedule = catchAsync(async (req: Request, res: Response) => {
  const result = await ScheduleServices.createSchedule(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor Schedule created successfully",
    data: result,
  });
});




const getAllFromDB = catchAsync(async (req: Request & { user?: IAuthUser }, res: Response) => {
  const filters = pick(req.query, ['startDate', 'endDate']);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

  const user = req.user;
  const result = await ScheduleServices.getAllFromDB(filters, options, user as IAuthUser);

  sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Schedule fetched successfully!",
      data: result
  });
});
export const ScheduleControllers = {
  createSchedule,
  getAllFromDB,
};
