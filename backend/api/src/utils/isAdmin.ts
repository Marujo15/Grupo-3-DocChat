import { ErrorApi } from "../errors/ErrorApi";
import { IUser } from "../interfaces/user";
import * as userRepository from "../repositories/userRepository";

export const isAdmin = async (userId: string): Promise<boolean> => {
  try {
    const user: IUser = await userRepository.getUserById(userId);
    return user.isAdmin === true;
  } catch (error) {
    throw new ErrorApi({
      message: "Failed to check if the user is an admin.",
      status: 500,
    });
  }
};
