import express from "express";
import { CreateAdmin, AdminLogin, AdminLogout } from "../Controllers/Admin.js";
import { auth_security } from "../Middlewares/VerfifyToken.js";

const Router = express.Router();

Router.post("/create-admin", CreateAdmin);
Router.post("/admin-login", AdminLogin);
Router.post("/admin-logout", auth_security, AdminLogout);



export default Router;