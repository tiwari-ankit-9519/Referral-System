import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import {
  createUserSchema,
  loginUserSchema,
} from "../validations/validation.js";
import { PrismaClient } from "@prisma/client";
import generateToken from "../utils/generateToken.js";

const prisma = new PrismaClient();

export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const result = createUserSchema.safeParse(req.body);
  if (!result.success) {
    const errorMessage = result.error.errors.map((err) => err.message);
    return res.status(411).json({
      message: errorMessage[0] || "Validation failed",
    });
  }
  const userExists = await prisma.referrer.findUnique({
    where: {
      email,
    },
  });
  if (userExists) {
    return res.status(409).json({
      status: "error",
      message: "User already exists with the same email",
    });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = await prisma.referrer.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
  res.json({
    status: "success",
    message: "User created successfully",
    user,
    token: generateToken(user.id),
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const result = loginUserSchema.safeParse(req.body);
  if (!result.success) {
    const errorMessage = result.error.errors.map((err) => err.message);
    return res.status(411).json({
      message: errorMessage[0] || "Validation failed",
    });
  }

  const user = await prisma.referrer.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return res.status(401).json({
      status: "Error",
      message: "User not found!",
    });
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    return res.status(401).json({
      message: "Invalid password",
    });
  }

  res.status(200).json({
    status: "success",
    message: "User logged in successfully",
    name: user.name,
    email: user.email,
    token: generateToken(user.id),
  });
});
