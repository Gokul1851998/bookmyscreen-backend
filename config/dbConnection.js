import mongoose from "mongoose";

const connection = ()=>{
    mongoose.connect('mongodb://0.0.0.0:27017/bookmyscreen')
}

export default connection