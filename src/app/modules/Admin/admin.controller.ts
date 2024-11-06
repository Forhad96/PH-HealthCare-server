import { Request, Response } from "express";
import { AdminServices } from "./admin.service";
import pick from "../shared/pick";
import { adminFilterAbleFields } from "./admin.constant";

const getAllFromDB = async (req: Request, res: Response) => {
  try {
    const filterData = pick(req.query, adminFilterAbleFields);
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    // console.log(options);
    const result = await AdminServices.getAllFromDB(filterData, options);
    res.status(200).json({
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
    res.status(200).json({
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
    res.status(200).json({
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

export const AdminController = {
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB
};
