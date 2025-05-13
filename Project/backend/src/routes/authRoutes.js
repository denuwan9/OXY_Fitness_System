import express from 'express';
import { CheckUser, Login, Logout, register, addUser, getUser, userUpdate, changePassword } from '../controllers/authController.js';
import { IsUser, authenticate } from '../middlewares/verifyToken.js';
import UserModel from '../models/userModel.js';
import bcrypt from 'bcryptjs';


const AuthRoutes = express.Router();

AuthRoutes.post('/register', register);
AuthRoutes.post('/login', Login);
AuthRoutes.post('/logout', Logout);
AuthRoutes.get('/CheckUser', IsUser, CheckUser);

AuthRoutes.post('/addUser', addUser);


//AuthRoutes.put('/change-password', authenticate, changePassword);
AuthRoutes.get("/getUser/:id", getUser);
AuthRoutes.put('/userUpdate/:id',  userUpdate);




AuthRoutes.post('/change-password', authenticate, changePassword );
  
export default AuthRoutes;