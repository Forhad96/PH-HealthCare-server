import { Request, Response } from "express";
import { userServices } from "./user.service";
import catchAsync from "../../../shared/catchAsync";
import httpStatus from "http-status";
import pick from "../../../shared/pick";
import { userSearchAbleFields } from "./user.constant";
import sendResponse from "../../../shared/sendResponse";
const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.createAdmin(req);
  res.status(httpStatus.OK).json({
    success: true,
    message: "Admin created successfully",
    data: result,
  });
});
const createDoctor = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.createDoctor(req);
  res.status(httpStatus.OK).json({
    success: true,
    message: "Doctor created successfully",
    data: result,
  });
});
const createPatient = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.createPatient(req);
  res.status(httpStatus.OK).json({
    success: true,
    message: "Patient created successfully",
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req, res) => {
  const filterData = pick(req.query, userSearchAbleFields);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
  const result = await userServices.getAllFromDB(filterData, options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admin data retrieves successfully",
    meta: result.meta,
    data: result.data,
  });
});
const changeProfileStatus = catchAsync(async (req, res) => {
    const { id } = req.params;
  const result = await userServices.changeProfileStatus(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Profile status update successfully",
    data: result,
  });
});

export const userController = {
  createAdmin,
  createDoctor,
  createPatient,
  getAllFromDB,
  changeProfileStatus,
};
