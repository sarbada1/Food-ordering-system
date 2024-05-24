import express from 'express'
import { loginUser, registerUser,googleLogin } from '../controllers/userController.js'

const userRoute=express.Router();
userRoute.post("/register",registerUser);
userRoute.post("/login",loginUser);
userRoute.post("/google-login", googleLogin);


export default userRoute
