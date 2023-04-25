import express from 'express'
import { deteteScreen, getAppoval, getBookings, getCurrentOwner, getMovieName, getScreen, getSelectScreen, getShows, login, ownerOtp, postAddScreen, postAddShow, postDeleteShow, postEditScreen, postEditShow, resendOtp, signUp } from '../controllers/ownerControllers.js'
import { ownerAuthication } from '../jwtAuth/generateJwt.js'

const router = express.Router()

router.post('/ownerOtp',ownerOtp)
router.post('/signUp',signUp)
router.post('/login',login)
router.post('/resendOtp',resendOtp)
router.get('/get-approval/:id',getAppoval) 
router.get('/getCurrentOwner',ownerAuthication,getCurrentOwner)
router.post('/add-screen',ownerAuthication,postAddScreen)
router.get('/get-screen/:id',ownerAuthication,getScreen)
router.post('/delete-screen',deteteScreen)
router.post('/add-show',ownerAuthication,postAddShow)
router.get('/get-movieName',ownerAuthication,getMovieName)
router.get('/select-screen/:id',ownerAuthication,getSelectScreen)
router.get('/get-shows/:id',ownerAuthication,getShows)
router.post('/delete-show',ownerAuthication,postDeleteShow)
router.post('/edit-screen',ownerAuthication,postEditScreen)
router.post('/edit-show',ownerAuthication,postEditShow)
router.get('/get-bookings/:id',ownerAuthication,getBookings) 


export default router