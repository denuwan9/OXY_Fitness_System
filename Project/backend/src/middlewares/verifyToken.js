import jwt from 'jsonwebtoken'
import UserModel from '../models/userModel.js'


const isAdmin = async (req,res,next) => {
    try{
        const token = req.cookies.token
        if(!token) {
            return res.status(401).json({message:"'Unauthorized: No token provided'"})
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRETE)
        const user =await UserModel.findById(decoded.userId)

        if(!user){ 
            return res.status(401).json({message:"'user not found'"})
        }
        if(user.role !== 'admin'){
            return res.status(403).json({message:"'Unauthorized: User is  not an admin'"})
        }

     req.user = user
        next()

    }catch(error){
        console.log(error)
    }
}

const IsUser=async(req,res,next)=>{
   try {
      const token=req.cookies.token
      if (!token) {
         return res.status(401).json({messsage:"'Unauthorized: No token provided'"})
      }

      const decoded= jwt.verify(token,process.env.JWT_SECRETE)
      const user=await UserModel.findById(decoded.userId)
      if (!user) {
         return res.status(401).json({messsage:"'user not found'"})
      }

    
    req.user=user
      next()
   
 } catch (error) {
     console.log(error)
 }
}


const authorizeAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: Admin privileges required"
      });
    }
    next();
  };

  
  const authenticate = async (req, res, next) => {
    try {
      // 1. Get token from either cookies or Authorization header
      const token = req.cookies?.token || req.headers?.authorization?.split(" ")[1];
      
      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Authentication required: No token provided"
        });
      }
  
      // 2. Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // 3. Find user in database
      const user = await UserModel.findById(decoded.userId).select("-password");
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }
  
      // 4. Attach user to request object
      req.user = user;
      next();
      
    } catch (error) {
      console.error("Authentication error:", error);
      
      // Handle different JWT errors specifically
      if (error.name === "JsonWebTokenError") {
        return res.status(401).json({
          success: false,
          message: "Invalid token"
        });
      }
      
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Token expired"
        });
      }
      
      res.status(500).json({
        success: false,
        message: "Authentication failed",
        error: error.message
      });
    }
  };
  
  

export {isAdmin,IsUser, authorizeAdmin, authenticate}