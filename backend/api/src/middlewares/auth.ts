import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config";

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.cookies.session_id;

  if (!token) {
    res.status(401).json({ message: "Access Denied" });
    return;
  }

  if (!SECRET_KEY) {
    console.error("No SECRET_KEY defined.");
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }

  jwt.verify(token, SECRET_KEY!, (err: any, decoded: any) => {
    if (err) {
      res.status(400).json({ message: "Invalid jwt Token" });
      return;
    }

    req.user = decoded.id;
    next();
  });
};
