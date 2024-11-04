import { Request, Response } from "express";
import { userServices } from "./user.service";

const createAdminHandle = async (req: Request, res: Response) => {
  try {
    const result = await userServices.createAdmin(req.body);
    res.status(200).json({
      success: true,
      message: "Admin created successfully",
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

export const userController = {
  createAdminHandle,
};
