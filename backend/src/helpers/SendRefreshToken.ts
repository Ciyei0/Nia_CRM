import { Response } from "express";

export const SendRefreshToken = (res: Response, token: string): void => {
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("jrt", token, {
    httpOnly: true,
    secure: isProduction, // Required for HTTPS in production
    sameSite: isProduction ? "none" : "lax", // "none" for cross-origin cookies in production
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};
