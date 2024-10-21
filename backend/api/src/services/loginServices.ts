import jwt from "jsonwebtoken";
import { comparePassword } from "../utils/comparePassword";
import * as userRepository from "../repositories/userRepository";
import { ErrorApi } from "../errors/ErrorApi";
import { SECRET_KEY } from "../config";

export const getUser = async (email: string) => {
  try {
    const user = await userRepository.getUserByEmail(email);

    return user;
  } catch (error) {
    throw error;
  }
};

export const authenticateUser = async (email: string, password: string) => {
  try {
    const user = await userRepository.getUserByEmail(email);

    if (!user || !(user.length > 0)) {
      return { auth: false, token: "" };
    }

    const matchPassword = await comparePassword(password, user[0].password);

    if (matchPassword) {
      const token = jwt.sign({ id: user[0].id }, SECRET_KEY, {
        expiresIn: "5d",
      });
      
      return { auth: true, token, id: user[0].id };
    }

    return { auth: false, token: "" };
  } catch (error) {
    throw new ErrorApi({
      message: "Failed to authenticate user",
      status: 500,
    });
  }
};
