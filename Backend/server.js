require('dotenv').config();
const app = require('./src/app')
const connectDB = require('./src/config/db');

connectDB();

const port = process.env.PORT;

app.listen(port, ()=>{
  console.log("Server running on port ${port}");
});