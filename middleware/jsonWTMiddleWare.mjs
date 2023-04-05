import { response } from "express"
import jwt from "jsonwebtoken"

export function verifyTokenAdmin(req,res,next){

        let token = req?.headers?.authorization?.split(' ')[1]
    if(token==='null'){
        res.json({token:false})
    }else{
        jwt.verify(token,process.env.TOKEN_SECRET,(err,data)=>{
            if(err){
                res.status(200).json({token: false})
            }else{
                console.log('here');
                res.status(200).json({token:true})
            }
        })
    }

}