import mongoose from "mongoose";

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },  
    brand: {
        type: String,
        required: true,
    },  
    image: {
        type: String,
        required: true,
    },
    serving: {
        type: String,
        required: true,
    },
    oldPrice: {
        type: Number,
        required: true,
    },
    newPrice: {
        type: Number,
        required: true,
    },

});

const Product = mongoose.models.Product|| mongoose.model("Product", productSchema);

export default Product;