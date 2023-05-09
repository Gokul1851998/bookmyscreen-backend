import express from 'express'
const router = express.Router()
import {sendOtp,verifyOtpAndSignUp,signIn, getViewMovies, userResentOtp, getDates, getSeats, getBill, getPayment, userOrder, getcurrentuser, getOrder, getSingleorder, getOrderCancel, getVerify, getBalance, postForgotOtp, postResetPassword, getWallet, getSearch, editProfile, getUserOwner, getLocation, getTheatreShows} from '../controllers/userControllers.js'
import { userAuthication } from '../jwtAuth/generateJwt.js'


router.post('/getOtp',sendOtp)
router.post('/signUp',verifyOtpAndSignUp)
router.post('/signIn',signIn)
router.post('/resendOtp',userResentOtp)
router.post('/forgotOtp',postForgotOtp)
router.get('/view-movies',getViewMovies)
router.post('/get-dates',getDates)
router.post('/get-seats',getSeats)
router.post('/get-bill',userAuthication,getBill)
router.get('/getcurrentuser',userAuthication,getcurrentuser)
router.get('/get-payment/:id',userAuthication,getPayment)
router.post('/user-order',userAuthication,userOrder)
router.post('/get-order',userAuthication,getOrder)
router.get('/single-order/:id',userAuthication,getSingleorder)
router.get('/cancel-order/:id',userAuthication,getOrderCancel)
router.post('/get-balance',userAuthication,getBalance)
router.post('/get-wallet',userAuthication,getWallet)
router.post('/edit-profile',userAuthication,editProfile)
router.post('/get-userOwner',userAuthication,getUserOwner)
router.get('/get-verify/:id',getVerify)
router.post('/reset-password',postResetPassword)
router.get('/get-search/:id',getSearch)
router.post('/get-location',getLocation)
router.get('/get-theatreShows/:id',getTheatreShows)

export default router 