import express from "express";
import { SignUp, Login } from "../Controllers/User.js";

const Router = express.Router();

Router.post("/signup", SignUp);
Router.post("/login", Login);



export default Router;