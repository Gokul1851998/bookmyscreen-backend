import mongoose from "mongoose";
const Schema = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId

const screenSchema = new Schema({
    ownerId:{
        type:mongoose.Types.ObjectId,
        ref:'Owner',
    },
    screen:{
        type:Number,
        required:true
    },
    rows:{
        type:Number,
        required:true
    },
    columns:{
        type:Number,
        required:true
    },
    totalSeats:{
        type:Number
    }
    
    
},{timestamps:true})

const screenModel = mongoose.model('Screen',screenSchema)
export default screenModel