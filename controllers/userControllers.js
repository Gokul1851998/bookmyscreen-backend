import userModel from "../model/userModel.js"
import otpGenerator from "../otpGenerator/otpGenerator.js"
import { generateToken } from "../jwtAuth/generateJwt.js"
import sendMail from "../nodeMailer/nodeMailer.js";
import bcrypt, { hash } from 'bcrypt'
import movieModel from "../model/movieModel.js";
import showModel from "../model/showModel.js";
import ownerModel from "../model/ownerModel.js";
import screenModel from "../model/screenModel.js";
import Razorpay from "razorpay";
import orderModel from "../model/orderModel.js";
import crypto from 'crypto'
import { log } from "console";

export let otpVerify
export const sendOtp = (req, res) => {
    try {
        let userData = req.body
        
        let response = {}
        userModel.findOne({ signEmail: userData.signEmail }).then((user) => {
            if (user) {

                response.userExist = true
                res.status(200).json(response)
            } else {
  
                otpGenerator().then((otp) => {
                    sendMail(userData.signEmail, otp).then((result) => {
                        console.log(userData.signEmail);
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

export const verifyOtpAndSignUp = (req, res) => {
    try {
        const user = req.body.userSignup
        const otp = req.body.otp
        let response = {} 
        if (otp === otpVerify) {  
            
            bcrypt.hash(user.signPassword, 10).then((hash) => {
            user.signPassword = hash
                const newUser = new userModel(user)
                newUser.save().then(() => {
                    response.status = true
                    res.status(200).json(response)
                })
            })
        } else {
            response.status = false
            res.status(200).json(response)
        }
    } catch (err) {
        res.status(500)
    }
}

export const postForgotOtp = async(req,res)=>{
    try{
      const otp = req.body.forgotOTP
      if(otp === otpVerify){
        res.send({
            success:true,
            message:'OTP verified',
        })
      }else{
        res.send({
            success:false,
            message:'OTP not matching',
        })
      }
    }catch (err) {
        res.status(500)
    }
}

export const signIn = async(req, res) => {
    try {
        let response = {}
        let { loginEmail, loginPassword } = req.body
       await userModel.findOne({ signEmail: loginEmail }).then((user) => {
            if (user) {
                if (!user.block) {
                    bcrypt.compare(loginPassword, user.signPassword, function (err, result) {
                        if (result) {
                            const token = generateToken({ userId: user._id, name: user.signName, type: 'user' })
                            response.Name = user.signName
                            response.token = token
                            response.logIn = true
                            res.status(200).json(response)
                        } else {
                            response.incPass = true
                            res.status(200).json(response)
                        }
                    })
                } else {
                    response.block = true
                    res.status(200).json(response)
                }
            } else {
                response.noUser = true
                res.status(200).json(response)
            }
        })
    } catch (err) {
        res.status(500)
    }
}

export const userResentOtp = async(req,res) =>{
    try{
     const email = req.body.signEmail
     const response = {}
     otpGenerator().then((otp)=>{
        otpVerify = otp
        sendMail(email,otp).then((result)=>{
            if(result.otpSent){
                response.status = true
                res.status(200).json(response)
            }else{
                response.status = false
                res.status(200).json(response)
            }
        })
     })
    }catch (err) {
        res.status(500)
    }
}

export const getViewMovies = async(req,res) =>{
    try{
        
        const movies = await movieModel.aggregate([
            { $match: { 'movieId': { $exists: true } } },
            { $project: { _id: 0, movieId: 1, director: 1 } }
          ]).sort({createdAt:-1})
          
          if(movies){
            res.send({
                success:true,
                message:'Here is your Movies',
                data:movies
            })
          }else{
            res.send({
                success:false,
                message:'Movies not Found',
            })
          }
    }catch (err) {
        res.status(500)
    }
}

export const getDates = async(req,res)=>{
    try{
      const date = req.body.date;
      const newdate = new Date(date).toISOString().slice(0, 10) + "T00:00:00.000Z";
      const movieName = req.body.response.title;
      const shows = await showModel.find({
        $and: [
          { movieName: movieName },
          { "dates.date": { $eq: new Date(newdate) } }
        ]
      });
     
      if(shows){
        res.send({
            success:true,
            message:'Date Available',
            data:shows
        })
      }else{
        res.send({
            success:false,
            message:'Movie not Available',
        })
      }
    }catch(err) {
        res.status(500)
    }
}

 export const getSeats = async(req,res)=>{
    try{
        const showId = req.body.showId
        const date = req.body.date
        const newdate = new Date(date).toISOString().slice(0, 10) + "T00:00:00.000Z";
        const showData = await showModel.findOne({ _id: showId, "dates.date": { $eq: new Date(newdate) } })
        const screen = await screenModel.findOne({_id:showData.screenId})
        const seats = await showModel.findOne({ _id: showId, "dates.date": { $eq: new Date(newdate) } },{ 'dates.$': 1 })
        if(seats){
            res.send({
                success:true,
                message:'Select your Seats',
                data:{seats,screen,showData}
            })
        }else{
            res.send({
                success:false,
                message:'Something went wrong',
            })
        }
    }catch(err) {
        res.status(500)
    }
}

export const getBill = async(req,res)=>{
    try{
        const movieName = req.body.showDetails.movieName
        const movie = await movieModel.findOne({title:movieName})
        const movieId = movie.movieId
        res.send({
            success:true,
            message:'Movie Picture',
            data:movieId
        })
    }catch(err) {
        res.status(500)
    }
}

export const getcurrentuser = async(req,res)=>{
    try{
      const user = await userModel.findById(res.locals.Id).select("-signPassword")
      res.send({
        success: true,
        message: "User Details fetched successfully",
        data: user
      });
    }catch(err) {
        res.status(500)
    }
}

export const getPayment = async(req,res)=>{
    try{
     
        const {fee,subtotal,total,image,user,language} = req.body
        const {selectedSeats,date}=req.body.details
        const userId = user.user._id
        const userName = user.user.signName
        const status ='Booked'
        const {ownerId,ownerName,movieName,location,showTime,screen,_id} = req.body.details.showDetails
        const newdate = new Date(date).toISOString().slice(0, 10) + "T00:00:00.000Z";
     
        const hash = crypto.createHash('sha256')
        .update(movieName + userId + selectedSeats + date)
        .digest('hex');
      const randomNumber = Math.floor(Math.random() * 10) + 1;
        const bookingId = hash.slice(0, 5) + randomNumber.toString().padStart(3, '0')
           
      
        const show = await showModel.findOneAndUpdate(
          {
            _id: _id,
            "dates.date": { $eq: new Date(newdate) },
            "dates.seats.id": { $in: selectedSeats.map(seat => seat.id) }
          },
          {
            $set: {
              "dates.$[date].seats.$[seat].seatStatus": "sold"
            }
          },
          {
            arrayFilters: [
              { "date.date": { $eq: new Date(newdate) } },
              { "seat.id": { $in: selectedSeats.map(seat => seat.id) } }
            ]
          }
        );
        
        const newOrder = new orderModel({
          userId,
         ownerId,
         movieName,
         ownerName,
         location,
         showTime,
         date,
         selectedSeats,
         subtotal,
         fee,
         total,
         screen,
         bookingId,
         image,
         language,
         userName,
         status
      })
      await newOrder.save();
      const bookings = await orderModel.findOne({bookingId:bookingId})
      if(bookings){
           const instance = new Razorpay({key_id:process.env.RAZORPAY_KEY_ID, key_secret:process.env.RAZORPAY_SECRET})
           var options={
            amount:bookings.total * 100,
            currency: 'INR'
           }
           instance.orders.create(options,function(err,order){
            if(err){
                res.status(500)
            }
                res.send({
                success:true,
                data:{order,bookings}
            })
           })
        }
      
    }catch(err) {
        res.status(500)
    }
}

export const userOrder = async(req,res)=>{
    try{
    const bookings = await orderModel.findOne({_id:req.body.bookingId})
    if(bookings){
        res.send({
            success:true,
            data:bookings
        })
    }
   
    }catch(err) {
        res.status(500)
    }
}

export const getOrder = async(req,res)=>{
    try{
        const order = await orderModel.find({userId:req.body._id})
        const currentDate = new Date();
      
        //   const nextDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
        currentDate.setUTCHours(0, 0, 0, 0); // set time to 00:00:00.000 UTC
        const newDate = currentDate.toISOString()
        order.forEach(async (ord) => {
            if (new Date(newDate) > new Date(ord.date)) {
              await orderModel.updateOne(
                { _id: ord._id },
                { $set: { paymentstatus: "Expired" } }
              );
            }else{
                await orderModel.updateOne(
                  { _id: ord._id },
                  { $set: { paymentstatus: "Active" } }
                );
              }
          });                                                                                                                                                                       
         const activeOrders = await orderModel.find({userId:req.body._id,paymentstatus:'Active'}).sort({date: -1 })
         const expireOrders = await orderModel.find({userId:req.body._id,paymentstatus:'Expired'}).sort({date: -1 }).limit(3)
         if(activeOrders ||expireOrders ){
            res.send({
                success:true,
                message:'Your Orders',
                data:{activeOrders,expireOrders}
            })
         }else{
            res.send({
                success:false,
                message:'No Orders Found'
            })
         }
    }catch(err) {
        res.status(500)
    }   
}

export const getSingleorder = async(req,res)=>{
    try{
       const order = await orderModel.findOne({_id:req.params.id})
       if(order){
        res.send({
            success:true,
            message:'Your Ticket',
            data:order
        })
       }else{
        res.send({
            success:false,
            message:'Something went wrong'
        })
       }
    }catch(err) {
        res.status(500)
    }
}

export const getOrderCancel = async(req,res)=>{
    try{
    const orderId = await orderModel.findOne({_id:req.params.id})
    const order = await orderModel.findOneAndUpdate({_id:req.params.id},{
        $set:{
            status:'Canceled'
        }
    })
    await userModel.findOneAndUpdate(
        {_id: orderId.userId},
        {
          $inc: {wallet: orderId.subtotal},
          $push: {
            transaction: {
              $each: [{ amount: orderId.subtotal, date: new Date() }],
              $position: 0,
              $slice: 4
            }
          } 
        }
      );
    const orders = await orderModel.find({userId:orderId.userId,paymentstatus:'Active'}).sort({date: -1 })
    res.send({
        success:true,
        message:'Your Order has been Canceled',
        data:orders
    })
    }catch(err) {
        res.status(500)
    }
}

export const getVerify = async(req,res)=>{
    try{
      const user = await userModel.findOne({signEmail:req.params.id})
      if(user){
        otpGenerator().then((otp) => {
            sendMail(req.params.id, otp).then((result) => {
                if (result.otpSent) {
                    otpVerify = otp
                    res.send({
                        success:true,
                        message:'Otp sent'
                    })
                } else {
                    res.send({
                        success:false,
                        message:'Something went wrong'
                    })
                }
            })
        })
      }else{
        res.send({
            success:false,
            message:'User not found'
        })
      }
    }catch(err) {
        res.status(500)
    }
}

export const getBalance = async(req,res)=>{
    try{
        const user = req.body.user.user
        const {fee,subtotal,total,image,language} = req.body
        const {selectedSeats,date}=req.body.details
        const status ='Booked'
        const userId = user._id
        const userName =user.signName
        const {ownerId,ownerName,movieName,location,showTime,screen,_id} = req.body.details.showDetails
        console.log(_id);
        const newdate = new Date(date).toISOString().slice(0, 10) + "T00:00:00.000Z";
        const hash = crypto.createHash('sha256')
        .update(movieName + userId + selectedSeats + date)
        .digest('hex');
        const randomNumber = Math.floor(Math.random() * 10) + 1;
        const bookingId = hash.slice(0, 5) + randomNumber.toString().padStart(3, '0')

        const userfind = await userModel.findOne({_id:user._id})
        if(userfind){
            if(userfind.wallet >= total){
                
                const shows = await showModel.findOneAndUpdate(
                    {
                      _id: _id,
                      "dates.date": { $eq: new Date(newdate) },
                      "dates.seats.id": { $in: selectedSeats.map(seat => seat.id) }
                    },
                    {
                      $set: {
                        "dates.$[date].seats.$[seat].seatStatus": "sold"
                      }
                    },
                    {
                      arrayFilters: [
                        { "date.date": { $eq: new Date(newdate) } },
                        { "seat.id": { $in: selectedSeats.map(seat => seat.id) } }
                      ]
                    }
                  ).catch((err) => console.log(err));
                  
                  console.log(shows);
                  const newOrder = new orderModel({
                    userId,
                   ownerId,
                   movieName,
                   ownerName,
                   location,
                   showTime,
                   date,
                   selectedSeats,
                   subtotal,
                   fee,
                   total,
                   screen,
                   bookingId,
                   image,
                   language,
                   userName,
                   status
                })
                await newOrder.save();
                await userModel.findOneAndUpdate({_id:user._id},
                    {
                        $inc: {wallet: -total},
                        $push: {
                          transaction: {
                            $each: [{ amount: -total, date: new Date() }],
                            $position: 0,
                            $slice: 4
                          }
                        } 
                      });
                    const bookings = await orderModel.findOne({bookingId:bookingId})
                    console.log(bookingId);
                     if(bookings){
                        res.send({
                            success:true,
                            message:'Payment successfull',
                            data: bookings
                        })
                     }
             }else{
                res.send({
                    success:false,
                    message:'Insufficient Balance'
                })
             }
        }else{
            res.send({
                success:false,
                message:'Something went wrong'
            })  
        }
    }catch(err) {
        res.status(500)
    }
}

export const postResetPassword = async(req,res)=>{
    try{
        var {forgotEmail,forPassword1,forPassword2} = req.body.forgotData
        if(forPassword1 === forPassword2){
            const hash = await bcrypt.hash(forPassword1, 10);
              const updatedUser = await userModel.findOneAndUpdate(
        { signEmail: forgotEmail },
        { $set: { signPassword: hash } }
            );
            if(updatedUser){
            res.send({
                success:true,
                message:'Password changed'
            })
        }
    }else{
        res.send({
            success:false,
            message:'check not matching'
        })
    }
    }catch(err) {
        res.status(500)
    }

}

export const getWallet = async(req,res)=>{
    try{
    const user = await userModel.findOne({_id:req.body._id})
    if(user){
        res.send({
            success:true,
            message:'Wallet',
            data:user
        }) 
    }else{
        res.send({
            success:false,
            message:'Something went wrong'
        })
    }
    }catch(err) {
        res.status(500)
    }
}

export const getSearch = async(req,res)=>{
    try{
        const search = []
      const user = await movieModel.find({title: {$regex :req.params.id,$options: "i"  }})
      const theatre = await ownerModel.find({Location: {$regex :req.params.id,$options: "i"  }})
      search.push(...user, ...theatre);
     
      if(search){
        res.send({
            success:true,
            message:'Movies',
            data:search
        }) 
      }else{
        res.send({
            success:false,
            message:'Not found',
        })
      }
    }catch(err) {
        res.status(500)
    }
}

export const editProfile = async(req,res)=>{
    try{
     const {user,editEmail,editName,editPhone} = req.body
    if(user){
     await userModel.findOneAndUpdate({_id:user._id},
        {$set:{
            signName:editName,
            signEmail:editEmail,
            signPhone:editPhone
        }}
        )
     const newUser = await userModel.findOne({_id:user._id})
     res.send({
        success:true,
        message:'User profile has been edited',
        data:newUser
    })
    }else{
        res.send({
            success:false,
            message:'Something went wrong'
        })
    }
    }catch(err) {
        res.status(500)
    }
}

export const getUserOwner = async(req,res)=>{
    try{
    const order = await orderModel.find({userId:req.body._id,paymentstatus:'Active'})
    const ownerIds = order.map((item) => item.ownerId);
    const owners = await ownerModel.find({ _id: { $in: ownerIds } });
    const uniq = [...new Set(owners)];
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
    }catch(err) {
        res.status(500)
    }
}

export const getLocation = async(req,res)=>{
    try{
     const location = req.body.place
     const theatre = await ownerModel.find({Location:location})
     if(theatre){
        res.send({
            success:true,
            message:'Theatre found',
            data:theatre
        })
     }
    }catch(err) {
        res.status(500)
    }
}

export const getTheatreShows = async(req,res)=>{
    try{
       const owner = await ownerModel.findOne({_id:req.params.id})
       const newdate = new Date().toISOString().slice(0, 10) + "T00:00:00.000Z";
       const shows = await showModel.find({
        $and: [
          { ownerId: req.params.id },
          { "dates.date": { $eq: new Date(newdate) } }
        ]
      });
          if(shows){
        res.send({
            success:true,
            message:'Theatre found',
            data:{owner,shows}
        })
       }else{
        res.send({
            success:false,
            message:'Shows not found',
        })
       }
    }catch(err) {
        res.status(500)
    }
}
