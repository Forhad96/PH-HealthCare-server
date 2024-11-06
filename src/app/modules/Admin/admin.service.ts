import { Prisma } from "@prisma/client";
import { adminSearchAbleFields } from "./admin.constant";
import calculatePagination from "../helpers/calculatePagination";
import prisma from "../shared/prisma";

const getAllAdmin = async (params: any, options: any) => {
  const { page, limit, skip } = calculatePagination(options);
  const { searchTerm, ...additionalFilters } = params;

  // Log additional filters for debugging purposes
  //  console.log(additionalFilters);

  // Initialize an array to store all query conditions
  const queryConditions: Prisma.AdminWhereInput[] = [];

  // List of fields in the Admin table that can be searched
  const searchableFields = adminSearchAbleFields;

  // Add search conditions to the query if a searchTerm is provided
  if (searchTerm) {
    queryConditions.push({
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
    queryConditions.push({
      AND: Object.keys(additionalFilters).map((filterKey) => ({
        [filterKey]: {
          equals: additionalFilters[filterKey],
        },
      })),
    });
  }

  // Construct the final query condition
  const whereQueryCondition: Prisma.AdminWhereInput = { AND: queryConditions };

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
const getAdminById = async (id: string) => {
  const result = await prisma.admin.findUnique({
    where: { id },
  });
  return result
};
export const AdminServices = {
  getAllAdmin,
  getAdminById,
};
