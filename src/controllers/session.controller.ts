import { type Request, type Response } from "express";
import { loginSchemaBody } from "../schemas/auth.schema.ts";
import * as userService from "../services/user.service.ts";

export async function createSession(req: Request, res: Response) {
  const { email, password } = loginSchemaBody.parse(req.body);

  const user = await userService.verifyCredentials(email, password);

  req.session.userId = user.id;

  res.status(201).json({ status: "success", data: user });
}
