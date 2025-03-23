import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieparser from "cookie-parser"
import DbCon from "./utlis/db.js"
import AuthRoutes from "./routes/authRoutes.js"
import AdminRoutes from "./routes/AdminRoutes.js"


dotenv.config()
const PORT = process.env.PORT || 3000
const app = express()

// mongo db
DbCon()

app.use(express.json())
app.use(cookieparser())
app.use(cors({
    credentials: true,
    origin:"http://localhost:5177"
}));

app.use("/api/auth",AuthRoutes)
app.use("/api/admin",AdminRoutes)


app.get("/", (req, res) => {
    res.send("Hello World")
    })

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    })
