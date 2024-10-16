import { Request, Response } from "express";
import * as userServices from "../services/userServices";
import { IAPIResponse } from "../interfaces/api";
import { IUser } from "../interfaces/user";
import { isAdmin } from "../utils/isAdmin";
import { ErrorApi } from "../errors/ErrorApi";

// export const getAllUsers = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   const response: IAPIResponse<IUser[]> = { success: false };
//   try {
//     const users: IUser[] = await userServices.getAllUsers();

//     response.data = users;
//     response.success = true;
//     response.message = "Users retrieved successfully";

//     res.status(200).json(response);
//   } catch (error: any) {
//     if (error instanceof ErrorApi) {
//       console.log(error);

//       res.status(error.status).json({
//         data: null,
//         error: error.message,
//       });

//       return;
//     }
//     console.error(error);

//     res.status(500).json({ data: null, error: "Internal server erro" });
//   }
// };

export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const response: IAPIResponse<IUser> = { success: false };

  try {
    const userId = req.params.userId;
    const user: IUser = await userServices.getUserById(userId);

    response.data = user;
    response.success = true;
    response.message = "User retrieved successfully";

    res.status(200).json(response);
  } catch (error) {
    console.error(error);

    if (error instanceof ErrorApi) {
      res.status(error.status).json({
        data: null,
        error: error.message,
      });

      return;
    }

    res.status(403).json({
      data: null,
      error: "Permission denied, you need to be an admin.",
    });
  }
};

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const response: IAPIResponse<IUser> = { success: false };

  try {
    const { username, email, password } = req.body;

    const user: IUser = await userServices.createUser(
      username,
      email,
      password
    );

    response.data = user;
    response.success = true;
    response.message = "User successfully registered!";

    res.status(201).json(response);
  } catch (error) {
    if (error instanceof ErrorApi) {
      response.message = error.message;

      res.status(error.status).json(response);
      return;
    } else {
      response.message = "Failed to register the user!";

      res.status(500).json(response);
      return;
    }
  }
};

export const getUserMe = async (req: Request, res: Response): Promise<void> => {
  const response: IAPIResponse<IUser> = { success: false };

  try {
    const userId = req.user ?? "";

    if (!userId) {
      throw new ErrorApi({
        message: "User ID not found.",
        status: 401,
      });
    }

    const user = await userServices.getUserById(userId);

    response.success = true;
    response.data = user;
    response.message = "User found successfully!";

    res.status(200).json(response);
  } catch (error) {
    if (error instanceof ErrorApi) {
      response.message = error.message;

      res.status(error.status).json(response);
      return;
    } else {
      response.message = "Unable to find information!";

      res.status(401).json(response);
      return;
    }
  }
};

// export const deleteUser = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   const response: IAPIResponse<IUser> = { success: false };

//   try {
//     const userId = req.params.userId;
//     const user: IUser = await userServices.deleteUser(userId);

//     response.data = user;
//     response.success = true;
//     response.message = "User deleted successfully!";

//     res.status(200).json(response);
//   } catch (error: any) {
//     if (error instanceof ErrorApi) {
//       response.message = error.message;

//       res.status(error.status).json(response);

//       return;
//     } else {
//       response.message = "Failed to delete the user!";

//       res.status(500).json(response);

//       return;
//     }
//   }
// };

// export const updateUser = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   const response: IAPIResponse<IUser> = { success: false };

//   try {
//     const userId = req.params.userId;
//     const fields: Partial<IUser> = req.body;
//     const userLoggedId = req.user;

//     if (!userLoggedId) {
//       throw new ErrorApi({
//         message: "You are not logged in",
//         status: 401,
//       });
//     }

//     const isAdminUser = await isAdmin(userLoggedId);
//     const isUpdatingSelf = userLoggedId === userId;

//     if (isUpdatingSelf) {
//       const updatedUser: IUser = await userServices.updateUser(userId, fields);

//       response.data = updatedUser;
//       response.success = true;
//       response.message = "User updated successfully!";

//       res.json(response);
//     } else if (!isUpdatingSelf && isAdminUser) {
//       const promotedUser: IUser = await userServices.makeUserAdmin(userId);

//       response.data = promotedUser;
//       response.success = true;
//       response.message = "User promoted successfully!";

//       res.json(response);
//     } else if (!isUpdatingSelf && isAdminUser) {
//       throw new ErrorApi({
//         message: "User cannot be promoted to administrator",
//         status: 403,
//       });
//     } else if (!isUpdatingSelf && !isAdminUser) {
//       throw new ErrorApi({
//         message: "You are not allowed to change another user's ID",
//         status: 403,
//       });
//     }
//   } catch (error: any) {
//     if (error instanceof ErrorApi) {
//       response.message = error.message;

//       res.status(error.status).json(response);

//       return;
//     } else {
//       response.message = "Failed to update the user!";

//       res.status(500).json(response);

//       return;
//     }
//   }
// };
