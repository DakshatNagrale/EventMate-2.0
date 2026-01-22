import express from "express"
import cors from "cors"

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js"
import adminRoutes from "./routes/admin.routes.js"

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res)=>{
  res.send("Eventmate API is running...");
});

export default app;