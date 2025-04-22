import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieparser from "cookie-parser"
import DbCon from "./utlis/db.js"
import AuthRoutes from "./routes/authRoutes.js"
import AdminRoutes from "./routes/AdminRoutes.js"
import UserModel from "./models/userModel.js"
import nodemailer from "nodemailer"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

dotenv.config()
const PORT = process.env.PORT || 3000
const app = express()

// mongo db
DbCon()

app.use(express.json())
app.use(cookieparser())
app.use(cors({
    credentials: true,
    origin:"http://localhost:5173"
}));
app.use("/api/auth",AuthRoutes)
app.use("/api/admin",AdminRoutes)


app.post('/forgot-password', (req, res) => {
    const {email} = req.body;
    UserModel.findOne({email: email})
    .then(user => {
        if(!user) {
            return res.send({Status: "User not existed"})
        } 
        const token = jwt.sign({id: user._id}, "jwt_secret_key", {expiresIn: "1d"})
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
          });
          
          var mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Reset Password Link',
            text: `http://localhost:5173/reset_password/${user._id}/${token}`
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              return res.send({Status: "Success"})
            }
          });
    })
})


app.post('/reset-password/:id/:token', (req, res) => {
    const {id, token} = req.params
    const {password} = req.body

    jwt.verify(token, "jwt_secret_key", (err, decoded) => {
        if(err) {
            return res.json({Status: "Error with token"})
        } else {
            bcrypt.hash(password, 10)
            .then(hash => {
                UserModel.findByIdAndUpdate({_id: id}, {password: hash})
                .then(u => res.send({Status: "Success"}))
                .catch(err => res.send({Status: err}))
            })
            .catch(err => res.send({Status: err}))
        }
    })
})


app.get("/", (req, res) => {
    res.send("Hello World")
    })

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    })
