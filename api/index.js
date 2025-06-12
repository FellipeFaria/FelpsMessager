import express from "express";
import cors from "cors";
import userRouter from "./routes/userRoute.js";
import loginRouter from "./routes/loginRoute.js";
import chatRouter from "./routes/chatRoute.js";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/user", userRouter);

app.use("/login", loginRouter);

app.use("/chat", chatRouter);

app.listen(3000, () => {
  console.log("Server rodando");
});
