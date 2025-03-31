import UserModel from "../models/userModel.js"
import jwt from "jsonwebtoken"
import bcryptjs from "bcryptjs"
import AuthRoutes from "../routes/authRoutes.js"


const register = async (req, res) => {
  try {
    const {fname,lname,address,city,number,email,password} = req.body
      
    const existingUser = await UserModel.findOne({ email })
    if (existingUser) {
      return res.status(401).json({success:false, message: "User already exists" }) 
    }
    const hashedPassword = await bcryptjs.hashSync(password, 10)
    const newUser = new UserModel({
      fname,
      lname,
      address,
      city,
      number,
      email,
      password: hashedPassword
    })
      
    await newUser.save()
    res.status(200).json({message:"user register successfully", newUser}) 
  } catch (error) {
    res.status(500).json({success:false, message: "Internal server error" }) 
    console.log(error)
  }
}

const Login = async (req, res) => {         
  try{
    const {email,password} = req.body
    
    const user= await UserModel.findOne({email})
    if(!user){
      return res.status(404).json({success:false,message:"User not found"})
    }

    const ispasswordValid = await bcryptjs.compare(password,user.password)
    if(!ispasswordValid){
      return res.status(404).json({success:false,message:"Invalid password"})
    }
    const token = jwt.sign({userId:user._id},process.env.JWT_SECRETE)

     res.cookie("token",token,{
        httpOnly:true,
        secure: false,
        maxAge: 3600000
    })
    res.status(200).json({success:true,message:"Login successfully",user,token})

  }catch(error){
    res.status(500).json({success:false, message: "Internal server error" }) 
    console.log(error)
  }
}

const Logout = async (req, res) => {
  try {
    res.clearCookie("token")
    res.status(200).json({message:"Logout successfully"})
  } catch (error) {
    res.status(500).json({success:false, message: "Internal server error" }) 
    console.log(error)
  }
}



const CheckUser=async(req,res)=>{
  try{

  }catch (error){

  }
}
export { register, Login, Logout, CheckUser }