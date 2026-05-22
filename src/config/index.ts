import dotenv from "dotenv";
import path from "path";

dotenv.config({
     path: path.join(process.cwd(), ".env"),
     override: true
});


const config = {
     connection_string: process.env.CONNECTIONDB ,
     port: process.env.PORT || 3000,
     secret: process.env.JWT_SECRET,
     expiry: process.env.JWT_EXPIRY
}


export default config;