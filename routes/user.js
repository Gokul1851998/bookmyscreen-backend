import express from 'express'
const router = express.Router()
import {sendOtp,verifyOtpAndSignUp,signIn} from '../controllers/userControllers.js'


router.post('/getOtp',sendOtp)
router.post('/signUp',verifyOtpAndSignUp)
router.post('/signIn',signIn)




export default router 