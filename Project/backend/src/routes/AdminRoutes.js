import express from 'express'
import { Getuser, updateUser, deleteUser, generatePDF } from '../controllers/Admin.js'
import { isAdmin } from '../middlewares/verifyToken.js'


const AdminRoutes = express.Router()
AdminRoutes.get("/getuser",isAdmin,Getuser)
AdminRoutes.post("/delet/:id",isAdmin,deleteUser)
AdminRoutes.put("/updateUser/:id", isAdmin, updateUser);

AdminRoutes.get("/getuser-pdf", isAdmin, generatePDF);
export default AdminRoutes