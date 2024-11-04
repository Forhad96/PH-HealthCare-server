import { Request, Response } from "express";
import { AdminServices } from "./admin.service";

const getAllAdminHandler = async (req: Request, res: Response) => {
  const result = await AdminServices.getAllAdmin();
  res.status(200).json({
    success: true,
    message: "Admin data retrieves successfully",
    data: result,
  });
};
export const AdminController = {
    getAllAdminHandler
}