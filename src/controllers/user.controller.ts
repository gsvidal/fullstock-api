import { type Request, type Response } from "express";
import { registerSchemaBody } from "../schemas/auth.schema.ts";
import * as userService from "../services/user.service.ts";

export async function createUser(req: Request, res: Response) {
  const { email, password } = registerSchemaBody.parse(req.body);

  const user = await userService.createUser(email, password);

  req.session.userId = user.id;

  res.status(201).json({ data: user });
}
