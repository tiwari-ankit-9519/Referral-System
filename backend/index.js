import express from "express";
import dotenv from "dotenv";

dotenv.config();

import { errorHandler, notFound } from "./middlewares/errorHandler.js";
import userRouter from "./routes/userRoutes.js";

const app = express();
app.use(express.json());

app.use("/api/v1/users", userRouter);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
