import { generateToken } from "../jwtAuth/generateJwt.js";
import nodeMailer from "nodemailer"
import adminModel from "../model/adminModel.js";
import userModel from "../model/userModel.js"
import ownerModel from "../model/ownerModel.js";

export const adminLogin =(req, res)=>{
        try{
        let {email,password}=req.body
        let response={}
        adminModel.findOne({email:email}).then((result)=>{
            if(result){
                if(result.email === email && result.password === password){
                    response.login = true
                    const token = generateToken({adminId: result._id, email:email})
                    response.token = token
                    res.status(200).json(response)
                }else{
                    res.status(200).json(response)
                }
            }else{
                res.status(200).json(response)
            }
        })
    }catch(err){
        res.status(500)
    }
}

export const getAdminUser=async(req,res)=>{
    const users = await userModel.find()
    const response ={
        success:true,
        message:'Userlist getted',
        data:users
    }
    res.status(200).json(response)
}

export const postBlockUser = async(req,res)=>{
    try {
        const userId = req.body.userId
        const user = await userModel.findOne({_id:userId})
        if(user){
            await userModel.findOneAndUpdate({_id:userId},
            {$set:{
                block: true
            }}    
            )
        }
        const usersData = await userModel.find({})
        res.send({
            success:true,
            message:'User blocked Successfully',
            data:usersData
        })

    } catch (error) {
        res.send({
            success:false,
            message:error.message
        })
    }
}

export const postUnblockUser =async(req,res)=>{
    try {
        const userId = req.body.userId
        const user = await userModel.findOne({_id:userId})
        if(user){
            await userModel.findOneAndUpdate({_id:userId},
            {$set:{
                block: false
            }}    
            )
        }

        const userData = await userModel.find({})
        res.send({
            success:true,
            message:'User unblocked successfully',
            data:userData
        })

    } catch (error) {
        res.send({
            success:false,
            message:error.message
        })
    }
}

export const getAdminOwner=async(req,res)=>{
    const owners = await ownerModel.find({})
    return res.send({
        success:true,
        message:'Ownerlist fetched successfully',
        data:owners
    })
}

export const postOwnerApprove = async(req,res,next)=>{
    try {   
        
        const ownerId = req.body.ownerId
        const owner = await ownerModel.findOne({_id:ownerId})
        
        if(owner){
            await ownerModel.findOneAndUpdate({_id:ownerId},{
                $set:{
                    status:"Approved"
                }
            }) 
            console.log('Mail sending')
            const ownerMail = owner.Email;
            const sender = nodeMailer.createTransport({
                host: "smtp.gmail.com",
                service: "Gmail",
                auth: {
                  user: "techyhost18@gmail.com",
                  pass: process.env.MAILPASS,
                },
                port: 465,
                tls: {
                  rejectUnauthorized: false,
                },
              });
              
              const mailOptions = {
                from: "Cineawe",
                to: ownerMail,
                subject: "Account Approved",
                text: `Your account has been approved. As a verified theater owner, you can now add movies and shows to our platform. Please familiarize yourself with the tools and features available. Contact us if you have any questions. Thank you for choosing to partner with us.`,
              };
              const owners = await ownerModel.find()
              sender.sendMail(mailOptions, function (error, info) {
                if (error) {
                  console.log(error);
                } else {
                
                  res.send({
                    success: true,
                    message: "Email send successfully",
                    data: owners,
                  });
                }
              });

            res.send({
                success:true,
                message:'Status Changed Successfully',
                data: owners
            })
        }else{
            res.send({
                success:false,
                message:'something went wrong'
            })
        }
    } catch (error) {
        res.send({
            success:true,
            message:error.message
        })
    }
}
