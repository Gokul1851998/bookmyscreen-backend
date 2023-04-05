import mongoose from "mongoose";
const Schema = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId


const userSchema = new Schema({
    signName:{
        type:String
    },
    signPhone:{
        type:Number
    },
    signEmail:{
        type:String
    },
    signPassword:{
        type:String
    },
    block:{
        type:Boolean,
        default:false
    },
    wallet:{
        type:Number,
        default:0
    }

})
const userModel = mongoose.model('User',userSchema)
export default userModel