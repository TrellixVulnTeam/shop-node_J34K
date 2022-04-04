const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Order = new Schema({
    userId: {type: String, required:true} ,
    products: [
        {
            productId :{type: String, required: true},
            quantity: {type: Number, default: 1}
        }
    ],
    amount: {type: Number, required: true},
    address:{ type: String, required: true},
    status: {type: String, default: "pending"}
},{timestamps: true})
module.exports = mongoose.model("Order", Order)