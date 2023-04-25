import express from 'express'
const router = express.Router()
import {sendOtp,verifyOtpAndSignUp,signIn, getViewMovies, userResentOtp, getDates, getSeats, getBill, getPayment, userOrder, getcurrentuser, getOrder, getSingleorder, getOrderCancel, getVerify, getBalance} from '../controllers/userControllers.js'
import { userAuthication } from '../jwtAuth/generateJwt.js'


router.post('/getOtp',sendOtp)
router.post('/signUp',verifyOtpAndSignUp)
router.post('/signIn',signIn)
router.post('/resendOtp',userResentOtp)
router.get('/view-movies',getViewMovies)
router.post('/get-dates',getDates)
router.post('/get-seats',getSeats)
router.post('/get-bill',userAuthication,getBill)
router.get('/getcurrentuser',userAuthication,getcurrentuser)
router.get('/get-payment/:id',userAuthication,getPayment)
router.post('/user-order',userAuthication,userOrder)
router.get('/get-order/:id',userAuthication,getOrder)
router.get('/single-order/:id',userAuthication,getSingleorder)
router.get('/cancel-order/:id',userAuthication,getOrderCancel)
router.post('/get-balance',getBalance)
router.get('/get-verify/:id',getVerify)

export default router 