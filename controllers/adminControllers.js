import { generateToken } from "../jwtAuth/generateJwt.js";
import nodeMailer from "nodemailer"
import adminModel from "../model/adminModel.js";
import userModel from "../model/userModel.js"
import ownerModel from "../model/ownerModel.js";
import movieModel from "../model/movieModel.js";
import orderModel from "../model/orderModel.js";
import jwt from "jsonwebtoken"

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

export const verifyTokenAdmin = async(req, res, next)=>{
    try{
       const adminId =res.locals.Id
       console.log(token);
       const admin = await adminModel.findOne({_id:adminId})
       if(admin){
        res.status(200).json({ token: true })
       }else{
        res.status(200).json({ token: false })
       }
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

export const postOwnerDenied= async(req,res)=>{
    try{
       const ownerId = req.body.ownerId
       const owner = await ownerModel.findOne({_id:ownerId})
       if(owner){
        await ownerModel.findOneAndUpdate({_id:ownerId},{
            $set:{
                status:"Denied"
            }
        })
        const owners = await ownerModel.find()
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
    }catch (error) {
        res.send({
            success:true,
            message:error.message
        })
    }
}

export const postBlockOwner = async(req,res) =>{
   try{
    const ownerId = req.body.ownerId
    const owner = await ownerModel.findOne({_id:ownerId})
    if(owner){
        await ownerModel.findOneAndUpdate({_id:ownerId},
        {$set:{
            block: true
        }}    
        )
    }
    const owners = await ownerModel.find({})
    res.send({
        success:true,
        message:'Owner blocked Successfully',
        data:owners
    })
   }catch (error) {
        res.send({
            success:false,
            message:error.message
        })
    }
}

export const postUnblockOwner = async(req,res)=>{
    try{
      const ownerId = req.body.ownerId
      const owner = await ownerModel.findOne({_id:ownerId})
      if(owner){
        await ownerModel.updateOne({_id:ownerId},
            {$set:{
                block: false
            }}    
            )
    }

    const owners = await ownerModel.find({})
    res.send({
        success:true,
        message:'Owner unblocked successfully',
        data:owners
    })
    }catch (error) {
        res.send({
            success:false,
            message:error.message
        })
    }
}

export const getMovies= async(req,res)=>{
    try{
        const movies = await movieModel.find({})
        if(movies){
            res.send({
                success:true,
                message:'Movies are Available',
                data:movies
            })
        }else{
            res.send({
                success:false,
                message:'Movies not Found',
            })
        }
    }catch (error) {
        res.send({
            success:true,
            message:error.message
        })
    }
}

export const postAddMovies = async (req,res)=>{
     try{ 
        const existMovie = await movieModel.findOne({movieId:req.body.movieDetails.id})
        if(existMovie){
            res.send({
            success:false,
            message:'Movie already added'
            })
        }else{
       const movieData={  movieId : req.body.movieDetails.id,
                          title : req.body.movieDetails.title,
                          language : req.body.movieDetails.original_language,
                          releaseDate : req.body.movieDetails.release_date,
                           }
                     
                       const newMovie = new movieModel(movieData)
                       newMovie.save().then(async() => {
                        const movies = await movieModel.find()
                        res.send({
                            success:true,
                            message:'Movie Added',
                            data:movies
                        })
                       })
                      
     }  
     }catch (error) {
        res.send({
            success:true,
            message:error.message
        })
    }
}

export const postDeleteMovie = async(req,res)=>{
    try{
       const movieId = req.body.movieId
       const movie = await movieModel.find({_id:movieId})
       if(movie){
        await movieModel.deleteOne({_id: movieId})
        const movies = await movieModel.find({})
       res.send({
        success:true,
        message:'Movie deleted successfully',
        data:movies
    })
       }else{
        res.send({
            success:false,
            message:'something went wrong'
        })
       }
    }catch (error) {
        res.send({
            success:true,
            message:error.message
        })
    }
}

export const getAllorders = async(req,res)=>{
    try{
        const orders = await orderModel.find().sort({ createdAt: -1 })
        if(orders){
            res.send({
                success:true,
                message:'User Orders',
                data:orders
            })
        }else{
            res.send({
                success:false,
                message:'Something went wrong',
            })
        }
    }catch (error) {
        res.send({
            success:true,
            message:error.message
        })
    }
}

export const viewOrder = async(req,res)=>{
    try{
       const order = await orderModel.findOne({_id:req.params.id})
       if(order){
        res.send({
            success:true,
            message:'User Order',
            data:order
        })
       }else{
        res.send({
            success:false,
            message:'Something went wrong',
        })
       }
    }catch (error) {
        res.send({
            success:true,
            message:error.message
        })
    }
}
