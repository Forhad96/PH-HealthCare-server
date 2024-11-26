import { Prisma } from "@prisma/client";
import { paginationHelper } from "../../../helpers/paginationHealper";
import prisma from "../../../shared/prisma";
import { IAuthUser } from "../../interfaces/common";
import { IPaginationOptions } from "../../interfaces/pagination";
import ApiError from "../../errors/ApiError";

const insertIntoDB = async (
  user: any,
  payload: {
    scheduleIds: string[];
  }
) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });

  const doctorScheduleData = payload.scheduleIds.map((scheduleId) => ({
    doctorId: doctorData.id,
    scheduleId,
    isBooked: false,
  }));

  const doctorSchedule = prisma.doctorSchedules.createMany({
    data: doctorScheduleData,
  });

  return doctorSchedule;
  // console.log(doctorScheduleData);
};

const getMySchedule = async (
  filters: any,
  options: IPaginationOptions,
  user: IAuthUser
) => {
  const { limit, page, skip } = paginationHelper.calculatePagination(options);
  const { startDate, endDate, ...filterData } = filters;

  const andConditions: Prisma.DoctorSchedulesWhereInput[] = [];

  if (startDate && endDate) {
    andConditions.push({
      AND: [
        {
          schedule: {
            startDateTime: {
              gte: startDate,
            },
          },
        },
        {
          schedule: {
            endDateTime: {
              lte: endDate,
            },
          },
        },
      ],
    });
  }
  if (Object.keys(filterData).length > 0) {
      if(typeof filterData.isBooked === "string" && filterData.isBooked ==='true'){
          filterData.isBooked = true
        }
        else if(typeof filterData.isBooked === "string" && filterData.isBooked ==='false'){
            filterData.isBooked = false
        }
    const filterConditions = Object.keys(filterData).map((key) => ({
      [key]: {
        equals: (filterData as any)[key],
      },
    }));
    andConditions.push(...filterConditions);
  }

  const whereConditions: Prisma.DoctorSchedulesWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.doctorSchedules.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {},
  });

  const total = await prisma.doctorSchedules.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const deleteFromDB = async (user:IAuthUser,scheduleId:string)=>{
    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where: {
            email: user?.email
        }
    });

    const isBookedSchedule = await prisma.doctorSchedules.findFirst({
        where: {
            doctorId: doctorData.id,
            scheduleId: scheduleId,
            isBooked: true
        }
    });

    if (isBookedSchedule) {
        throw new ApiError(httpStatus.BAD_REQUEST, "You can not delete the schedule because of the schedule is already booked!")
    }

    const result = await prisma.doctorSchedules.delete({
        where: {
            doctorId_scheduleId: {
                doctorId: doctorData.id,
                scheduleId: scheduleId
            }
        }
    })
    return result;

}
export const DoctorScheduleServices = {
  insertIntoDB,
  getMySchedule,
  deleteFromDB
};
