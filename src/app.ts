import express, { Application, Request, Response } from "express";
import cors from "cors";
import { UserRoutes } from "./app/modules/User/user.routes";

const app: Application = express();
app.use(cors());





app.get("/", (req: Request, res: Response) => {
  res.send({
    Message: "Ph health care server..",
  });
});
app.use("/api/v1/users", UserRoutes);

export default app;
