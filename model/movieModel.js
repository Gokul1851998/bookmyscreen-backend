import mongoose from "mongoose";
const Schema = mongoose.Schema

const movieSchema = new Schema({
    movieId:{
        type:Number
    },
    title:{
        type:String
    },
    language:{
        type:String
    },
    releaseDate:{
        type:String
    },
    
})

const movieModel = mongoose.model('movie',movieSchema)
export default movieModel