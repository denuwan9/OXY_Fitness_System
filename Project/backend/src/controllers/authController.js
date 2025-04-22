import UserModel from "../models/userModel.js"
import jwt from "jsonwebtoken"
import bcryptjs from "bcryptjs"
import AuthRoutes from "../routes/authRoutes.js"


const addUser = async (req, res) => {
  try {
    const { fname, lname, email, password, role, address, city, number } = req.body;

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: "User already exists" 
      });
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create new user
    const newUser = new UserModel({
      fname,
      lname,
      email,
      password: hashedPassword,
      role: role || 'user', // Default to 'user' if not specified
      address,
      city,
      number
    });

    // Save to database
    await newUser.save();

    // Return response without password
    const userToReturn = { ...newUser._doc };
    delete userToReturn.password;

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: userToReturn
    });
  } catch (error) {
    console.error("Add user error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating user",
      error: error.message
    });
  }
};


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



const getUser = async (req, res, next) => {
  const { id } = req.params;  // Correct destructuring
  console.log("Received ID:", id); // This will now show the actual ID
  
  try {
      const user = await UserModel.findById(id);
      
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({
          message: "User fetched successfully",
          user: user
      });
  } catch (error) {
      console.log("Error details:", error);
      if (error.name === 'CastError') {
          return res.status(400).json({ 
              message: "Invalid user ID format",
              receivedId: id
          });
      }
      console.error(error);
      res.status(500).json({ message: "Server error" });
  }
};

const userUpdate = async (req, res, next) => {
  const { id } = req.params;
  
  // Extract only allowed fields to prevent unwanted updates
  const { fname, lname, email, address, city, number } = req.body;
  
  try {
    // Check if user exists first
    const user = await UserModel.findById(id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create update object with only the fields we want to allow
    const updateData = {
      fname,
      lname,
      email,
      address,
      city,
      number
    };

    // Update with only the allowed fields
    const updatedUser = await UserModel.findByIdAndUpdate(
      id, 
      updateData, 
      { 
        new: true,
        runValidators: true // Ensures updated data follows schema validation
      }
    );

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser 
    });
  } catch (error) {
    console.error("Error updating user:", error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        message: "Invalid user ID format",
        receivedId: id
      });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: "Validation error",
        details: error.message
      });
    }
    
    res.status(500).json({ 
      message: "Server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export { register, Login, Logout, CheckUser, addUser, getUser, userUpdate };