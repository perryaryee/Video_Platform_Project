import express from "express";
import { SignUp, Login, Email_Confirm_Verification, Forgot_Password, Reset_Password } from "../Controllers/User.js";

const Router = express.Router();

Router.post("/signup", SignUp);
Router.post("/login", Login);
Router.post("/verify-email", Email_Confirm_Verification);
Router.post("/forgot-password", Forgot_Password);
Router.post("/reset-password", Reset_Password);



export default Router;