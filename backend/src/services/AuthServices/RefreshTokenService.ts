import { verify } from "jsonwebtoken";
import { Response as Res } from "express";

import User from "../../models/User";
import AppError from "../../errors/AppError";
import ShowUserService from "../UserServices/ShowUserService";
import authConfig from "../../config/auth";
import {
  createAccessToken,
  createRefreshToken
} from "../../helpers/CreateTokens";

interface RefreshTokenPayload {
  id: string;
  tokenVersion: number;
  companyId: number;
}

interface Response {
  user: User;
  newToken: string;
  refreshToken: string;
}

export const RefreshTokenService = async (
  res: Res,
  token: string
): Promise<Response> => {
  try {
    console.log("RefreshToken: Attempting to verify token...");

    if (!token) {
      console.log("RefreshToken: No token provided");
      throw new AppError("ERR_SESSION_EXPIRED", 401);
    }

    const decoded = verify(token, authConfig.refreshSecret);
    const { id, tokenVersion, companyId } = decoded as RefreshTokenPayload;

    console.log("RefreshToken: Token decoded", { userId: id, tokenVersion, companyId });

    const user = await ShowUserService(id);

    console.log("RefreshToken: User found", {
      userId: user.id,
      userTokenVersion: user.tokenVersion,
      tokenTokenVersion: tokenVersion
    });

    if (user.tokenVersion !== tokenVersion) {
      console.log("RefreshToken: Token version mismatch - session invalidated");
      res.clearCookie("jrt");
      throw new AppError("ERR_SESSION_EXPIRED", 401);
    }

    const newToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    console.log("RefreshToken: New tokens created successfully");

    return { user, newToken, refreshToken };
  } catch (err: any) {
    console.log("RefreshToken: Error occurred:", err.message);
    res.clearCookie("jrt");
    throw new AppError("ERR_SESSION_EXPIRED", 401);
  }
};
