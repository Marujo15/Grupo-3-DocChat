import { pool } from "../database/database";
import { ErrorApi } from "../errors/ErrorApi";
import { IUser } from "../interfaces/user";

export const getAllUsers = async (): Promise<IUser[]> => {
  try {
    const { rows } = await pool.query(`SELECT * FROM users`);
    return rows;
  } catch (error: any) {

    throw new ErrorApi({
      message: "Error updating users",
      status: 500,
    });
  }
};

export const createUser = async (
  username: string,
  email: string,
  password: string,
) => {

  const query =
    `INSERT INTO users (username, email, password, created_at) 
    VALUES ($1, $2, $3, NOW()) 
    RETURNING username, email`;

  try {
    const result = await pool.query(query, [username, email, password]);

    return result.rows[0];
  } catch (error) {
    console.error("Error creating user:", error);

    throw new ErrorApi({
      message: "Failed to create user.",
      status: 500,
    });
  }
};

// export const getUserByUsername = async (username: string) => {
//   const query = "SELECT * FROM users WHERE username=$1";

//   try {
//     const result = await pool.query(query, [username]);

//     return result.rows;
//   } catch (error) {
//     throw new ErrorApi({
//       message: "Failed to locate the user by username.",
//       status: 404,
//     });
//   }
// };

export const getUserByEmail = async (email: string) => {
  const query = "SELECT * FROM users WHERE email=$1";

  try {
    const result = await pool.query(query, [email]);

    return result.rows;
  } catch (error) {
    throw new ErrorApi({
      message: "Failed to locate the user by email.",
      status: 404,
    });
  }
};

export const getUserById = async (userId: string): Promise<IUser> => {
  try {
    const result = await pool.query(
      `SELECT 
        username, 
        email
      FROM users WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      throw new ErrorApi({
        message: `User ${userId} was not found`,
        status: 404,
      });
    }

    return result.rows[0] as IUser;
  } catch (error) {
    console.error("Error while fetching user by ID:", error);

    throw new ErrorApi({
      message: "Failed to retrieve user by ID.",
      status: 500,
    });
  }
};

// export const deleteUserById = async (userId: string): Promise<IUser> => {
//   try {
/* // Primeiro, obtenha os dados do usuário */
//     const userResult = await pool.query(
//       `SELECT
//         id,
//         username,
//         email,
//         is_admin AS "isAdmin",
//       FROM users WHERE id = $1`,
//       [userId]
//     );

//     if (userResult.rows.length === 0) {
//       throw new ErrorApi({
//         message: `User ${userId} was not found`,
//         status: 404,
//       });
//     }

//     const user = userResult.rows[0] as IUser;

//     // Em seguida, exclua o usuário
//     const deleteResult = await pool.query("DELETE FROM users WHERE id = $1", [
//       userId,
//     ]);

//     if (deleteResult.rowCount === 0) {
//       throw new ErrorApi({
//         message: `Failed to delete user with ID ${userId}.`,
//         status: 500,
//       });
//     }

//     // Retorne os dados do usuário deletado
//     return user;
//   } catch (error) {
//     console.error("Error while deleting user by ID:", error);

//     throw new ErrorApi({
//       message: "Failed to delete user by ID.",
//       status: 500,
//     });
//   }
// };

// export const updateUser = async (
//   userId: string,
//   updatedUser: Omit<IUser, "isAdmin">
// ): Promise<IUser> => {
//   try {
//     const { username, email } = updatedUser;
//     const query = `
//       UPDATE users
//       SET
//         username = $1,
//         email = $2,
//       WHERE id = $3
//       RETURNING *
//     `;
//     const result = await pool.query(query, [username, email, userId]);

//     if (result.rows.length === 0) {
//       throw new ErrorApi({
//         message: `User ${userId} was not found`,
//         status: 404,
//       });
//     }

//     return result.rows[0] as IUser;
//   } catch (error) {
//     console.error("Error while updating user:", error);

//     throw new ErrorApi({
//       message: "Failed to update user.",
//       status: 500,
//     });
//   }
// };

// export const makeUserAdmin = async (userId: string): Promise<IUser> => {
//   try {
//     const query = `
//       UPDATE users
//       SET is_admin = true
//       WHERE id = $1
//       RETURNING
//         id,
//         username,
//         email,
//         is_admin AS "isAdmin",`;

//     const result = await pool.query(query, [userId]);

//     if (result.rows.length === 0) {
//       throw new ErrorApi({
//         message: `User ${userId} was not found`,
//         status: 404,
//       });
//     }

//     return result.rows[0] as IUser;
//   } catch (error) {
//     console.error("Error while updating user to admin:", error);

//     throw new ErrorApi({
//       message: "Failed to update user to admin.",
//       status: 500,
//     });
//   }
// };
