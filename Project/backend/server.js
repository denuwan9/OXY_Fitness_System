import express from 'express';
import cors from 'cors';
import DbCon from './src/utlis/db.js';
import dotenv, { config } from "dotenv"
import productRouter from './routes/productRoute.js';
import orderRouter from './routes/orderRoute.js';
import inventoryRouter from './routes/inventoryRoutes.js';
import cookieparser from 'cookie-parser';
const app = require('./app'); 

//app config
dotenv.config()
const PORT = process.env.PORT || 3000
const app = express()

//middleware
app.use(express.json())
app.use(cookieparser())
app.use(cors({
    credentials: true,
    origin:"http://localhost:5173"
}));

//db connection
DbCon();

//api endpoints
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);
app.use("/api/inventory", inventoryRouter);

app.get("/", (req, res) => {
    res.send("Hello World")
    })

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    })