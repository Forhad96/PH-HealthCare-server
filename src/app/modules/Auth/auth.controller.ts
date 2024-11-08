import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { AuthServices } from "./auth.service";

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUser(req.body);
  res.cookie("refreshToken", result.refreshToken,{
    secure:true,
    httpOnly:true,
  });
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User login successful",
    data: {
      accessToken: result.accessToken,
      needPasswordChange: result.needPasswordChange,
    },
  });
});
const refreshToken = catchAsync(async (req, res) => {
  const {refreshToken} = req.cookies
  const result = await AuthServices.refreshToken(refreshToken);
  


  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User login successful",
    data: result
    // data: {
    //   accessToken: result.accessToken,
    //   needPasswordChange: result.needPasswordChange,
    // },
  });
});

export const AuthController = {
  loginUser,
  refreshToken
};
