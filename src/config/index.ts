import dotenv from "dotenv";
import path from "path";

dotenv.config({
     path: path.join(process.cwd(), ".env")
});


const config = {
     connection_string: process.env.CONNECTIONDB ,
     port: process.env.PORT || 3000,
}


export default config;