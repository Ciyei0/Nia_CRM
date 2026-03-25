import { Request, Response } from "express";
import AppError from "../errors/AppError";
import ShowUserService from "../services/UserServices/ShowUserService";
import User from "../models/User";

import { SerializeUser } from "../helpers/SerializeUser";

export const me = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.user;
  const user = await ShowUserService(id);

  return res.json(await SerializeUser(user));
};

export const remove = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.user;
  const user = await User.findByPk(id);
  await user.update({ online: false });

  res.clearCookie("jrt");

  return res.send();
};
