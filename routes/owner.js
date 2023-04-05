import express from 'express'
import { getCurrentOwner, login, ownerOtp, signUp } from '../controllers/ownerControllers.js'
import { authMiddleware } from '../jwtAuth/generateJwt.js'
const router = express.Router()

router.post('/ownerOtp',ownerOtp)
router.post('/signUp',signUp)
router.post('/login',login)
router.post('/getCurrentOwner',authMiddleware,getCurrentOwner)

    

export default router