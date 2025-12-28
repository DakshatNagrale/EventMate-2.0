import dotenv from "dotenv"
import app from "./src/app.js"
import connectDB from "./src/config/db.js"

dotenv.config();
connectDB();

const PORT = process.env.PORT;

app.listen(PORT, "0.0.0.0", ()=>{
  console.log(`Server running on port ${PORT}`);
});