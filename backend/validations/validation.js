import z from "zod";

export const createUserSchema = z.object({
  name: z
    .string()
    .trim({ message: "Please provide a valid name" })
    .min(1, { message: "Name cannot be empty" }),
  email: z.string().email({ messgae: "Please give a valid email" }),
  password: z.string().min(8, { messgae: "Password of atleast 8 characters" }),
});

export const loginUserSchema = z.object({
  email: z.string().email({ messgae: "Please give a valid email" }),
  password: z.string().min(8, { messgae: "Please check your password" }),
});

export const refreeSchema = z.object({
  name: z
    .string()
    .trim({ message: "Name cannot be empty" })
    .min(1, { message: "Please provide a name" }),
  email: z.string().email({ messgae: "Please give a valid email" }),
});
