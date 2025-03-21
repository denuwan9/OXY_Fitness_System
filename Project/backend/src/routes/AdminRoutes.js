import express from 'express'
import { Getuser } from '../controllers/Admin.js'
import { deletUser } from '../controllers/Admin.js'
import { isAdmin } from '../middlewares/verifyToken.js'

const AdminRoutes = express.Router()
AdminRoutes.get("/getuser",isAdmin,Getuser)
AdminRoutes.post("/delet/:id",isAdmin,deletUser)

export default AdminRoutes