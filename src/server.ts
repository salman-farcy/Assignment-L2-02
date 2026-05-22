import app from "./app";
import config from "./config";
import { initializeDatabase } from "./db/schema";

       

const main = () =>{
  initializeDatabase()
  app.listen(config.port, () => {
  console.log(`Example app listening on port ${config.port}`);
});
}

main()