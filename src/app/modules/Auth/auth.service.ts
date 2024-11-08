import prisma from "../../../shared/prisma";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const loginUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
    },
  });
  const isCorrectPassword = await bcrypt.compare(
    payload.password,
    userData.password
  );
  if (!isCorrectPassword) {
    throw new Error("Password incorrect");
  }

  const accessToken = await jwt.sign(
    {
      email: userData.email,
      role: userData.role,
    },
    "abc1234",
    { algorithm: "HS256", expiresIn: "15m" }
  );

  const refreshToken = await jwt.sign(
    {
      email: userData.email,
      role: userData.role,
    },
    "abc1234567",
    { algorithm: "HS256", expiresIn: "30d" }
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: userData.needPasswordChange,
  };
};

export const AuthServices = {
  loginUser,
};
