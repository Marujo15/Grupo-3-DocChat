/* import { Request, Response, NextFunction } from "express";
import { ErrorApi } from "../errors/ErrorApi";
import { getUserById } from "../services/userServices";

const adminOnly = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user;

    if (!userId) {
      return res.status(401).json({ message: "User ID not found." });
    }

    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isAdmin = user.isAdmin;

    if (isAdmin) {
      next();
    } else {
      return res.status(403).json({ message: "You do not have permission." });
    }
  } catch (error) {
    if (error instanceof ErrorApi) {
      return res.status(error.status).json({ error: error.message });
    }
    return res.status(500).json({ error: "Internal server error." });
  }
};

export default adminOnly; */
