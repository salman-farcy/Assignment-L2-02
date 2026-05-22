import { pool } from "../../db/schema";
import { hashPassword } from "../../utils/bcrypt";
import { isValidRole } from "../../utils/validation";
import type { SignupRequest } from "./auth.interface"


const signUpServiceIntoDB = async (data: SignupRequest) => {

     if (!data.name || data.name.trim().length === 0) {
          throw new Error('ValidationError: Name is required');
     }

     if (!data.email) {
          throw new Error('ValidationError: Valid email is required');
     }

     if (!data.password) {
          throw new Error('ValidationError: Password must be at least 6 characters');
     }

     const role = data.role || 'contributor';
     if (!isValidRole(role)) {
          throw new Error('ValidationError: Role must be contributor or maintainer')
     }

     // Check if email already exists 
     const existingUser = await pool.query(`
          SELECT ID FROM users 
          WHERE email = $1
          `, [data.email]);
     if (existingUser.rows.length > 0) {
          throw new Error('ValidationError: Email allready registered');
     }


     try {
          // Hash Password
          const hashedPassword = await hashPassword(data.password);

          //insert user into database
          const result = await pool.query(`
               INSERT INTO users (name, email, password, role)
               VALUES ($1, $2, $3, $4)
               RETURNING id, name, email, role, created_at, updated_at
          `, [data.name, data.email, hashedPassword, role]);

          const user = result.rows[0];
          console.log(user)
          return {
               id: user.id,
               name: user.name,
               email: user.email,
               role: user.role,
               created_at: user.created_at,
               updated_at: user.updated_at,
          };

     } catch (error) {
          throw error;
     }
}





export const authService = {
     signUpServiceIntoDB,
}