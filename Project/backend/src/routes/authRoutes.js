import express from 'express';
import { CheckUser, Login, Logout, register, addUser, getUser, userUpdate, uploadAvatar, upload } from '../controllers/authController.js';
import { IsUser, authenticate } from '../middlewares/verifyToken.js';



const AuthRoutes = express.Router();

AuthRoutes.post('/register', register);
AuthRoutes.post('/login', Login);
AuthRoutes.post('/logout', Logout);
AuthRoutes.get('/CheckUser', IsUser, CheckUser);

AuthRoutes.post('/addUser', addUser);



AuthRoutes.get("/getUser/:id", getUser);
AuthRoutes.put('/userUpdate/:id',  userUpdate);


AuthRoutes.put('/avatar',IsUser, upload.single('avatar'), uploadAvatar);
export default AuthRoutes;