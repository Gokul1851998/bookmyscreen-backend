import express from 'express'
import { adminLogin, getAdminOwner, getAdminUser, getAllorders, getMovies, postAddMovies, postBlockOwner, postBlockUser, postDeleteMovie, postOwnerApprove, postOwnerDenied, postUnblockOwner, postUnblockUser, verifyTokenAdmin, viewOrder} from '../controllers/adminControllers.js'
import { adminAuthication } from '../jwtAuth/generateJwt.js'


const router = express.Router()

router.post('/adminlogin',adminLogin)
router.get('/checkAdminToken',adminAuthication,verifyTokenAdmin)
router.get('/adminuser',adminAuthication,getAdminUser)
router.post('/block-user',adminAuthication,postBlockUser)
router.post('/unblock-user',adminAuthication,postUnblockUser)
router.get('/adminowner',adminAuthication,getAdminOwner)
router.post('/ownerApprove',adminAuthication,postOwnerApprove)
router.post('/ownerDenied',adminAuthication,postOwnerDenied)
router.post('/blockOwner',adminAuthication,postBlockOwner)
router.post('/unblockOwner',adminAuthication,postUnblockOwner)
router.post('/add-movies',adminAuthication,postAddMovies)
router.get('/getMovies',adminAuthication,getMovies)
router.post('/deleteMovie',adminAuthication,postDeleteMovie)
router.get('/get-allOrders',adminAuthication,getAllorders)
router.get('/view-order/:id',adminAuthication,viewOrder)

export default router
