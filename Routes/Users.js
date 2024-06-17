import express from "express";
import { SignUp, Login, Email_Confirm_Verification, Forgot_Password, Reset_Password, Logout_User } from "../Controllers/User.js";
import { auth_security } from "../Middlewares/VerfifyToken.js";

const Router = express.Router();

Router.post("/signup", SignUp);
Router.post("/login", Login);
Router.post("/verify-email", Email_Confirm_Verification);
Router.post("/forgot-password", Forgot_Password);
Router.post("/reset-password", Reset_Password);
Router.post("/logout", auth_security, Logout_User);



export default Router;