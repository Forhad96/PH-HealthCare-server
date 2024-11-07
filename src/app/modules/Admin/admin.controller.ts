import { Request, Response } from "express";
import { AdminServices } from "./admin.service";
import pick from "../shared/pick";
import { adminFilterAbleFields } from "./admin.constant";
import sendResponse from "../shared/sendResponse";

const getAllFromDB = async (req: Request, res: Response) => {
  try {
    const filterData = pick(req.query, adminFilterAbleFields);
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    // console.log(options);
    const result = await AdminServices.getAllFromDB(filterData, options);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Admin data retrieves successfully",
      meta: result.meta,
      data: result.data,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
      error,
    });
  }
};
const getByIdFromDB = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await AdminServices.getByIdFromDB(id);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Admin by id retrieves successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
      error,
    });
  }
};

const updateIntoDB = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await AdminServices.updateIntoDB(id, req.body);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Admin data update successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
      error,
    });
  }
};

const deleteFromDB = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await AdminServices.deleteFromDB(id);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Admin data deleted successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
      error,
    });
  }
};
const softDeleteFromDB = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await AdminServices.softDeleteFromDB(id);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Admin data deleted successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
      error,
    });
  }
};

export const AdminController = {
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
  softDeleteFromDB,
};
