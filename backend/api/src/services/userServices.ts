import * as userRepository from "../repositories/userRepository";
import {
  validateEmail,
  validatePassword,
  validateName,
} from "../utils/validation";
import { hashPassword } from "../utils/hashPassword";
import { ErrorApi } from "../errors/ErrorApi";
import { IValidate } from "../interfaces/validate";
import { v4 as uuidv4 } from "uuid";

export const createUser = async (
  username: string,
  email: string,
  password: string
) => {
  try {
    const result1: IValidate = await validateName(username);
    if (!result1.passed) {
      throw result1.error;
    }

    const result2: IValidate = await validateEmail(email);
    if (!result2.passed) {
      throw result2.error;
    }

    const result3: IValidate = validatePassword(password);
    if (!result3.passed) {
      throw result3.error;
    }

    const hashedPassword = await hashPassword(password);

    if (!hashedPassword) {
      throw new ErrorApi({
        message: "Failed to hash password.",
        status: 500,
      });
    }

    const id: string = uuidv4();
    const timestamp: number = Date.now();
    const createdAt: string = new Date(timestamp).toISOString();

    const user = await userRepository.createUser(
      id,
      username,
      email,
      hashedPassword,
      createdAt
    );
    return user;
  } catch (error) {
    throw error;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await userRepository.getUserById(id);
    return user;
  } catch (error) {
    throw error;
  }
};

// export const getAllUsers = async (): Promise<IUser[]> => {
//   try {
//     const users = await userRepository.getAllUsers();
//     return users;
//   } catch (error) {
//     throw error;
//   }
// };

// export const deleteUser = async (id: string): Promise<IUser> => {
//   try {
//     const user = await userRepository.deleteUserById(id);
//     return user;
//   } catch (error) {
//     throw error;
//   }
// };

// export const updateUser = async (id: string, fields: Partial<IUser>): Promise<IUser> => {
//   try {
//     const oldUser: IUser | null = await userRepository.getUserById(id);

//     if (!oldUser) {
//       throw new Error("Usuário não existente");
//     }

//     const newUser: Omit<IUser, "isAdmin"> = {
//       username: fields.username || oldUser.username,
//       email: fields.email || oldUser.email,
//       password: fields.password || oldUser.password,
//       id: fields.id || oldUser.id,
//     };

//     const updatedUser = await userRepository.updateUser(id, newUser);
//     return updatedUser;
//   } catch (error: any) {
//     throw new Error(`Falha ao atualizar usuário: ${error.message}`);
//   }
// };

// export const makeUserAdmin = async (id: string): Promise<IUser> => {
// 	try {
// 		const user = await userRepository.makeUserAdmin(id);
// 		return user;
// 	} catch (error) {
// 		throw error;
// 	}
// };
