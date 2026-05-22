import dotenv from "dotenv";
import path from "path";

dotenv.config({
     path: path.join(process.cwd(), ".env"),
     override: true
});


const config = {
     connection_string: process.env.CONNECTIONDB ,
     port: process.env.PORT || 3000,

     acces_secret: process.env.JWT_ACCESS_SECRET,
     acces_expiry: process.env.JWT_ACCESS_EXPIRY,

     refress_secret: process.env.JWT_REFRESS_SECRET,
     refress_expiry: process.env.JWT_REFRESS_EXPIRY
}


export default config;