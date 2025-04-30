import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: true,
    trim: true
  },
  lname: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  number: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum:['admin','manager','trainer','supplier',"user"],
    default: "user"
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: ''
  }
  
},{timestamps: true});


const UserModel = mongoose.model('user', userSchema)

export default UserModel