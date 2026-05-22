import bcrypt from 'bcrypt';

// password bicrypt
export const hashPassword = async (password: string) =>  {
     try {
          const salt = await bcrypt.genSalt(10);
          const hash = await bcrypt.hash(password, salt);
          return hash;

     } catch (error) {
          throw new Error('Password hashing failed');
     }
}


// Compare plain text password with hashed password
export const comparePassword = async (
  plainPassword: string,
  hashedPassword: string
) => {
  try {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return isMatch;
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};