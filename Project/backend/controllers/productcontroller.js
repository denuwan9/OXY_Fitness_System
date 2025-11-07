import Product from "../models/product.js";
import fs from "fs";

//add product

const addProduct = async (req, res) => {
    
    let image_filename = '${req.file.filename}';

     const product = new Product({
        name: req.body.name,
        brand: req.body.brand,
        serving: req.body.serving,
        oldPrice: req.body.oldPrice,
        newPrice: req.body.newPrice,
        image: image_filename,
     });

     try{
        await product.save();
        res.json({sucess: true, message: "Product added successfully"});
     }catch(error){
         console.log(error);
         res.json({sucess: false, message: "Product could not be added"});
     }

 
}
export { addProduct };