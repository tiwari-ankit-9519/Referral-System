import z from "zod";

export const registerUserSchema = z.object({
  name: z.string().min(1, { message: "Username cannot be blank" }),
  email: z.string().email({ message: "Please provide a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password should be of 8 characters" }),
});

export const loginUserSchema = z.object({
  email: z.string().email({ message: "Please provide a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password should be of 8 characters" }),
});

export const blogCreateSchema = z.object({
  title: z.string().min(1, { message: "Please provide a title" }),
  description: z.string().min(1, { message: "Please provide a description" }),
});

export const updateBlogSchema = z.object({
  title: z.string().min(1, { message: "Please provide a title" }).optional(),
  description: z
    .string()
    .min(1, { message: "Please provide a description" })
    .optional(),
});

export const createCommentSchema = z.object({
  content: z.string().min(1, { message: "Please provide a comment" }),
});
