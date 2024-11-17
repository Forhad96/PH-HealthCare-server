import { UserStatus } from "@prisma/client";
import { jwtHelpers } from "../../../helpers/jwtHealpers";
import prisma from "../../../shared/prisma";
import * as bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";
import { config } from "../../config";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";
const loginUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });
  const isCorrectPassword = await bcrypt.compare(
    payload.password,
    userData.password
  );
  if (!isCorrectPassword) {
    throw new Error("Password incorrect");
  }

  const accessToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.access_token_secret as Secret,
    "5d"
  );
  const refreshToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.refresh_token_secret as Secret,
    config.jwt.refresh_token_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: userData.needPasswordChange,
  };
};

const refreshToken = async (token: string) => {
  let decoded;
  try {
    decoded = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_token_secret as Secret
    );
  } catch (error) {
    throw new Error("You are  not authorize");
  }
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decoded.email,
      status: UserStatus.ACTIVE,
    },
  });
  const accessToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.access_token_secret as Secret,
    config.jwt.access_token_expire_in as string
  );

  return {
    accessToken,
    // refreshToken,
    needPasswordChange: userData.needPasswordChange,
  };
};
const changePassword = async (user: any, payload: any) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isCorrectPassword = await bcrypt.compare(
    payload.oldPassword,
    userData.password
  );
  if (!isCorrectPassword) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Password incorrect");
  }
  const hashedPassword = await bcrypt.hash(payload.newPassword, 12);
  await prisma.user.update({
    where: {
      email: user.email,
    },
    data: {
      password: hashedPassword,
      needPasswordChange: false,
    },
  });

  return {
    message: "Password changed successfully",
  };
};

export const AuthServices = {
  loginUser,
  refreshToken,
  changePassword,
};
