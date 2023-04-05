import mongoose from "mongoose";
const Schema = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId


const ownerSchema = new Schema({
    Name:{
        type:String
    },
    Phone:{
        type:Number
    },
    Email:{
        type:String
    },
    Licence:{
        type:String
    },
    Adhaar:{
        type:Number
    },
    Password:{
        type:String
    },
    wallet:{
        type:Number,
        default:0
    },
    status:{
      type:String,
      default:'Pending'
    },
    block:{
        type:Boolean,
        default:false
    },

})
const ownerModel = mongoose.model('Owner',ownerSchema)
export default ownerModel