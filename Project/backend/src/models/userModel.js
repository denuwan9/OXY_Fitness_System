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
  },
  membershipType: {
    type: String,
    enum: ['Platinum', 'Gold', 'Silver'],
    default: 'Silver'
  },
  membershipStartDate: {
    type: Date
  },
  membershipEndDate: {
    type: Date
  },
  profileImage: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // Dietary preferences
  dietType: {
    type: String,
    enum: ['None', 'Vegetarian', 'Vegan', 'Pescatarian', 'Non-Vegetarian', 'Other'],
    default: 'None'
  },
  allergies: [String],
  specialGuidelines: {
    type: String,
    trim: true
  },
  schedulePreferences: {
    type: [String],
    default: []
  },
  specialScheduleRequest: {
    type: String,
    trim: true,
    default: ''
  }
  
},{timestamps: true});


const UserModel = mongoose.model('user', userSchema)

export default UserModel;