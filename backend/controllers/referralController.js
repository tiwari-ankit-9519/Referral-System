import asyncHandler from "express-async-handler";
import { PrismaClient } from "@prisma/client";

import { refreeSchema } from "../validations/validation";

const prisma = new PrismaClient();

export const createReferral = asyncHandler(async (req, res) => {
  const { email, name } = req.body;
  const referrId = req.userAuthId;

  const result = refreeSchema.safeParse({
    email,
    name,
  });

  if (!result.success) {
    const errorMessage = result.error.errors.map((err) => err.message);
    return res.status(411).json({
      status: "error",
      message: errorMessage[0] || "Validation failed",
    });
  }

  const refreeExists = await prisma.referee.findUnique({
    where: {
      email,
    },
  });

  if (refreeExists) {
    return res.status(404).json({
      status: "error",
      message: "Already referred",
    });
  }

  const referee = await prisma.referee.create({
    data: {
      email,
      name,
    },
  });

  const referral = await prisma.referral.create({
    data: {
      refereeId: referee.id,
      referrId,
    },
  });

  res.status(200).json({
    status: "success",
    message: "Referred Successfully!",
  });
});

export const getRefereeDetails = asyncHandler(async (req, res) => {
  const { refereeId } = req.params;

  const referee = await prisma.referee.findUnique({
    where: { id: Number(refereeId) },
    include: {
      referrals: {
        include: {
          referrer: true,
        },
      },
    },
  });

  if (!referee) {
    return res.status(404).json({
      status: "error",
      message: "Referee not found",
    });
  }

  res.status(200).json({
    status: "success",
    referee,
  });
});

export const listReferees = asyncHandler(async (req, res) => {
  const referees = await prisma.referee.findMany({
    include: {
      referrals: {
        include: {
          referrer: true,
        },
      },
    },
  });

  res.status(200).json({
    status: "success",
    referees,
  });
});
