import mongoose, {Types} from "mongoose";
import Category from "./Category";
import User from "./User";

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
        validate: {
            validator: async (categoryId: Types.ObjectId) => {
               const category =  await Category.findById(categoryId);
                return !!category;
            },
            message: 'Category does not exist',
        }
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        validate: {
            validator: async (userId: Types.ObjectId) => {
                const user =  await User.findById(userId);
                return !!user;
            },
            message: 'User does not exist',
        }
    },
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
    images: {
        type: [String],
        default: null
    }
});

const Product = mongoose.model('Product', ProductSchema);
export default Product;