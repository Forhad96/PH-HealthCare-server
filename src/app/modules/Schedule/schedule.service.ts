import { addHours, addMinutes, format } from "date-fns";
import { ISchedule } from "./schedule.interface";
import { Prisma, Schedule } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { paginationHelper } from "../../../helpers/paginationHealper";
import { IAuthUser } from "../../interfaces/common";

export const createSchedule = async (
  payload: ISchedule
): Promise<Schedule[]> => {
  const { startDate, endDate, startTime, endTime } = payload;

  const intervalTime = 30;

  const schedules = [];

  const currentDate = new Date(startDate); // start date
  const lastDate = new Date(endDate); // end date

  while (currentDate <= lastDate) {
    // 09:30  ---> ['09', '30']
    const startDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-MM-dd")}`,
          Number(startTime.split(":")[0])
        ),
        Number(startTime.split(":")[1])
      )
    );

    const endDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-MM-dd")}`,
          Number(endTime.split(":")[0])
        ),
        Number(endTime.split(":")[1])
      )
    );

    while (startDateTime < endDateTime) {
      const scheduleData = {
        startDateTime: startDateTime,
        endDateTime: addMinutes(startDateTime, intervalTime),
      };

      const existingSchedule = await prisma.schedule.findFirst({
        where: {
          startDateTime: scheduleData.startDateTime,
          endDateTime: scheduleData.endDateTime,
        },
      });

      if (!existingSchedule) {
        const result = await prisma.schedule.create({
          data: scheduleData,
        });
        schedules.push(result);
      }

      startDateTime.setMinutes(startDateTime.getMinutes() + intervalTime);
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }
  return schedules;
};
const getAllFromDB = async (filters: any, options: any, user: IAuthUser) => {
  const { limit, page, skip } = paginationHelper.calculatePagination(options);
  const { startDate,endDate, ...filterData } = filters;
  console.log("time",startDate,endDate);

  const andConditions: Prisma.ScheduleWhereInput[] = [];

  if(startDate && endDate){
    andConditions.push({
      AND:[
        {
          startDateTime:{
            gte: startDate
          },
          endDateTime:{
            lte:endDate
          }
        }
      ]
    })

  }
  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.keys(filterData).map((key) => ({
      [key]: {
        equals: (filterData as any)[key],
      },
    }));
    andConditions.push(...filterConditions);
  }

  const whereConditions: Prisma.ScheduleWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

    const doctorSchedules = await prisma.doctorSchedules.findMany({
      where: {
          doctor: {
              email: user?.email
          }
      }
  });
const doctorSchedulesId = doctorSchedules.map(schedule =>  schedule.scheduleId)
console.log(doctorSchedulesId);
  const result = await prisma.schedule.findMany({
    where: {
      ...whereConditions,
      id:{
        notIn:doctorSchedulesId
      }
    },
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: "desc" },
  });

  const total = await prisma.schedule.count({
    where: {
      ...whereConditions,
      id:{
        notIn:doctorSchedulesId
      }
    },
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
export const ScheduleServices = {
  createSchedule,
  getAllFromDB
};
