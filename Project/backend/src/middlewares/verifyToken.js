import jwt from 'jsonwebtoken'
import UserModel from '../models/userModel.js'


const isAdmin = async (req,res,next) => {
    try{
        const token = req.cookies.token
        if(!token) {
            return res.status(401).json({message:"'Unauthorized: No token provided'"})
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET)
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

 const IsUser = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id }; // Attach ID for multer and controllers
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};



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
    const authHeader = req.headers.authorization;
  
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Missing token' });
    }
  
    const token = authHeader.split(' ')[1];
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await UserModel.findById(decoded.userId); // or decoded.id, depending on your token payload
  
      if (!user) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }
  
      req.user = user; // full user object for later use
      next();
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }
  };
  
  

export {isAdmin, IsUser, authorizeAdmin, authenticate}