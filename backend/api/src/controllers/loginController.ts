import * as loginServices from "../services/loginServices";
import { Request, Response } from "express";
import { ErrorApi } from "../errors/ErrorApi";
import { IUser } from "../interfaces/user";

export const loginController = {
  authenticate: async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    //CORREÇÃO POSTERIOR: mudar para { username, password }, senão não faz sentido a criação do username

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    try {
      const user: IUser = await loginServices.getUser(email);

      const { auth, token, id } = await loginServices.authenticateUser(
        email,
        password
      );

      if (!auth) {
        res.status(400).json({ error: "Invalid email and/or password" });
        return;
      }

      const maxAge = 5 * 24 * 60 * 60 * 1000;

      res.cookie("session_id", token, { maxAge, httpOnly: true });

      res.status(200).json({
        auth,
        token,
        id,
        message: "User successfully authenticated!",
        user: {
          id: user.id,
          username: user.username,
          password: user.password,
        },
      });
      return;
    } catch (error) {
      if (error instanceof ErrorApi) {
        res.status(error.status).json({ error: error.message });
        return;
      }

      res
        .status(500)
        .json({ error: "Failed to authenticate user, server error" });
      return;
    }
  },

  logout: (req: Request, res: Response): void => {
    try {
      if (!req.cookies.session_id) {
        res
          .status(400)
          .json({ success: false, message: "You are not logged in" });
        return;
      }

      res.clearCookie("session_id", { path: "/" });

      res.status(200).json({ success: true, message: "Logout successful" });
      return;
    } catch (error) {
      if (error instanceof ErrorApi) {
        res.status(error.status).json({ error: error.message });
        return;
      }

      res
        .status(500)
        .json({ error: "Internal server error when trying to log out" });
      return;
    }
  },
};
