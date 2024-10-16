const bcrypt = require("bcrypt");

export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  try {
    const match: boolean = await bcrypt.compare(password, hashedPassword);
    return match;
  } catch (error) {
    return false;
  }
}
