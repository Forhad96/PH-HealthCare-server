import { Request, Response } from "express";
import { AdminServices } from "./admin.service";

const getAllAdminHandler = async (req: Request, res: Response) => {
// console.log(req.query);
  const result = await AdminServices.getAllAdmin(req.query);
  res.status(200).json({
    success: true,
    message: "Admin data retrieves successfully",
    data: result,
  });
};
export const AdminController = {
    getAllAdminHandler
}