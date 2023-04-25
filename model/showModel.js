import mongoose from "mongoose";
const Schema = mongoose.Schema

const showSchema = new Schema({
    screenId:{
        type:mongoose.Types.ObjectId,
        ref:'Screen',
    },
    ownerId:{
        type:mongoose.Types.ObjectId,
        ref:'Owner',
    },
    ownerName:{
        type:String,
        require:true
    },
    location:{
        type:String,
        require:true
    },
    movieName:{
        type:String,
        required:true
    },
    showTime:{
        type:String,
        required:true
    },
    startDate:{
        type:Date,
        required:true
    },
    endDate:{
        type:Date,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    screen:{
        type:Number,
        required:true
    },
    dates:{
        type:Array,
        require:true
    },
    
    
},{timestamps:true})

const showModel = mongoose.model('Show',showSchema)
export default showModel
