import mongoose from "mongoose";

import ownerModel from "../model/ownerModel.js";
import screenModel from "../model/screenModel.js";
import otpGenerator from "../otpGenerator/otpGenerator.js"
import { generateToken } from "../jwtAuth/generateJwt.js";
import sendMail from "../nodeMailer/nodeMailer.js";
import bcrypt, { hash } from 'bcrypt'
import cloudinary from "../middleware/cloudinary/cloudinary.js";
import movieModel from "../model/movieModel.js";
import showModel from "../model/showModel.js";
import moment from "moment";
import orderModel from "../model/orderModel.js";
import userModel from "../model/userModel.js";

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
    const image = req.body.imageData
    const otp = req.body.otp
    let response = {}  
    if(otp === otpVerify){
        cloudinary.uploader.upload(image).then((result,error)=>{
            bcrypt.hash(owner.Password, 10).then((hash) => {
                owner.Password= hash
                owner.images=result.secure_url
                const newOwner = new ownerModel(owner)
                newOwner.save().then(() => {
                    response.status = true
                    res.status(200).json(response)
                })
            })
        })
       
    }
  }catch (err) {
    res.status(500).json(err)
}
}

export const resendOtp = (req, res) => {
    try {
        let response = {}
        let email = req.body.email
        otpGenerator()
            .then((otp) => {
                otpVerify = otp
                sendMail(email, otp)
                    .then((result) => {
                        if (result.otpSent) {
                            response.otpSent = true
                            res.status(200).json(response)
                        } else {
                            res.status(500)
                        }
                    })
            })
    }
    catch (err) {
        res.status(500)
    }
}

