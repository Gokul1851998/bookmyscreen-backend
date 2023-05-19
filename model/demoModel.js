import mongoose from "mongoose";
const Schema = mongoose.Schema

const demoSchema = new Schema({
    DocDate:{
        type:String
    },
    Project:{
        type:String
    },
    ProjectDes:{
        type:String
    },
    Location:{
        type:String
    },
    Id:{
        type:String
    },
    Body:{
       type:Array
    }
    
},
{
    timestamps: true,
  })

const demoModel = mongoose.model('demo',demoSchema)
export default demoModel