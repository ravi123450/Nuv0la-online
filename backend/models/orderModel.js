import mongoose from "mongoose"

const orderSchema = new mongoose.Schema({
    userId:{type:String,required:true},
    items:{type:Array,required:true},
    amount:{type:Number,required:true},
    address:{type:Object,required:true},
    status:{type:String,default:"Food Processing"},
    date:{type:Date,default:Date.now()},
    payment:{type:Boolean,default:false},
    razorpayOrderId: { type: String },
    lat: { type: Number, default: null }, // Latitude for tracking
    lon: { type: Number, default: null } ,// Store Razorpay order ID
    updatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
})

const orderModel = mongoose.models.order || mongoose.model("order",orderSchema)
export default orderModel;