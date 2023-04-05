import ownerModel from "../model/ownerModel.js";
import otpGenerator from "../otpGenerator/otpGenerator.js"
import { generateToken } from "../jwtAuth/generateJwt.js";
import sendMail from "../nodeMailer/nodeMailer.js";
import bcrypt, { hash } from 'bcrypt'


export let otpVerify
export const ownerOtp = (req, res) => {
    try {
        let ownerData = req.body
        let response = {}
        ownerModel.findOne({ Email: ownerData.Email }).then((owner) => {
            if (owner) {
                response.ownerExist = true
                res.status(200).json(response)
            } else {
                otpGenerator().then((otp) => {
                    sendMail(ownerData.Email, otp).then((result) => {
                        if (result.otpSent) {
                            otpVerify = otp
                            res.status(200).json(response)
                        } else {
                            res.status(500)
                        }
                    })
                })
            }
        })

    } catch (err) {
        res.status(500).json(err)
    }
}


export const signUp =(req,res)=>{
  try{
    const owner = req.body.OwnerData
    console.log(owner);
    const otp = req.body.otp
    let response = {}  
    if(otp === otpVerify){
        bcrypt.hash(owner.Password, 10).then((hash) => {
            owner.Password= hash
            const newOwner = new ownerModel(owner)
            newOwner.save().then(() => {
                response.status = true
                res.status(200).json(response)
            })
        })
    }
  }catch (err) {
    res.status(500).json(err)
}
}

export const login=async(req,res)=>{
    try{
        let response ={}
        let {email,password} = req.body
       await ownerModel.findOne({Email:email}).then((owner)=>{
         if(owner){
              if(owner.status === "Approved"){
                bcrypt.compare(password,owner.Password, function (err, result) {
                    if (result) {
                        const token = generateToken({ ownerId: owner._id, email: owner.Email, type: 'owner' })
                        response.token = token
                        response.logIn = true
                        res.status(200).json(response)
                    } else {
                        response.incPass = true
                        res.status(200).json(response)
                    }
                })
              }else{
                response.status = "Pending"
                res.status(200).json(response)
              }
         }else{
            response.noUser = true
            res.status(200).json(response)
         }
       })
    }catch (err) {
        res.status(500).json(err)
    }
}

export const getCurrentOwner =async(req,res)=>{
    try {
        const owner = await ownerModel.findById(req.body.Id).select("-Password")
        res.send({
            success: true,
            message: "User Details fetched successfully",
            data: owner
          });
    } catch (error) {
        return error.message
    }
}