import express, { Application, Request, Response } from "express";
import cors from "cors";
import { UserRoutes } from "./app/modules/User/user.routes";
import { AdminRoutes } from "./app/modules/Admin/admin.routes";

const app: Application = express();
app.use(cors());

// parser
app.use(express.json())
app.use(express.urlencoded({extended:true}))



app.get("/", (req: Request, res: Response) => {
  res.send({
    Message: "Ph health care server..",
  });
});

//routes
app.use("/api/v1/users", UserRoutes);
app.use("/api/v1/admin", AdminRoutes);

export default app;
