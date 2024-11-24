import { Prisma, PrismaClient, UserRole, UserStatus } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { fileUploader } from "../../../helpers/fileUploader";
import { IFile } from "../../interfaces/file";
import { Request } from "express";
import { IPaginationOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../../helpers/paginationHealper";
import { userSearchAbleFields } from "./user.constant";
import { IAuthUser } from "../../interfaces/common";

const prisma = new PrismaClient();

const createAdmin = async (req: any) => {
  const file: IFile = req.file;
  if (file) {
    const uploadedFile = await fileUploader.uploadToCloudinary(file);
    req.body.admin.profilePhoto = uploadedFile?.secure_url;
    console.log(uploadedFile);
  }

  const hashedPassword: string = await bcrypt.hash(req.body.password, 12);

  const userData = {
    email: req.body.admin.email,
    password: hashedPassword,
    role: UserRole.ADMIN,
  };
  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({ data: userData });
    const createdAdminData = await transactionClient.admin.create({
      data: req.body.admin,
    });
    return createdAdminData;
  });

  return result;
};
const createDoctor = async (req: Request) => {
  const file = req.file as IFile;
  if (file) {
    const uploadedFile = await fileUploader.uploadToCloudinary(file);
    req.body.doctor.profilePhoto = uploadedFile?.secure_url;
    // console.log(uploadedFile);
  }

  const hashedPassword: string = await bcrypt.hash(req.body.password, 12);

  const userData = {
    email: req.body.doctor.email,
    password: hashedPassword,
    role: UserRole.DOCTOR,
  };
  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({ data: userData });
    const createdDoctorData = await transactionClient.doctor.create({
      data: req.body.doctor,
    });
    return createdDoctorData;
  });

  return result;
};
const createPatient = async (req: Request) => {
  const file = req.file as IFile;
  if (file) {
    const uploadedFile = await fileUploader.uploadToCloudinary(file);
    req.body.patient.profilePhoto = uploadedFile?.secure_url;
    // console.log(uploadedFile);
  }

  const hashedPassword: string = await bcrypt.hash(req.body.password, 12);

  const userData = {
    email: req.body.patient.email,
    password: hashedPassword,
    role: UserRole.PATIENT,
  };
  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({ data: userData });
    const createdPatientData = await transactionClient.patient.create({
      data: req.body.patient,
    });
    return createdPatientData;
  });

  return result;
};

const getAllFromDB = async (params: any, options: IPaginationOptions) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andConditions: Prisma.UserWhereInput[] = [];

  //console.log(filterData);
  if (params.searchTerm) {
    andConditions.push({
      OR: userSearchAbleFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.UserWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.user.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
    select: {
      id: true,
      email: true,
      role: true,
      needPasswordChange: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      admin: true,
      patient: true,
      doctor: true,
    },
  });

  const total = await prisma.user.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};
const changeProfileStatus = async (id: string, status: UserStatus) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const updateUserStatus = await prisma.user.update({
    where: {
      id,
    },
    data: status,
  });

  return updateUserStatus;
};

const getMyProfile = async (user: IAuthUser) => {
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      email: user?.email,
      status: UserStatus.ACTIVE,
    },
    select: {
      id: true,
      email: true,
      needPasswordChange: true,
      role: true,
      status: true,
    },
  });
  let profileInfo;

  if (userInfo.role === UserRole.SUPER_ADMIN) {
    profileInfo = await prisma.admin.findUnique({
      where: {
        email: userInfo.email,
      },
    });
  } else if (userInfo.role === UserRole.ADMIN) {
    profileInfo = await prisma.admin.findUnique({
      where: {
        email: userInfo.email,
      },
    });
  } else if (userInfo.role === UserRole.DOCTOR) {
    profileInfo = await prisma.doctor.findUnique({
      where: {
        email: userInfo.email,
      },
    });
  } else if (userInfo.role === UserRole.PATIENT) {
    profileInfo = await prisma.patient.findUnique({
      where: {
        email: userInfo.email,
      },
    });
  }

  return { ...userInfo, ...profileInfo };
};
const updateMyProfile = async (user: IAuthUser, req: Request) => {
  const userInfo = await prisma.user.findUniqueOrThrow({
      where: {
          email: user?.email,
          status: UserStatus.ACTIVE
      }
  });

  const file = req.file as IFile;
  if (file) {
      const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
      req.body.profilePhoto = uploadToCloudinary?.secure_url;
  }

  let profileInfo;

  if (userInfo.role === UserRole.SUPER_ADMIN) {
      profileInfo = await prisma.admin.update({
          where: {
              email: userInfo.email
          },
          data: req.body
      })
  }
  else if (userInfo.role === UserRole.ADMIN) {
      profileInfo = await prisma.admin.update({
          where: {
              email: userInfo.email
          },
          data: req.body
      })
  }
  else if (userInfo.role === UserRole.DOCTOR) {
      profileInfo = await prisma.doctor.update({
          where: {
              email: userInfo.email
          },
          data: req.body
      })
  }
  else if (userInfo.role === UserRole.PATIENT) {
      profileInfo = await prisma.patient.update({
          where: {
              email: userInfo.email
          },
          data: req.body
      })
  }

  return { ...profileInfo };
}

export const userServices = {
  createAdmin,
  createDoctor,
  createPatient,
  getAllFromDB,
  changeProfileStatus,
  getMyProfile,
  updateMyProfile
};
