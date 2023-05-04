import mongoose from "mongoose";

const connection = ()=>{
    mongoose.connect('mongodb+srv://bookmyscreen:88888888@cluster0.gvssqdc.mongodb.net/bookmyscreen?retryWrites=true&w=majority')
}

export default connection