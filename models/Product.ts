import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Заголовок обязателен']
    },
    description: {
        type: String,
        default: null
    },
    price: {
        type: Number,
        min: [1, 'Price must be at least 1$'],
        required: true
    },
    image: {
        type: String,
        default: null
    }
});

const Product = mongoose.model('Product', ProductSchema);
export default Product;