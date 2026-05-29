import * as z from "zod";

export const registerSchemaBody = z.object({
  email: z.email(),
  password: z.string().min(6)
})

export const loginSchemaBody = z.object({
  email: z.email(),
  password: z.string().min(1)
})