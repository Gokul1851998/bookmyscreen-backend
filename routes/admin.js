import express from 'express'
import { adminLogin, getAdminOwner, getAdminUser, postBlockUser, postOwnerApprove, postUnblockUser} from '../controllers/adminControllers.js'
import { verifyTokenAdmin } from '../middleware/jsonWTMiddleWare.mjs'
const router = express.Router()

router.post('/adminlogin',adminLogin)
router.get('/checkAdminToken',verifyTokenAdmin)
router.get('/adminuser',getAdminUser)
router.post('/block-user',postBlockUser)
router.post('/unblock-user',postUnblockUser)
router.get('/adminowner',getAdminOwner)
router.post('/ownerApprove',postOwnerApprove)

export default router
