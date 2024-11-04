import { Prisma, PrismaClient } from "@prisma/client";
import { adminSearchAbleFields } from "./admin.constant";
const prisma = new PrismaClient();

const getAllAdmin = async (params: any, options: any) => {
  const { page, limit } = options;
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
  const finalQueryCondition: Prisma.AdminWhereInput = { AND: queryConditions };

  // Execute the query with the constructed conditions
  const admins = await prisma.admin.findMany({
    where: finalQueryCondition,
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit),
  });

  // Return the result of the query
  return admins;
};

export const AdminServices = {
  getAllAdmin,
};
