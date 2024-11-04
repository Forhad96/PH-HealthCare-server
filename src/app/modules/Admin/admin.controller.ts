import { Request, Response } from "express";
import { AdminServices } from "./admin.service";
import pick from "../shared/pick";
import { adminFilterAbleFields } from "./admin.constant";


const getAllAdminHandler = async (req: Request, res: Response) => {
  const filterData = pick(req.query, adminFilterAbleFields);
  const options = pick(req.query,["page","limit"])

  const result = await AdminServices.getAllAdmin(filterData,options);
  res.status(200).json({
    success: true,
    message: "Admin data retrieves successfully",
    data: result,
  });
};
export const AdminController = {
  getAllAdminHandler,
};
