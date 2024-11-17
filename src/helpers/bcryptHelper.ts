import bcrypt from "bcrypt";

export const hashPassword = async (
  password: string,
  saltRounds: number
) => {
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (err) {
    console.error("Error hashing password:", err);
  }
};