export const login=async(req,res)=>{
    try{
        let response ={}
        let {email,password} = req.body
        const owner =await ownerModel.findOne({Email:email})
      
       await ownerModel.findOne({Email:email}).then((owner)=>{
         if(owner){
              if(owner.status === "Approved" && owner.block === false){
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
              }else if(owner.status === "Pending"){
                response.status = "Pending"
                res.status(200).json(response)
              }else if(owner.status === "Denied"){
                response.status = "Denied"
                res.status(200).json(response)
              }else{
                response.status = "You are Blocked"
                response.block = true
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
        const owner = await ownerModel.findById(res.locals.Id).select("-Password")
        res.send({
            success: true,
            message: "Owner Details fetched successfully",
            data: owner
          });
    } catch (error) {
        return error.message
    }
}

export const postAddScreen = async(req,res)=>{
   try{
        const ownerId = req.body.owner._id
        const rows = req.body.rows
        const columns = req.body.columns
        const screen = req.body.screen
        const totalSeats = rows*columns
        const screenExist = await screenModel.find({ownerId:ownerId,screen:screen}).count()
        if(screenExist){
            res.send({
                success:false,
                message:'Screen already exist'
            })
        }else{
            const newScreen = new screenModel({
                ownerId,
                rows,
                columns,
                screen,
                totalSeats,
            })
            await newScreen.save();
            const screens = await screenModel.find({ownerId:ownerId})
            res.send({
                success:true,
                message:'Screen added successfully',
                data:screens
            })
        }
        
     }catch (error) {
        return error.message
     }
}

export const getScreen = async(req,res)=>{
    try{
    const ownerId = req.params.id
    
    const screens = await screenModel.find({ownerId:ownerId})
    if(screens){
        res.send({
            success:true,
            message:'Screen already exist',
            data:screens
        })
    }else{
        res.send({
            success:false,
            message:'Add screen'
        })
    }
    }catch (error) {
        return error.message
     }
}

export const deteteScreen = async(req,res)=>{
    try{
      const screenId = req.body.screenId
      const screen = await screenModel.findOne({_id:screenId})
      const ownerId = screen.ownerId
      if(screen){
        await screenModel.deleteOne({_id: screenId})
        const screens = await screenModel.find({ownerId:ownerId})
       res.send({
        success:true,
        message:'Screen deleted successfully',
        data:screens
    })
       }else{
        res.send({
            success:false,
            message:'something went wrong'
        })
       }

    }catch (error) {
        return error.message
     }
}

export const getMovieName = async(req,res)=>{
    try{
       const movie = await movieModel.find()
       res.send({
        success:true,
        data:movie
    })
        
    }catch (error) {
        return error.message
     }
}

export const getSelectScreen = async(req,res)=>{
    try{
      const ownerId = req.params.id
      const screen = await screenModel.find({ownerId:ownerId})
      if(screen){
        res.send({
            success:true,
            data:screen
        })
      }else{
        res.send({
            success:false,
            message:'Screens are not added'
        })
      } 
    }catch (error) {
        return error.message
     }
}


export const postAddShow = async(req,res)=>{
    try{
        const ownerId = req.body.owner._id
        const screen = req.body.screen
        const owner = await ownerModel.findOne({_id:ownerId})
        const ownerName = owner.Name
        const location = owner.Location
        const ownerScreen = await screenModel.findOne({ownerId:ownerId} && {screen:screen})
        const screenId = ownerScreen._id
        const time = req.body.time
        const movieName = req.body.inputValue
        const startDate = req.body.startDate
        const endDate = req.body.endDate
        const newStartDate = new Date(req.body.startDate)
        const newEndDate = new Date(req.body.endDate)
        const theaterSeats = []
        const showTime = moment(time, 'HH:mm').format('hh:mma');
        for (let i = 0; i < ownerScreen.rows; i++) {
            for (let j = 0; j < ownerScreen.columns; j++) {
              const seatId = String.fromCharCode(65 + i) + '-' + (j + 1);
              const seat = { id: seatId,seatStatus:'available'};
              theaterSeats.push(seat);
            }
        }
        const dates = [];

        for (let date = newStartDate; date <= newEndDate; date.setDate(date.getDate() + 1)) {
        dates.push({ date: new Date(date) , seats:theaterSeats });
        }   
        const price = req.body.price
        const show = await showModel.findOne({screenId:screenId} && {showTime:showTime})
        if(show){
            res.send({
                success:false,
                message:'Show already Exist'
            })
        }else{
            const newShow = new showModel({
                ownerId,
                screenId,
                movieName,
                showTime,
                screen,
                startDate,
                endDate,
                price,
                ownerName,
                dates,
                location
            })
            await newShow.save();
            const shows = await showModel.find({ownerId:ownerId})
            res.send({
                success:true,
                message:'Show added successfully',
                data:shows
            })
        }
    }catch (error) {
        return error.message
     }
}

export const getShows = async(req,res) =>{
    try{
        const ownerId = req.params.id
        const shows = await showModel.find({ownerId:ownerId})
        if(shows){
            res.send({
                success:true,
                data:shows
            })
        }else{
            res.send({
                success:false,
                message:'Show Unavaiable',
            })
        }
    }catch(error) {
        return error.message
     }
}

export const postDeleteShow = async(req,res)=>{
    try{
      const showId = req.body.showId
      const owner = await showModel.findOne({_id:showId})
      const ownerId = owner.ownerId
      if(showId){
       await showModel.deleteOne({_id:showId})
       const shows = await showModel.find({ownerId:ownerId})
      res.send({
        success:true,
        message:'Show Deleted',
        data:shows
    })
}
    }catch(error) {
        return error.message
     }
}

export const postEditScreen = async(req,res)=>{
    try{
       const screenId = req.body.newId
       const ownerId =req.body.owner._id
       const screenNo = req.body.screen
       const rows = req.body.rows
       const columns = req.body.columns
       const totalSeats = rows*columns
       const screen = await screenModel.findOne({_id:screenId})
       if(screen){
         await screenModel.findOneAndUpdate({_id:screenId},
            {$set:{
               screen:screenNo,
               rows:rows,
               columns:columns,
               totalSeats:totalSeats
            }})
       }
       const screens = await screenModel.find({ownerId:ownerId})
    res.send({
        success:true,
        message:'Screen edited',
        data:screens
    })
    }catch(error) {
        return error.message
     }
}

export const postEditShow = async(req,res)=>{
    try{
      const showId = req.body.editId
      const ownerId = req.body.owner._id
      const showTime = req.body.showTime
      const price = req.body.editprice
      const movieName = req.body.inputValue
      const startDate = req.body.startDate
      const endDate = req.body.endDate
      const screen = req.body.screen
      const newStartDate = new Date(req.body.startDate)
      const newEndDate = new Date(req.body.endDate)
      const dates = [];

        for (let date = newStartDate; date <= newEndDate; date.setDate(date.getDate() + 1)) {
        dates.push({ date: new Date(date) });
        }
      const show = await showModel.findOne({_id:showId})
      if(show){
        await showModel.findOneAndUpdate({_id:showId},
            {$set:{
               screen:screen,
               movieName:movieName,
               price:price,
               showTime:showTime,
               startDate:startDate,
               endDate:endDate,
               dates:dates
            }})
      }
      const shows = await showModel.find({ownerId:ownerId})
    res.send({
        success:true,
        message:'Show Updated',
        data:shows
    })
    }catch(error) {
        return error.message
     }
}

export const getBookings = async(req,res)=>{
    try{
     const ownerOrders = await orderModel.find({ownerId:req.params.id},{userId:0,ownerId:0}).sort({ createdAt: -1 })
     if(ownerOrders){
        res.send({
            success:true,
            message:'Here is the order',
            data:ownerOrders
        })
     }else{
        res.send({
            success:false,
            message:'Something went wrong',
        })
     }
    }catch(error) {
        return error.message
     }
}

export const getAppoval = async(req,res)=>{
    try{
      const owner = await ownerModel.findOne({Email:req.params.id})
      if(owner){
         await ownerModel.findOneAndUpdate({Email:req.params.id},
            {
                $set:{
                    status :'Pending'
                }
            })

            res.send({
                success:true,
                message:'Your are reapply for the approval .Your get an response with in 4-5days',
            }) 
      }else{
        res.send({
            success:false,
            message:'Something went wrong',
        }) 
      }
    }catch(error) {
        return error.message
     }
}

export const getStatus = async(req,res)=>{
    try{
      const booked = await orderModel.find({ownerId:req.body._id , status:'Booked'})
      const canceled = await orderModel.find({ownerId:req.body._id , status:'Canceled'})
      const bookedCount = booked.length
      const canceledCount = canceled.length
      res.send({
        success:true,
        message:'Your status',
        data: [bookedCount,canceledCount]
    })
    }catch(error) {
        return error.message
     }
}

export const getMonthlySails = async(req,res)=>{
    try{
        const ownerId =req.body._id
        const year = new Date().getFullYear();
        const userCount = new Array(12).fill(0);
        const promises = [];
        
        for (let month = 1; month <= 12; month++){
          const start = new Date(`${year}-${month.toString().padStart(2, '0')}-01`);
          let end;
          if (month === 12) {
            end = new Date(`${year}-12-31`);
          } else {
            end = new Date(`${year}-${(month + 1).toString().padStart(2, '0')}-01`);
          }
          
          const promise = await orderModel.aggregate([
            {
                $match: {
                  date: {
                    $gte: start,
                    $lt: end
                  },
                status:'Booked',
                ownerId: new mongoose.Types.ObjectId(ownerId) 
                 }
              },
              {
                $group: {
                  _id: null,
                  total: { $sum: "$total" }
                }
              }
          ])
          .then((result) => {
            if (result.length > 0) {
              userCount[month - 1] = result[0].total;
            }
          })
          .catch((error) => {
            console.log(error);
          });
          
          promises.push(promise);
        }
        
        Promise.all(promises)
        .then(() => {
          if(userCount.some((count) => count > 0)){
            const years = userCount.reduce((accumulator, currentValue) => {
                return accumulator + currentValue;
              }, 0);
          
            res.send({
              success:true,
              message:'Your graph data',
              data: {userCount,years}
            })  
          }else{
            const userCount = [0,0,0,0,0,0,0,0,0,0,0,0]
            const years = 0
            res.send({
              success:false,
              message:'No data found',
              data:{userCount,years}
            })
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }catch(error) {
        return error.message
     }
}

export const getDailySails = async(req,res)=>{
    try{
        const ownerId = req.body._id
        const currentDate = new Date().toISOString();
        const startOfDayStr = currentDate.substring(0, 10) + "T00:00:00.000Z"
        const start = new Date(startOfDayStr)
        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + 1);
        const nextDateISOString = nextDate.toISOString();
        const endOfDayStr = nextDateISOString.substring(0, 10) + "T00:00:00.000Z"
        const end = new Date(endOfDayStr)
        const daily =await orderModel.aggregate([
            {
                $match: {
                  date: {
                    $gte: start,
                    $lt: end
                  },
                  status: "Booked",
                  ownerId: new mongoose.Types.ObjectId(ownerId)
                   // Only match orders with status "Booked"
                }
              },
              {
                $group: {
                  _id: null,
                  total: { $sum: "$total" }
                }
              }
          ])
          if(daily.lenght){
            var total = daily[0].total
          }else{
            var total=0
          }
          
          const expired = await orderModel.find({paymentstatus:'Expired',ownerId:ownerId})
          const expiredCount = expired.length
          const active = await orderModel.find({paymentstatus:'Active',ownerId:ownerId})
          const activeCount = active.length
          const screen = await screenModel.find({ownerId:ownerId})
          const screenCount = screen.length
          const show = await showModel.find({ownerId:ownerId})
          const showCount = show.length
          const order = await orderModel.find({ownerId:ownerId})
          const orderCount = order.length
          res.send({
            success:true,
            message:'Daily sails',
            data:{total,expiredCount,activeCount,screenCount,showCount,orderCount}
          })
    }catch(error) {
        return error.message
     }
}

export const getOwnerUser = async(req,res)=>{
  try{
    const order  = await orderModel.find({ownerId:req.body._id,paymentstatus:'Active'})
    const user = order.map((item) => item.userId);
    const users = await userModel.find({ _id: { $in: user } });
    const uniq = [...new Set(users)];
    if(uniq){
      res.send({
          success:true,
          message:'Chat list',
          data:uniq
      })
  }else{
      res.send({
          success:false,
          message:'Somthing went wrong',
      }) 
  }
  }catch(error) {
        return error.message
     }
}

