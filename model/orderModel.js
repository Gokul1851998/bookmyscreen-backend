import mongoose from "mongoose";
const Schema = mongoose.Schema

const orderSchema = new Schema({
    userId:{
        type:mongoose.Types.ObjectId,
        ref:'User',
    },
    ownerId:{
        type:mongoose.Types.ObjectId,
        ref:'Owner',
    },
    userName:{
        type:String,
        require:true
    },
    movieName:{
        type:String,
        require:true
    },
    ownerName:{
        type:String,
        require:true
    },
    location:{
        type:String,
        required:true
    },
    showTime:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    selectedSeats:{
        type:Array,
        required:true
    },
    bookingId:{
        type:String,
        required:true
    },
    subtotal:{
        type:Number,
        required:true
    },
    fee:{
        type:Number,
        required:true
    },
    total:{
        type:Number,
        required:true
    },
    screen:{
    type:Number,
    required:true
    },
    status:{
        type:String,
        required:true
        },
    language:{
        type:String
    },
    image:{
        type:String         
    },
    paymentstatus:{
        type:String,
        default:'Active'
    }
  
},{timestamps:true})

const orderModel = mongoose.model('Order',orderSchema)
export default orderModel
