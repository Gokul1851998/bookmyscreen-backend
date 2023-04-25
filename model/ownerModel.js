import mongoose from "mongoose";
const Schema = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId


const ownerSchema = new Schema({
    Name:{
        type:String,
        require:true
    },
    Phone:{
        type:Number,
        require:true
    },
    Email:{
        type:String,
        require:true
    },
    Licence:{
        type:String,
        require:true
    },
    Adhaar:{
        type:Number,
        require:true
    },
    Location:{
        type:String,
        require:true
    },
    Password:{
        type:String,
        require:true
    },
    wallet:{
        type:Number,
        default:0
    },
    images:{
        type:String,
        require:true
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