import { Pool } from "pg";
import config from "../config";

export const pool = new Pool({
     connectionString: config.connection_string,
})

export const initializeDatabase = async () => {
     try {
          const userTableExists = await pool.query(`
               SELECT EXISTS (
                    SELECT FROM information_schema.tables
                    WHERE table_schema = 'public' AND table_name = 'users'
               )
               `);

          if (!userTableExists.rows[0].exists) {
               await pool.query(`
                    CREATE TABLE IF NOT EXISTS users (
                         id SERIAL PRIMARY KEY,
                         name VARCHAR(100) NOT NULL,
                         email VARCHAR(150) UNIQUE NOT NULL,
                         password TEXT NOT NULL,
                         role VARCHAR(20) DEFAULT 'contributor' CHECK (role IN ('contributor', 'maintainer')),
                         created_at TIMESTAMP DEFAULT NOW(),
                         updated_at TIMESTAMP DEFAULT NOW()
               )
               `);


               await pool.query(`
                    CREATE TABLE IF NOT EXISTS issues (
                         id SERIAL PRIMARY KEY,
                         title VARCHAR(150) NOT NULL,
                         description TEXT NOT NULL,
                         type VARCHAR(20) NOT NULL CHECK (type IN ('bug', 'feature_request')),
                         status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved')),
                         reporter_id INT NOT NULL,
                         created_at TIMESTAMP DEFAULT NOW(),
                         updated_at TIMESTAMP DEFAULT NOW()
                    )
               `);
               console.log("✅ Database tables created successfully");
          }
          console.log("✅ Database Connected Successfully");
     } catch (error) {
          console.error('❌ Database initialization error', error)
     }
}


