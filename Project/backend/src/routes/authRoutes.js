import express from 'express'
import { Login, Logout, register } from '../controllers/authController.js' // added file extension

const AuthRoutes = express.Router()

AuthRoutes.post("/register",register)
AuthRoutes.post("/login",Login)
AuthRoutes.post("/logout",Logout)

export default AuthRoutes