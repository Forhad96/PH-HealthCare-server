import { Admin, Prisma, UserStatus } from "@prisma/client";
import { adminSearchAbleFields } from "./admin.constant";
import calculatePagination from "../helpers/calculatePagination";
import prisma from "../shared/prisma";

const getAllFromDB = async (params: any, options: any) => {
  const { page, limit, skip } = calculatePagination(options);
  const { searchTerm, ...additionalFilters } = params;

  // Log additional filters for debugging purposes
  //  console.log(additionalFilters);

  // Initialize an array to store all query conditions
  const andQueryConditions: Prisma.AdminWhereInput[] = [];

  // List of fields in the Admin table that can be searched
  const searchableFields = adminSearchAbleFields;

  // Add search conditions to the query if a searchTerm is provided
  if (searchTerm) {
    andQueryConditions.push({
      OR: searchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive", // Case-insensitive search
        },
      })),
    });
  }

  // Add filter conditions for additional fields
  if (Object.keys(additionalFilters).length > 0) {
    andQueryConditions.push({
      AND: Object.keys(additionalFilters).map((filterKey) => ({
        [filterKey]: {
          equals: additionalFilters[filterKey],
        },
      })),
    });
  }
  andQueryConditions.push({
    isDeleted: false,
  });

  // Construct the final query condition
  const whereQueryCondition: Prisma.AdminWhereInput = {
    AND: andQueryConditions,
  };

  // Execute the query with the constructed conditions
  const result = await prisma.admin.findMany({
    where: whereQueryCondition,
    skip,
    take: limit,
    orderBy: {
      [options.sortBy]: options.sortOrder,
    },
  });
  const total = await prisma.admin.count({
    where: whereQueryCondition,
  });
  // Return the result of the query
  return {
    meta: { page, limit, total },
    data: result,
  };
};
const getByIdFromDB = async (id: string) => {
  const result = await prisma.admin.findUnique({
    where: { id ,
      isDeleted:false
    },
  });
  return result;
};

const updateIntoDB = async (id: string, payload: Partial<Admin>):Promise<Admin> => {
  await prisma.admin.findUniqueOrThrow({ where: { id,isDeleted:false } });
  const result = await prisma.admin.update({
    where: { id },
    data: payload,
  });

  return result;
};

const deleteFromDB = async (id: string): Promise<Admin| null> => {
  await prisma.admin.findUniqueOrThrow({
    where: { id },
  });
  const result = await prisma.$transaction(async (transactionClient) => {
    const adminDeletedData = await transactionClient.admin.delete({
      where: { id },
    });

    await transactionClient.user.delete({
      where: {
        email: adminDeletedData.email,
      },
    });
    return adminDeletedData;
  });

  return result;
};
const softDeleteFromDB = async (id: string) => {
  await prisma.admin.findUniqueOrThrow({
    where: { id },
  });
  const result = await prisma.$transaction(async (transactionClient) => {
    const adminDeletedData = await transactionClient.admin.update({
      where: { id,isDeleted:false },
      data: {
        isDeleted: true,
      },
    });
    await transactionClient.user.update({
      where: {
        email: adminDeletedData.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });
    return adminDeletedData;
  });

  return result;
};

export const AdminServices = {
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
  softDeleteFromDB,
};
